"""One-time final heading-parity corrections; validate every source hash before writing."""
from pathlib import Path
import json
import hashlib
root = Path.cwd().resolve()
records = json.loads((root / 'scripts/indexability-patches/final.json').read_text())
if len(records) != 3 or {r['path'] for r in records} != {'docs/indexability-readiness-2026-09-10.md','src/content/indexability.test.ts','src/seo/routes.ts'}:
    raise RuntimeError('Unexpected final correction scope')
hash_text = lambda text: hashlib.sha256(text.encode()).hexdigest()
prepared = []
for entry in records:
    target = root / entry['path']
    old = target.read_text()
    if hash_text(old) != entry['before']: raise RuntimeError('Baseline changed: ' + entry['path'])
    lines = old.splitlines(keepends=True)
    previous = len(lines) + 1
    for start, end, replacement in reversed(entry['edits']):
        if not 0 <= start <= end <= len(lines) or end > previous: raise RuntimeError('Invalid line edit')
        lines[start:end] = replacement.splitlines(keepends=True)
        previous = start
    text = ''.join(lines)
    if hash_text(text) != entry['after']: raise RuntimeError('Reconstruction mismatch: ' + entry['path'])
    prepared.append((target, text))
for target, text in prepared:
    target.write_text(text)
    print(target.relative_to(root), hash_text(text))
