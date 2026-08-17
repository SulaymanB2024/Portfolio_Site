#!/usr/bin/env python3
"""Fetch bounded Treasury Fiscal Data snapshots for the interest-repricing article.

Requests are deliberately small and concurrent: exact month-end snapshots for
interest expense and average rates, one current security-level MSPD snapshot,
and one date-bounded Debt to the Penny request per fiscal period. The shared
calculation cutoff is July 31, 2026. Raw rows are preserved without restatement.
"""

from __future__ import annotations

import csv
import hashlib
import json
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
SNAPSHOTS = FISCAL_ENDS + [CURRENT_MONTH_END]

FIELD_SETS = {
    "interest": ",".join(
        [
            "record_date",
            "expense_catg_desc",
            "expense_group_desc",
            "expense_type_desc",
            "month_expense_amt",
            "fytd_expense_amt",
            "src_line_nbr",
            "record_fiscal_year",
            "record_fiscal_quarter",
        ]
    ),
    "rates": ",".join(
        [
            "record_date",
            "security_type_desc",
            "security_desc",
            "avg_interest_rate_amt",
            "src_line_nbr",
            "record_fiscal_year",
            "record_fiscal_quarter",
        ]
    ),
    "debt": ",".join(
        [
            "record_date",
            "debt_held_public_amt",
            "intragov_hold_amt",
            "tot_pub_debt_out_amt",
        ]
    ),
    "market": None,
}


def request_rows(
    path: str,
    filter_expr: str,
    *,
    fields: str | None = None,
    page_size: int = 10000,
    attempts: int = 2,
) -> tuple[list[dict[str, Any]], dict[str, Any], str]:
    params: dict[str, Any] = {
        "filter": filter_expr,
        "page[number]": 1,
        "page[size]": page_size,
    }
    if fields:
        params["fields"] = fields
    query = urllib.parse.urlencode(params)
    url = f"{BASE}{path}?{query}"
    headers = {
        "User-Agent": "SulaymanBowlesResearch/1.0 (public-data reproducibility)",
        "Accept": "application/json",
    }
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        started = time.monotonic()
        try:
            print(f"GET attempt={attempt} {url}", flush=True)
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
            rows = payload.get("data", [])
            if not isinstance(rows, list):
                raise RuntimeError(f"Unexpected data payload for {path}: {type(rows)!r}")
            meta = payload.get("meta", {})
            total_pages = int(meta.get("total-pages", 1) or 1)
            if total_pages > 1:
                raise RuntimeError(
                    f"Bounded request unexpectedly paginated ({total_pages} pages): {url}"
                )
            elapsed = time.monotonic() - started
            print(
                f"OK seconds={elapsed:.2f} endpoint={path} rows={len(rows)} "
                f"total={meta.get('total-count')} filter={filter_expr}",
                flush=True,
            )
            return rows, meta, url
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")[:1200]
            if 400 <= exc.code < 500 and exc.code != 429:
                raise RuntimeError(f"Treasury HTTP {exc.code}: {url}: {body}") from exc
            last_error = exc
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, RuntimeError) as exc:
            last_error = exc
        if attempt < attempts:
            time.sleep(2)
    raise RuntimeError(f"Treasury request failed after {attempts} attempts: {url}: {last_error}")


def stable_columns(rows: Iterable[dict[str, Any]]) -> list[str]:
    preferred = [
        "snapshot_requested",
        "period_requested",
        "record_date",
        "record_fiscal_year",
        "record_fiscal_quarter",
        "expense_catg_desc",
        "expense_group_desc",
        "expense_type_desc",
        "month_expense_amt",
        "fytd_expense_amt",
        "security_type_desc",
        "security_desc",
        "security_class1_desc",
        "security_class2_desc",
        "issue_date",
        "maturity_date",
        "interest_rate_pct",
        "avg_interest_rate_amt",
        "outstanding_amt",
        "debt_held_public_amt",
        "intragov_hold_amt",
        "tot_pub_debt_out_amt",
        "src_line_nbr",
    ]
    observed: set[str] = set()
    for row in rows:
        observed.update(row.keys())
    return [column for column in preferred if column in observed] + sorted(
        observed.difference(preferred)
    )


def write_csv(name: str, rows: list[dict[str, Any]]) -> dict[str, Any]:
    path = OUT / name
    columns = stable_columns(rows)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({key: row.get(key, "") for key in columns})
    dates = sorted({str(row.get("record_date")) for row in rows if row.get("record_date")})
    return {
        "file": str(path.relative_to(OUT.parent)),
        "rows": len(rows),
        "columns": columns,
        "first_record_date": dates[0] if dates else None,
        "last_record_date": dates[-1] if dates else None,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }


def fiscal_ranges(cutoff: str) -> list[tuple[str, str]]:
    latest = date.fromisoformat(cutoff)
    ranges: list[tuple[str, str]] = []
    for fiscal_year in range(2021, latest.year + 2):
        start = date(fiscal_year - 1, 10, 1)
        end = date(fiscal_year, 9, 30)
        if start > latest:
            break
        ranges.append((start.isoformat(), min(end, latest).isoformat()))
    return ranges


def main() -> None:
    retrieved_at = datetime.now(timezone.utc).isoformat()
    tasks: list[dict[str, Any]] = []

    for key in ("interest", "rates"):
        for snapshot in SNAPSHOTS:
            tasks.append(
                {
                    "dataset": key,
                    "label": snapshot,
                    "path": ENDPOINTS[key],
                    "filter": f"record_date:eq:{snapshot}",
                    "fields": FIELD_SETS[key],
                }
            )

    tasks.append(
        {
            "dataset": "market",
            "label": CURRENT_MONTH_END,
            "path": ENDPOINTS["market"],
            "filter": f"record_date:eq:{CURRENT_MONTH_END}",
            "fields": FIELD_SETS["market"],
        }
    )

    for start, end in fiscal_ranges(CURRENT_MONTH_END):
        tasks.append(
            {
                "dataset": "debt",
                "label": f"{start}/{end}",
                "path": ENDPOINTS["debt"],
                "filter": f"record_date:gte:{start},record_date:lte:{end}",
                "fields": FIELD_SETS["debt"],
            }
        )

    collected: dict[str, list[dict[str, Any]]] = {
        "interest": [],
        "rates": [],
        "market": [],
        "debt": [],
    }
    provenance: dict[str, dict[str, Any]] = {key: {} for key in collected}
    failures: list[dict[str, str]] = []

    with ThreadPoolExecutor(max_workers=12) as pool:
        future_map = {
            pool.submit(
                request_rows,
                task["path"],
                task["filter"],
                fields=task["fields"],
            ): task
            for task in tasks
        }
        for future in as_completed(future_map):
            task = future_map[future]
            try:
                rows, meta, url = future.result()
                if not rows:
                    raise RuntimeError(
                        f"No rows for {task['dataset']} {task['label']} ({task['filter']})"
                    )
                marker = "snapshot_requested" if task["dataset"] != "debt" else "period_requested"
                for row in rows:
                    row[marker] = task["label"]
                collected[task["dataset"]].extend(rows)
                provenance[task["dataset"]][task["label"]] = {
                    "endpoint": task["path"],
                    "filter": task["filter"],
                    "fields": task["fields"],
                    "url": url,
                    "api_meta": meta,
                }
            except Exception as exc:
                failures.append(
                    {
                        "dataset": task["dataset"],
                        "label": task["label"],
                        "error": repr(exc),
                    }
                )

    if failures:
        print(json.dumps({"failures": failures}, indent=2), flush=True)
        raise SystemExit("One or more bounded Treasury requests failed")

    file_map = {
        "interest": "interest_expense_raw.csv",
        "rates": "average_interest_rates_raw.csv",
        "market": "mspd_marketable_snapshot_raw.csv",
        "debt": "debt_to_penny_raw.csv",
    }
    manifest: dict[str, Any] = {
        "retrieved_at_utc": retrieved_at,
        "calculation_cutoff": CURRENT_MONTH_END,
        "base_url": BASE,
        "snapshot_dates": SNAPSHOTS,
        "datasets": [],
    }
    for key, filename in file_map.items():
        rows = sorted(
            collected[key],
            key=lambda row: (
                str(row.get("record_date", "")),
                str(row.get("src_line_nbr", "")),
                str(row.get("maturity_date", "")),
            ),
        )
        entry = write_csv(filename, rows)
        entry["requests"] = provenance[key]
        manifest["datasets"].append(entry)

    manifest_path = OUT / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True), encoding="utf-8")
    print(json.dumps(manifest, indent=2), flush=True)


if __name__ == "__main__":
    main()
