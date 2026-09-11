"""Verify readable initial documents when JavaScript is absent or fails.

Uses the same built pages for every browser (no user-agent branching). This is
rendering/readability verification, not Google's URL Inspection or index status.
Requires Playwright and Chrome, matching browser-smoke.py's CI environment.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import time
from playwright.sync_api import sync_playwright

routes = {
    '/': None,
    '/research': 'ResearchPage-',
    '/research/ai-systems/the-first-ai-managers': 'AiManagersArticlePage-',
    '/research/technical-seo/issues/canonical-noindex-conflict': 'ProgrammaticSeoPage-',
}
output = Path('audit-artifact/browser-indexability'); output.mkdir(parents=True, exist_ok=True)
chrome = os.environ.get('BROWSER_EXECUTABLE') or shutil.which('google-chrome') or shutil.which('chromium')
if not chrome: raise RuntimeError('System Chrome/Chromium is required.')
entry = list(Path('dist/assets').glob('index-*.js'))
if len(entry) != 1: raise RuntimeError('Expected exactly one fingerprinted application entry.')
server = subprocess.Popen(['node', 'node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
results = []
try:
    time.sleep(2)
    if server.poll() is not None: raise RuntimeError('Preview server did not start.')
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome, args=['--no-sandbox'])
        for width in [1440, 390]:
            for mode in ['no-javascript', 'failed-entry', 'failed-route-chunk']:
                for path, chunk in routes.items():
                    if mode == 'failed-route-chunk' and chunk is None: continue
                    blocked = []
                    context = browser.new_context(viewport={'width': width, 'height': 900}, java_script_enabled=mode != 'no-javascript', reduced_motion='reduce')
                    def request(route):
                        url = route.request.url
                        if not url.startswith('http://127.0.0.1:4173/'):
                            route.abort(); return
                        fail = mode == 'failed-entry' and url.split('?')[0].endswith('/' + entry[0].name)
                        fail = fail or (mode == 'failed-route-chunk' and ('/assets/' + chunk) in url and url.split('?')[0].endswith('.js'))
                        if fail: blocked.append(url); route.abort()
                        else: route.continue_()
                    context.route('**/*', request)
                    page = context.new_page()
                    response = page.goto('http://127.0.0.1:4173' + path, wait_until='networkidle', timeout=30000)
                    page.wait_for_timeout(150)
                    main = page.locator('#seo-static-summary main')
                    h1 = main.locator('h1')
                    record = {
                        'path': path, 'width': width, 'mode': mode, 'status': response.status,
                        'visibleMain': main.is_visible(), 'visibleH1': h1.count() == 1 and h1.is_visible(),
                        'words': len(main.inner_text().split()), 'links': main.locator('a[href]').count(),
                        'overflow': page.evaluate('document.documentElement.scrollWidth > innerWidth + 1'),
                        'blockedScripts': blocked,
                        'canonical': page.locator('link[rel="canonical"]').get_attribute('href'),
                        'robots': page.locator('meta[name="robots"]').get_attribute('content'),
                    }
                    results.append(record)
                    if width == 390 and path in ['/research', '/research/technical-seo/issues/canonical-noindex-conflict']:
                        page.screenshot(path=str(output / f'{mode}-{len(results)}.png'), animations='disabled')
                    assert record['status'] == 200 and record['visibleMain'] and record['visibleH1'], record
                    assert record['words'] >= 100 and record['links'] >= 3 and not record['overflow'], record
                    assert record['canonical'] == 'https://sulayman-bowles.dev' + path and record['robots'] == 'index,follow', record
                    if mode != 'no-javascript': assert blocked, 'Test did not actually block a script: ' + str(record)
                    context.close()
        browser.close()
finally:
    server.terminate(); server.wait(timeout=10)
    (output / 'results.json').write_text(json.dumps(results, indent=2) + '\n')
assert len(results) == 22, results
print('Passed 22 initial-document checks across desktop/mobile, no JavaScript, failed entry, and failed route chunks.')
