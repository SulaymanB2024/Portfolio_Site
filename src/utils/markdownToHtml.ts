function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function inlineMarkdown(value: string) {
  const code: string[] = [];
  let html = escapeHtml(value).replace(/`([^`]+)`/g, (_match, contents: string) => {
    code.push(`<code>${contents}</code>`);
    return `@@INLINE_CODE_${code.length - 1}@@`;
  });

  html = html
    .replace(/\[\^([^\]]+)\]/g, '<sup><a href="#note-$1" id="note-ref-$1">$1</a></sup>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|#[^\s)]*)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>');

  return html.replace(/@@INLINE_CODE_(\d+)@@/g, (_match, index: string) => code[Number(index)] ?? '');
}

function isTableDivider(line: string) {
  return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);
}

function tableCells(line: string) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

export function markdownToHtml(markdown: string) {
  const notes = new Map<string, string>();
  const lines = markdown.replace(/\r\n/g, '\n').split('\n').filter((line) => {
    const match = line.match(/^\[\^([^\]]+)\]:\s*(.+)$/);
    if (!match) return true;
    notes.set(match[1], match[2]);
    return false;
  });
  const blocks: string[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim() || line.trim() === '---') {
      index += 1;
      continue;
    }

    const fence = line.match(/^```([\w-]*)\s*$/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(`<pre><code${fence[1] ? ` class="language-${escapeHtml(fence[1])}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const id = heading[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      blocks.push(`<h${level} id="${id}">${inlineMarkdown(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const headers = tableCells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      blocks.push(`<div class="article-table-wrap"><table><thead><tr>${headers.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(`<blockquote>${quote.map((item) => `<p>${inlineMarkdown(item)}</p>`).join('')}</blockquote>`);
      continue;
    }

    const unordered = line.match(/^\s*-\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const tag = ordered ? 'ol' : 'ul';
      const pattern = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*-\s+(.+)$/;
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(pattern);
        if (!item) break;
        items.push(`<li>${inlineMarkdown(item[1])}</li>`);
        index += 1;
      }
      blocks.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^```/.test(lines[index]) &&
      !/^#{2,4}\s+/.test(lines[index]) &&
      !/^>\s?/.test(lines[index]) &&
      !/^\s*(?:-|\d+\.)\s+/.test(lines[index]) &&
      !(lines[index].includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1]))
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
  }

  if (notes.size) {
    blocks.push(`<ol class="article-notes">${Array.from(notes, ([id, note]) => `<li id="note-${escapeHtml(id)}">${inlineMarkdown(note)} <a href="#note-ref-${escapeHtml(id)}" aria-label="Back to reference ${escapeHtml(id)}">↩</a></li>`).join('')}</ol>`);
  }

  return blocks.join('\n');
}
