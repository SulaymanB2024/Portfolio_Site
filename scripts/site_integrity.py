"""Build-output integrity checks. Standard-library parser; no network or third-party packages."""
from __future__ import annotations
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import xml.etree.ElementTree as ET

ORIGIN = 'https://sulayman-bowles.dev'

class Document(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.duplicate_ids: list[str] = []
        self.references: list[str] = []
        self.canonicals: list[str] = []
        self.descriptions: list[str] = []
        self.robots: list[str] = []
        self.titles: list[str] = []
        self.h1s: list[str] = []
        self.missing_alt: list[str] = []
        self.jsonld: list[str] = []
        self._title: list[str] | None = None
        self._h1: list[str] | None = None
        self._script: list[str] | None = None
        self.feed(text)
        self.close()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        identifier = a.get('id')
        if identifier:
            if identifier in self.ids:
                self.duplicate_ids.append(identifier)
            self.ids.add(identifier)
        if tag == 'a' and a.get('name'):
            self.ids.add(a['name'])
        if tag == 'title': self._title = []
        if tag == 'h1': self._h1 = []
        if tag == 'script' and a.get('type', '').lower() == 'application/ld+json': self._script = []
        if tag == 'link' and 'canonical' in a.get('rel', '').lower().split():
            self.canonicals.append(a.get('href', ''))
        elif tag in ('link', 'a', 'area') and a.get('href'):
            self.references.append(a['href'])
        if tag == 'meta':
            name = (a.get('name') or a.get('property') or '').lower()
            if name == 'description': self.descriptions.append(a.get('content', ''))
            if name == 'robots': self.robots.append(a.get('content', ''))
            if name in ('og:image', 'twitter:image') and a.get('content'): self.references.append(a['content'])
        if tag == 'img' and 'alt' not in a: self.missing_alt.append(a.get('src', '(no src)'))
        for name in ('src', 'poster'):
            if a.get(name): self.references.append(a[name])
        if tag == 'object' and a.get('data'): self.references.append(a['data'])
        if a.get('srcset') and not a['srcset'].strip().startswith('data:'):
            self.references.extend(part.strip().split()[0] for part in a['srcset'].split(',') if part.strip())

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_data(self, value):
        if self._title is not None: self._title.append(value)
        if self._h1 is not None: self._h1.append(value)
        if self._script is not None: self._script.append(value)

    def handle_endtag(self, tag):
        if tag == 'title' and self._title is not None:
            self.titles.append(' '.join(''.join(self._title).split())); self._title = None
        if tag == 'h1' and self._h1 is not None:
            self.h1s.append(' '.join(''.join(self._h1).split())); self._h1 = None
        if tag == 'script' and self._script is not None:
            self.jsonld.append(''.join(self._script)); self._script = None


def delivery_path(file: Path, root: Path) -> str:
    value = '/' + file.relative_to(root).as_posix()
    if value.endswith('/index.html'): value = value[:-len('index.html')].rstrip('/') or '/'
    elif value.endswith('.html'): value = value[:-5]
    return value


def resolve_local(href: str, source_url: str, root: Path, origin: str = ORIGIN):
    """None means external/non-HTTP. Own-host mistakes are errors, never silently external."""
    parts = urlsplit(urljoin(source_url, href))
    if parts.scheme in ('mailto', 'tel', 'data', 'blob'): return None
    if parts.scheme not in ('http', 'https'): raise ValueError('unsupported URL scheme')
    host = urlsplit(origin).hostname
    if parts.hostname not in (host, 'www.' + host): return None
    if parts.netloc != urlsplit(origin).netloc or parts.scheme != 'https':
        raise ValueError('internal URL uses a noncanonical origin')
    decoded = unquote(parts.path, errors='strict')
    target = (root / decoded.lstrip('/')).resolve()
    if not target.is_relative_to(root): raise ValueError('path escapes build directory')
    candidates = [target, Path(str(target) + '.html'), target / 'index.html']
    found = next((p for p in candidates if p.is_file()), None)
    if found is None: raise ValueError('missing built page or asset')
    # Resolve symlinks before accepting a target outside the build root.
    if not found.resolve().is_relative_to(root): raise ValueError('asset escapes build directory')
    return found, unquote(parts.fragment.split(':~:', 1)[0], errors='strict')


def verify(root: Path, origin: str = ORIGIN) -> dict:
    root = root.resolve()
    files = sorted(root.rglob('*.html'))
    if not files: raise ValueError('No built HTML found; run the production build first.')
    docs = {file: Document(file.read_text()) for file in files}
    errors: list[str] = []
    pages: dict[str, dict] = {}
    variants: dict[str, bytes] = {}
    supporting: list[dict] = []
    broken: set[tuple[str, str, str]] = set()
    checked = 0
    for file, doc in docs.items():
        label = file.relative_to(root).as_posix()
        delivery = delivery_path(file, root)
        def error(message): errors.append(f'{label}: {message}')
        for name, values in [('canonical', doc.canonicals), ('title', doc.titles), ('description', doc.descriptions), ('H1', doc.h1s), ('robots', doc.robots)]:
            if len(values) != 1 or not values[0].strip(): error(f'expected exactly one nonempty {name}')
        if doc.duplicate_ids: error('duplicate IDs: ' + ', '.join(doc.duplicate_ids))
        if doc.missing_alt: error('images missing alt: ' + ', '.join(doc.missing_alt))
        for data in doc.jsonld:
            try: json.loads(data)
            except (ValueError, TypeError) as exc: error(f'invalid JSON-LD: {exc}')
        canonical = doc.canonicals[0] if len(doc.canonicals) == 1 else ''
        noindex = any('noindex' in value.lower().replace(',', ' ').split() for value in doc.robots)
        parts = urlsplit(canonical)
        canonical_path = parts.path
        if not canonical.startswith(origin + '/') or parts.query or parts.fragment:
            error('invalid canonical host, query or fragment')
        if delivery != canonical_path:
            if not noindex: error('noncanonical supporting document must be noindex')
            supporting.append({'path': delivery, 'canonical': canonical_path, 'noindex': noindex})
        elif canonical:
            record = {'path': canonical_path, 'title': doc.titles[0] if doc.titles else '', 'description': doc.descriptions[0] if doc.descriptions else '', 'h1': doc.h1s[0] if doc.h1s else '', 'noindex': noindex, 'outgoing': sorted(set(doc.references))}
            if canonical_path in pages and pages[canonical_path] != record: error('flat/directory metadata or links disagree')
            if canonical_path in variants and variants[canonical_path] != file.read_bytes(): error('flat/directory output differs')
            pages[canonical_path] = record
            variants[canonical_path] = file.read_bytes()
        for href in [canonical] + doc.references:
            if not href: continue
            try:
                target = resolve_local(href, origin + delivery, root, origin)
                if target is None: continue
                checked += 1
                destination, fragment = target
                if fragment and destination.suffix == '.html' and fragment not in docs[destination].ids:
                    raise ValueError('missing fragment')
            except (ValueError, KeyError) as exc:
                error(f'{exc}: {href}')
                broken.add((delivery, href, str(exc)))
    sitemap_path = root / 'sitemap.xml'
    try:
        tree = ET.parse(sitemap_path)
        urls = [element.text or '' for element in tree.iter() if element.tag.split('}')[-1] == 'loc']
    except (OSError, ET.ParseError) as exc:
        urls = []; errors.append(f'Sitemap missing or malformed: {exc}')
    if not urls: errors.append('Sitemap is empty')
    if len(set(urls)) != len(urls): errors.append('Sitemap contains duplicate URLs')
    for url in urls:
        try:
            target = resolve_local(url, origin + '/', root, origin)
            record = pages.get(urlsplit(url).path)
            if target is None or not record or record['noindex'] or url != origin + record['path']:
                raise ValueError('sitemap URL is not an indexable canonical')
        except ValueError as exc: errors.append(f'{exc}: {url}')
    for field in ('title', 'description', 'h1'):
        owners: dict[str, str] = {}
        for record in pages.values():
            if record['noindex']: continue
            owner = owners.get(record[field])
            if owner: errors.append(f'Duplicate indexable {field}: {owner} and {record["path"]}')
            owners[record[field]] = record['path']
    for record in pages.values():
        if not record['noindex'] and origin + record['path'] not in urls:
            errors.append(f'Indexable page missing from sitemap: {record["path"]}')
    return {'htmlFiles': len(files), 'canonicalPages': len(pages), 'localReferences': checked, 'sitemapUrls': len(urls), 'supportingDocuments': supporting, 'brokenReferences': [{'path': p, 'href': h, 'reason': e} for p, h, e in sorted(broken)], 'errors': sorted(set(errors)), 'pages': sorted(pages.values(), key=lambda p: p['path'])}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', default='dist')
    parser.add_argument('--report', default='audit-artifact/site-integrity.json')
    args = parser.parse_args()
    result = verify(Path(args.dist))
    report = Path(args.report); report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: value for key, value in result.items() if key != 'pages'}, indent=2))
    raise SystemExit(bool(result['errors']))
