#!/usr/bin/env python3
"""Rate-limited Treasury Fiscal Data fetcher for the repricing audit.

The Treasury API is intermittently slow under concurrent load. This version uses
three workers, deep retry/backoff, and a smaller rate-snapshot set. Every request
is bounded to one exact month-end or one fiscal-period debt slice.
"""

from __future__ import annotations

import csv
import hashlib
import json
import random
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Iterable

BASE = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service"
OUT = Path(__file__).resolve().parent / "data"
OUT.mkdir(parents=True, exist_ok=True)

ENDPOINTS = {
    "interest": "/v2/accounting/od/interest_expense",
    "rates": "/v2/accounting/od/avg_interest_rates",
    "debt": "/v2/accounting/od/debt_to_penny",
    "market": "/v1/debt/mspd/mspd_table_3_market",
}
FISCAL_ENDS = [f"{year}-09-30" for year in range(2021, 2026)]
CURRENT_MONTH_END = "2026-07-31"
INTEREST_DATES = FISCAL_ENDS + [CURRENT_MONTH_END]
RATE_DATES = ["2021-09-30", "2025-09-30", CURRENT_MONTH_END]

FIELDS = {
    "interest": ",".join([
        "record_date", "expense_catg_desc", "expense_group_desc", "expense_type_desc",
        "month_expense_amt", "fytd_expense_amt", "src_line_nbr",
        "record_fiscal_year", "record_fiscal_quarter",
    ]),
    "rates": ",".join([
        "record_date", "security_type_desc", "security_desc", "avg_interest_rate_amt",
        "src_line_nbr", "record_fiscal_year", "record_fiscal_quarter",
    ]),
    "debt": ",".join([
        "record_date", "debt_held_public_amt", "intragov_hold_amt", "tot_pub_debt_out_amt",
    ]),
    "market": None,
}


def request_rows(task: dict[str, Any]) -> tuple[dict[str, Any], list[dict[str, Any]], dict[str, Any], str]:
    params: dict[str, Any] = {
        "filter": task["filter"],
        "page[number]": 1,
        "page[size]": 10000,
    }
    if task["fields"]:
        params["fields"] = task["fields"]
    url = f"{BASE}{task['path']}?{urllib.parse.urlencode(params)}"
    headers = {
        "User-Agent": "SulaymanBowlesResearch/1.0 (public-data reproducibility)",
        "Accept": "application/json",
    }
    last_error: Exception | None = None
    for attempt in range(1, 7):
        started = time.monotonic()
        try:
            print(f"GET attempt={attempt} dataset={task['dataset']} label={task['label']}", flush=True)
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=75) as response:
                payload = json.loads(response.read().decode("utf-8"))
            rows = payload.get("data", [])
            meta = payload.get("meta", {})
            if not isinstance(rows, list) or not rows:
                raise RuntimeError(f"Empty or malformed data payload: {url}")
            if int(meta.get("total-pages", 1) or 1) > 1:
                raise RuntimeError(f"Bounded request unexpectedly paginated: {url}")
            print(
                f"OK seconds={time.monotonic()-started:.2f} dataset={task['dataset']} "
                f"label={task['label']} rows={len(rows)}",
                flush=True,
            )
            return task, rows, meta, url
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")[:1000]
            if 400 <= exc.code < 500 and exc.code != 429:
                raise RuntimeError(f"Treasury HTTP {exc.code}: {url}: {body}") from exc
            last_error = exc
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, RuntimeError) as exc:
            last_error = exc
        if attempt < 6:
            delay = min(30, 2 ** attempt) + random.random()
            print(
                f"RETRY seconds={delay:.1f} dataset={task['dataset']} label={task['label']} "
                f"error={last_error!r}",
                flush=True,
            )
            time.sleep(delay)
    raise RuntimeError(f"Treasury request failed after 6 attempts: {url}: {last_error}")


def fiscal_ranges(cutoff: str) -> list[tuple[str, str]]:
    latest = date.fromisoformat(cutoff)
    ranges: list[tuple[str, str]] = []
    for fiscal_year in range(2021, latest.year + 2):
        start = date(fiscal_year - 1, 10, 1)
        end = min(date(fiscal_year, 9, 30), latest)
        if start > latest:
            break
        ranges.append((start.isoformat(), end.isoformat()))
    return ranges


def stable_columns(rows: Iterable[dict[str, Any]]) -> list[str]:
    preferred = [
        "snapshot_requested", "period_requested", "record_date", "record_fiscal_year",
        "record_fiscal_quarter", "expense_catg_desc", "expense_group_desc", "expense_type_desc",
        "month_expense_amt", "fytd_expense_amt", "security_type_desc", "security_desc",
        "security_class1_desc", "security_class2_desc", "issue_date", "maturity_date",
        "interest_rate_pct", "avg_interest_rate_amt", "outstanding_amt", "debt_held_public_amt",
        "intragov_hold_amt", "tot_pub_debt_out_amt", "src_line_nbr",
    ]
    observed: set[str] = set()
    for row in rows:
        observed.update(row.keys())
    return [column for column in preferred if column in observed] + sorted(observed.difference(preferred))


def write_csv(filename: str, rows: list[dict[str, Any]]) -> dict[str, Any]:
    path = OUT / filename
    columns = stable_columns(rows)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows({column: row.get(column, "") for column in columns} for row in rows)
    dates = sorted({str(row.get("record_date")) for row in rows if row.get("record_date")})
    return {
        "file": str(path.relative_to(OUT.parent)),
        "rows": len(rows),
        "columns": columns,
        "first_record_date": dates[0] if dates else None,
        "last_record_date": dates[-1] if dates else None,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }


def build_tasks() -> list[dict[str, Any]]:
    tasks: list[dict[str, Any]] = []
    for snapshot in INTEREST_DATES:
        tasks.append({
            "dataset": "interest", "label": snapshot, "path": ENDPOINTS["interest"],
            "filter": f"record_date:eq:{snapshot}", "fields": FIELDS["interest"],
        })
    for snapshot in RATE_DATES:
        tasks.append({
            "dataset": "rates", "label": snapshot, "path": ENDPOINTS["rates"],
            "filter": f"record_date:eq:{snapshot}", "fields": FIELDS["rates"],
        })
    tasks.append({
        "dataset": "market", "label": CURRENT_MONTH_END, "path": ENDPOINTS["market"],
        "filter": f"record_date:eq:{CURRENT_MONTH_END}", "fields": FIELDS["market"],
    })
    for start, end in fiscal_ranges(CURRENT_MONTH_END):
        tasks.append({
            "dataset": "debt", "label": f"{start}/{end}", "path": ENDPOINTS["debt"],
            "filter": f"record_date:gte:{start},record_date:lte:{end}", "fields": FIELDS["debt"],
        })
    return tasks


def main() -> None:
    tasks = build_tasks()
    collected: dict[str, list[dict[str, Any]]] = {key: [] for key in ENDPOINTS}
    provenance: dict[str, dict[str, Any]] = {key: {} for key in ENDPOINTS}
    failures: list[dict[str, str]] = []

    with ThreadPoolExecutor(max_workers=3) as pool:
        future_map = {pool.submit(request_rows, task): task for task in tasks}
        for future in as_completed(future_map):
            task = future_map[future]
            try:
                resolved, rows, meta, url = future.result()
                marker = "period_requested" if resolved["dataset"] == "debt" else "snapshot_requested"
                for row in rows:
                    row[marker] = resolved["label"]
                collected[resolved["dataset"]].extend(rows)
                provenance[resolved["dataset"]][resolved["label"]] = {
                    "endpoint": resolved["path"], "filter": resolved["filter"],
                    "fields": resolved["fields"], "url": url, "api_meta": meta,
                }
            except Exception as exc:
                failures.append({
                    "dataset": task["dataset"], "label": task["label"], "error": repr(exc),
                })

    if failures:
        print(json.dumps({"failures": failures}, indent=2), flush=True)
        raise SystemExit("One or more bounded Treasury requests failed")

    filenames = {
        "interest": "interest_expense_raw.csv",
        "rates": "average_interest_rates_raw.csv",
        "market": "mspd_marketable_snapshot_raw.csv",
        "debt": "debt_to_penny_raw.csv",
    }
    manifest: dict[str, Any] = {
        "retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
        "calculation_cutoff": CURRENT_MONTH_END,
        "base_url": BASE,
        "interest_snapshot_dates": INTEREST_DATES,
        "rate_snapshot_dates": RATE_DATES,
        "datasets": [],
    }
    for key, filename in filenames.items():
        rows = sorted(
            collected[key],
            key=lambda row: (
                str(row.get("record_date", "")), str(row.get("src_line_nbr", "")),
                str(row.get("maturity_date", "")),
            ),
        )
        entry = write_csv(filename, rows)
        entry["requests"] = provenance[key]
        manifest["datasets"].append(entry)

    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True), encoding="utf-8")
    print(json.dumps(manifest, indent=2), flush=True)


if __name__ == "__main__":
    main()
