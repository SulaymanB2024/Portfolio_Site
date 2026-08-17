#!/usr/bin/env python3
"""Fetch authoritative Treasury Fiscal Data inputs for the interest-repricing article.

The script uses only the Python standard library. It writes source-faithful CSV
snapshots and a manifest containing endpoint, filter, API metadata, row count,
record-date range, and SHA-256. Broad budget tables are intentionally excluded:
the article's critical path is gross Treasury interest expense, average rates,
daily debt, and selected security-level Monthly Statement of the Public Debt rows.
"""

from __future__ import annotations

import csv
import hashlib
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

BASE = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service"
OUT = Path(__file__).resolve().parent / "data"
OUT.mkdir(parents=True, exist_ok=True)


def request_json(path: str, params: dict[str, Any], attempts: int = 3) -> dict[str, Any]:
    query = urllib.parse.urlencode(params, doseq=True)
    url = f"{BASE}{path}?{query}"
    headers = {
        "User-Agent": "SulaymanBowlesResearch/1.0 (public-data reproducibility)",
        "Accept": "application/json",
    }
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            print(f"GET attempt={attempt} {url}", flush=True)
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            # Parameter and endpoint errors are deterministic; do not hide them in retries.
            if 400 <= exc.code < 500 and exc.code != 429:
                body = exc.read().decode("utf-8", errors="replace")[:1000]
                raise RuntimeError(f"Treasury HTTP {exc.code}: {url}: {body}") from exc
            last_error = exc
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
        if attempt < attempts:
            time.sleep(2 ** (attempt - 1))
    raise RuntimeError(f"Treasury request failed after {attempts} attempts: {url}: {last_error}")


def fetch_all(path: str, *, filter_expr: str | None = None, sort: str | None = None,
              page_size: int = 5000) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    page = 1
    first_meta: dict[str, Any] = {}
    while True:
        params: dict[str, Any] = {"page[number]": page, "page[size]": page_size}
        if filter_expr:
            params["filter"] = filter_expr
        if sort:
            params["sort"] = sort
        payload = request_json(path, params)
        batch = payload.get("data", [])
        if page == 1:
            first_meta = payload.get("meta", {})
        if not isinstance(batch, list):
            raise RuntimeError(f"Unexpected data payload for {path}: {type(batch)!r}")
        rows.extend(batch)
        meta = payload.get("meta", {})
        total_pages = int(meta.get("total-pages", page) or page)
        print(
            f"PAGE endpoint={path} page={page}/{total_pages} batch={len(batch)} cumulative={len(rows)}",
            flush=True,
        )
        if page >= total_pages or len(batch) < page_size:
            break
        page += 1
    return rows, first_meta


def latest_record_date(path: str) -> str:
    payload = request_json(path, {"sort": "-record_date", "page[number]": 1, "page[size]": 1})
    rows = payload.get("data", [])
    if not rows or not rows[0].get("record_date"):
        raise RuntimeError(f"Could not discover latest record_date for {path}")
    return str(rows[0]["record_date"])


def stable_columns(rows: Iterable[dict[str, Any]]) -> list[str]:
    preferred = [
        "snapshot_requested", "record_date", "record_fiscal_year", "record_fiscal_quarter",
        "record_calendar_year", "record_calendar_quarter", "security_type_desc", "security_desc",
        "security_class1_desc", "security_class2_desc", "debt_catg_1", "debt_catg_2",
        "debt_catg_3", "debt_catg_4", "issue_date", "maturity_date", "interest_rate_pct",
        "avg_interest_rate_amt", "outstanding_amt", "interest_expense_amt", "debt_held_public_amt",
        "intragov_hold_amt", "tot_pub_debt_out_amt",
    ]
    observed: set[str] = set()
    for row in rows:
        observed.update(row.keys())
    return [c for c in preferred if c in observed] + sorted(observed.difference(preferred))


def write_csv(name: str, rows: list[dict[str, Any]]) -> dict[str, Any]:
    path = OUT / name
    columns = stable_columns(rows)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in columns})
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    record_dates = sorted({str(r.get("record_date")) for r in rows if r.get("record_date")})
    return {
        "file": str(path.relative_to(OUT.parent)),
        "rows": len(rows),
        "columns": columns,
        "first_record_date": record_dates[0] if record_dates else None,
        "last_record_date": record_dates[-1] if record_dates else None,
        "sha256": digest,
    }


def main() -> None:
    retrieved_at = datetime.now(timezone.utc).isoformat()
    manifest: dict[str, Any] = {
        "retrieved_at_utc": retrieved_at,
        "base_url": BASE,
        "datasets": [],
        "snapshot_dates_requested": [
            "2021-09-30", "2022-09-30", "2023-09-30", "2024-09-30", "2025-09-30"
        ],
    }
    errors: list[dict[str, str]] = []

    specs = [
        {
            "name": "interest_expense_raw.csv",
            "path": "/v2/accounting/od/interest_expense",
            "filter": "record_date:gte:2020-09-30",
        },
        {
            "name": "average_interest_rates_raw.csv",
            "path": "/v2/accounting/od/avg_interest_rates",
            "filter": "record_date:gte:2020-09-30",
        },
        {
            "name": "debt_to_penny_raw.csv",
            "path": "/v2/accounting/od/debt_to_penny",
            "filter": "record_date:gte:2020-09-30",
        },
    ]

    for spec in specs:
        print(f"START dataset={spec['name']}", flush=True)
        try:
            rows, meta = fetch_all(spec["path"], filter_expr=spec["filter"], sort="record_date")
            entry = write_csv(spec["name"], rows)
            entry.update({"endpoint": spec["path"], "filter": spec["filter"], "api_meta": meta})
            manifest["datasets"].append(entry)
        except Exception as exc:
            errors.append({"dataset": spec["name"], "error": repr(exc)})
            print(f"ERROR dataset={spec['name']} {exc!r}", flush=True)

    market_endpoint = "/v1/debt/mspd/mspd_table_3_market"
    try:
        latest_market_date = latest_record_date(market_endpoint)
        if latest_market_date not in manifest["snapshot_dates_requested"]:
            manifest["snapshot_dates_requested"].append(latest_market_date)
    except Exception as exc:
        errors.append({"dataset": "mspd_latest_date", "error": repr(exc)})

    market_rows: list[dict[str, Any]] = []
    market_meta: dict[str, Any] = {}
    for snapshot_date in manifest["snapshot_dates_requested"]:
        print(f"START dataset=mspd_market snapshot={snapshot_date}", flush=True)
        try:
            rows, meta = fetch_all(
                market_endpoint,
                filter_expr=f"record_date:eq:{snapshot_date}",
                sort="record_date",
            )
            for row in rows:
                row["snapshot_requested"] = snapshot_date
            market_rows.extend(rows)
            market_meta[snapshot_date] = meta
        except Exception as exc:
            errors.append({"dataset": f"mspd_market_{snapshot_date}", "error": repr(exc)})
            print(f"ERROR dataset=mspd_market snapshot={snapshot_date} {exc!r}", flush=True)

    if market_rows:
        entry = write_csv("mspd_marketable_snapshots_raw.csv", market_rows)
        entry.update({
            "endpoint": market_endpoint,
            "filter": "one exact record_date request per snapshot",
            "api_meta_by_snapshot": market_meta,
        })
        manifest["datasets"].append(entry)

    manifest["errors"] = errors
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True), encoding="utf-8")

    required = {
        "interest_expense_raw.csv",
        "average_interest_rates_raw.csv",
        "debt_to_penny_raw.csv",
        "mspd_marketable_snapshots_raw.csv",
    }
    produced = {Path(d["file"]).name for d in manifest["datasets"]}
    missing = sorted(required.difference(produced))
    print(json.dumps({"retrieved_at_utc": retrieved_at, "produced": sorted(produced), "errors": errors}, indent=2))
    if missing:
        raise SystemExit(f"Missing required research datasets: {missing}")


if __name__ == "__main__":
    main()
