"""Bounded browser checks for the built Kalshi article; no production writes.
Run after npm run build, with Playwright Chromium installed in a test environment.
Artifacts contain screenshots, checks and this research package, never font files.
"""
import functools
import http.server
import importlib.util
import json
from pathlib import Path
import subprocess
import threading
import zipfile
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.cache/kalshi-review'
OUT.mkdir(parents=True, exist_ok=True)
SLUG = 'kalshi-40-billion-question'
ARTICLE = ROOT / f'src/personal/editorial/data/articles/{SLUG}.json'
article = json.loads(ARTICLE.read_text())
report = {'commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip(), 'checks': [], 'errors': []}
# Retain only the reviewed package and text engineering dependencies for replay.
patterns = ['src/personal/editorial/data/articles/kalshi-40-billion-question.json', 'src/personal/editorial/data/catalog.json', 'src/personal/editorial/data/reader-guides.json', 'src/personal/editorial/ArticlePage.tsx', 'src/personal/editorial/ResearchFigure.tsx', 'src/personal/editorial/types.ts', 'public/research-assets/kalshi-valuation-2026/*', 'public/images/research/kalshi-valuation/*', 'public/images/social/kalshi-40-billion-question.png', 'docs/kalshi-valuation-2026/*', 'docs/article-publications.json', 'tools/*article*', 'tools/test-kalshi*', 'tools/qa-kalshi-browser.py', 'tests/kalshi*']
with zipfile.ZipFile(OUT / 'research-source.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    selected = {p for pattern in patterns for p in ROOT.glob(pattern) if p.is_file()}
    for p in sorted(selected): archive.write(p, p.relative_to(ROOT))
    for name in ['src/personal/editorial/data/catalog.json', 'src/personal/editorial/data/reader-guides.json']:
        archive.writestr('baseline/' + name, subprocess.check_output(['git', 'show', 'ed0d992825e1a4ee58914fc82f4459b0304034e0:' + name]))

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_): pass
handler = functools.partial(QuietHandler, directory=str(ROOT / 'dist'))
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
origin = f'http://127.0.0.1:{server.server_port}'
spec = importlib.util.spec_from_file_location('kalshi_model', ROOT / 'public/research-assets/kalshi-valuation-2026/model.py')
model = importlib.util.module_from_spec(spec)
spec.loader.exec_module(model)

def check(condition, label):
    if not condition: raise AssertionError(label)
    report['checks'].append(label)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for width, height in [(390, 844), (1440, 1000)]:
            context = browser.new_context(viewport={'width': width, 'height': height}, reduced_motion='reduce', locale='en-US')
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            response = page.goto(origin + article['path'], wait_until='networkidle')
            check(response.status == 200, f'article {width}: HTTP 200')
            page.get_by_role('heading', level=1).first.wait_for()
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(500)
            check(page.get_by_role('heading', level=1).count() == 1, f'article {width}: one title')
            check(page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'article {width}: no page overflow')
            page.screenshot(path=str(OUT / f'article-{width}.png'))
            for index, figure in enumerate(page.locator('.reader-research-figure').all()):
                figure.scroll_into_view_if_needed()
                image = figure.locator('img').first
                if image.count():
                    image.wait_for()
                    page.wait_for_function('(img) => img.complete && img.naturalWidth > 0', arg=image.element_handle())
                figure.screenshot(path=str(OUT / f'figure-{index+1}-{width}.png'))
            check(len(page.locator('.reader-research-figure').all()) == sum(len(s.get('figures', [])) for s in article['sections']), f'article {width}: all analytical figures')
            check(not errors, f'article {width}: no uncaught JavaScript errors')
            response = page.goto(origin + '/research-assets/kalshi-valuation-2026/model.html', wait_until='networkidle')
            check(response.status == 200, f'model {width}: HTTP 200')
            page.wait_for_function("document.getElementById('base').textContent.length > 0")
            check(page.locator('#base').inner_text() == f"${model.value_case('Base')['equity_illustration']:.2f}bn", f'model {width}: independent Python baseline')
            check(page.locator('#rows tr').count() == 10, f'model {width}: ten forecast years')
            check(page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'model {width}: no page overflow')
            page.screenshot(path=str(OUT / f'model-{width}.png'), full_page=True)
            page.locator('#shock').fill('-25')
            page.locator('#shock').dispatch_event('input')
            check(page.locator('#base').inner_text() != '$27.41bn', f'model {width}: fee control recalculates')
            page.locator('#scenario').select_option('Restricted')
            check(page.locator('#rows tr').count() == 10, f'model {width}: scenario change keeps forecast')
            page.locator('#reset').click()
            check(page.locator('#base').inner_text() == '$27.41bn', f'model {width}: reset restores baseline')
            page.locator('#discount').fill('5')
            page.locator('#growth').fill('6')
            page.locator('#growth').dispatch_event('input')
            check(bool(page.locator('#error').inner_text()), f'model {width}: invalid perpetuity rejected')
            page.locator('#reset').click()
            page.locator('#discount').focus()
            page.keyboard.press('Tab')
            check(page.evaluate("document.activeElement.id === 'growth'"), f'model {width}: keyboard controls')
            with page.expect_download() as download:
                page.locator('a[download][href="./forecast.csv"]').click()
            download.value.save_as(OUT / f'forecast-download-{width}.csv')
            check((OUT / f'forecast-download-{width}.csv').read_bytes() == (ROOT / 'public/research-assets/kalshi-valuation-2026/forecast.csv').read_bytes(), f'model {width}: exact CSV download')
            check(not errors, f'model {width}: no uncaught JavaScript errors')
            context.close()
        browser.close()
except Exception as error:
    report['errors'].append(str(error))
    raise
finally:
    server.shutdown()
    (OUT / 'checks.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
