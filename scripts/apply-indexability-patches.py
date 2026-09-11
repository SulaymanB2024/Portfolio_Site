"""One-time, hash-verified application of reviewed line edits; removed before merge."""
from pathlib import Path
import json
import hashlib
root = Path.cwd().resolve()
records = []
for file in sorted((root / 'scripts/indexability-patches').glob('*.json')):
    records.extend(json.loads(file.read_text()))
if len(records) != 13 or len({r['path'] for r in records}) != 13:
    raise RuntimeError('Unexpected source scope or duplicate edit')
hash_text = lambda text: hashlib.sha256(text.encode()).hexdigest()
prepared = []
for entry in records:
    target = (root / entry['path']).resolve()
    if not target.is_relative_to(root) or target.relative_to(root).parts[0] not in ['src','scripts','docs','package.json']:
        raise RuntimeError('Unexpected edit scope: ' + entry['path'])
    if entry['before'] is None:
        if target.exists(): raise RuntimeError('New file already exists: ' + entry['path'])
        text = entry['text']
    else:
        old = target.read_text()
        if hash_text(old) != entry['before']: raise RuntimeError('Baseline changed: ' + entry['path'])
        lines = old.splitlines(keepends=True)
        previous = len(lines) + 1
        for start, end, replacement in reversed(entry['edits']):
            if not 0 <= start <= end <= len(lines) or end > previous:
                raise RuntimeError('Invalid line edit: ' + entry['path'])
            lines[start:end] = replacement.splitlines(keepends=True)
            previous = start
        text = ''.join(lines)
    if hash_text(text) != entry['after']: raise RuntimeError('Reconstruction mismatch: ' + entry['path'])
    prepared.append((target, text))
for target, text in prepared:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text)
    print(target.relative_to(root), hash_text(text))
print('All 13 source records reconstructed exactly.')
