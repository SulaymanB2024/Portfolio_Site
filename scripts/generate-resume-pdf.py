#!/usr/bin/env python3
"""Generate the public, site-native resume PDF from the current public facts."""

from __future__ import annotations

import argparse
import re
import shutil
from pathlib import Path

import pdfplumber
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PROFILE_FACTS = ROOT / "src/content/profileFacts.ts"
OUTPUT_COPY = ROOT / "output/pdf/Sulayman_Bowles_Resume.pdf"
PUBLIC_COPY = ROOT / "public/Sulayman_Bowles_Resume.pdf"

INK = HexColor("#080807")
CANVAS = HexColor("#F4F4F0")
MUTED = HexColor("#5F5F5A")
RULE = HexColor("#C8C8C0")
ACCENT = HexColor("#B7C8A8")

GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIA_ITALIC = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"


EXPERIENCE = [
    {
        "dates": "DEC 2025 - PRESENT",
        "role": "FOUNDER",
        "org": "Void Agency",
        "summary": (
            "Builds fixed-scope technical SEO audits, website systems, local-search reviews, "
            "and crawl-access checks with explicit evidence and handoff boundaries."
        ),
        "note": "$50K+ collected revenue as of May 31, 2026.",
    },
    {
        "dates": "MAY 2026 - AUG 2026",
        "role": "AI PRODUCT MANAGER INTERN",
        "org": "Chegg, Office of the Chief Product Officer",
        "summary": (
            "Supports AI product research, competitive analysis, workflow mapping, and "
            "prototype review for student-facing product work."
        ),
    },
    {
        "dates": "MAY 2026 - PRESENT",
        "role": "TECHNICAL SEO ANALYTICS",
        "org": "Private engagement",
        "summary": (
            "Supports GA4 and Search Console reporting, launch baselines, traffic analysis, "
            "keyword tracking, and prioritized site recommendations."
        ),
    },
    {
        "dates": "SEP 2025 - PRESENT",
        "role": "STUDENT ASSOCIATE",
        "org": "Jon Brumley Texas Venture Labs",
        "summary": (
            "Advises early-stage teams on customer discovery, market validation, competitive "
            "positioning, unit economics, go-to-market work, and financial models."
        ),
    },
]

CAPABILITIES = [
    ("TECHNICAL SEO", "Crawlability, indexation, canonicals, redirects, robots.txt, sitemaps, internal links, structured data, and rerun checks."),
    ("ANALYTICS + RESEARCH", "GA4, Search Console, public-source research, assumption tables, market structure, valuation frames, and claim boundaries."),
    ("PRODUCT + SOFTWARE", "React, TypeScript, Vite, Python, SQLite, workflow mapping, prototypes, and structured exports."),
    ("OPERATING PRACTICE", "Scoping, evidence review, issue prioritization, implementation handoff, client-safe reporting, and acceptance criteria."),
]


def ensure_current_contract() -> None:
    source = PROFILE_FACTS.read_text(encoding="utf-8")
    required = {
        "graduation": "graduation: 'May 2027'",
        "Void Agency role date": "dates: 'Dec 2025",
        "review date": "lastReviewed: '2026-07-12'",
        "role review date": "nextRoleReview: '2026-08-31'",
    }
    missing = [label for label, token in required.items() if token not in source]
    if missing:
        raise RuntimeError(
            "Resume PDF contract is stale; update the generator before publishing: "
            + ", ".join(missing)
        )


def register_fonts() -> None:
    for name, path in (
        ("GeorgiaSite", GEORGIA),
        ("GeorgiaSiteItalic", GEORGIA_ITALIC),
        ("GeorgiaSiteBold", GEORGIA_BOLD),
    ):
        if not Path(path).exists():
            raise FileNotFoundError(f"Required site font is missing: {path}")
        pdfmetrics.registerFont(TTFont(name, path))


def tracked_text(
    page: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    *,
    font: str = "Helvetica",
    size: float = 6.5,
    spacing: float = 1.1,
    color=INK,
) -> None:
    line = page.beginText(x, y)
    line.setFont(font, size)
    line.setFillColor(color)
    line.setCharSpace(spacing)
    line.textLine(text)
    page.drawText(line)


def plain_text(
    page: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    *,
    font: str,
    size: float,
    color=INK,
) -> None:
    line = page.beginText(x, y)
    line.setFont(font, size)
    line.setFillColor(color)
    line.setCharSpace(0)
    line.textLine(text)
    page.drawText(line)


def wrap_lines(text: str, font: str, size: float, max_width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if not current or pdfmetrics.stringWidth(candidate, font, size) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def wrapped_text(
    page: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    *,
    font: str,
    size: float,
    width: float,
    leading: float,
    color=INK,
) -> float:
    lines = wrap_lines(text, font, size, width)
    block = page.beginText(x, y)
    block.setFont(font, size)
    block.setFillColor(color)
    block.setLeading(leading)
    block.setCharSpace(0)
    for line in lines:
        block.textLine(line)
    page.drawText(block)
    return y - (len(lines) * leading)


def draw_corner(page: canvas.Canvas, x: float, y: float, x_dir: int, y_dir: int) -> None:
    page.setStrokeColor(RULE)
    page.setLineWidth(0.6)
    page.line(x, y, x + (14 * x_dir), y)
    page.line(x, y, x, y + (14 * y_dir))


def section_label(page: canvas.Canvas, number: str, label: str, x: float, y: float) -> None:
    tracked_text(page, number, x, y, size=6.2, spacing=1.2, color=MUTED)
    tracked_text(page, label, x + 27, y, size=6.4, spacing=1.35, color=INK)


def draw_url(page: canvas.Canvas, label: str, url: str, x: float, y: float, width: float) -> None:
    plain_text(page, label, x, y, font="Helvetica", size=7.2, color=INK)
    page.linkURL(url, (x, y - 2, x + width, y + 8), relative=0, thickness=0)


def draw_job(page: canvas.Canvas, x: float, y: float, width: float, index: int, job: dict[str, str]) -> float:
    page.setStrokeColor(RULE)
    page.setLineWidth(0.55)
    page.line(x, y, x + width, y)

    tracked_text(page, f"{index:02d}", x, y - 17, size=6.2, spacing=1.15, color=MUTED)
    tracked_text(page, job["dates"], x + 42, y - 17, size=6.2, spacing=1.05, color=MUTED)

    tracked_text(page, job["role"], x + 42, y - 39, size=7.4, spacing=1.0, color=INK)
    plain_text(page, job["org"], x + 42, y - 55, font="GeorgiaSiteItalic", size=10.4, color=INK)

    summary_y = wrapped_text(
        page,
        job["summary"],
        x + 42,
        y - 73,
        font="Helvetica",
        size=7.65,
        width=width - 50,
        leading=10.4,
        color=MUTED,
    )

    if note := job.get("note"):
        note_y = summary_y - 2
        page.setStrokeColor(ACCENT)
        page.setLineWidth(2.0)
        page.line(x + 42, note_y - 1, x + 42, note_y - 15)
        tracked_text(page, "DATED ANNOTATION", x + 50, note_y - 11, size=5.7, spacing=0.9, color=MUTED)
        plain_text(page, note, x + 136, note_y - 11, font="Helvetica", size=6.9, color=INK)
        return note_y - 30

    return summary_y - 14


def build_resume(output_path: Path) -> None:
    ensure_current_contract()
    register_fonts()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    page = canvas.Canvas(str(output_path), pagesize=letter, pageCompression=1)
    page.setTitle("Sulayman Bowles Public Resume")
    page.setAuthor("Sulayman Bowles")
    page.setSubject("Technical SEO, search systems, product, and finance research")
    page.setCreator("sulayman-bowles.dev resume generator")

    width, height = letter
    page.setFillColor(CANVAS)
    page.rect(0, 0, width, height, fill=1, stroke=0)

    margin = 36
    right = width - margin
    draw_corner(page, margin, height - margin, 1, -1)
    draw_corner(page, right, height - margin, -1, -1)
    draw_corner(page, margin, margin, 1, 1)
    draw_corner(page, right, margin, -1, 1)

    tracked_text(
        page,
        "PUBLIC RESUME / REVIEWED JUL 12, 2026 / ROLE-TENSE REVIEW AUG 31, 2026",
        margin,
        height - 42,
        size=6.15,
        spacing=1.0,
        color=MUTED,
    )

    plain_text(page, "Sulayman Bowles", margin, height - 92, font="GeorgiaSiteItalic", size=32, color=INK)

    wrapped_text(
        page,
        "Technical SEO, search systems, product, and finance research.",
        margin,
        height - 111,
        font="GeorgiaSiteItalic",
        size=13.5,
        width=330,
        leading=14.4,
        color=MUTED,
    )

    wrapped_text(
        page,
        "Builds inspectable systems that keep raw observations separate from analysis, recommendations, and measurement gaps.",
        margin,
        height - 149,
        font="Helvetica",
        size=7.8,
        width=330,
        leading=10.4,
        color=MUTED,
    )

    contact_x = 414
    page.setStrokeColor(RULE)
    page.setLineWidth(0.55)
    page.line(397, height - 69, 397, height - 159)
    tracked_text(page, "CONTACT + PROFILES", contact_x, height - 77, size=5.9, spacing=1.15, color=MUTED)
    draw_url(page, "sulayman.bowles@gmail.com", "mailto:sulayman.bowles@gmail.com", contact_x, height - 97, 130)
    draw_url(page, "sulayman-bowles.dev/resume", "https://sulayman-bowles.dev/resume", contact_x, height - 112, 128)
    draw_url(page, "linkedin.com/in/sulayman-bowles", "https://www.linkedin.com/in/sulayman-bowles/", contact_x, height - 127, 145)
    draw_url(page, "github.com/SulaymanB2024", "https://github.com/SulaymanB2024", contact_x, height - 142, 128)

    content_top = height - 182
    page.setStrokeColor(RULE)
    page.setLineWidth(0.7)
    page.line(margin, content_top, right, content_top)

    left_x = margin
    left_width = 160
    divider_x = 211
    main_x = 229
    main_width = right - main_x
    page.line(divider_x, content_top - 14, divider_x, 64)

    # Sidebar: education
    sidebar_y = content_top - 28
    section_label(page, "01", "EDUCATION", left_x, sidebar_y)
    plain_text(page, "McCombs School of Business", left_x, sidebar_y - 25, font="GeorgiaSiteItalic", size=12.2, color=INK)
    sidebar_y = wrapped_text(
        page,
        "Bachelor of Business Administration in Finance",
        left_x,
        sidebar_y - 43,
        font="Helvetica",
        size=7.5,
        width=left_width,
        leading=10.3,
        color=MUTED,
    )
    sidebar_y = wrapped_text(
        page,
        "The University of Texas at Austin / Expected May 2027",
        left_x,
        sidebar_y - 5,
        font="Helvetica",
        size=7.5,
        width=left_width,
        leading=10.3,
        color=MUTED,
    )
    sidebar_y = wrapped_text(
        page,
        "Coursework: valuation, quantitative investment, database management, and predictive analytics. Activities: Texas Venture Labs.",
        left_x,
        sidebar_y - 11,
        font="Helvetica",
        size=7.15,
        width=left_width,
        leading=9.9,
        color=MUTED,
    )

    # Sidebar: capabilities
    sidebar_y -= 18
    section_label(page, "02", "CAPABILITIES", left_x, sidebar_y)
    sidebar_y -= 24
    for label, copy in CAPABILITIES:
        tracked_text(page, label, left_x, sidebar_y, size=6.05, spacing=0.85, color=INK)
        sidebar_y = wrapped_text(
            page,
            copy,
            left_x,
            sidebar_y - 14,
            font="Helvetica",
            size=6.9,
            width=left_width,
            leading=9.5,
            color=MUTED,
        )
        sidebar_y -= 12

    # Sidebar: public evidence and direct links
    section_label(page, "03", "PUBLIC EVIDENCE", left_x, sidebar_y,)
    sidebar_y -= 23
    plain_text(page, "Atlas", left_x, sidebar_y, font="GeorgiaSiteItalic", size=10.6, color=INK)
    sidebar_y = wrapped_text(
        page,
        "Crawl and evidence console with a public sanitized run.",
        left_x,
        sidebar_y - 14,
        font="Helvetica",
        size=6.9,
        width=left_width,
        leading=9.5,
        color=MUTED,
    )
    draw_url(page, "Open public crawl", "https://sulayman-bowles.dev/atlas/sample-crawl", left_x, sidebar_y - 2, 78)
    sidebar_y -= 24
    plain_text(page, "Public research", left_x, sidebar_y, font="GeorgiaSiteItalic", size=10.6, color=INK)
    sidebar_y = wrapped_text(
        page,
        "Texas toll-road ownership, operators, and economics.",
        left_x,
        sidebar_y - 14,
        font="Helvetica",
        size=6.9,
        width=left_width,
        leading=9.5,
        color=MUTED,
    )
    draw_url(page, "Open research", "https://sulayman-bowles.dev/markets/who-owns-texas-toll-roads", left_x, sidebar_y - 2, 65)

    # Main column: experience
    main_y = content_top - 28
    section_label(page, "01", "EXPERIENCE", main_x, main_y)
    main_y -= 16
    for index, job in enumerate(EXPERIENCE, start=1):
        main_y = draw_job(page, main_x, main_y, main_width, index, job)

    page.setStrokeColor(RULE)
    page.setLineWidth(0.55)
    page.line(main_x, main_y, right, main_y)
    section_label(page, "02", "WORKING PRACTICE", main_x, main_y - 21)
    wrapped_text(
        page,
        "Collect the source material. Preserve what happened. Separate observations from interpretation. Ship a decision-ready handoff with explicit gaps and acceptance criteria.",
        main_x + 42,
        main_y - 35,
        font="GeorgiaSiteItalic",
        size=9.0,
        width=main_width - 50,
        leading=11.8,
        color=INK,
    )

    page.setStrokeColor(RULE)
    page.setLineWidth(0.55)
    page.line(margin, 55, right, 55)
    tracked_text(page, "SULAYMAN BOWLES", margin, 41, size=5.8, spacing=1.15, color=INK)
    tracked_text(page, "PUBLIC RESUME / JUL 2026", 247, 41, size=5.7, spacing=1.1, color=MUTED)
    tracked_text(page, "SULAYMAN-BOWLES.DEV", 458, 41, size=5.7, spacing=1.05, color=INK)

    page.save()


def validate_resume(output_path: Path) -> None:
    with pdfplumber.open(output_path) as pdf:
        if len(pdf.pages) != 1:
            raise RuntimeError(f"Expected one resume page, found {len(pdf.pages)}")
        page = pdf.pages[0]
        text = page.extract_text() or ""
        collapsed = re.sub(r"\s+", "", text).upper()
        required = [
            "MAY2027",
            "DEC2025-PRESENT",
            "AIPRODUCTMANAGERINTERN",
            "PUBLICSANITIZED",
            "OPENPUBLICCRAWL",
            "ROLE-TENSEREVIEWAUG31,2026",
            "$50K+COLLECTEDREVENUEASOFMAY31,2026.",
        ]
        forbidden = [
            "MAY2028",
            "INCOMINGAIPRODUCTMANAGERINTERN",
            "JAN2026-PRESENT",
        ]
        for token in required:
            if token not in collapsed:
                raise RuntimeError(f"Generated resume is missing required text: {token}")
        for token in forbidden:
            if token in collapsed:
                raise RuntimeError(f"Generated resume contains stale text: {token}")

        outside = [
            word
            for word in page.extract_words()
            if word["x0"] < 0
            or word["x1"] > page.width
            or word["top"] < 0
            or word["bottom"] > page.height
        ]
        if outside:
            raise RuntimeError(f"Generated resume contains text outside the page: {outside[:3]}")

    reader = PdfReader(output_path)
    annotations = reader.pages[0].get("/Annots") or []
    links = [
        annotation
        for annotation in annotations
        if annotation.get_object().get("/Subtype") == "/Link"
    ]
    if len(links) < 6:
        raise RuntimeError(f"Expected at least six live PDF links, found {len(links)}")

    metadata = reader.metadata
    if metadata.title != "Sulayman Bowles Public Resume":
        raise RuntimeError("Generated resume title metadata is missing")
    if metadata.author != "Sulayman Bowles":
        raise RuntimeError("Generated resume author metadata is missing")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=OUTPUT_COPY)
    parser.add_argument("--no-public-copy", action="store_true")
    args = parser.parse_args()

    output = args.output.resolve()
    build_resume(output)
    validate_resume(output)
    if not args.no_public_copy:
        PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(output, PUBLIC_COPY)

    print(f"Generated and validated {output}")
    if not args.no_public_copy:
        print(f"Updated {PUBLIC_COPY}")


if __name__ == "__main__":
    main()
