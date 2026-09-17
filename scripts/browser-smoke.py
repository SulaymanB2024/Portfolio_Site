"""Browser smoke test against the built site. Requires Playwright 1.57.0 and system Chrome.

Runs in CI because the authoring container blocks loopback browser requests.
External requests are aborted: this validates local application code and assets,
not third-party font, analytics, or production hosting availability.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import time
from playwright.sync_api import sync_playwright

paths = [
    '/', '/about', '/resume', '/research/ai-systems/the-first-ai-managers',
    '/research/financial-systems/who-owns-austin-home-service-companies',
    '/research/data-systems/us-rare-earth-magnet-manufacturing-capacity',
    '/research/ai-crawlers/robots-txt-courtesy-not-access-control',
    '/research/technical-seo/issues/canonical-noindex-conflict',
    '/research/technical-seo/canonicalization-graph-consistency',
    '/markets/who-owns-texas-toll-roads',
]
paths += ['/work'] + ['/work/' + slug for slug in ['internshipdeadlines', 'project-delta', 'payrollpro', 'no-limit-artemis', 'mandatearc', 'jane-street-puzzle', 'internship-aggregator-engine', '1-800-operator', 'dropkit-sui-ticketing', 'sezzle-fundamental-model', 'coal-price-forecasting-framework']]
output = Path('audit-artifact/browser'); output.mkdir(parents=True, exist_ok=True)
chrome = os.environ.get('BROWSER_EXECUTABLE') or shutil.which('google-chrome') or shutil.which('chromium')
if not chrome: raise RuntimeError('System Chrome/Chromium is required for the browser smoke test.')
server = subprocess.Popen(['node', 'node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
results = []; states = []
try:
    time.sleep(2)
    if server.poll() is not None: raise RuntimeError('Preview server failed to start.')
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome, args=['--no-sandbox'])
        def offline_external(route):
            if route.request.url.startswith('http://127.0.0.1:4173/'):
                route.continue_()
            else: route.abort()
        for width in [1440, 390, 320]:
            context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
            context.route('**/*', offline_external)
            for i, path in enumerate(paths):
                if width == 320 and not path.startswith('/work'): continue
                page = context.new_page(); errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                response = page.goto('http://127.0.0.1:4173' + path, wait_until='networkidle', timeout=30000)
                is_work_document = path == '/work' or path.startswith('/work/')
                h1_selector = '#seo-static-summary h1' if is_work_document else '#root h1'
                page.wait_for_selector(h1_selector, state='attached'); page.wait_for_timeout(200)
                if is_work_document:
                    assert page.locator('#seo-static-summary[data-authored-layout]').count() == 1
                    assert page.locator('#root h1').count() == 0
                record = {
                    'width': width, 'path': path, 'status': response.status, 'title': page.title(),
                    'h1': page.locator(h1_selector).all_text_contents(),
                    'overflow': page.evaluate('document.documentElement.scrollWidth > innerWidth + 1'),
                    'errors': list(errors), 'native': page.evaluate('typeof window.lenis?.raf !== "function"'),
                }
                if i in [0, 1, 2, 6, 7] or path.startswith('/work'):
                    page.screenshot(path=str(output / f'{width}-{i}.png'), full_page=False, animations='disabled')
                if path.startswith('/work/'):
                    controls = page.locator('button[data-observation-button]')
                    controls.nth(2).focus(); page.keyboard.press('Enter')
                    assert controls.nth(2).get_attribute('aria-pressed') == 'true'
                    assert page.locator('[data-observation="2"]').is_visible()
                    assert not page.locator('[data-observation="0"]').is_visible()
                    assert page.locator('main').count() == 1
                if path == '/work':
                    # Work and case studies are authored documents. Verify the browser
                    # performs a native document load across that boundary.
                    page.locator('a.ws-card-link').first.click()
                    page.wait_for_url('**/work/internshipdeadlines')
                    page.wait_for_selector('#seo-static-summary h1', state='visible')
                    assert page.locator('#root h1').count() == 0
                    assert page.locator('[data-work-study="internshipdeadlines"]').count() == 1
                results.append(record); page.close()
            context.close()
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        context.route('**/*', offline_external)
        page = context.new_page(); page.goto('http://127.0.0.1:4173/', wait_until='networkidle')
        states.append(page.evaluate('typeof window.lenis?.raf === "function"'))
        page.emulate_media(reduced_motion='reduce'); page.wait_for_timeout(100)
        states.append(page.evaluate('typeof window.lenis?.raf === "function"'))
        page.emulate_media(reduced_motion='no-preference'); page.wait_for_timeout(100)
        states.append(page.evaluate('typeof window.lenis?.raf === "function"'))
        page.set_viewport_size({'width': 390, 'height': 900}); page.wait_for_timeout(100)
        states.append(page.evaluate('typeof window.lenis?.raf === "function"'))
        context.close(); browser.close()
finally:
    server.terminate(); server.wait(timeout=10)
    (output / 'results.json').write_text(json.dumps({'pages': results, 'scrollStates': states}, indent=2) + '\n')
assert len(results) == len(paths) * 2 + 12, results
for record in results:
    assert record['status'] == 200 and len(record['h1']) == 1 and not record['overflow'] and not record['errors'] and record['native'], record
assert states == [True, False, True, False], states
print(f'Browser smoke passed: {len(paths)} routes at three widths, case-study controls, native navigation, and live scroll preferences.')
