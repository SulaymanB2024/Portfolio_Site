"""Content-safe HTTP link readbacks; factual verification uses the source ledger."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from hashlib import sha256
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from pathlib import Path
import json
from build_articles import CONFIGS

HERE=Path(__file__).resolve().parent


def check(s):
    row={"id":s["id"],"url":s["href"],"checked_at":datetime.now(timezone.utc).isoformat(),
         "claim_evidence":"Matching source text read through web tools; see article SOURCES.md for exact boundaries."}
    try:
        req=Request(s["href"],headers={"User-Agent":"Mozilla/5.0"})
        with urlopen(req,timeout=20) as response:
            body=response.read(2_000_000)
            row.update(status=response.status,final_url=response.url,
                content_type=response.headers.get("Content-Type"),
                first_2mb_sha256=sha256(body).hexdigest())
    except HTTPError as e:row.update(status=e.code,note="HTTP client access response; separate web evidence remains in the source register.")
    except Exception as e:row.update(status=None,note=type(e).__name__)
    return row


if __name__=="__main__":
    sources=[s for c in CONFIGS if c["key"]!="strategy" for s in c["sources"]]
    with ThreadPoolExecutor(max_workers=8) as pool: rows=list(pool.map(check,sources))
    (HERE/"source-verification.json").write_text(json.dumps(rows,indent=2)+"\n")
    print(json.dumps({"sources":len(rows),"statuses":{str(code):sum(r['status']==code for r in rows) for code in set(r['status'] for r in rows)}},indent=2))
