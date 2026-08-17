#!/usr/bin/env python3
"""Build a reproducible research bundle from the Summer 2026 internship registry.

This is a temporary research utility. It downloads the public registry at the
commit used for the closed Summer 2026 archive, constructs the archive cohort,
and emits only derived/cleaned data plus aggregate diagnostics. The original
registry is not committed.
"""

from __future__ import annotations

import csv
import json
import math
import re
import urllib.parse
import urllib.request
import zipfile
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable, Sequence

SNAPSHOT_SHA = "3c16fd5d8ff8fe54a073bccfdb1990fa01e8154b"
SNAPSHOT_AT = datetime(2026, 7, 29, 16, 0, 54, tzinfo=timezone.utc)
ARCHIVE_CUTOFF = SNAPSHOT_AT - timedelta(days=30)
SOURCE_URL = (
    "https://raw.githubusercontent.com/SimplifyJobs/"
    f"Summer2027-Internships/{SNAPSHOT_SHA}/.github/scripts/listings.json"
)
OUT_DIR = Path("research_tmp")
OUT_DIR.mkdir(parents=True, exist_ok=True)

CATEGORY_MAP = {
    "Software": "Software Engineering",
    "Software Engineering": "Software Engineering",
    "Product": "Product Management",
    "Product Management": "Product Management",
    "AI/ML/Data": "Data Science, AI & Machine Learning",
    "Data Science, AI & Machine Learning": "Data Science, AI & Machine Learning",
    "Quant": "Quantitative Finance",
    "Quantitative Finance": "Quantitative Finance",
    "Hardware": "Hardware Engineering",
    "Hardware Engineering": "Hardware Engineering",
}
CATEGORY_ORDER = [
    "Software Engineering",
    "Product Management",
    "Data Science, AI & Machine Learning",
    "Quantitative Finance",
    "Hardware Engineering",
]

US_STATE_CODES = {
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
    "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
    "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
    "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
    "WI", "WY", "DC",
}
CANADA_CODES = {
    "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"
}


def fetch_json(url: str) -> list[dict[str, Any]]:
    req = urllib.request.Request(url, headers={"User-Agent": "sulayman-bowles-research/1.0"})
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


def normalized_category(value: Any) -> str:
    raw = str(value or "Unknown")
    return CATEGORY_MAP.get(raw, raw)


def norm_url(value: Any) -> str:
    raw = str(value or "").strip()
    if not raw:
        return ""
    try:
        parsed = urllib.parse.urlsplit(raw)
        host = parsed.netloc.lower().removeprefix("www.")
        path = re.sub(r"/+", "/", parsed.path).rstrip("/").lower()
        params = urllib.parse.parse_qs(parsed.query, keep_blank_values=False)
        # Retain query parameters that can carry the actual requisition ID when
        # the path itself is generic; strip tracking parameters.
        id_keys = {
            "gh_jid", "jobid", "job_id", "jid", "reqid", "req_id", "requisitionid",
            "requisition_id", "rid", "postingid", "posting_id", "job", "jobnumber",
        }
        kept: list[tuple[str, str]] = []
        for key, values in params.items():
            if key.lower() in id_keys:
                kept.extend((key.lower(), str(v)) for v in values)
        query = urllib.parse.urlencode(sorted(kept))
        return f"{host}{path}" + (f"?{query}" if query else "")
    except ValueError:
        return raw.lower()


def percentile(values: Sequence[float], p: float) -> float | None:
    if not values:
        return None
    xs = sorted(values)
    if len(xs) == 1:
        return float(xs[0])
    pos = (len(xs) - 1) * p
    lo = math.floor(pos)
    hi = math.ceil(pos)
    if lo == hi:
        return float(xs[lo])
    frac = pos - lo
    return float(xs[lo] * (1 - frac) + xs[hi] * frac)


def date_quantile(rows: Sequence[dict[str, Any]], p: float) -> str | None:
    ts = [r["posted_at"].timestamp() for r in rows if r.get("posted_at")]
    value = percentile(ts, p)
    return datetime.fromtimestamp(value, tz=timezone.utc).date().isoformat() if value is not None else None


def week_start(d: date) -> date:
    return d - timedelta(days=d.weekday())


def classify_region(locations: Sequence[str]) -> str:
    if not locations:
        return "Unknown"
    labels: set[str] = set()
    for raw in locations:
        text = str(raw).strip()
        lower = text.lower()
        if any(token in lower for token in ["remote in usa", "remote - usa", "united states", "usa", "u.s."]):
            labels.add("United States")
            continue
        if any(token in lower for token in ["remote in canada", "canada"]):
            labels.add("Canada")
            continue
        if any(token in lower for token in ["united kingdom", " uk", "london", "england", "scotland", "wales"]):
            labels.add("United Kingdom")
            continue
        if text in {"NYC", "SF", "LA", "United States"}:
            labels.add("United States")
            continue
        codes = set(re.findall(r"\b[A-Z]{2}\b", text))
        if codes & US_STATE_CODES:
            labels.add("United States")
        elif codes & CANADA_CODES:
            labels.add("Canada")
        else:
            labels.add("Other")
    if len(labels) == 1:
        return next(iter(labels))
    if not labels:
        return "Unknown"
    return "Multi-region"


def write_csv(path: Path, fieldnames: list[str], rows: Iterable[dict[str, Any]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def timing_metrics(rows: Sequence[dict[str, Any]]) -> dict[str, Any]:
    if not rows:
        return {
            "n": 0,
            "first_seen_min": None,
            "p10": None,
            "p25": None,
            "median": None,
            "p75": None,
            "p90": None,
            "first_seen_max": None,
        }
    dates = sorted(r["posted_at"].date() for r in rows)
    result: dict[str, Any] = {
        "n": len(rows),
        "first_seen_min": dates[0].isoformat(),
        "p10": date_quantile(rows, 0.10),
        "p25": date_quantile(rows, 0.25),
        "median": date_quantile(rows, 0.50),
        "p75": date_quantile(rows, 0.75),
        "p90": date_quantile(rows, 0.90),
        "first_seen_max": dates[-1].isoformat(),
    }
    for threshold in [
        date(2026, 1, 1), date(2026, 2, 1), date(2026, 3, 1),
        date(2026, 4, 1), date(2026, 5, 1), date(2026, 6, 1),
    ]:
        key = f"share_on_or_after_{threshold.isoformat()}"
        result[key] = sum(r["posted_at"].date() >= threshold for r in rows) / len(rows)
    return result


def main() -> None:
    raw_rows = fetch_json(SOURCE_URL)
    visible = [r for r in raw_rows if r.get("is_visible", True)]
    summer_rows: list[dict[str, Any]] = []

    for raw in visible:
        if "Summer 2026" not in (raw.get("terms") or []):
            continue
        posted_at = as_dt(raw.get("date_posted"))
        if not posted_at:
            continue
        row = dict(raw)
        row["posted_at"] = posted_at
        row["category_norm"] = normalized_category(raw.get("category"))
        row["normalized_url"] = norm_url(raw.get("url"))
        row["locations_norm"] = [str(x).strip() for x in (raw.get("locations") or [])]
        row["region"] = classify_region(row["locations_norm"])
        row["remote"] = any("remote" in x.lower() for x in row["locations_norm"])
        summer_rows.append(row)

    cutoff_candidates = {
        "posted_before_exact_30_day_cutoff": sum(r["posted_at"] < ARCHIVE_CUTOFF for r in summer_rows),
        "posted_on_or_before_exact_30_day_cutoff": sum(r["posted_at"] <= ARCHIVE_CUTOFF for r in summer_rows),
        "posted_before_cutoff_calendar_day": sum(r["posted_at"].date() < ARCHIVE_CUTOFF.date() for r in summer_rows),
        "posted_on_or_before_cutoff_calendar_day": sum(r["posted_at"].date() <= ARCHIVE_CUTOFF.date() for r in summer_rows),
    }

    # This exact timestamp rule reproduces the archive-generation note: records
    # first observed within 30 days of the snapshot are excluded.
    archive_rows = [r for r in summer_rows if r["posted_at"] < ARCHIVE_CUTOFF]

    # Exact-URL sensitivity dedupe: retain earliest observed record per normalized
    # application URL. Empty URLs remain distinct via the listing ID.
    by_url: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in archive_rows:
        key = row["normalized_url"] or f"missing-url:{row.get('id')}"
        by_url[key].append(row)
    dedup_rows = [min(group, key=lambda r: r["posted_at"]) for group in by_url.values()]

    min_posted = min(r["posted_at"] for r in archive_rows)
    launch_day = min_posted.date()
    flow_rows = [r for r in archive_rows if r["posted_at"].date() > launch_day]
    dedup_flow_rows = [r for r in dedup_rows if r["posted_at"].date() > launch_day]

    cleaned_fields = [
        "listing_id", "posted_at_utc", "posted_date_utc", "week_start_utc", "month",
        "category", "company", "title", "locations", "location_count", "region", "remote",
        "sponsorship", "degrees", "source", "active_at_snapshot", "url", "normalized_url",
        "launch_day_stock",
    ]
    cleaned_rows: list[dict[str, Any]] = []
    for r in sorted(archive_rows, key=lambda x: (x["posted_at"], str(x.get("id")))):
        posted_date = r["posted_at"].date()
        cleaned_rows.append({
            "listing_id": r.get("id"),
            "posted_at_utc": r["posted_at"].isoformat(),
            "posted_date_utc": posted_date.isoformat(),
            "week_start_utc": week_start(posted_date).isoformat(),
            "month": posted_date.strftime("%Y-%m"),
            "category": r["category_norm"],
            "company": str(r.get("company_name") or "").strip(),
            "title": str(r.get("title") or "").strip(),
            "locations": " | ".join(r["locations_norm"]),
            "location_count": len(r["locations_norm"]),
            "region": r["region"],
            "remote": str(bool(r["remote"])).lower(),
            "sponsorship": str(r.get("sponsorship") or "Unknown"),
            "degrees": " | ".join(str(x) for x in (r.get("degrees") or [])),
            "source": str(r.get("source") or "Unknown"),
            "active_at_snapshot": str(bool(r.get("active"))).lower(),
            "url": str(r.get("url") or ""),
            "normalized_url": r["normalized_url"],
            "launch_day_stock": str(posted_date == launch_day).lower(),
        })
    write_csv(OUT_DIR / "summer_2026_archive_cleaned.csv", cleaned_fields, cleaned_rows)

    daily: Counter[tuple[date, str]] = Counter()
    daily_dedup: Counter[tuple[date, str]] = Counter()
    weekly: Counter[tuple[date, str]] = Counter()
    weekly_dedup: Counter[tuple[date, str]] = Counter()
    monthly: Counter[tuple[str, str]] = Counter()
    for r in archive_rows:
        d = r["posted_at"].date()
        c = r["category_norm"]
        daily[(d, c)] += 1
        weekly[(week_start(d), c)] += 1
        monthly[(d.strftime("%Y-%m"), c)] += 1
    for r in dedup_rows:
        d = r["posted_at"].date()
        c = r["category_norm"]
        daily_dedup[(d, c)] += 1
        weekly_dedup[(week_start(d), c)] += 1

    all_dates = sorted({d for d, _ in daily})
    daily_rows: list[dict[str, Any]] = []
    for d in all_dates:
        for category in ["All"] + CATEGORY_ORDER:
            if category == "All":
                raw_n = sum(daily[(d, c)] for c in CATEGORY_ORDER)
                dedup_n = sum(daily_dedup[(d, c)] for c in CATEGORY_ORDER)
            else:
                raw_n = daily[(d, category)]
                dedup_n = daily_dedup[(d, category)]
            daily_rows.append({
                "date": d.isoformat(), "category": category,
                "raw_posting_records": raw_n, "exact_url_dedup_records": dedup_n,
            })
    write_csv(
        OUT_DIR / "summer_2026_archive_daily_flow.csv",
        ["date", "category", "raw_posting_records", "exact_url_dedup_records"],
        daily_rows,
    )

    all_weeks = sorted({d for d, _ in weekly})
    weekly_rows: list[dict[str, Any]] = []
    for d in all_weeks:
        for category in ["All"] + CATEGORY_ORDER:
            if category == "All":
                raw_n = sum(weekly[(d, c)] for c in CATEGORY_ORDER)
                dedup_n = sum(weekly_dedup[(d, c)] for c in CATEGORY_ORDER)
            else:
                raw_n = weekly[(d, category)]
                dedup_n = weekly_dedup[(d, category)]
            weekly_rows.append({
                "week_start": d.isoformat(), "category": category,
                "raw_posting_records": raw_n, "exact_url_dedup_records": dedup_n,
            })
    write_csv(
        OUT_DIR / "summer_2026_archive_weekly_flow.csv",
        ["week_start", "category", "raw_posting_records", "exact_url_dedup_records"],
        weekly_rows,
    )

    monthly_rows = [
        {"month": month, "category": category, "posting_records": n}
        for (month, category), n in sorted(monthly.items())
    ]
    write_csv(
        OUT_DIR / "summer_2026_archive_monthly_by_category.csv",
        ["month", "category", "posting_records"],
        monthly_rows,
    )

    timing_rows: list[dict[str, Any]] = []
    for label, source_rows in [
        ("All raw records", archive_rows),
        ("All exact-URL deduped", dedup_rows),
        ("Post-launch raw flow", flow_rows),
        ("Post-launch exact-URL deduped flow", dedup_flow_rows),
    ]:
        timing_rows.append({"population": label, "category": "All", **timing_metrics(source_rows)})
    for category in CATEGORY_ORDER:
        cat_rows = [r for r in archive_rows if r["category_norm"] == category]
        cat_dedup = [r for r in dedup_rows if r["category_norm"] == category]
        cat_flow = [r for r in cat_rows if r["posted_at"].date() > launch_day]
        cat_dedup_flow = [r for r in cat_dedup if r["posted_at"].date() > launch_day]
        timing_rows.extend([
            {"population": "Raw records", "category": category, **timing_metrics(cat_rows)},
            {"population": "Exact-URL deduped", "category": category, **timing_metrics(cat_dedup)},
            {"population": "Post-launch raw flow", "category": category, **timing_metrics(cat_flow)},
            {"population": "Post-launch exact-URL deduped flow", "category": category, **timing_metrics(cat_dedup_flow)},
        ])
    timing_fields = list(timing_rows[0].keys())
    write_csv(OUT_DIR / "summer_2026_archive_timing_metrics.csv", timing_fields, timing_rows)

    cumulative_rows: list[dict[str, Any]] = []
    for category in ["All"] + CATEGORY_ORDER:
        raw_subset = archive_rows if category == "All" else [r for r in archive_rows if r["category_norm"] == category]
        dedup_subset = dedup_rows if category == "All" else [r for r in dedup_rows if r["category_norm"] == category]
        raw_dates = Counter(r["posted_at"].date() for r in raw_subset)
        dedup_dates = Counter(r["posted_at"].date() for r in dedup_subset)
        raw_running = 0
        dedup_running = 0
        for d in all_dates:
            raw_running += raw_dates[d]
            dedup_running += dedup_dates[d]
            cumulative_rows.append({
                "date": d.isoformat(),
                "category": category,
                "raw_cumulative_records": raw_running,
                "raw_cumulative_share": raw_running / len(raw_subset) if raw_subset else 0,
                "dedup_cumulative_records": dedup_running,
                "dedup_cumulative_share": dedup_running / len(dedup_subset) if dedup_subset else 0,
            })
    write_csv(
        OUT_DIR / "summer_2026_archive_cumulative_curve.csv",
        ["date", "category", "raw_cumulative_records", "raw_cumulative_share", "dedup_cumulative_records", "dedup_cumulative_share"],
        cumulative_rows,
    )

    company_counts = Counter(str(r.get("company_name") or "Unknown").strip() for r in archive_rows)
    company_rows: list[dict[str, Any]] = []
    running = 0
    for rank, (company, n) in enumerate(company_counts.most_common(), start=1):
        running += n
        company_rows.append({
            "rank": rank, "company": company, "posting_records": n,
            "share_of_records": n / len(archive_rows),
            "cumulative_share": running / len(archive_rows),
        })
    write_csv(
        OUT_DIR / "summer_2026_archive_employer_concentration.csv",
        ["rank", "company", "posting_records", "share_of_records", "cumulative_share"],
        company_rows,
    )

    duplicate_groups = [
        group for key, group in by_url.items()
        if not key.startswith("missing-url:") and len(group) > 1
    ]
    duplicate_rows: list[dict[str, Any]] = []
    for group in sorted(duplicate_groups, key=lambda g: (-len(g), g[0]["normalized_url"])):
        duplicate_rows.append({
            "normalized_url": group[0]["normalized_url"],
            "records": len(group),
            "companies": " | ".join(sorted({str(r.get("company_name") or "") for r in group})),
            "titles": " | ".join(sorted({str(r.get("title") or "") for r in group})),
            "first_seen_min": min(r["posted_at"] for r in group).isoformat(),
            "first_seen_max": max(r["posted_at"] for r in group).isoformat(),
        })
    write_csv(
        OUT_DIR / "summer_2026_archive_duplicate_url_audit.csv",
        ["normalized_url", "records", "companies", "titles", "first_seen_min", "first_seen_max"],
        duplicate_rows,
    )

    def categorical_summary(field: str, getter) -> list[dict[str, Any]]:
        counts = Counter(getter(r) for r in archive_rows)
        return [
            {field: key, "posting_records": n, "share_of_records": n / len(archive_rows)}
            for key, n in counts.most_common()
        ]

    write_csv(
        OUT_DIR / "summer_2026_archive_region_summary.csv",
        ["region", "posting_records", "share_of_records"],
        categorical_summary("region", lambda r: r["region"]),
    )
    write_csv(
        OUT_DIR / "summer_2026_archive_source_summary.csv",
        ["source", "posting_records", "share_of_records"],
        categorical_summary("source", lambda r: str(r.get("source") or "Unknown")),
    )
    write_csv(
        OUT_DIR / "summer_2026_archive_sponsorship_summary.csv",
        ["sponsorship", "posting_records", "share_of_records"],
        categorical_summary("sponsorship", lambda r: str(r.get("sponsorship") or "Unknown")),
    )
    write_csv(
        OUT_DIR / "summer_2026_archive_remote_summary.csv",
        ["remote", "posting_records", "share_of_records"],
        categorical_summary("remote", lambda r: str(bool(r["remote"])).lower()),
    )
    write_csv(
        OUT_DIR / "summer_2026_archive_degree_requirement_summary.csv",
        ["advanced_degree_flag", "posting_records", "share_of_records"],
        categorical_summary("advanced_degree_flag", lambda r: "advanced_degree_listed" if (r.get("degrees") or []) else "no_advanced_degree_listed"),
    )

    category_counts = Counter(r["category_norm"] for r in archive_rows)
    launch_stock = [r for r in archive_rows if r["posted_at"].date() == launch_day]
    peak_day, peak_day_n = max(Counter(r["posted_at"].date() for r in flow_rows).items(), key=lambda x: x[1])
    peak_week, peak_week_n = max(Counter(week_start(r["posted_at"].date()) for r in flow_rows).items(), key=lambda x: x[1])

    summary = {
        "source": {
            "repository": "SimplifyJobs/Summer2027-Internships",
            "snapshot_sha": SNAPSHOT_SHA,
            "snapshot_at_utc": SNAPSHOT_AT.isoformat(),
            "archive_cutoff_utc": ARCHIVE_CUTOFF.isoformat(),
            "registry_url": SOURCE_URL,
            "archive_readme_claimed_records": 9271,
        },
        "cohort_construction": {
            "visible_summer_2026_records_before_cutoff": len(archive_rows),
            "cutoff_candidate_counts": cutoff_candidates,
            "category_counts": dict(category_counts),
            "launch_day": launch_day.isoformat(),
            "launch_day_stock_records": len(launch_stock),
            "launch_day_stock_share": len(launch_stock) / len(archive_rows),
            "post_launch_flow_records": len(flow_rows),
        },
        "deduplication": {
            "raw_records": len(archive_rows),
            "exact_url_deduped_records": len(dedup_rows),
            "records_removed": len(archive_rows) - len(dedup_rows),
            "records_removed_share": (len(archive_rows) - len(dedup_rows)) / len(archive_rows),
            "duplicate_url_groups": len(duplicate_groups),
        },
        "timing": {
            "raw": timing_metrics(archive_rows),
            "exact_url_deduped": timing_metrics(dedup_rows),
            "post_launch_raw_flow": timing_metrics(flow_rows),
            "post_launch_exact_url_deduped_flow": timing_metrics(dedup_flow_rows),
            "peak_post_launch_day": peak_day.isoformat(),
            "peak_post_launch_day_records": peak_day_n,
            "peak_post_launch_week_start": peak_week.isoformat(),
            "peak_post_launch_week_records": peak_week_n,
        },
        "coverage_and_composition": {
            "unique_companies": len(company_counts),
            "top_10_company_share": sum(n for _, n in company_counts.most_common(10)) / len(archive_rows),
            "top_25_company_share": sum(n for _, n in company_counts.most_common(25)) / len(archive_rows),
            "source_counts": dict(Counter(str(r.get("source") or "Unknown") for r in archive_rows)),
            "region_counts": dict(Counter(r["region"] for r in archive_rows)),
            "remote_records": sum(bool(r["remote"]) for r in archive_rows),
            "multi_location_records": sum(len(r["locations_norm"]) > 1 for r in archive_rows),
            "advanced_degree_listed_records": sum(bool(r.get("degrees") or []) for r in archive_rows),
        },
        "invalid_lifespan_measurement": {
            "date_updated_equals_date_posted": sum(r.get("date_updated") == r.get("date_posted") for r in summer_rows),
            "reason_not_used": "date_updated is not a reliable closure timestamp in this snapshot; it frequently equals date_posted or differs by minutes.",
        },
    }
    with (OUT_DIR / "summer_2026_archive_summary.json").open("w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, sort_keys=True)
        f.write("\n")

    report = [
        "# Summer 2026 internship archive research diagnostics",
        "",
        f"- Archive cohort under exact 30-day cutoff: **{len(archive_rows):,} records** (archive README: 9,271).",
        f"- Exact-URL deduped sensitivity sample: **{len(dedup_rows):,} records**; removed {len(archive_rows) - len(dedup_rows):,} ({(len(archive_rows)-len(dedup_rows))/len(archive_rows):.2%}).",
        f"- Earliest first-seen date: **{min_posted.date().isoformat()}**.",
        f"- Launch-day stock: **{len(launch_stock):,} records** ({len(launch_stock)/len(archive_rows):.1%}); treat as left-censored opening stock, not same-day market flow.",
        f"- Raw median first-seen date: **{timing_metrics(archive_rows)['median']}**.",
        f"- Post-launch flow median: **{timing_metrics(flow_rows)['median']}**.",
        f"- Share first seen on/after March 1: **{timing_metrics(archive_rows)['share_on_or_after_2026-03-01']:.1%}** raw; **{timing_metrics(dedup_rows)['share_on_or_after_2026-03-01']:.1%}** exact-URL deduped.",
        f"- Peak post-launch week: **{peak_week.isoformat()}**, {peak_week_n:,} records.",
        "",
        "## Category counts",
        "",
    ]
    report.extend(f"- {category}: {category_counts[category]:,}" for category in CATEGORY_ORDER)
    report.extend([
        "",
        "## Measurement warning",
        "",
        "`date_posted` is the repository's first-observed/addition timestamp, not a guaranteed employer publication timestamp. The December 1 launch-day stock is left-censored. `date_updated` is not used as a closure date.",
    ])
    (OUT_DIR / "summer_2026_archive_diagnostics.md").write_text("\n".join(report) + "\n", encoding="utf-8")

    bundle_paths = [p for p in OUT_DIR.iterdir() if p.is_file() and p.name != "summer_2026_research_bundle.zip"]
    with zipfile.ZipFile(OUT_DIR / "summer_2026_research_bundle.zip", "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(bundle_paths):
            zf.write(path, arcname=path.name)

    print(json.dumps(summary, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
