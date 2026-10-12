# Recruiter and role openings — October 12, 2026

## Authorized result and protected surface

The user approved spreadsheet-driven openings and now explicitly requests public release, activation of the existing spreadsheet automation, and proof that a spreadsheet edit automatically changes the same public recruiter URL. Each recruiter/role pairing gets a stable page link, with optional greeting, specific role, selected job priorities, truthful personal evidence and a company-interest reason. Preserve the original LandingSequence and four existing headline rows, canonical résumé/site destinations, later chapters, header and portfolio. No recruiter outreach send is authorized.

Root owns the integration in `codex/recruiter-landing-20261009`, initial HEAD `0fb80537df3841a367eadff567aeec77b8d86e0d`, common launch owner. Existing October 11 copy changes and dirty documentation/evidence remain preserved. Reused context: `docs/recruiter-landing.md` October 12 proposal, actual workbook headers/samples, launch README, existing registry/store/signed sync, original opening contract, public personal facts and current project routes/policies. The active independent SEO task owns search optimization; do not overlap it.

## Worksheet contract

Existing workbook: `1WDUFFDYgXqCXGwglBDpr2qB6pUtVpcJw04lMMQohuFA`. New tab: **Personalized Openings**. Columns A–V:

1. Page ID (generated stable UUID)
2. Company
3. Relationship ID
4. Greeting name (optional)
5. App Key
6. Role / team
7. Job description URL
8. Job description excerpt
9. Priority 1
10. Evidence 1
11. Priority 2
12. Evidence 2
13. Why company
14. Opening line 1
15. Opening line 2
16. Opening line 3
17. Opening line 4
18. Copy status (`Draft`, `Ready`, `Paused`)
19. Personalized URL (generated; verified server URL only)
20. Sync status (generated)
21. Last synced (generated)
22. Local preview URL (prepared locally; not a live-publication claim)

Names, role context and priorities guide editorial preparation, backed by the existing public facts. Four rows are the final explicit copy authority, so different pairs can have individually written messages. Rows can be literal copy or authored templates using `{{greeting}}`, `{{company}}`, `{{role}}`, `{{priority_1}}`, `{{priority_2}}`, `{{evidence_1}}`, `{{evidence_2}}`, `{{why_company}}`. Resolve input tokens before hashing, validation and sync; a missing greeting becomes empty, other missing/unknown tokens block Ready. Unfinished Draft templates can send blank rows while retaining the previous published version. Only resolved copy reaches the server/page. Dedicated JD requirements need a real source/excerpt; absent JD inputs must remain absent, with clearly labeled role-based draft examples. No invented requirement, name, vacancy or employer relationship. Source/operational fields stay in the workbook; only selected reviewed opening text crosses into the page.

## Integration contract

- Keep the current company endpoint and A–F contract intact. Extend the authenticated `/api/outreach-sync` handler to accept `sheet: 'Personalized Openings'` and `openings` rows `{recordId, company, status, lines}`. Only `Ready` with four valid lines publishes/updates a variant; `Paused` explicitly disables its page. `Draft` stays unpublished and does not silently remove a previous stable link. Omission retains existing published records.
- Reuse the same registry, writer, signing secret and existing automation owner; no new account or credentials. The version-1 registry gains optional `openings` entries keyed by stable UUID, containing company slug, four public lines and enabled state. Legacy snapshots and existing company URLs continue working. Reconciliation adds known company labels through the existing deterministic company mapping.
- Personalized path: `/for/<page-id>`. It is validated against the exact server-approved document ID and selected copy; arbitrary names, skills and query parameters cannot establish context. Readable HTML and mounted React use the same four rows. Emit selected-copy metadata only; do not bundle the whole contact list or JD source fields.
- Keep `Résumé` `/resume` and `Explore the site` `/`; canonical standard navigation must leave the personalized arrival. Preserve company-only analytics and never send recipient names, roles, JD text or page IDs as new analytics fields.
- Local preview reads prepared, ignored fixtures from a source-owned private evidence folder. Build a legible local review index with direct real page links. Local fixture success is not a production sync receipt.

## Verification and remaining boundary

Required: genuine named/role sample, missing-name and missing-JD cases, two variants at one company, independently edited copy, stable links after reorder, Ready/Draft/Paused behavior, escaped text, legacy registry compatibility, signed batch replay/tampering, unknown UUID 404, unchanged standard continuation/destinations and original desktop/phone geometry/art. Run affected tests, typechecks, build and release gate; inspect actual rendered samples and show them inline. Preserve the previous browser-policy rejection; do not circumvent it through another surface or low-level browser technology.

The user separately requested five new top-level work tasks: financial-analysis article, strategy-planning article, mobile article-cover repair, recruiter-flow QA and general project-page improvement. They share an isolated content worktree with separate file lanes and no shared catalog edits; root owns eventual integration. Creation is authorized; their execution/results must be reported separately from this feature's local completion.

Current state: authorized local preparation is complete. Registry/signed sync, named UUID routes, readable HTML and mounted React, private-source projection, importer/template substitution and the Apps Script adapter are implemented. The exact final native A1:V6 readback matches all 132 cells; all five examples remain Draft with public URLs and Last synced blank. Header notes, native status validation and the frozen header are verified. Luna passed all five final messages and confirmed exact template resolution. Root inspected every final example on desktop and phone, then shortened the IBM and Microsoft program rows where phone text was too small. Detailed final evidence and the live-activation boundary follow below.

Dispatched user-requested tasks (all host local, project New Personal Site): financial analysis `01a13147-1656-73b2-9497-3381c0ff66f0`; strategy planning `01a13147-1d8f-7441-82ec-47147a419609`; mobile covers `01a13147-c39b-7c63-83dc-106032b12e05`; recruiter QA `01a13147-cb93-7813-b192-149957fc4cf3`; project improvements `01a13147-d4c1-7b53-b70b-aa941b490cd6`. Their isolated source is `/Users/sulaymanbowles/Projects/CodexWork/sulayman-site-content-20261012`, branch `codex/site-content-20261012`, verified common launch owner and starting HEAD above. `docs/delegated-work-20261012.md` defines exclusive lanes; articles do not edit shared catalog/route files. An active separate task “Optimize personal site SEO” was inspected read-only and kept outside these lanes. Root has accepted only the separately authorized QA error-recovery patch described in the latest section; the other peer deliverables remain independent.

## Ready runtime checkpoint — October 12

The five final examples have completed Luna review. Root applied Luna’s IBM phrasing fix and made the Microsoft business-program interest specific to Azure/Microsoft 365, grounded in their official current product pages. Exact authoring file hash: `85da8dd6f7e20585735bbaaddd80417adc41623e624a0fff07d201c64dc39667`. All source rows stay Draft; only the ignored local preview payload promotes complete rows for display.

The final source builds successfully after the QA-driven mobile action repair: visible opening links now remain usable during their reading hold while retaining the original opacity, position, sculpture and animation. The 404 Return home action now uses canonical `/`. Affected integration, adapter, compatibility, analytics, copy/import and action checks pass: 63/63. Release verification on the host’s Node 22.14 requires `--experimental-strip-types`; the plain npm script’s runtime failure did not indicate a product defect. Final release check and actual browser checks follow.

Root-owned preview is running at `http://127.0.0.1:4193` from this worktree; build identity is `.cache/recruiter-personalization-20261012/build-identity.json`. This is the new feature build, distinct from QA’s previous October 11 baseline. `/for/<id>` uses the same company mapping and server document helper as the public route. Independent QA can resume against this exact runtime and file. Worksheet helper has saved all five Draft rows with public URLs blank; one final Microsoft wording update/readback remains pending. No remote script deployment or public release occurred.

## Final prepared handoff — October 12

The user can review five actual recruiter/role variants, edit the native control tab, and retain one stable URL per pairing. Eight supported source tokens resolve before validation, hashing and signed sync. The source fields remain private; only the selected four public rows reach the page. Historical personal facts remain literal in templates (the Coinbase challenge cannot be renamed by editing Company). Names are optional, and missing JD material stays blank. Local JSON/CSV preparation now enforces the same sourced-priority/evidence presence checks as the Apps Script Ready gate. The preparation command performs no network writes.

Final authoring SHA-256: `c166893a0437aa919634c0ca4e12bb29df74a6fd61562fbaf556edf25978d9cb`. Luna's final exact-file/template receipt is `.cache/recruiter-personalization-20261012/luna-approved-review.json`. The actual native worksheet is [Personalized Openings](https://docs.google.com/spreadsheets/d/1WDUFFDYgXqCXGwglBDpr2qB6pUtVpcJw04lMMQohuFA/edit?gid=490964940#gid=490964940), tab ID `490964940`. Root independently compared all 132 cells and inspected the final native template capture. Five rows are Draft; generated public URLs and sync timestamps are blank. Adapter code and the idempotent sheet-only installer are prepared locally; existing company-sheet automation ownership and credentials are preserved.

Verification: 64/64 affected checks, final typechecks, full production build and release/search gates pass. The host's Node 22.14 release invocation uses `node --experimental-strip-types tools/verify-release.mjs`; the ordinary npm script lacks that flag on this runtime. Actual local HTTP checks pass for all 85 documents: exact public copy and unchanged normalized readable continuation, noindex, private selected context, unknown/malformed UUID 404, HEAD and query isolation. A valid trailing slash is normalized by the application; deployment's existing trailingSlash:false policy remains. These receipts are in `focused-final.log`, `build-final.log`, `release-final.log`, `http-receipt.json`, `build-identity.json` and `root-sheet-verification.json` in the ignored evidence folder.

Actual in-app-browser inspection covers all five final pages at 1440×900 and 390×844, each with four unwrapped rows, loaded original helmet, no horizontal overflow and both 44px action areas. Phone quiet text is now 11.75–15.71px; large rows are 23.99–32.05px. Root verified Résumé reaches `/resume` from the formerly dead 147.5px scroll state, Explore reaches `/` with no opening metadata, the original InternshipDeadlines chapter follows a named opening, and unknown-UUID Return home reaches canonical `/`. SULLY-DESIGN receipt: composition/brand, subject/craft, typography, mobile, interaction/loading and content readiness pass for these prepared examples. Motion/CSS/artwork remain the existing design; no sustained-cadence benchmark or controlled route-failure rendering is claimed.

[Completed local review](http://127.0.0.1:4193/recruiter-personalization-review/index.html) contains five current desktop/phone capture pairs, direct real-page links, and all 80 company introductions. Root inspected its actual loaded captures and no-error console at the normal 1280px viewport. The earlier interactive gallery depended on iframes and inline executable JavaScript that the existing CSP prohibits; it was corrected to static HTML with direct links, without weakening headers. The former `/recruiter-review-20261011/index.html` URL also serves the corrected review. Gallery files are reproducible local artifacts, rebuilt by `.cache/recruiter-personalization-20261012/build-review.py`; a future product build removes them from dist and the builder can restore them.

Retention: root-owned loopback preview `127.0.0.1:4193`, PID `94531`, execution session `76964`, this source worktree, retained for user review. The in-app review tab is the delivered browser output; temporary viewport overrides are reset. The helper's native sheet tab is also retained as a deliverable. No unrelated tab, process, dirty source or shared worktree was cleaned up. The prior internal-error-page browser rejection was preserved; inspection used the new authorized HTTP feature pages in the established in-app surface.

Remaining release boundary: this code has not been pushed, merged or deployed, and the remote Apps Script project/triggers have not changed. The native Draft links are local previews; no live sync/publication receipt exists. After separately authorized release of this reviewed implementation and activation of the prepared adapter under the existing owner, review each pairing and mark Ready; real public GET verification must succeed before a generated URL is marked Live. Prior production-merge approval rejection remains preserved, with no alternative release path attempted.

The five requested top-level tasks were created and started. Financial-analysis draft delivery and project-page local handoff are available in their own records; strategy, mobile-cover and QA work have subsequent active work. The independent QA task received this ready feature runtime, preserving its older baseline. No peer product deliverables are accepted or integrated by this handoff; read their latest human corrections before integration. Their isolated owner and lanes remain `docs/delegated-work-20261012.md` in the content worktree.

## QA recovery patch integrated — October 12

The human-authorized QA handoff supplied local commit `5febdb2af7d08caf1980bb54a8e7801f013bfda7`. Root read the actual two-file diff, report, final compatibility receipt and desktop/phone captures, confirmed the pre-change RouteBoundary matched its tested base, and applied exactly `RouteBoundary.tsx` plus `route-recovery.css` to this worktree without staging, committing or disturbing existing feature work. Current hashes match the reviewed candidate: boundary `22a1048c13c78bf9b644dcd02ed78346f05235e21929375209c8d084de38980c`, stylesheet `bb8905c445158e861b3d5ef4506c81e37d3a9d180c2d0072707223170ebe3e5f`.

Recovery now reuses the standard action styling and canonical `/work` or `/` destinations. Its five-line CSS applies only to a failed full-width homepage route. The normal recruiter layout, four rows, renderer and artwork are unchanged. Full rebuilt product and both typechecks pass, followed by release/search gates and renewed 85-document exact-copy/continuation readback. The static review was regenerated after the build.

Root independently exercised real one-shot RecruiterLandingPage and WorkCollection chunk failures through an owned loopback proxy in the established in-app browser. Actual default desktop and 390/320px phone error states have 14px controls, 44px hit heights, 20px phone gutters and no overflow. Keyboard Reload restores the named arrival and loaded helmet; Explore work reaches canonical `/work` with selected-opening metadata absent; Go home reaches `/` and the standard original heading. A final healthy named opening on the actual 4193 preview confirms the original composition and `/resume`/`/` destinations remain. Root's first capture was correctly relabeled desktop after observing its actual 1280px width, then phone views were measured after setting the override on the new tab.

Evidence: `.cache/recruiter-personalization-20261012/recovery-integration.json`, `build-recovery.log`, `release-recovery.log`, renewed `http-receipt.json`, `root-recovery-fault.jsonl` and `rendered/recovery-*`. SULLY-DESIGN recovery receipt: brand/composition, typography, phone, interaction/loading and content readiness pass; no artwork change. The owned 4195 test proxy and test tab are closed, temporary viewport reset, and the main 4193 review remains retained. No reply to the sending task, remote push/merge, publication or Apps Script deployment occurred. This resolves the observed route-error defects; generic nested-path local-preview HTTP200 remains the distinct recorded preview limitation.

## Authorized live release in progress — October 12

The user's latest explicit instruction requests live public pages and automatic spreadsheet-edit proof. This supersedes the previous preparation-only release boundary. Root verified current production `95e9ee6a2ce86d5e7b04c9f842fd5752ac192cc5` (`dpl_Ff6wPHkt6C4XUn65Kn9dxnY8tCQL`) and integrated its accepted typography, public copy, navigation, SEO and action tracking into the recruiter branch. Independent read-only review caught and root fixed UUID cold-entry route preparation. Standard homepage introduction/actions remain; customized arrivals select four approved rows and the two canonical destinations. The company copy hash remains `9ca5e1f…`.

Merged-source tests pass 660/660, bot observer 19/19, typechecks/build and release/search gates pass. Rebuilt actual local HTTP readback passes all 85 pages with exact copy and identical standard continuation. Root inspected the integrated named opening at default desktop and 390px phone: original loaded helmet, four unwrapped rows, no horizontal overflow and 44px destination links. Local npm advisory endpoint failed without an advisory result; the remote CI advisory gate must independently pass before release. No dependency change occurred.

The existing bound script/owner and exactly two Head triggers have been independently observed. A helper owns only remote Code.gs and native Personalized Openings writes; root owns Git/Vercel release and public inspection. Source rows remain Draft until verified production supports UUID pages. Required final evidence: public provider commit/alias, exact public page/copy readback and actual browser views, then a truthful native greeting edit and restoration automatically reflected at the unchanged public UUID URL without redeploy/manual reconcile. Public sheet URL/status/timestamp must be verified by real GET; private source fields and credentials remain protected. No recruiter outreach is authorized.
