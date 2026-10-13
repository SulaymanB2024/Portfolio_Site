"""Save primary financial sources and readable table-preserving text. Stdlib only."""
from pathlib import Path
from urllib.request import Request, urlopen
from html.parser import HTMLParser
import gzip, hashlib, json, re

ROOT = Path(__file__).resolve().parent
SOURCES = [
    ("CROX-K25", "2026-02-12", "2025-12-31", "https://www.sec.gov/Archives/edgar/data/1334036/000133403626000006/crox-20251231.htm"),
    ("CROX-Q226", "2026-07-30", "2026-06-30", "https://www.sec.gov/Archives/edgar/data/1334036/000133403626000052/crox-20260630.htm"),
    ("CROX-ER226", "2026-07-30", "2026-06-30", "https://www.sec.gov/Archives/edgar/data/1334036/000133403626000050/croxq22026-pressrelease.htm"),
    ("QCOM-K25", "2025-11-05", "2025-09-28", "https://www.sec.gov/Archives/edgar/data/804328/000080432825000085/qcom-20250928.htm"),
    ("QCOM-Q326", "2026-07-29", "2026-06-28", "https://www.sec.gov/Archives/edgar/data/804328/000080432826000086/qcom-20260628.htm"),
    ("QCOM-ER326", "2026-07-29", "2026-06-28", "https://www.sec.gov/Archives/edgar/data/804328/000080432826000085/qcom062826erex991.htm"),
    ("HCA-K25", "2026-02-10", "2025-12-31", "https://www.sec.gov/Archives/edgar/data/860730/000119312526044769/hca-20251231.htm"),
    ("HCA-Q226", "2026-07-28", "2026-06-30", "https://www.sec.gov/Archives/edgar/data/860730/000119312526321077/hca-20260630.htm"),
    ("HCA-ER226", "2026-07-24", "2026-06-30", "https://investor.hcahealthcare.com/news/news-details/2026/HCA-Healthcare-Reports-Second-Quarter-2026-Results/default.aspx"),
    ("WCC-K25", "2026-02-13", "2025-12-31", "https://www.sec.gov/Archives/edgar/data/929008/000092900826000008/wcc-20251231.htm"),
    ("WCC-Q226", "2026-07-30", "2026-06-30", "https://www.sec.gov/Archives/edgar/data/929008/000092900826000024/wcc-20260630.htm"),
    ("WCC-ER226", "2026-07-30", "2026-06-30", "https://www.sec.gov/Archives/edgar/data/929008/000092900826000021/wcc-2q2026earnings.htm"),
    ("CROX-Q225", "2025-08-07", "2025-06-30", "https://www.sec.gov/Archives/edgar/data/1334036/000133403625000085/crox-20250630.htm"),
    ("QCOM-Q325", "2025-07-30", "2025-06-29", "https://www.sec.gov/Archives/edgar/data/804328/000080432825000045/qcom-20250629.htm"),
    ("HCA-Q225", "2025-08-04", "2025-06-30", "https://www.sec.gov/Archives/edgar/data/860730/000095017025102056/hca-20250630.htm"),
    ("WCC-Q225", "2025-07-31", "2025-06-30", "https://www.sec.gov/Archives/edgar/data/929008/000092900825000023/wcc-20250630.htm"),
    ("WCC-DECK226", "2026-07-30", "2026-06-30", "https://www.sec.gov/Archives/edgar/data/929008/000092900826000021/wcc-2q2026slides.htm"),
    ("QCOM-AWS8K", "2026-09-08", "2026-09-03", "https://www.sec.gov/Archives/edgar/data/804328/000110465926105718/tm2623289d1_8k.htm"),
    ("QCOM-APPLE", "2026-09-24", "2026-09-24", "https://www.qualcomm.com/news/releases/2026/09/qualcomm-announces-renewal-of-global-patent-license-agreement-wi"),
    ("QCOM-APPLE-PR", "2026-09-24", "2026-09-24", "https://www.prnewswire.com/news-releases/qualcomm-announces-renewal-of-global-patent-license-agreement-with-apple-302888552.html"),
    ("QCOM-AWS", "2026-09-08", "2026-09-08", "https://investor.qualcomm.com/news-events/press-releases/news-details/2026/Qualcomm-Announces-Multi-Generational-Product-Collaboration-with-Amazon-to-Build-Next-Generation-AI-Data-Center-Infrastructure/default.aspx"),
    ("CMS-SDP", None, None, "https://www.medicaid.gov/medicaid/managed-care/guidance/state-directed-payments"),
]

class Readable(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts=[]; self.hide=0; self.cell=0
    def handle_starttag(self, tag, attrs):
        if tag in ('script','style','ix:header'): self.hide+=1
        if not self.hide and tag in ('p','div','tr','h1','h2','h3','li') and not self.cell: self.parts.append('\n')
        if not self.hide and tag in ('td','th'): self.parts.append(' | '); self.cell+=1
    def handle_endtag(self, tag):
        if tag in ('script','style','ix:header'): self.hide=max(0,self.hide-1)
        if tag in ('td','th'): self.cell=max(0,self.cell-1)
        if not self.hide and tag in ('p','div','tr','h1','h2','h3','li') and not self.cell: self.parts.append('\n')
    def handle_data(self,data):
        if not self.hide: self.parts.append(re.sub(r'\s+',' ',data))
    def text(self):
        lines=[re.sub(r'[\t \xa0]+',' ',s).strip() for s in ''.join(self.parts).splitlines()]
        return '\n'.join(s for s in lines if s)+'\n'

def acquire():
    register=[]
    prior=json.loads((ROOT/'source-register.json').read_text()) if (ROOT/'source-register.json').exists() else []
    for sid,pub,period,url in SOURCES:
        rawpath=ROOT/'sources'/f'{sid}.html.gz'; textpath=ROOT/'sources'/f'{sid}.txt'
        if rawpath.exists(): raw=gzip.decompress(rawpath.read_bytes())
        else:
            req=Request(url,headers={'User-Agent':'Public financial research contact sybatx@gmail.com'})
            with urlopen(req,timeout=30) as r: raw=r.read()
            rawpath.write_bytes(gzip.compress(raw,mtime=0))
        parser=Readable(); parser.feed(raw.decode('utf-8',errors='replace')); textpath.write_text(parser.text())
        register.append({'id':sid,'publication_date':pub,'period_end':period,'url':url,'publisher':'SEC EDGAR' if 'sec.gov' in url else 'CMS' if 'medicaid.gov' in url else 'Company investor relations','raw_sha256':hashlib.sha256(raw).hexdigest(),'raw_bytes':len(raw),'raw_snapshot':str(rawpath.relative_to(ROOT)),'text_snapshot':str(textpath.relative_to(ROOT)),'retrieved_client_date':'2026-10-12','cutoff':'2026-10-12','date_verification':'Filing/release dates confirmed using SEC index, SEC submissions or displayed company release date. CMS landing page is undated and links a February 2, 2026 guidance letter.'})
        print(sid,len(raw),len(parser.text()))
    known={r['id'] for r in register}
    register.extend(r for r in prior if r['id'] not in known)
    for r in register:
        if r['id']=='QCOM-APPLE': r['limitation']='Direct HTML is a JavaScript shell. Official text was read through web search; company-authored QCOM-APPLE-PR syndication supplies a readable saved body.'
        if r['id']=='QCOM-APPLE-PR': r['publisher']='Qualcomm company-authored release distributed by PR Newswire'
    (ROOT/'source-register.json').write_text(json.dumps(register,indent=2)+'\n')

if __name__=='__main__': acquire()
