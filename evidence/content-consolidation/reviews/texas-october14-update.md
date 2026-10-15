> Independent review retained from this task. Findings describe the reviewed frozen edition and that lane’s scope. The root’s final dispositions and full-site/browser checks are in [the QA report](../QA.md). Scratch paths in executed-command evidence are local diagnostics, not published source records.

# Final Texas integration audit — October 14

Read-only comparison of root's final integration against frozen #99 `c538389219be8fa33baf2c396d4b459ddf458c1d`. Scope: two updated native articles/claim ledgers, the Texas topic metadata/links, PUBLISHING, AUTHOR_BRIEF, publication receipt chains and the new October 14 public projection.

**Final result: PASS; no remaining defect found in this scoped final state.** Root corrected the one preservation regression identified during this pass. Product files were not written by this reviewer.

## Supported narrow update

The actual October 14 [Waymo announcement](https://support.google.com/waymo/answer/18765688), read during this same review session, supports open San Antonio and SAT admission without an invitation. The native introductions, access tables, SAT explanation, FAQ answers, source notes and ledger claims now describe that dated admission change. They continue to require actual supported requests rather than imply every route, immediate vehicle supply, unrestricted account eligibility, organizational payment, comparative safety or an entire itinerary.

The altered source-area lastVerified dates are genuinely targeted to October 14. All other existing source lastVerified dates remain identical to #99, including the October 12 airport-location and freeway guidance and October 13 NTSB observation. The native evidence boundaries, table captions, ledger updateScope and Texas hub introductions distinguish this targeted update from the older source checks. Ledger priorClaim values preserve the historical assertions privately; they do not appear in the public projection. No remaining current San Antonio gradual-admission/pending-invitation assertion was found in the updated reader-facing materials. The retained mentions either explain superseded guidance or concern freeway access separately.

The public projection contains 18 articles and 194 dated source references. Exactly the two intended projection entries differ from the reviewed October 13 edition; the other sixteen source articles and their ledgers are byte-identical to #99. The scenario/calculation objects remain unchanged.

## Preservation regression caught and closed

The first integrated edit replaced the unaffected `texas-access.paragraphs[0]` in the Waymo article with generic opening prose, dropping the accepted Austin Uber products/preference/accepted-offer/fallback instructions. Root was notified and restored the original paragraph. **The final paragraph now equals frozen #99 exactly.** The separate freeway source item and airport-section freeway paragraph also equal frozen #99 exactly, preserving the limited/gradual rollout distinction.

## Docs, receipt chains and historical artifacts

- The Zoox author brief at line 53 now specifies the 704/512 throughput example and explicitly excludes a derived per-trip cost. The stale $17.05/$23.44 instruction is gone. **TEXAS-DOC-1 is closed.** The actual Zoox article/model were already correct and remain unchanged.
- `docs/texas-business/library.json` selects edition 2026-10-14 and `public/research/texas-research-library-2026-10-14.json`. PUBLISHING names that exact file and explains preserved historical editions/individual source dates. Both Texas topic download links target the new edition and their introductions identify the targeted update.
- Both changed articles preserve original publication date, slug, path, author and aliases. All original receipt fields and prior updates remain unchanged; each receipt appends one October 14 update with the dated primary evidence. Every previous/current hash link was verified and each chain's head equals the actual final native bytes.
- Final Waymo article SHA256: `8f8f997a186342f22b765bc4c8d0aaf600a6f335476d549f96599a9b713018bc`.
- Final robotaxi-map article SHA256: `b81737881f6775543ca3df378a6304924e78e8b76415a6f7fbb4e93c8457d9c3`.
- The October 12, initial October 13 and reviewed October 13 downloads, original final-acceptance record, Python companion and executed notebook remain byte-identical to #99. No historical receipt was replaced to imply a new review date.

## Checks run and actual outputs

`python3 .cache/content-qa/texas-review/integration-audit.py` — PASS. Assertions cover exact Austin restoration, freeway preservation, all other sixteen article/ledger identities, both append-only receipt chains/head hashes, source-date scope, source-anchor resolution, unchanged scenarios, private-field exclusion, historical downloads/calculations, Zoox brief correction and edition links. Saved output: `integration-audit.json`.

`node tools/texas-editorial.mjs check` — PASS after the final Austin restoration and bundle regeneration. Actual output: `Texas library verified: 18 articles, 194 dated source references, claims-only public projection and unchanged publication identities.` Saved output: `integration-final-texas-check.log`.

`node --experimental-strip-types --test tests/texas-editorial.test.ts` — 5/5 passed during this final-integration pass. The subsequent restoration changed article prose and regenerated its receipt/projection; no tested helper code changed. The final projection/receipt check above was repeated after that restoration. Saved output: `integration-texas-tests.log`.

This scoped addendum relies on the completed full 18-body/224-claim and 15-model audit in `report.md`, with its explicit primary-source access limits. The new dated access statement has actual primary support; no new measured performance, fare, current fleet/authorization census or route availability was established. Rendered UI, broad build/release gates and submission remain root responsibilities.
