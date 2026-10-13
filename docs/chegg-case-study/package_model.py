"""Package only public reproducibility files, with fixed ZIP timestamps."""
from pathlib import Path
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED
import hashlib

ROOT=Path(__file__).resolve().parent
SITE=ROOT.parents[1]
files=["model.py","inputs.json","source-register.json","verify.py","figures.py","worked-model.ipynb","requirements-figures.txt"]
files+=sorted(str(p.relative_to(ROOT)) for p in (ROOT/"outputs").glob("*"))
files+=sorted(str(p.relative_to(ROOT)) for p in (ROOT/"figures").glob("chegg-*.svg") if "share-card" not in p.name)
files+=sorted(str(p.relative_to(ROOT)) for p in (ROOT/"figures").glob("chegg-*.png"))
destination=SITE/"public/downloads/research/chegg-cash-flow-model.zip"
destination.parent.mkdir(parents=True,exist_ok=True)
with ZipFile(destination,"w",compression=ZIP_DEFLATED,compresslevel=9) as archive:
    for name in ["README.md",*files]:
        original=ROOT/("MODEL_README.md" if name=="README.md" else name)
        info=ZipInfo(name,date_time=(2026,10,12,12,0,0)); info.compress_type=ZIP_DEFLATED;info.external_attr=0o644<<16
        archive.writestr(info,original.read_bytes())
print("Packaged",len(files)+1,"files;",destination.stat().st_size,"bytes; SHA256",hashlib.sha256(destination.read_bytes()).hexdigest())
