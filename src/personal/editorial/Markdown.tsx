import type { ReactNode } from 'react';
import { readerFragmentHref } from './library';
import catalog from './data/catalog.json';
import { articleHref, safeHref } from './links';
import type { ArticleSummary } from './types';

function isSafeHref(value: string) {
  return safeHref(value);
}

function renderInline(value: string, keyPrefix: string, references = new Map<string, number>()): ReactNode[] {
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
        nodes.push(<strong key={key}>{renderInline(value.slice(start + 2, end), `${key}-strong`, references)}</strong>);
        cursor = end + 2;
        continue;
      }
    }

    if (value[start] === '*') {
      const end = value.indexOf('*', start + 1);
      if (end !== -1) {
        nodes.push(<em key={key}>{renderInline(value.slice(start + 1, end), `${key}-em`, references)}</em>);
        cursor = end + 1;
        continue;
      }
    }

    if (value.startsWith('[^', start)) {
      const end = value.indexOf(']', start + 2);
      if (end !== -1) {
        const id = value.slice(start + 2, end);
        const occurrence = references.get(id) || 0;
        references.set(id, occurrence + 1);
        nodes.push(<sup key={key} id={`note-ref-${id}${occurrence ? `-${occurrence + 1}` : ''}`} className="article-citation"><a href={readerFragmentHref(typeof location === 'undefined' ? '' : location.hash, `#note-${id}`)} aria-label={`Note ${id}`}>{id}</a></sup>);
        cursor = end + 1;
        continue;
      }
    }

    if (value[start] === '[') {
      const labelEnd = value.indexOf(']', start + 1);
      const hrefStart = labelEnd === -1 ? -1 : labelEnd + 1;
      const source = labelEnd === -1 ? '' : value.slice(start + 1, labelEnd);
      if (/^S\d+$/.test(source) && value[hrefStart] !== '(') {
        const href = `#source-${source.toLowerCase()}`;
        nodes.push(<sup key={key} className="article-citation"><a href={readerFragmentHref(typeof location === 'undefined' ? '' : location.hash, href)} aria-label={`Source ${source.slice(1)}`}>{source}</a></sup>);
        cursor = labelEnd + 1;
        continue;
      }
      if (labelEnd !== -1 && value[hrefStart] === '(') {
        const hrefEnd = value.indexOf(')', hrefStart + 1);
        if (hrefEnd !== -1) {
          const label = value.slice(start + 1, labelEnd);
          const href = value.slice(hrefStart + 1, hrefEnd);
          if (isSafeHref(href)) {
            const children = renderInline(label, `${key}-link`, references);
            nodes.push(
              /^S\d+$/.test(label) && href.startsWith('#source-')
                ? <sup key={key} className="article-citation"><a href={readerFragmentHref(typeof location === 'undefined' ? '' : location.hash, href)} aria-label={`Source ${label.slice(1)}`}>{children}</a></sup>
                : <a key={key} href={readerFragmentHref(typeof location === 'undefined' ? '' : location.hash, articleHref(href, catalog as ArticleSummary[], import.meta.env.BASE_URL))}>{children}</a>,
            );
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

function textExhibit(code: string, key: string): ReactNode | null {
  const lines = code.split('\n').map(line => line.trimEnd()).filter(line => line.trim())
  // Only the supplied simple text equations are converted. Unknown TeX remains
  // literal, rather than silently dropping a command or changing its meaning.
  if (lines.length === 1 && code.includes('\\text{') && code.includes('\\times')) {
    const expression = code.replace(/\\text\{([^{}]+)\}/g, '$1').replace(/\\times\b/g, '×')
    if (!expression.includes('\\')) return <p key={key} className="reader-equation">{expression}</p>
  }
  if (lines.length >= 5 && lines.length % 2 === 1 && lines.every((line, index) => index % 2 === 0 ? line.trim() !== '↓' : line.trim() === '↓')) {
    return <figure key={key} className="reader-workflow"><ol>{lines.filter((_, index) => index % 2 === 0).map((line, index) => <li key={index}>{line.trim()}</li>)}</ol></figure>
  }
  const branches = lines.slice(1).map(line => line.match(/^([│\s]*)(?:├|└)──\s+(.+)$/))
  if (branches.length && branches.every(Boolean)) {
    type Branch = { text: string; children: Branch[] }
    const root: Branch = { text: lines[0], children: [] }, parents = [root]
    const levels = [...new Set(branches.map(branch => branch![1].length))].sort((a, b) => a - b)
    for (const branch of branches) {
      const depth = levels.indexOf(branch![1].length) + 1
      if (depth > parents.length) return null
      const node: Branch = { text: branch![2], children: [] }
      parents[depth - 1].children.push(node)
      parents[depth] = node
      parents.length = depth + 1
    }
    const tree = (nodes: Branch[]): ReactNode => <ul>{nodes.map((node, index) => <li key={index}><span>{node.text}</span>{node.children.length > 0 && tree(node.children)}</li>)}</ul>
    return <figure key={key} className="reader-lineage"><figcaption>{root.text}</figcaption>{tree(root.children)}</figure>
  }
  return null
}

export function markdownToReact(markdown: string): ReactNode[] {
  const references = new Map<string, number>();
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
      const exhibit = fence[1] === 'text' ? textExhibit(code.join('\n'), key) : null
      blocks.push(exhibit || (
        <pre key={key}>
          <code className={fence[1] ? `language-${fence[1]}` : undefined}>{code.join('\n')}</code>
        </pre>
      ));
      continue;
    }

    const picture = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (picture && isSafeHref(picture[2])) {
      blocks.push(<figure key={key}><img src={articleHref(picture[2], catalog as ArticleSummary[], import.meta.env.BASE_URL)} alt={picture[1]} loading="lazy" /></figure>);
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const id = heading[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const children = renderInline(heading[2], `${key}-heading`, references);
      if (heading[1].length <= 2) blocks.push(<h2 key={key} id={id}>{children}</h2>);
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
        <div key={key} className="article-table-wrap" role="region" aria-label="Data table" tabIndex={0}>
          <table>
            <thead><tr>{headers.map((cell, cellIndex) => <th key={`${key}-head-${cellIndex}`}>{renderInline(cell, `${key}-head-${cellIndex}`, references)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={`${key}-row-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${key}-cell-${rowIndex}-${cellIndex}`}>{renderInline(cell, `${key}-cell-${rowIndex}-${cellIndex}`, references)}</td>)}</tr>)}</tbody>
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
      blocks.push(<blockquote key={key}>{quote.map((item, quoteIndex) => <p key={`${key}-quote-${quoteIndex}`}>{renderInline(item, `${key}-quote-${quoteIndex}`, references)}</p>)}</blockquote>);
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
      const listItems = items.map((item, itemIndex) => <li key={`${key}-item-${itemIndex}`}>{renderInline(item, `${key}-item-${itemIndex}`, references)}</li>);
      blocks.push(ordered ? <ol key={key}>{listItems}</ol> : <ul key={key}>{listItems}</ul>);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^```/.test(lines[index]) &&
      !/^#{1,4}\s+/.test(lines[index]) &&
      !/^!\[/.test(lines[index]) &&
      !/^>\s?/.test(lines[index]) &&
      !/^\s*(?:-|\d+\.)\s+/.test(lines[index]) &&
      !(lines[index].includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1]))
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={key}>{renderInline(paragraph.join(' '), `${key}-paragraph`, references)}</p>);
  }

  if (notes.size) {
    blocks.push(
      <ol key="markdown-notes" className="article-notes">
        {Array.from(notes, ([id, note]) => (
          <li key={id} id={`note-${id}`}>
            {renderInline(note, `note-${id}`, references)}{' '}
            <a href={readerFragmentHref(typeof location === 'undefined' ? '' : location.hash, `#note-ref-${id}`)} aria-label={`Back to reference ${id}`}>↩</a>
          </li>
        ))}
      </ol>,
    );
  }

  return blocks;
}

export function inlineText(value: string, key = 'inline') {
  return renderInline(value, key);
}
