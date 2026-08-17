#!/usr/bin/env python3
"""Fetch bounded Treasury Fiscal Data snapshots for the interest-repricing article.

Every request is either one exact monthly record date or one fiscal-year slice of
the daily Debt to the Penny series. The shared calculation cutoff is July 31,
2026, the latest completed monthly Treasury snapshot available when this research
was conducted. The script writes source-faithful CSV files and a provenance
manifest with endpoints, fields, filters, API metadata, row counts, and hashes.
"""

from __future__ import annotations

import csv
import hashlib
import json
import time
import urllib.error
import urllib.parse
import urllib.request
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
    # MSPD schemas evolve. Pull the full exact-date records and preserve every
    # returned field so security-level provenance remains auditable.
    "market": None,
}


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
            with urllib.request.urlopen(req, timeout=60) as response:
                payload = json.loads(response.read().decode("utf-8"))
            print(
                f"OK endpoint={path} rows={len(payload.get('data', []))} "
                f"total={payload.get('meta', {}).get('total-count')}",
                flush=True,
            )
            return payload
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")[:1200]
            if 400 <= exc.code < 500 and exc.code != 429:
                raise RuntimeError(f"Treasury HTTP {exc.code}: {url}: {body}") from exc
            last_error = exc
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
        if attempt < attempts:
            time.sleep(2 ** (attempt - 1))
    raise RuntimeError(f"Treasury request failed after {attempts} attempts: {url}: {last_error}")


def fetch_all(
    path: str,
    filter_expr: str,
    *,
    fields: str | None = None,
    page_size: int = 1000,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    page = 1
    first_meta: dict[str, Any] = {}
    while True:
        params: dict[str, Any] = {
            "filter": filter_expr,
            "page[number]": page,
            "page[size]": page_size,
        }
        if fields:
            params["fields"] = fields
        payload = request_json(path, params)
        batch = payload.get("data", [])
        if page == 1:
            first_meta = payload.get("meta", {})
        if not isinstance(batch, list):
            raise RuntimeError(f"Unexpected data payload for {path}: {type(batch)!r}")
        rows.extend(batch)
        total_pages = int(payload.get("meta", {}).get("total-pages", page) or page)
        if page >= total_pages or len(batch) < page_size:
            break
        page += 1
    return rows, first_meta


def stable_columns(rows: Iterable[dict[str, Any]]) -> list[str]:
    preferred = [
        "snapshot_requested",
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
    return [c for c in preferred if c in observed] + sorted(observed.difference(preferred))


def write_csv(name: str, rows: list[dict[str, Any]]) -> dict[str, Any]:
    path = OUT / name
    columns = stable_columns(rows)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({key: row.get(key, "") for key in columns})
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    dates = sorted({str(row.get("record_date")) for row in rows if row.get("record_date")})
    return {
        "file": str(path.relative_to(OUT.parent)),
        "rows": len(rows),
        "columns": columns,
        "first_record_date": dates[0] if dates else None,
        "last_record_date": dates[-1] if dates else None,
        "sha256": digest,
    }


def fetch_snapshot_set(
    path: str,
    dates: list[str],
    *,
    fields: str | None,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    combined: list[dict[str, Any]] = []
    metadata: dict[str, Any] = {}
    for snapshot in dates:
        rows, meta = fetch_all(
            path,
            f"record_date:eq:{snapshot}",
            fields=fields,
            page_size=5000,
        )
        if not rows:
            raise RuntimeError(f"No rows returned for {path} on {snapshot}")
        for row in rows:
            row["snapshot_requested"] = snapshot
        combined.extend(rows)
        metadata[snapshot] = meta
    return combined, metadata


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
    manifest: dict[str, Any] = {
        "retrieved_at_utc": retrieved_at,
        "calculation_cutoff": CURRENT_MONTH_END,
        "base_url": BASE,
        "datasets": [],
        "snapshot_dates": SNAPSHOTS,
    }

    monthly_specs = [
        ("interest_expense_raw.csv", "interest"),
        ("average_interest_rates_raw.csv", "rates"),
        ("mspd_marketable_snapshots_raw.csv", "market"),
    ]

    for filename, key in monthly_specs:
        endpoint = ENDPOINTS[key]
        fields = FIELD_SETS[key]
        print(f"START dataset={filename} snapshots={SNAPSHOTS}", flush=True)
        rows, meta_by_snapshot = fetch_snapshot_set(endpoint, SNAPSHOTS, fields=fields)
        entry = write_csv(filename, rows)
        entry.update(
            {
                "endpoint": endpoint,
                "fields": fields,
                "filters": [f"record_date:eq:{snapshot}" for snapshot in SNAPSHOTS],
                "api_meta_by_snapshot": meta_by_snapshot,
            }
        )
        manifest["datasets"].append(entry)

    print("START dataset=debt_to_penny_raw.csv", flush=True)
    debt_rows: list[dict[str, Any]] = []
    debt_meta: dict[str, Any] = {}
    for start, end in fiscal_ranges(CURRENT_MONTH_END):
        filter_expr = f"record_date:gte:{start},record_date:lte:{end}"
        rows, meta = fetch_all(
            ENDPOINTS["debt"],
            filter_expr,
            fields=FIELD_SETS["debt"],
            page_size=500,
        )
        if not rows:
            raise RuntimeError(f"No debt rows returned for {start} through {end}")
        debt_rows.extend(rows)
        debt_meta[f"{start}/{end}"] = meta
    debt_entry = write_csv("debt_to_penny_raw.csv", debt_rows)
    debt_entry.update(
        {
            "endpoint": ENDPOINTS["debt"],
            "fields": FIELD_SETS["debt"],
            "filters": list(debt_meta),
            "api_meta_by_range": debt_meta,
        }
    )
    manifest["datasets"].append(debt_entry)

    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True), encoding="utf-8")
    print(json.dumps(manifest, indent=2), flush=True)


if __name__ == "__main__":
    main()
