import sample from '../../../public/research/atlas-open-corpus-run-2026-07-16.json' with { type: 'json' }

export const atlasSample = sample

export function describeAtlasRow(index: number) {
  const row = sample.rows[index]
  if (!row) throw new RangeError('Unknown sample page')
  return {
    ...row,
    path: new URL(row.url).pathname,
    runtimeRecords: row.runtime_data_record_count ?? null,
    canonical: row.source_canonical === null ? 'Not present in source' : row.source_canonical,
    explanation: row.source_quote_card_count === 0
      ? 'The response contains ten embedded data records, but no quote-card elements. A successful response does not establish what a visitor or crawler will see after JavaScript runs.'
      : 'Ten quote-card elements are present in the source HTML. The captured response already contains the content being inspected.',
    nextStep: row.source_quote_card_count === 0
      ? 'Render the page before evaluating content coverage.'
      : 'Retain the source observation and follow the discovered pagination path.',
  }
}
