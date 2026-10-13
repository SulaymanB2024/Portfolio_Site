"""Read-only acquisition of the primary sources used in this candidate screen."""
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.request

BASE = Path(__file__).resolve().parent
SOURCES = {
    'adbe-q3-2026': 'https://www.sec.gov/Archives/edgar/data/796343/000079634326000156/adbe-20260828.htm',
    'adbe-fy-2025': 'https://www.sec.gov/Archives/edgar/data/796343/000079634326000003/adbe-20251128.htm',
    'pypl-q2-2026': 'https://www.sec.gov/Archives/edgar/data/1633917/000163391726000082/pypl-20260630.htm',
    'pypl-fy-2025': 'https://www.sec.gov/Archives/edgar/data/1633917/000163391726000024/pypl-20251231.htm',
    'pypl-q2-2026-release': 'https://www.sec.gov/Archives/edgar/data/1633917/000163391726000080/pypl2q-26earningsrelease.htm',
    'dbx-q2-2026': 'https://www.sec.gov/Archives/edgar/data/1467623/000146762326000049/dbx-20260630.htm',
    'dbx-fy-2025': 'https://www.sec.gov/Archives/edgar/data/1467623/000146762326000008/dbx-20251231.htm',
    'dbx-q2-2026-release': 'https://investors.dropbox.com/news-releases/news-release-details/dropbox-announces-second-quarter-2026-results',
    'dbx-ir-index': 'https://investors.dropbox.com/',
    'expe-q2-2026': 'https://www.sec.gov/Archives/edgar/data/1324424/000132442426000053/expe-20260630.htm',
    'expe-fy-2025': 'https://www.sec.gov/Archives/edgar/data/1324424/000132442426000008/expe-20251231.htm',
    'expe-q2-2026-release': 'https://www.sec.gov/Archives/edgar/data/1324424/000132442426000051/earningsrelease-q22026.htm',
    'pypl-ir-quarterly': 'https://investor.pypl.com/financials/quarterly-results/default.aspx',
    'expe-ir-quarterly': 'https://ir.expediagroup.com/financial-information/quarterly-results/default.aspx',
    'adbe-q3-2026-release': 'https://www.adobe.com/cc-shared/assets/investor-relations/pdfs/01906202/au56y4ter.pdf',
    'adbe-q3-2026-datasheet': 'https://www.adobe.com/cc-shared/assets/investor-relations/pdfs/01906202/b75st5a4rwea.pdf',
    'dbx-q2-2026-supplement': 'https://investors.dropbox.com/static-files/ed86c070-4173-4339-ad09-aca866a36774',
    'dbx-q2-2026-prepared-remarks': 'https://investors.dropbox.com/static-files/47c520a5-a888-4a35-98d2-d20440d56518',
    'dbx-q2-2026-presentation': 'https://investors.dropbox.com/static-files/85c3f018-bb5c-4207-b33b-1ca09d188ed6',
}

class Visible(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts, self.links = [], []
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script','style','ix:header'):
            self.skip += 1
        if not self.skip:
            if tag in ('p','div','tr','h1','h2','h3','h4','br','li'):
                self.parts.append('\n')
            if tag in ('td','th'):
                self.parts.append(' | ')
            if tag == 'a' and attrs.get('href'):
                self.links.append(attrs['href'])
    def handle_endtag(self, tag):
        if tag in ('script','style','ix:header') and self.skip:
            self.skip -= 1
        if not self.skip and tag in ('p','div','tr','h1','h2','h3','h4','li'):
            self.parts.append('\n')
    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)
    def text(self):
        s = ''.join(self.parts).replace('\xa0',' ')
        return '\n'.join(re.sub(r'[ \t]+',' ',line).strip() for line in s.splitlines() if line.strip())+'\n'

def acquire(item):
    key,url = item
    target=BASE/'sources'
    target.mkdir(exist_ok=True)
    try:
        request=urllib.request.Request(url,headers={'User-Agent':'Research contact sybatx@gmail.com'})
        with urllib.request.urlopen(request,timeout=35) as r:
            raw=r.read()
            ctype=r.headers.get('Content-Type','')
        suffix='pdf' if raw.startswith(b'%PDF') else 'html'
        path=target/f'{key}.{suffix}'
        path.write_bytes(raw)
        if suffix=='html':
            parser=Visible()
            parser.feed(raw.decode('utf-8',errors='replace'))
            (target/f'{key}.txt').write_text(parser.text())
            (target/f'{key}.links.json').write_text(json.dumps(parser.links,indent=2)+'\n')
        else:
            try:
                from pypdf import PdfReader
                reader=PdfReader(path)
                text='\n'.join(f'PAGE {i+1}\n'+(page.extract_text(extraction_mode='layout') or '') for i,page in enumerate(reader.pages))
                (target/f'{key}.txt').write_text(text)
            except ImportError:
                pass
        return {'id':key,'url':url,'status':'acquired','content_type':ctype,'bytes':len(raw),'sha256':sha256(raw).hexdigest(),'snapshot':str(path.relative_to(BASE))}
    except Exception as exc:
        return {'id':key,'url':url,'status':'failed','error':str(exc)}

if __name__=='__main__':
    with ThreadPoolExecutor(max_workers=3) as pool:
        results=list(pool.map(acquire,SOURCES.items()))
    (BASE/'acquisition.json').write_text(json.dumps({'cutoff':'2026-10-12','retrieved_local_date':'2026-10-12','sources':results},indent=2)+'\n')
    for result in results:
        print(result['id'],result['status'],result.get('bytes',result.get('error')))
