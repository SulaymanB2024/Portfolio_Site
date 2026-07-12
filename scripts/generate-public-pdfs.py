#!/usr/bin/env python3
"""Generate machine-readable public PDF artifacts for the portfolio site."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
RESUME_PATH = ROOT / "public" / "Sulayman_Bowles_Resume.pdf"
APPIAN_PATH = ROOT / "public" / "research" / "appian-enterprise-software-durability-memo.pdf"

INK = colors.HexColor("#080807")
CANVAS = colors.HexColor("#F1EFE8")
SAGE = colors.HexColor("#708266")
MUTED = colors.HexColor("#5D5D58")
RULE = colors.HexColor("#C9C6BB")


def register_fonts() -> tuple[str, str, str]:
    regular = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
    bold = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")
    italic = Path("/System/Library/Fonts/Supplemental/Arial Italic.ttf")
    if all(path.exists() for path in (regular, bold, italic)):
        pdfmetrics.registerFont(TTFont("PortfolioSans", str(regular)))
        pdfmetrics.registerFont(TTFont("PortfolioSans-Bold", str(bold)))
        pdfmetrics.registerFont(TTFont("PortfolioSans-Italic", str(italic)))
        return "PortfolioSans", "PortfolioSans-Bold", "PortfolioSans-Italic"
    return "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"


SANS, SANS_BOLD, SANS_ITALIC = register_fonts()


def set_metadata(canvas, title: str, subject: str) -> None:
    canvas.setTitle(title)
    canvas.setAuthor("Sulayman Bowles")
    canvas.setSubject(subject)
    canvas.setCreator("Portfolio_Site reproducible PDF generator")


def section_rule(title: str, style: ParagraphStyle, width: float) -> Table:
    item = Table([[Paragraph(title.upper(), style)]], colWidths=[width])
    item.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, -1), 0.65, INK),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return item


def build_resume() -> None:
    page_width, _ = letter
    left = right = 0.47 * inch
    width = page_width - left - right
    doc = SimpleDocTemplate(
        str(RESUME_PATH),
        pagesize=letter,
        leftMargin=left,
        rightMargin=right,
        topMargin=0.38 * inch,
        bottomMargin=0.32 * inch,
        title="Sulayman Bowles - Full Resume",
        author="Sulayman Bowles",
        subject="Full public resume updated July 12, 2026",
    )
    style = {
        "name": ParagraphStyle("ResumeName", fontName=SANS_BOLD, fontSize=22, leading=23, textColor=INK, spaceAfter=3),
        "contact": ParagraphStyle("ResumeContact", fontName=SANS, fontSize=8.2, leading=10, textColor=MUTED, spaceAfter=7),
        "section": ParagraphStyle("ResumeSection", fontName=SANS_BOLD, fontSize=10, leading=11, textColor=INK),
        "role": ParagraphStyle("ResumeRole", fontName=SANS_BOLD, fontSize=9, leading=10.4, textColor=INK),
        "date": ParagraphStyle("ResumeDate", fontName=SANS_BOLD, fontSize=8.6, leading=10.4, textColor=INK, alignment=2),
        "subtitle": ParagraphStyle("ResumeSubtitle", fontName=SANS_ITALIC, fontSize=8.4, leading=9.8, textColor=MUTED),
        "body": ParagraphStyle("ResumeBody", fontName=SANS, fontSize=8.15, leading=9.9, textColor=INK, leftIndent=8, firstLineIndent=-6),
        "small": ParagraphStyle("ResumeSmall", fontName=SANS, fontSize=7.8, leading=9.3, textColor=INK),
    }
    story = [
        Paragraph("SULAYMAN BOWLES", style["name"]),
        Paragraph(
            "Austin, TX | sulayman.bowles@gmail.com | linkedin.com/in/sulayman-bowles | github.com/SulaymanB2024 | sulayman-bowles.dev<br/>"
            "Full public resume - updated July 12, 2026",
            style["contact"],
        ),
        section_rule("Education", style["section"], width),
    ]
    education = Table(
        [
            [Paragraph("The University of Texas at Austin, McCombs School of Business - Austin, TX", style["role"]), Paragraph("Expected May 2028", style["date"])],
            [Paragraph("BBA Candidate, Finance and Management Information Systems", style["subtitle"]), ""],
            [Paragraph("Coursework: Financial Valuation, Quantitative Investment, Database Management (SQL), Predictive Analytics", style["small"]), ""],
        ],
        colWidths=[width * 0.78, width * 0.22],
    )
    education.setStyle(
        TableStyle(
            [
                ("SPAN", (0, 2), (-1, 2)),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.extend([education, Spacer(1, 4), section_rule("Experience", style["section"], width)])
    experiences = [
        ("Chegg, Inc. - Austin, TX", "May 2026 - Aug 2026", "AI Product Manager Intern, Office of the Chief Product Officer", [
            "Support AI product strategy, discovery, competitive research, workflow mapping, and prototype review for student-facing tools.",
            "Develop product briefs and evaluation criteria that connect user problems, product evidence, and implementation decisions.",
        ]),
        ("Confidential B2B Semiconductor Manufacturer - Remote", "May 2026 - Present", "SEO and Digital Marketing Analytics Intern", [
            "Built GA4 and Search Console baselines for launch traffic, query performance, engagement, and user-flow diagnostics.",
            "Translate search and website evidence into recurring reports and prioritized digital-marketing recommendations.",
        ]),
        ("VOID Agency - Austin, TX", "Dec 2025 - Present", "Founder", [
            "Founded a technical SEO and web-systems practice with $50K+ in collected client revenue as of May 2026.",
            "Built Atlas, a Python/SQLite crawl and evidence system for links, canonicals, indexability, rendered pages, and structured reports.",
            "Turn crawl, metadata, schema, performance, and analytics evidence into reviewed implementation roadmaps.",
        ]),
        ("Jon Brumley Texas Venture Labs - Austin, TX", "Sep 2025 - Present", "Student Associate", [
            "Build pricing, market-sizing, unit-economics, and financial models for early-stage companies.",
            "Support customer discovery, competitive positioning, go-to-market work, and investor-style recommendations.",
        ]),
        ("Confidential AI Data Labeling Platform - Remote", "Nov 2025 - Jan 2026", "Part-Time Data Labeling and Annotation Reviewer", [
            "Reviewed labeled datasets and AI-generated outputs for accuracy, consistency, ambiguity, and edge cases.",
        ]),
        ("AI Visual Infrastructure Venture - Remote", "Jan 2025 - Sep 2025", "Co-Founder", [
            "Co-founded an AI visual-services venture that generated $100K in collected revenue from image-generation and transformation services.",
            "Evaluated model-quality tradeoffs, creator workflows, pricing, and visual-asset positioning.",
        ]),
    ]
    for organization, dates, title, bullets in experiences:
        heading = Table([[Paragraph(organization, style["role"]), Paragraph(dates, style["date"])]], colWidths=[width * 0.78, width * 0.22])
        heading.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 1.3), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
        block = [heading, Paragraph(title, style["subtitle"])]
        block.extend(Paragraph(f"- {bullet}", style["body"]) for bullet in bullets)
        story.append(KeepTogether(block))
    story.extend([Spacer(1, 3), section_rule("Selected Awards and Leadership", style["section"], width)])
    for award in (
        "OnionDAO Hackathon - 1st Place, Team Lead (Jun 2025): led a three-person team building a Solana payroll prototype.",
        "No Limit Holdings x Artemis Researchathon - Crypto Investment Research Prize Winner (Mar 2026).",
        "Student Government - University-Wide Representative (Sep 2024 - Present).",
        "Texas Blockchain - Investment Team Analyst (Sep 2025 - Present).",
    ):
        story.append(Paragraph(f"- {award}", style["body"]))
    story.extend([Spacer(1, 3), section_rule("Additional", style["section"], width)])
    story.append(Paragraph("Technical: Python, SQL, JavaScript/TypeScript, React/Vite, SQLite, GA4, Search Console, crawl analysis, structured reporting. Research: financial modeling, market sizing, valuation logic, competitive analysis. Languages: Spanish (intermediate).", style["small"]))

    def on_page(canvas, _doc):
        set_metadata(canvas, "Sulayman Bowles - Full Resume", "Full public resume updated July 12, 2026")

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)


def appian_page(canvas, doc) -> None:
    set_metadata(canvas, "Appian Operating Durability Diligence Framework", "Source-backed educational research using FY2025 and Q1 2026 public filings")
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, 0.42 * inch, letter[0] - doc.rightMargin, 0.42 * inch)
    canvas.setFont(SANS, 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 0.26 * inch, "APPN DILIGENCE FRAMEWORK | DATA THROUGH MAY 7, 2026")
    canvas.drawRightString(letter[0] - doc.rightMargin, 0.26 * inch, str(doc.page))
    canvas.restoreState()


def build_appian() -> None:
    doc = SimpleDocTemplate(str(APPIAN_PATH), pagesize=letter, leftMargin=0.62 * inch, rightMargin=0.62 * inch, topMargin=0.55 * inch, bottomMargin=0.58 * inch, title="Appian Operating Durability Diligence Framework", author="Sulayman Bowles")
    width = letter[0] - doc.leftMargin - doc.rightMargin
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("Kicker", fontName=SANS_BOLD, fontSize=7.5, leading=9, textColor=SAGE, spaceAfter=10))
    styles.add(ParagraphStyle("TitleLarge", fontName=SANS_BOLD, fontSize=27, leading=29, textColor=INK, spaceAfter=8))
    styles.add(ParagraphStyle("Deck", fontName=SANS, fontSize=10.5, leading=15, textColor=MUTED, spaceAfter=12))
    styles.add(ParagraphStyle("H1Appian", fontName=SANS_BOLD, fontSize=16, leading=19, textColor=INK, spaceBefore=4, spaceAfter=8))
    styles.add(ParagraphStyle("H2Appian", fontName=SANS_BOLD, fontSize=10, leading=12, textColor=SAGE, spaceBefore=6, spaceAfter=5))
    styles.add(ParagraphStyle("BodyAppian", fontName=SANS, fontSize=9, leading=13.5, textColor=INK, spaceAfter=7))
    styles.add(ParagraphStyle("CellHead", fontName=SANS_BOLD, fontSize=7.5, leading=9, textColor=CANVAS))
    styles.add(ParagraphStyle("Cell", fontName=SANS, fontSize=7.6, leading=10.2, textColor=INK))
    styles.add(ParagraphStyle("CellStrong", fontName=SANS_BOLD, fontSize=8.2, leading=10.5, textColor=INK))

    def make_table(rows, widths, header=True):
        item = Table(rows, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
        commands = [("GRID", (0, 0), (-1, -1), 0.4, RULE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]
        if header:
            commands.extend([("BACKGROUND", (0, 0), (-1, 0), INK), ("TEXTCOLOR", (0, 0), (-1, 0), CANVAS)])
        item.setStyle(TableStyle(commands))
        return item

    story = [
        Paragraph("SULAYMAN BOWLES / MARKETS RESEARCH / SOURCE-BACKED FRAMEWORK", styles["Kicker"]),
        Paragraph("Appian Operating Durability Diligence Framework", styles["TitleLarge"]),
        Paragraph("A compact test of recurring-revenue quality, margin durability, and execution risk using Appian's FY2025 Form 10-K and Q1 2026 results. Educational research sample; no price target or recommendation.", styles["Deck"]),
        make_table([
            [Paragraph("DATA CUTOFF", styles["CellHead"]), Paragraph("QUESTION", styles["CellHead"]), Paragraph("BOUNDARY", styles["CellHead"])],
            [Paragraph("May 7, 2026", styles["CellStrong"]), Paragraph("Are process deployments durable enough to support continued subscription growth without hiding margin or concentration risk?", styles["Cell"]), Paragraph("No live valuation, target price, or trade recommendation.", styles["Cell"])],
        ], [width * 0.18, width * 0.52, width * 0.30]),
        Spacer(1, 14), Paragraph("What the public record says", styles["H1Appian"]),
        make_table([
            [Paragraph("Metric", styles["CellHead"]), Paragraph("Reported result", styles["CellHead"]), Paragraph("Diligence meaning", styles["CellHead"])],
            [Paragraph("FY2025 total revenue", styles["CellStrong"]), Paragraph("$726.9M, up from $617.0M in 2024", styles["Cell"]), Paragraph("Growth accelerated, but the mix matters more than the headline.", styles["Cell"])],
            [Paragraph("FY2025 subscriptions", styles["CellStrong"]), Paragraph("$576.5M; cloud subscriptions $437.4M", styles["Cell"]), Paragraph("Subscriptions were about 79% of revenue; cloud remained the main growth engine.", styles["Cell"])],
            [Paragraph("FY2025 subscription gross margin", styles["CellStrong"]), Paragraph("85.4%, down from 86.6%", styles["Cell"]), Paragraph("High margin supports quality, while the decline keeps hosting economics in scope.", styles["Cell"])],
            [Paragraph("Q1 2026 cloud subscriptions", styles["CellStrong"]), Paragraph("$124.5M, +25% year over year", styles["Cell"]), Paragraph("A strong quarter; durability still requires renewal and cohort evidence beyond one period.", styles["Cell"])],
            [Paragraph("Q1 2026 cloud net ARR expansion", styles["CellStrong"]), Paragraph("115%", styles["Cell"]), Paragraph("Existing cloud customers expanded in aggregate; this is not disclosed gross retention.", styles["Cell"])],
            [Paragraph("Q1 2026 operating cash flow", styles["CellStrong"]), Paragraph("$48.8M", styles["Cell"]), Paragraph("Cash generation improved the growth story; seasonality and working capital still need review.", styles["Cell"])],
        ], [width * 0.25, width * 0.25, width * 0.50]),
        Spacer(1, 12), Paragraph("Working thesis", styles["H2Appian"]),
        Paragraph("Appian's subscription mix, cloud growth, and 115% cloud net ARR expansion support a durability hypothesis. The evidence does not establish customer-level retention, pricing power, or a valuation conclusion. Confidence remains conditional on subscription growth staying efficient while hosting costs, services mix, and public-sector concentration remain controlled.", styles["BodyAppian"]),
        PageBreak(), Paragraph("Evidence, interpretation, and counter-signals", styles["H1Appian"]),
        make_table([
            [Paragraph("Observed evidence", styles["CellHead"]), Paragraph("Supports", styles["CellHead"]), Paragraph("Counter-signal to monitor", styles["CellHead"])],
            [Paragraph("Subscriptions were about 79% of FY2025 revenue.", styles["Cell"]), Paragraph("A recurring-revenue-led model.", styles["Cell"]), Paragraph("Services grew 31% in Q1 2026; test whether services accelerates adoption or adds delivery burden.", styles["Cell"])],
            [Paragraph("Cloud subscriptions grew 25% in Q1 2026.", styles["Cell"]), Paragraph("Continued hosted recurring growth.", styles["Cell"]), Paragraph("Full-year cloud guidance implied 18%-19% growth; do not annualize one quarter.", styles["Cell"])],
            [Paragraph("Subscription gross margin was 85.4% in FY2025.", styles["Cell"]), Paragraph("Strong subscription economics.", styles["Cell"]), Paragraph("Margin fell 120 basis points; the 10-K cites $13.0M more hosting cost.", styles["Cell"])],
            [Paragraph("Federal agencies were 25.3% of FY2025 revenue.", styles["Cell"]), Paragraph("Mission-critical public workflows can be durable.", styles["Cell"]), Paragraph("Budget cycles, procurement timing, and policy shifts create concentration risk.", styles["Cell"])],
            [Paragraph("No single end customer exceeded 10% of 2025 revenue.", styles["Cell"]), Paragraph("Limited single-customer concentration.", styles["Cell"]), Paragraph("Segment concentration can still matter without one customer crossing 10%.", styles["Cell"])],
            [Paragraph("FY2026 guidance: $819M-$831M revenue and $97M-$105M adjusted EBITDA.", styles["Cell"]), Paragraph("Management expected growth and adjusted profitability.", styles["Cell"]), Paragraph("Guidance is not audited outcome; reconcile GAAP income and cash flow each quarter.", styles["Cell"])],
        ], [width * 0.34, width * 0.28, width * 0.38]),
        Spacer(1, 14), Paragraph("What is still missing", styles["H1Appian"]),
        Paragraph("Public releases do not provide a complete customer cohort table, gross retention, remaining-performance-obligation conversion by cohort, or product-level contribution margins. Those gaps are diligence requirements, not evidence for or against the thesis.", styles["BodyAppian"]),
        PageBreak(), Paragraph("Diligence plan and falsifiers", styles["H1Appian"]),
        make_table([
            [Paragraph("Question", styles["CellHead"]), Paragraph("Evidence to collect", styles["CellHead"]), Paragraph("Thesis weakens if", styles["CellHead"])],
            [Paragraph("Are deployments mission critical?", styles["CellStrong"]), Paragraph("Renewal commentary, deployment depth, regulated-workflow examples, customer references, and replacement friction.", styles["Cell"]), Paragraph("Customers can pause or replace deployments without material disruption.", styles["Cell"])],
            [Paragraph("Is expansion durable?", styles["CellStrong"]), Paragraph("Cloud net ARR expansion trend, new versus existing contribution, seat/application growth, and pricing changes.", styles["Cell"]), Paragraph("Expansion falls below 100%, growth relies mainly on new logos, or discounting rises.", styles["Cell"])],
            [Paragraph("Does cloud scale improve economics?", styles["CellStrong"]), Paragraph("Subscription margin, hosting cost per cloud dollar, support headcount, and partner delivery mix.", styles["Cell"]), Paragraph("Hosting and support costs outgrow cloud revenue for multiple periods.", styles["Cell"])],
            [Paragraph("Is services growth productive?", styles["CellStrong"]), Paragraph("Services margin, implementation duration, partner share, backlog, and time-to-production.", styles["Cell"]), Paragraph("Services becomes a persistent low-margin prerequisite rather than an adoption accelerator.", styles["Cell"])],
            [Paragraph("Is public-sector exposure resilient?", styles["CellStrong"]), Paragraph("Federal bookings, renewals, contract duration, agency concentration, procurement timing, and appropriations sensitivity.", styles["Cell"]), Paragraph("Budget or procurement changes produce sustained renewal or expansion pressure.", styles["Cell"])],
        ], [width * 0.25, width * 0.42, width * 0.33]),
        Spacer(1, 14), Paragraph("Decision rule", styles["H2Appian"]),
        Paragraph("The durability thesis earns more confidence only if cloud growth remains paired with stable subscription margins, expansion stays above 100%, and services/public-sector exposure can be explained without treating every recurring dollar as equally durable. Valuation requires a separate current-market-data step.", styles["BodyAppian"]),
        Spacer(1, 16), Paragraph("Source ledger and claim boundary", styles["H1Appian"]),
        Paragraph('1. Appian FY2025 Form 10-K, filed February 19, 2026. Revenue mix, gross margins, hosting costs, customer and federal concentration, and risk disclosures.<br/><link href="https://www.sec.gov/Archives/edgar/data/1441683/000144168326000013/appn-20251231.htm" color="#708266">SEC filing: appn-20251231.htm</link>', styles["BodyAppian"]),
        Paragraph('2. Appian Q1 2026 financial results, published May 7, 2026. Cloud subscriptions, total subscriptions, growth, cloud net ARR expansion, operating cash flow, and FY2026 guidance.<br/><link href="https://investors.appian.com/news-releases/news-release-details/appian-announces-first-quarter-2026-financial-results" color="#708266">Appian Q1 2026 financial results</link>', styles["BodyAppian"]),
        Paragraph('3. Appian FY2025 financial results, published February 19, 2026. GAAP operating result and management presentation.<br/><link href="https://investors.appian.com/news-releases/news-release-details/appian-announces-fourth-quarter-and-full-year-2025-financial" color="#708266">Appian FY2025 financial results</link>', styles["BodyAppian"]),
        Spacer(1, 12), Paragraph("Calculated figures", styles["H2Appian"]),
        Paragraph("Subscription share of FY2025 revenue (about 79%) is calculated from $576.5M subscriptions revenue divided by $726.9M total revenue. Other figures follow the cited filings and releases. Rounded figures may not sum exactly.", styles["BodyAppian"]),
        Paragraph("Boundary", styles["H2Appian"]),
        Paragraph("This artifact demonstrates a source-backed diligence method. It is educational research, not investment, legal, accounting, or tax advice; it is not a price target, appraisal, recommendation, or statement of expected return. Refresh filings and market data before relying on any thesis.", styles["BodyAppian"]),
    ]
    doc.build(story, onFirstPage=appian_page, onLaterPages=appian_page)


def main() -> None:
    RESUME_PATH.parent.mkdir(parents=True, exist_ok=True)
    APPIAN_PATH.parent.mkdir(parents=True, exist_ok=True)
    build_resume()
    build_appian()
    print(f"wrote {RESUME_PATH}")
    print(f"wrote {APPIAN_PATH}")


if __name__ == "__main__":
    main()
