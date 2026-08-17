#!/usr/bin/env python3
"""Temporary research probe for the Summer 2026 internship registry.

The script is intentionally standard-library only so it can run in GitHub Actions.
It downloads the registry at the archive snapshot commit and emits aggregate
research diagnostics. It does not redistribute the raw registry.
"""

from __future__ import annotations

import csv
import json
import re
import statistics
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

SNAPSHOT_SHA = "3c16fd5d8ff8fe54a073bccfdb1990fa01e8154b"
SOURCE_URL = (
    "https://raw.githubusercontent.com/SimplifyJobs/"
    f"Summer2027-Internships/{SNAPSHOT_SHA}/.github/scripts/listings.json"
)
OUT_DIR = Path("research_tmp")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def fetch_json(url: str) -> list[dict[str, Any]]:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "sulayman-bowles-research/1.0"},
    )
    with urllib.request.urlopen(req, timeout=180) as response:
        return json.load(response)


def as_dt(value: Any) -> datetime | None:
    if value is None:
        return None
    try:
        return datetime.fromtimestamp(float(value), tz=timezone.utc)
    except (TypeError, ValueError, OSError):
        return None


def norm_text(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip().lower())


def norm_url(value: Any) -> str:
    raw = str(value or "").strip()
    if not raw:
        return ""
    try:
        parsed = urllib.parse.urlsplit(raw)
        host = parsed.netloc.lower().removeprefix("www.")
        path = re.sub(r"/+", "/", parsed.path).rstrip("/")
        # Preserve the path because ATS requisition IDs often live there. Drop
        # tracking parameters and fragments; they do not identify a vacancy.
        return f"{host}{path}".lower()
    except ValueError:
        return raw.lower()


def month_key(dt: datetime | None) -> str:
    return dt.strftime("%Y-%m") if dt else "unknown"


def percentile(values: list[float], p: float) -> float | None:
    if not values:
        return None
    xs = sorted(values)
    if len(xs) == 1:
        return xs[0]
    pos = (len(xs) - 1) * p
    lo = int(pos)
    hi = min(lo + 1, len(xs) - 1)
    frac = pos - lo
    return xs[lo] * (1 - frac) + xs[hi] * frac


def write_csv(path: Path, fieldnames: list[str], rows: Iterable[dict[str, Any]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    rows = fetch_json(SOURCE_URL)
    visible = [r for r in rows if r.get("is_visible", True)]
    summer_2026 = [
        r for r in visible if "Summer 2026" in (r.get("terms") or [])
    ]

    term_counts: Counter[str] = Counter()
    for row in visible:
        for term in row.get("terms") or ["(no term)"]:
            term_counts[str(term)] += 1

    posted_dates = [as_dt(r.get("date_posted")) for r in summer_2026]
    posted_dates = [d for d in posted_dates if d]
    updated_dates = [as_dt(r.get("date_updated")) for r in summer_2026]
    updated_dates = [d for d in updated_dates if d]

    deltas_days: list[float] = []
    equal_dates = 0
    negative_dates = 0
    missing_dates = 0
    for r in summer_2026:
        p = as_dt(r.get("date_posted"))
        u = as_dt(r.get("date_updated"))
        if not p or not u:
            missing_dates += 1
            continue
        delta = (u - p).total_seconds() / 86400
        if abs(delta) < 1e-9:
            equal_dates += 1
        elif delta < 0:
            negative_dates += 1
        else:
            deltas_days.append(delta)

    exact_url_counts = Counter(norm_url(r.get("url")) for r in summer_2026)
    exact_url_counts.pop("", None)
    duplicate_url_groups = {k: v for k, v in exact_url_counts.items() if v > 1}
    rows_in_duplicate_url_groups = sum(duplicate_url_groups.values())

    composite_counts: Counter[str] = Counter()
    for r in summer_2026:
        locs = sorted(norm_text(x) for x in (r.get("locations") or []))
        key = "|".join(
            [norm_text(r.get("company_name")), norm_text(r.get("title")), ";".join(locs)]
        )
        composite_counts[key] += 1
    duplicate_composite_groups = {k: v for k, v in composite_counts.items() if v > 1}

    month_counts: Counter[tuple[str, str]] = Counter()
    source_month_counts: Counter[tuple[str, str]] = Counter()
    category_counts: Counter[str] = Counter()
    source_counts: Counter[str] = Counter()
    active_counts: Counter[str] = Counter()
    company_counts: Counter[str] = Counter()
    location_count_distribution: Counter[int] = Counter()

    for r in summer_2026:
        dt = as_dt(r.get("date_posted"))
        month = month_key(dt)
        category = str(r.get("category") or "Unknown")
        source = str(r.get("source") or "Unknown")
        month_counts[(month, category)] += 1
        source_month_counts[(month, source)] += 1
        category_counts[category] += 1
        source_counts[source] += 1
        active_counts[str(bool(r.get("active"))).lower()] += 1
        company_counts[str(r.get("company_name") or "Unknown")] += 1
        location_count_distribution[len(r.get("locations") or [])] += 1

    month_rows = [
        {"month": m, "category": c, "posting_records": n}
        for (m, c), n in sorted(month_counts.items())
    ]
    write_csv(
        OUT_DIR / "summer_2026_posting_month_by_category.csv",
        ["month", "category", "posting_records"],
        month_rows,
    )

    source_month_rows = [
        {"month": m, "source": s, "posting_records": n}
        for (m, s), n in sorted(source_month_counts.items())
    ]
    write_csv(
        OUT_DIR / "summer_2026_posting_month_by_source.csv",
        ["month", "source", "posting_records"],
        source_month_rows,
    )

    company_rows = [
        {"company": company, "posting_records": count}
        for company, count in company_counts.most_common(100)
    ]
    write_csv(
        OUT_DIR / "summer_2026_top_companies.csv",
        ["company", "posting_records"],
        company_rows,
    )

    duplicate_rows = [
        {
            "normalized_url": url,
            "posting_records": count,
        }
        for url, count in sorted(
            duplicate_url_groups.items(), key=lambda item: (-item[1], item[0])
        )
    ]
    write_csv(
        OUT_DIR / "summer_2026_duplicate_url_groups.csv",
        ["normalized_url", "posting_records"],
        duplicate_rows,
    )

    timestamps_sorted = sorted(d.timestamp() for d in posted_dates)
    summary = {
        "source": {
            "repository": "SimplifyJobs/Summer2027-Internships",
            "snapshot_sha": SNAPSHOT_SHA,
            "snapshot_commit_timestamp_utc": "2026-07-29T16:00:54Z",
            "registry_url": SOURCE_URL,
        },
        "counts": {
            "registry_rows_all_terms": len(rows),
            "visible_rows_all_terms": len(visible),
            "summer_2026_visible_rows": len(summer_2026),
            "unique_companies_summer_2026": len(company_counts),
            "normalized_unique_urls_summer_2026": len(exact_url_counts),
            "duplicate_url_groups": len(duplicate_url_groups),
            "rows_in_duplicate_url_groups": rows_in_duplicate_url_groups,
            "duplicate_composite_groups": len(duplicate_composite_groups),
            "rows_in_duplicate_composite_groups": sum(duplicate_composite_groups.values()),
        },
        "date_quality": {
            "posted_min_utc": min(posted_dates).isoformat() if posted_dates else None,
            "posted_max_utc": max(posted_dates).isoformat() if posted_dates else None,
            "updated_min_utc": min(updated_dates).isoformat() if updated_dates else None,
            "updated_max_utc": max(updated_dates).isoformat() if updated_dates else None,
            "date_updated_equals_date_posted": equal_dates,
            "date_updated_after_date_posted": len(deltas_days),
            "date_updated_before_date_posted": negative_dates,
            "missing_posted_or_updated": missing_dates,
            "positive_delta_days_p10": percentile(deltas_days, 0.10),
            "positive_delta_days_p25": percentile(deltas_days, 0.25),
            "positive_delta_days_median": percentile(deltas_days, 0.50),
            "positive_delta_days_p75": percentile(deltas_days, 0.75),
            "positive_delta_days_p90": percentile(deltas_days, 0.90),
        },
        "posting_date_quantiles_utc": {
            "p10": datetime.fromtimestamp(percentile(timestamps_sorted, 0.10), tz=timezone.utc).isoformat() if timestamps_sorted else None,
            "p25": datetime.fromtimestamp(percentile(timestamps_sorted, 0.25), tz=timezone.utc).isoformat() if timestamps_sorted else None,
            "p50": datetime.fromtimestamp(percentile(timestamps_sorted, 0.50), tz=timezone.utc).isoformat() if timestamps_sorted else None,
            "p75": datetime.fromtimestamp(percentile(timestamps_sorted, 0.75), tz=timezone.utc).isoformat() if timestamps_sorted else None,
            "p90": datetime.fromtimestamp(percentile(timestamps_sorted, 0.90), tz=timezone.utc).isoformat() if timestamps_sorted else None,
        },
        "term_counts": dict(term_counts.most_common()),
        "category_counts_summer_2026": dict(category_counts.most_common()),
        "source_counts_summer_2026": dict(source_counts.most_common()),
        "active_counts_summer_2026": dict(active_counts.most_common()),
        "location_count_distribution_summer_2026": {
            str(k): v for k, v in sorted(location_count_distribution.items())
        },
        "top_companies_summer_2026": dict(company_counts.most_common(25)),
    }

    with (OUT_DIR / "internship_registry_summary.json").open(
        "w", encoding="utf-8"
    ) as f:
        json.dump(summary, f, indent=2, sort_keys=True)
        f.write("\n")

    print(json.dumps(summary, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
