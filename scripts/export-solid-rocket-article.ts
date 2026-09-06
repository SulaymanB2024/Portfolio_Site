import { writeFile } from 'node:fs/promises';
import { SOLID_ROCKET_MOTOR_CAPACITY_ARTICLE as article } from '../src/content/solidRocketMotorCapacityArticle';

const lines = [
  `# ${article.title}`, '', article.subtitle, '',
  `Research cutoff: ${article.lastVerified}. Publication edition: ${article.date}.`, '',
  article.evidenceBoundary!, '', ...article.content.flatMap((paragraph) => [paragraph, '']),
];
const tableCell = (value: string) => value.replaceAll('|', '\\|').replaceAll('\n', '<br>');
for (const section of article.sections ?? []) {
  lines.push(`## ${section.title}`, '', ...section.paragraphs.flatMap((paragraph) => [paragraph, '']));
  if (section.bullets) lines.push(...section.bullets.map((item) => `- ${item}`), '');
  if (section.table) {
    const table = section.table;
    lines.push(table.caption, '', `| ${table.columns.map(tableCell).join(' | ')} |`,
      `| ${table.columns.map(() => '---').join(' | ')} |`,
      ...table.rows.map((row) => `| ${row.map(tableCell).join(' | ')} |`), '');
  }
  for (const figure of section.figures ?? []) {
    lines.push(`![${figure.alt}](https://sulayman-bowles.dev${figure.src})`, '', figure.caption, '');
  }
}
lines.push(`## ${article.conclusion.title}`, '', article.conclusion.content, '', '## Sources', '');
lines.push(...article.sources.map((source) => `- [${source.label}](${source.href})`), '');
await writeFile('public/research/us-solid-rocket-motor-capacity-audit.md', lines.join('\n'));
console.log(`Exported ${article.sections?.length} sections and ${article.sources.length} sources.`);
