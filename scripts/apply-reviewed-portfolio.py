"""One-time application of the reviewed source repair; removed before merge.

All before/after SHA-256 values must match. Edits use Python Unicode offsets.
The entire manifest is validated before any source file is written.
"""
from pathlib import Path
import hashlib
import json

root = Path.cwd().resolve()
hash_text = lambda value: hashlib.sha256(value.encode()).hexdigest()
records = []
for manifest in sorted((root / 'scripts/portfolio-repair-manifests').glob('*.json')):
    records.extend(json.loads(manifest.read_text()))
if len(records) != 33 or len({entry['path'] for entry in records}) != len(records):
    raise RuntimeError('Unexpected repair manifest count or duplicate path')
prepared = []
for entry in records:
    target = (root / entry['path']).resolve()
    if not target.is_relative_to(root) or '.git' in target.relative_to(root).parts or '.github' in target.relative_to(root).parts:
        raise RuntimeError('Repair target is outside the approved source scope')
    if entry['before'] is None:
        if target.exists(): raise RuntimeError('New source already exists: ' + entry['path'])
        text = entry['text']
    else:
        old = target.read_text()
        if hash_text(old) != entry['before']: raise RuntimeError('Baseline drift: ' + entry['path'])
        text = old
        previous = len(old) + 1
        for start, end, replacement in reversed(entry['edits']):
            if not 0 <= start <= end <= len(old) or end > previous:
                raise RuntimeError('Overlapping or invalid edit offsets')
            text = text[:start] + replacement + text[end:]
            previous = start
    if hash_text(text) != entry['after']: raise RuntimeError('Reconstruction mismatch: ' + entry['path'])
    prepared.append((target, text))
for target, text in prepared:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text)
    print(target.relative_to(root), hash_text(text))
print('Applied 33 reviewed source repairs; all before/after hashes matched.')
