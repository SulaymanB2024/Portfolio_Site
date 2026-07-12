import type { ReactNode } from 'react';

function isSafeHref(value: string) {
  return value.startsWith('https://') || value.startsWith('http://') || value.startsWith('/') || value.startsWith('#');
}

function renderInline(value: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let tokenIndex = 0;

  const pushText = (end: number) => {
    if (end > cursor) nodes.push(value.slice(cursor, end));
    cursor = end;
  };

  while (cursor < value.length) {
    const relativeIndex = value.slice(cursor).search(/[`[*]/);
    if (relativeIndex === -1) {
      nodes.push(value.slice(cursor));
      break;
    }

    const start = cursor + relativeIndex;
    pushText(start);
    const key = `${keyPrefix}-${tokenIndex}`;
    tokenIndex += 1;

    if (value[start] === '`') {
      const end = value.indexOf('`', start + 1);
      if (end !== -1) {
        nodes.push(<code key={key}>{value.slice(start + 1, end)}</code>);
        cursor = end + 1;
        continue;
      }
    }

    if (value.startsWith('**', start)) {
      const end = value.indexOf('**', start + 2);
      if (end !== -1) {
        nodes.push(<strong key={key}>{renderInline(value.slice(start + 2, end), `${key}-strong`)}</strong>);
        cursor = end + 2;
        continue;
      }
    }

    if (value[start] === '*') {
      const end = value.indexOf('*', start + 1);
      if (end !== -1) {
        nodes.push(<em key={key}>{renderInline(value.slice(start + 1, end), `${key}-em`)}</em>);
        cursor = end + 1;
        continue;
      }
    }

    if (value[start] === '[') {
      const labelEnd = value.indexOf(']', start + 1);
      const hrefStart = labelEnd === -1 ? -1 : labelEnd + 1;
      if (labelEnd !== -1 && value[hrefStart] === '(') {
        const hrefEnd = value.indexOf(')', hrefStart + 1);
        if (hrefEnd !== -1) {
          const label = value.slice(start + 1, labelEnd);
          const href = value.slice(hrefStart + 1, hrefEnd);
          if (isSafeHref(href)) {
            nodes.push(<a key={key} href={href}>{renderInline(label, `${key}-link`)}</a>);
            cursor = hrefEnd + 1;
            continue;
          }
        }
      }
    }

    nodes.push(value[start]);
    cursor = start + 1;
  }

  return nodes;
}

function isTableDivider(line: string) {
  return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);
}

function tableCells(line: string) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

export function markdownToReact(markdown: string): ReactNode[] {
  const notes = new Map<string, string>();
  const lines = markdown.replace(/\r\n/g, '\n').split('\n').filter((line) => {
    const match = line.match(/^\[\^([^\]]+)\]:\s*(.+)$/);
    if (!match) return true;
    notes.set(match[1], match[2]);
    return false;
  });
  const blocks: ReactNode[] = [];
  let blockIndex = 0;

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim() || line.trim() === '---') {
      index += 1;
      continue;
    }

    const key = `markdown-block-${blockIndex}`;
    blockIndex += 1;
    const fence = line.match(/^```([\w-]*)\s*$/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre key={key}>
          <code className={fence[1] ? `language-${fence[1]}` : undefined}>{code.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      const id = heading[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const children = renderInline(heading[2], `${key}-heading`);
      if (heading[1].length === 2) blocks.push(<h2 key={key} id={id}>{children}</h2>);
      if (heading[1].length === 3) blocks.push(<h3 key={key} id={id}>{children}</h3>);
      if (heading[1].length === 4) blocks.push(<h4 key={key} id={id}>{children}</h4>);
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
      blocks.push(
        <div key={key} className="article-table-wrap">
          <table>
            <thead><tr>{headers.map((cell, cellIndex) => <th key={`${key}-head-${cellIndex}`}>{renderInline(cell, `${key}-head-${cellIndex}`)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={`${key}-row-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${key}-cell-${rowIndex}-${cellIndex}`}>{renderInline(cell, `${key}-cell-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(<blockquote key={key}>{quote.map((item, quoteIndex) => <p key={`${key}-quote-${quoteIndex}`}>{renderInline(item, `${key}-quote-${quoteIndex}`)}</p>)}</blockquote>);
      continue;
    }

    const unordered = line.match(/^\s*-\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const pattern = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*-\s+(.+)$/;
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(pattern);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      const listItems = items.map((item, itemIndex) => <li key={`${key}-item-${itemIndex}`}>{renderInline(item, `${key}-item-${itemIndex}`)}</li>);
      blocks.push(ordered ? <ol key={key}>{listItems}</ol> : <ul key={key}>{listItems}</ul>);
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
    blocks.push(<p key={key}>{renderInline(paragraph.join(' '), `${key}-paragraph`)}</p>);
  }

  if (notes.size) {
    blocks.push(
      <ol key="markdown-notes" className="article-notes">
        {Array.from(notes, ([id, note]) => (
          <li key={id} id={`note-${id}`}>
            {renderInline(note, `note-${id}`)}{' '}
            <a href={`#note-ref-${id}`} aria-label={`Back to reference ${id}`}>↩</a>
          </li>
        ))}
      </ol>,
    );
  }

  return blocks;
}
