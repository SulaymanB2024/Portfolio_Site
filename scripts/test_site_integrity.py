import tempfile
import unittest
from pathlib import Path
from site_integrity import Document, verify, ORIGIN


def html(path='/', body='', noindex=False, canonical=None):
    return f'''<!doctype html><html><head><title>Title {path}</title><meta name="description" content="Description {path}"><meta name="robots" content="{'noindex,follow' if noindex else 'index,follow'}"><link rel="canonical" href="{ORIGIN}{canonical or path}"><script type="application/ld+json">{{"name":"A > B"}}</script></head><body><h1>Heading {path}</h1>{body}</body></html>'''

class IntegrityTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.put('index.html', html(body='<a href="/guide#part">Guide</a>'))
        self.put('guide.html', html('/guide', '<h2 id="part">Part</h2><img src="/image.svg" alt="">'))
        self.put('guide/index.html', (self.root / 'guide.html').read_text())
        self.put('image.svg', '<svg/>')
        self.put('sitemap.xml', f'<urlset><url><loc>{ORIGIN}/</loc></url><url><loc>{ORIGIN}/guide</loc></url></urlset>')
    def tearDown(self): self.temp.cleanup()
    def put(self, name, value):
        path = self.root / name; path.parent.mkdir(parents=True, exist_ok=True); path.write_text(value)
    def errors(self): return '\n'.join(verify(self.root)['errors'])
    def test_valid_variants(self): self.assertEqual(self.errors(), '')
    def test_missing_destination(self):
        self.put('index.html', html(body='<a href="/absent">Broken</a>')); self.assertIn('missing built page', self.errors())
    def test_missing_fragment(self):
        self.put('index.html', html(body='<a href="/guide#absent">Broken</a>')); self.assertIn('missing fragment', self.errors())
    def test_missing_asset(self):
        (self.root / 'image.svg').unlink(); self.assertIn('missing built page or asset', self.errors())
    def test_duplicate_id(self):
        self.put('index.html', html(body='<p id="same">A</p><p id="same">B</p>')); self.assertIn('duplicate IDs', self.errors())
    def test_noindex_sitemap_leak(self):
        for file in ('guide.html', 'guide/index.html'): self.put(file, html('/guide', '<h2 id="part">Part</h2>', True))
        self.assertIn('not an indexable canonical', self.errors())
    def test_variant_drift(self):
        self.put('guide/index.html', html('/guide', '<h2 id="part">Different text</h2>')); self.assertIn('output differs', self.errors())
    def test_supporting_noindex_report(self):
        self.put('research/report.html', html('/research/report', '<a href="../guide#part">Guide</a>', True, '/guide'))
        self.assertEqual(self.errors(), '')
    def test_primary_host_and_text_fragment(self):
        self.put('index.html', html(body='<a href="/guide#:~:text=Part">Text</a>')); self.assertEqual(self.errors(), '')
        self.put('index.html', html(body='<a href="https://www.sulayman-bowles.dev/guide">Old host</a>')); self.assertIn('noncanonical origin', self.errors())
    def test_html_parser_ignores_script_examples_and_handles_entities(self):
        doc = Document(html(body='<script>const s = \'<img src="bad">\';</script><a title="A > B" href="/guide?a=1&amp;b=2">Go</a><h2 id="a&amp;b">A</h2>'))
        self.assertEqual(doc.missing_alt, []); self.assertIn('/guide?a=1&b=2', doc.references); self.assertIn('a&b', doc.ids)
    def test_invalid_jsonld(self):
        self.put('index.html', html(body='<script type="application/ld+json">{bad}</script>')); self.assertIn('invalid JSON-LD', self.errors())
    def test_duplicate_title_and_sitemap_omission(self):
        self.put('other.html', html('/other').replace('Title /other','Title /'))
        self.assertIn('Duplicate indexable title', self.errors()); self.assertIn('missing from sitemap', self.errors())

if __name__ == '__main__': unittest.main()
