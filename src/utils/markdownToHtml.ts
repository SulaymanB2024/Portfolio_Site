function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function fragmentId(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'note';
}

function plainMarkdownLabel(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inlineMarkdown(value: string, noteRefCounts: Map<string, number>) {
  const code: string[] = [];
  let html = escapeHtml(value).replace(/`([^`]+)`/g, (_match, contents: string) => {
    code.push(`<code>${contents}</code>`);
    return `@@INLINE_CODE_${code.length - 1}@@`;
  });

  html = html
    .replace(/\[\^([^\]]+)\]/g, (_match, id: string) => {
      const occurrence = noteRefCounts.get(id) ?? 0;
      noteRefCounts.set(id, occurrence + 1);
      const safeId = fragmentId(id);
      const refId = occurrence === 0 ? `note-ref-${safeId}` : `note-ref-${safeId}-${occurrence + 1}`;
      return `<sup class="article-note-ref"><a href="#note-${safeId}" id="${refId}" aria-label="Note ${escapeHtml(id)}">${escapeHtml(id)}</a></sup>`;
    })
    .replace(/\[(S\d+)\]\((#source-[^\s)]*)\)/g, '<sup class="article-citation"><a href="$2" aria-label="Source $1 in source ledger">$1</a></sup>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" aria-label="$1 (external link, opens in a new tab)">$1</a>',
    )
    .replace(/\[([^\]]+)\]\((\/[^\s)]*|#[^\s)]*)\)/g, '<a href="$2">$1</a>')
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

function noteBacklinks(id: string, noteRefCounts: Map<string, number>) {
  const safeId = fragmentId(id);
  const referenceCount = noteRefCounts.get(id) ?? 0;
  if (!referenceCount) return '';

  const links = Array.from({ length: referenceCount }, (_, index) => {
    const refId = index === 0 ? `note-ref-${safeId}` : `note-ref-${safeId}-${index + 1}`;
    const label = referenceCount === 1 ? '↩' : `↩${index + 1}`;
    return `<a class="article-note-backlink" href="#${refId}" aria-label="Back to reference ${index + 1} for note ${escapeHtml(id)}">${label}</a>`;
  });

  return ` <span class="article-note-backlinks">${links.join(' ')}</span>`;
}

export function markdownToHtml(
  markdown: string,
  options: { noteRefCounts?: Map<string, number> } = {},
) {
  const notes = new Map<string, string>();
  const noteRefCounts = options.noteRefCounts ?? new Map<string, number>();
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
      blocks.push(`<h${level} id="${id}">${inlineMarkdown(heading[2], noteRefCounts)}</h${level}>`);
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
      const tableLabel = escapeHtml(headers.map(plainMarkdownLabel).join(', '));
      blocks.push(
        `<div class="article-table-wrap" role="region" aria-label="Data table with fields: ${tableLabel}. Scroll horizontally to inspect every field." tabindex="0">` +
        `<table data-responsive-table="stacked" aria-label="Data table with fields: ${tableLabel}">` +
        `<thead><tr>${headers.map((cell) => `<th scope="col">${inlineMarkdown(cell, noteRefCounts)}</th>`).join('')}</tr></thead>` +
        `<tbody>${rows.map((row) => `<tr>${row.map((cell, cellIndex) => {
          const dataLabel = escapeHtml(plainMarkdownLabel(headers[cellIndex] ?? `Field ${cellIndex + 1}`));
          return cellIndex === 0
            ? `<th scope="row" data-label="${dataLabel}">${inlineMarkdown(cell, noteRefCounts)}</th>`
            : `<td data-label="${dataLabel}">${inlineMarkdown(cell, noteRefCounts)}</td>`;
        }).join('')}</tr>`).join('')}</tbody></table></div>`,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(`<blockquote>${quote.map((item) => `<p>${inlineMarkdown(item, noteRefCounts)}</p>`).join('')}</blockquote>`);
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
        items.push(`<li>${inlineMarkdown(item[1], noteRefCounts)}</li>`);
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
    blocks.push(`<p>${inlineMarkdown(paragraph.join(' '), noteRefCounts)}</p>`);
  }

  if (notes.size) {
    blocks.push(
      `<ol class="article-notes" aria-label="Article notes">${Array.from(notes, ([id, note]) => {
        const noteMarkup = inlineMarkdown(note, noteRefCounts);
        return `<li id="note-${fragmentId(id)}">${noteMarkup}${noteBacklinks(id, noteRefCounts)}</li>`;
      }).join('')}</ol>`,
    );
  }

  return blocks.join('\n');
}
