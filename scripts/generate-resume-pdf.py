#!/usr/bin/env python3
"""Deterministic public-profile PDF. Optional authoring dependency: reportlab==4.4.9."""
import json
import sys
from html import escape
from pathlib import Path
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether

if len(sys.argv) != 3:
    raise SystemExit('Usage: generate-resume-pdf.py PROFILE_JSON OUTPUT_PDF')
facts = json.loads(Path(sys.argv[1]).read_text())
styles = {
    'name': ParagraphStyle('name', fontName='Times-Bold', fontSize=18, leading=20, spaceAfter=3),
    'contact': ParagraphStyle('contact', fontName='Times-Roman', fontSize=8, leading=10),
    'section': ParagraphStyle('section', fontName='Times-Bold', fontSize=10, leading=12, spaceBefore=7, spaceAfter=4),
    'org': ParagraphStyle('org', fontName='Times-Bold', fontSize=9, leading=10.7),
    'date': ParagraphStyle('date', fontName='Times-Bold', fontSize=9, leading=10.7, alignment=TA_RIGHT),
    'role': ParagraphStyle('role', fontName='Times-Italic', fontSize=9, leading=10.7),
    'body': ParagraphStyle('body', fontName='Times-Roman', fontSize=8.7, leading=10.1, spaceAfter=2),
}
def clean(text):
    return str(text).replace('\u2014', '-').replace('\u2013', '-').replace('\u2019', "'").replace('\u2018', "'").replace('\u201c', '"').replace('\u201d', '"')
def para(text, style='body'):
    return Paragraph(escape(clean(text)), styles[style])
flow = [para(facts['name'].upper(), 'name')]
flow.append(Paragraph(f'Austin, TX | {escape(facts["publicContact"]["phone"])} | <link href="mailto:{escape(facts["publicContact"]["email"])}">{escape(facts["publicContact"]["email"])}</link> | <link href="https://sulayman-bowles.dev/resume">sulayman-bowles.dev/resume</link><br/><link href="https://www.linkedin.com/in/sulayman-bowles/">LinkedIn: sulayman-bowles</link> | <link href="https://github.com/SulaymanB2024">GitHub: SulaymanB2024</link>', styles['contact']))
def section(label):
    flow.append(para(label.upper(), 'section'))
def heading(left, right):
    table = Table([[para(left, 'org'), para(right, 'date')]], colWidths=[390, 126], hAlign='LEFT')
    table.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 1)]))
    return table
section('Education')
flow.extend([heading(facts['education']['institution'] + ', ' + facts['education']['school'], 'Expected ' + facts['education']['expectedGraduation']), para('; '.join(d['degree'] + ' in ' + d['field'] for d in facts['education']['degrees'])), para('Coursework: ' + ', '.join(facts['education']['coursework']))])
section('Experience')
for item in facts['experience']:
    group = [heading(item['organization'] + ' - ' + item['location'], item['dates']), para(item['title'], 'role'), para(item['publicSummary'])]
    group += [para('• ' + bullet) for bullet in item['bullets']]
    group.append(Spacer(1, 3))
    flow.append(KeepTogether(group))
section('Current research work')
flow.append(para(facts['currentResearchWork']))
section('Selected awards and leadership')
for item in facts['awardsAndLeadership']:
    flow.append(KeepTogether([heading(item['organization'], item['dates']), para(item['title'] + '. ' + item['detail']), Spacer(1, 2)]))
section('Skills and credentials')
for group in facts['skillGroups']:
    flow.append(para(group['label'] + ': ' + ', '.join(group['items'])))
flow.append(para('Certifications: ' + '; '.join(facts['certifications'])))
flow.append(para('Languages: ' + ', '.join(facts['languages'])))
def footer(canvas, doc):
    canvas.setFont('Times-Roman', 7.5)
    canvas.drawString(42, 25, 'Public profile reviewed ' + facts['lastReviewed'] + ' | sulayman-bowles.dev/resume')
    canvas.drawRightString(570, 25, str(doc.page))
doc = SimpleDocTemplate(sys.argv[2], pagesize=letter, rightMargin=42, leftMargin=42, topMargin=30, bottomMargin=38, title=facts['name']+' - Resume', author=facts['name'], pageCompression=0, invariant=1)
doc.build(flow, onFirstPage=footer, onLaterPages=footer)
print(sys.argv[2])
