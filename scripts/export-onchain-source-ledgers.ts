import fs from 'node:fs';
import path from 'node:path';
import { ETHEREUM_BLOBSPACE_SOURCES } from '../src/content/ethereumBlobspaceMeasurementAuditSources';
import { UNI_BURN_SUPPLY_ACCOUNTING_SOURCES } from '../src/content/uniBurnSupplyAccountingSupporting';

const root = path.resolve(import.meta.dirname, '../public/research');
const csv = (rows: unknown[][]) => rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n') + '\n';
const ethereumChecks: Record<number, string> = {
  5: 'Protocol BPO2 target 14 and maximum 21 rechecked against EIP-8135 on 2026-09-06.',
  7: 'Execution-linked reserve specification rechecked on 2026-09-06.',
  8: 'Historical cumulative input retained in August draft; original response not preserved. Not independently re-observed.',
  9: 'Historical occupancy input retained in August draft; original response not preserved. Not independently re-observed.',
  10: 'Published operator range 30000-35000/day rechecked on 2026-09-06; no underlying daily export.',
  13: 'Original reliability finding and April 9 correction rechecked on 2026-09-06.',
};
const uniChecks: Record<number, string> = {
  1: 'Executed proposal code and 40M two-year authorization rechecked on 2026-09-06.',
  3: 'Official contract source rechecked on 2026-09-06. This is not a fresh block-specific totalSupply RPC read.',
  4: 'Token mechanics and holder-rights documentation rechecked on 2026-09-06.',
  7: 'Reported August 5 tracker balance retained in draft; original response absent and live page changed.',
  8: 'Reported August 1 90-day window retained in draft; underlying classified export not preserved.',
  9: 'Paper abstract and date rechecked on 2026-09-06; no independent empirical replication.',
  12: 'Vote UI did not expose execution details during release check; v4 activation is not asserted.',
};
for (const [name, sources, checks] of [
  ['ethereum-blobspace', ETHEREUM_BLOBSPACE_SOURCES, ethereumChecks],
  ['uni-burn', UNI_BURN_SUPPLY_ACCOUNTING_SOURCES, uniChecks],
] as const) {
  fs.writeFileSync(path.join(root, `${name}-source-ledger.csv`), csv([
    ['source_id', 'label', 'url', 'original_draft_reference_date', 'release_verification_scope'],
    ...sources.map((source, index) => [index + 1, source.label, source.href, source.lastVerified,
      checks[index + 1] ?? 'Reference retained from the August research draft; not independently rechecked for this release.']),
  ]));
}
fs.writeFileSync(path.join(root, 'uni-burn-claim-ledger.csv'), csv([
  ['claim', 'status', 'value_or_rule', 'evidence', 'limitation'],
  ['Treasury transfer', 'primary_source_mechanics', '100000000 UNI to nonzero dead address', 'Proposal 93 executed call', 'Use transaction timestamp from original draft for elapsed days'],
  ['Recognized burn balance', 'reported_historical_input', '108025224 UNI', 'August 5 2026 18:15 UTC tracker figure retained in draft', 'Original response and address-level export not preserved'],
  ['Recurring-and-other residual', 'derived', '8025224 UNI', 'Recognized balance minus 100000000', 'Not exclusively classified protocol-fee burn'],
  ['Recent window', 'reported_historical_input', '3928000 UNI / 90 days', 'August 1 cited wallet analysis retained in draft', 'Underlying wallet export not preserved or independently reclassified'],
  ['Contract transfer accounting', 'primary_source_mechanics', 'Transfer to nonzero dead address does not decrement totalSupply', 'Official Uni.sol', 'Not a fresh totalSupply RPC read'],
  ['Dead-address-adjusted quantity', 'derived', '891974776 UNI', '1000000000 minus reported recognized balance', 'Neither circulating supply nor market float'],
  ['Growth schedule', 'primary_source_mechanics', '20000000 UNI/year from existing treasury', 'Proposal 93: 40000000 two-year authorization', 'Distribution schedule is not evidence of market sales'],
  ['Annualized cases', 'derived', '13.260M and 15.930M UNI/year', 'Exact elapsed time and 365/90 transformations', 'Historical-input scenarios, not forecasts'],
  ['Sell-through', 'assumption', '0 through 100 percent', 'Sensitivity model', 'Actual recipient disposition not established'],
  ['New mint', 'assumption', '0 in base model', 'Separate from treasury distribution', 'No fresh onchain event census in this release'],
  ['Break-even', 'derived', 'B / 20000000; approximately 66.3%-79.7%', 'Conditional no-new-mint equation', 'Not measured net exchange buying or a price forecast'],
  ['Later v4 activation', 'not_verified', 'Excluded as explanation of burn-window difference', 'UI did not expose execution receipt', 'Do not infer activation from a proposal reference'],
]));
console.log('Exported both source ledgers and the UNI claim ledger.');
