"""Author the native Chegg case study; financial inputs remain source-registered."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITE = ROOT.parents[1]
SLUG = "chegg-cash-flow-turnaround"

article = {'slug': 'chegg-cash-flow-turnaround',
 'path': '/research/financial-systems/chegg-cash-flow-turnaround',
 'title': 'Why I Believe in Chegg’s Reinvention',
 'displayTitle': 'Why I believe in Chegg’s reinvention.',
 'seoTitle': 'Why I Believe in Chegg: A Financial Turnaround Case Study',
 'seoDescription': 'Sulayman Bowles makes a positive case for Chegg’s reinvention through debt repayment, cash '
                   'generation and skilling growth, with a reproducible financial model.',
 'category': 'FINANCIAL SYSTEMS',
 'subtitle': 'A financial case for Chegg’s next chapter: a debt-free balance sheet, stronger free cash flow, and '
             'a disciplined path from academic learning to workforce skilling.',
 'searchTerms': ['Chegg',
                 'CHGG',
                 'cash flow',
                 'turnaround',
                 'skilling',
                 'financial analysis',
                 'AI disruption',
                 'capital allocation'],
 'date': '2026-10-12',
 'dateModified': '2026-10-12',
 'readTime': '17 MIN',
 'kind': 'research',
 'image': '/images/social/chegg-cash-flow-turnaround.png',
 'author': 'Sulayman Bowles',
 'openingPresentation': 'integrated',
 'ledeMarkdown': 'I believe in Chegg. I believe it can build a stronger future around learning and workforce '
                 'skilling, and the financial progress it has already made gives that conviction a concrete '
                 'foundation. Chegg retired its remaining convertible debt in September 2026 and generated '
                 'positive operating cash flow through the first half of a difficult restructuring. '
                 '[S4](#source-s4) [S2](#source-s2)\n'
                 '\n'
                 'The opportunity is to turn that financial reset into a business that can invest in its own '
                 'growth. Lower capital spending improved free cash flow, and skilling offers a direction for the '
                 'next stage. This case explains why I am optimistic, what the reported numbers establish, and '
                 'how disciplined reinvestment can support the transition. The cash bridge and stress test make '
                 'the conditions behind my belief visible.',
 'thesis': 'I believe in Chegg’s reinvention: its financial reset provides a foundation for a more focused '
           'learning and skilling business.',
 'evidenceBoundary': 'Public-source case study as of October 12, 2026. Latest financial statements used cover '
                     'June 30, 2026; September 1 debt repayment is a subsequent event. Reported results, '
                     'management guidance and author scenarios are labeled separately. The approximately $38m '
                     'reference is June cash and investments pro forma for repayment, not an observed September '
                     'or October cash balance. Product contribution margins, quarterly paths and reserve floor '
                     'are illustrative. This is operating and financial analysis, not a stock valuation or a '
                     'claim of work performed for Chegg.',
 'assumptions': ['USD millions unless stated; cash-capex and free-cash-flow definitions follow Chegg’s '
                 'reconciliations.',
                 'The four-quarter model is an explicit stress test with no seasonality, not a calendar forecast.',
                 'Contribution margins, cost trajectories and reserve floor are author assumptions; no '
                 'double-counted debt repayment or severance.'],
 'sections': [{'id': 'business-reset',
               'title': 'A foundation for Chegg’s next chapter',
               'paragraphs': ['Chegg’s original economic attraction was straightforward: students paid for help '
                              'with academic work, and a large digital library could serve many customers without '
                              'rebuilding each answer from scratch. That model depended on students reaching '
                              'Chegg and deciding its paid service was more useful than the alternatives. A '
                              'change in either step could weaken the economics before it appeared as a cash '
                              'shortage.',
                              'The company’s annual filing identifies generative AI and changes in Google’s '
                              'search experience as competitive and traffic risks. That is Chegg’s assessment; '
                              'the filing does not isolate how much of the decline came from each cause. The '
                              'accounting evidence establishes a contraction, not a clean causal experiment about '
                              'AI. [S1](#source-s1)',
                              'Management’s response gives the reinvention a clear direction: manage Academic '
                              'Services for cash and build Chegg Skilling as the growth engine. I see a practical '
                              'logic in that plan. A continuing academic business can contribute funding while '
                              'the company develops a different customer base and distribution model. The '
                              'strategy connects the business Chegg already operates with the one it wants to '
                              'grow. [S5](#source-s5)',
                              'My positive case starts with that capacity to adapt. Chegg can pursue a smaller, '
                              'more focused business with a cost base suited to its current scale. It does not '
                              'have to recreate every feature of its earlier model to create value. The '
                              'opportunity is to convert its learning experience into offerings that customers '
                              'continue to pay for, while using the financial reset to give those offerings room '
                              'to develop.'],
               'table': {'caption': 'The revenue base from which Chegg is rebuilding',
                         'columns': ['Reported revenue · $m', 'FY2024', 'FY2025'],
                         'rows': [['Academic Services', '543.615', '308.254'],
                                  ['Chegg Skilling', '73.959', '68.654'],
                                  ['Total', '617.574', '376.908']],
                         'note': 'Full-year product-line revenue; do not compare these annual totals directly '
                                 'with the quarterly figures below. [S1](#source-s1)'}},
              {'id': 'replacement-scale',
               'title': 'Skilling gives the reinvention a direction',
               'paragraphs': ['Skilling is still a relatively small business, but it is moving in the right '
                              'direction. In the second-quarter comparison, it added $0.317m year over year while '
                              'Academic Services lost $53.588m. That gain replaced about 0.6% of the revenue '
                              'lost, and skilling’s share rose from 16.4% to 33.8%. The larger share partly '
                              'reflects the shrinking academic base; the absolute gain shows why building '
                              'skilling’s scale remains the next task. [S2](#source-s2)',
                              'The first quarter also provided an encouraging signal: Chegg reported 9% skilling '
                              'growth and discussed enterprise and channel partnerships. I see those distribution '
                              'relationships as a promising route to reach learners through organizations with '
                              'workforce-development needs. Their value will become clearer as access converts '
                              'into paying customers and renewals. [S6](#source-s6)',
                              'This is the part of the strategy I find most compelling. A learning company can '
                              'serve customers across academic support, workplace readiness and professional '
                              'development. Enterprise and channel distribution give Chegg ways to build demand '
                              'beyond the acquisition pattern of its legacy academic subscriptions. My belief is '
                              'that a more focused offer and a more varied customer base can support a healthier '
                              'business over time.',
                              'The scale comparison gives that conviction a useful measure. I would track '
                              'skilling’s absolute growth and the contribution it adds, alongside the academic '
                              'business’s cash generation. A successful pivot could produce a smaller, profitable '
                              'company before it restores growth in the consolidated revenue line. That is a '
                              'credible outcome to work toward, and it is the reason cash discipline matters '
                              'during the transition.'],
               'figures': [{'src': '/images/research/chegg-revenue-replacement.svg',
                            'label': '01 · Reported revenue',
                            'alt': 'Paired bars show Academic Services falling from $87.903m to $34.315m while '
                                   'Skilling rises from $17.217m to $17.534m between Q2 2025 and Q2 2026.',
                            'caption': 'Skilling’s share doubled chiefly because Academic Services contracted. '
                                       'The $0.317m skilling gain offset only 0.6% of the $53.588m academic '
                                       'revenue loss. Q2-to-Q2 comparison; USD millions. [S2](#source-s2)',
                            'width': 2160,
                            'height': 1260}]},
              {'id': 'free-cash-flow-bridge',
               'title': 'The financial reset is producing real cash',
               'paragraphs': ['Free cash flow is operating cash flow less cash purchases of property and '
                              'equipment under Chegg’s definition. The first-half comparison therefore has a '
                              'simple explanation: operating cash flow fell by $5.525m, while cash capital '
                              'expenditure fell by $11.195m. The second movement more than offset the first, '
                              'lifting free cash flow by $5.670m. [S2](#source-s2) [S3](#source-s3)',
                              'At the previous year’s cash capex, the same H1 2026 operating cash flow would have '
                              'produced negative $1.734m of free cash flow. That counterfactual isolates the '
                              'spending effect. It does not argue that Chegg should have repeated the earlier '
                              'budget, or that the lower budget was necessarily insufficient.',
                              'I view this as evidence that Chegg is taking practical steps to fit investment to '
                              'the business it is becoming. Removing spending that no longer serves the strategy '
                              'releases cash for more useful priorities. The improvement is real even though its '
                              'source is lower investment rather than higher operating cash flow. Sustaining it '
                              'will require a productive investment budget and improving customer economics.',
                              'Chegg capitalizes eligible content and internal-use software costs, so capital '
                              'spending is relevant to a digital product’s future capabilities, not just physical '
                              'equipment. The annual filing also describes asset abandonments as products were '
                              'streamlined. Those disclosures make the quality of the remaining investment a '
                              'useful question. They do not prove that lower capex will damage the product. '
                              '[S1](#source-s1)',
                              'This is why I see the cash improvement as a foundation for reinvention. A more '
                              'selective investment program can concentrate resources on retention, reliable '
                              'delivery and a competitive skilling offer. The next operating goal is to keep '
                              'generating cash at a level of spending that supports those capabilities. Chegg has '
                              'made progress on the financial side; the opportunity is to turn that progress into '
                              'stronger recurring demand.'],
               'table': {'caption': 'First-half comparison · USD millions',
                         'columns': ['Measure', 'H1 2025', 'H1 2026'],
                         'rows': [['Revenue', '226.507', '115.111'],
                                  ['Adjusted EBITDA', '42.375', '24.507'],
                                  ['Operating cash flow', '19.686', '14.161'],
                                  ['Cash capex', '15.895', '4.700'],
                                  ['Free cash flow', '3.791', '9.461']],
                         'note': 'Comparable six-month periods. EBITDA and free cash flow use Chegg’s non-GAAP '
                                 'definitions; cash capex is cash paid, not asset additions including accruals. '
                                 '[S2](#source-s2) [S3](#source-s3)'},
               'figures': [{'src': '/images/research/chegg-free-cash-flow-bridge.svg',
                            'label': '02 · Historical cash bridge',
                            'alt': 'A waterfall starts at H1 2025 free cash flow of $3.791m, subtracts a $5.525m '
                                   'operating cash-flow decline, adds $11.195m lower capex, and ends at H1 2026 '
                                   'free cash flow of $9.461m.',
                            'caption': 'The entire $5.670m improvement is explained by lower capex exceeding the '
                                       'decline in operating cash flow. This is an arithmetic bridge between '
                                       'reported periods, not a forecast. [S2](#source-s2)',
                            'width': 2160,
                            'height': 1260}]},
              {'id': 'earnings-to-cash',
               'title': 'Cash generation through the restructuring',
               'paragraphs': ['The cash-flow bridge strengthens my positive reading of the reset. Chegg generated '
                              'operating cash while absorbing restructuring-related payments, giving the '
                              'reinvention an internally generated source of funding. Adjusted EBITDA helps '
                              'explain operating earnings, while the cash-flow statement shows what remains after '
                              'payment timing and other adjustments.',
                              'Start the reconciliation from GAAP net loss. Adding depreciation, stock '
                              'compensation and the other cash-flow adjustments produces $26.644m before changes '
                              'in operating assets and liabilities. Those changes consume a net $12.483m, leaving '
                              '$14.161m of operating cash flow. Subtract $4.700m of cash capex to reach $9.461m '
                              'of free cash flow. Each step comes from the cash-flow statement. [S2](#source-s2)',
                              'Management separately disclosed $14.4m of first-half severance payments. '
                              'Generating positive operating cash flow while paying those costs is an encouraging '
                              'part of the financial repair. Those payments are already included in operating '
                              'cash flow and free cash flow, so they are not subtracted a second time. The net '
                              'working-capital movement also combines several releases and uses of cash rather '
                              'than one recurring collection problem. [S3](#source-s3)',
                              'A restructuring can therefore be understood as an investment in a more appropriate '
                              'cost base, with cash costs paid during the transition. I would assess progress '
                              'through both the recurring operating-cost target and the payments required to '
                              'reach it. Showing those steps together helps identify when the benefits of a '
                              'leaner operation begin to become available for reinvestment.',
                              'The model below therefore keeps an earnings proxy, cash conversion and capex as '
                              'separate steps. It does not attempt to forecast GAAP net income from incomplete '
                              'disclosures. That restraint makes the decision easier to inspect: readers can '
                              'change the assumed cost reductions or payment drag without pretending they have '
                              'reconstructed Chegg’s internal budget.'],
               'table': {'caption': 'H1 2026: net loss to free cash flow · USD millions',
                         'columns': ['Step', 'Cash-flow bridge'],
                         'rows': [['GAAP net loss', '−2.723'],
                                  ['Depreciation and amortization', '+26.992'],
                                  ['Share-based compensation', '+5.035'],
                                  ['Other reconciliation adjustments, net', '−2.660'],
                                  ['Before operating asset/liability changes', '26.644'],
                                  ['Operating asset/liability changes, net', '−12.483'],
                                  ['Operating cash flow', '14.161'],
                                  ['Cash capex', '−4.700'],
                                  ['Free cash flow', '9.461']],
                         'note': 'The downloadable model retains every operating asset/liability line and '
                                 'reconciles the grouped subtotal. Stock compensation is non-cash in this bridge; '
                                 'that does not make its dilution economically free. [S2](#source-s2)'}},
              {'id': 'liquidity-after-debt',
               'title': 'A debt-free platform for the next stage',
               'paragraphs': ['Chegg confirmed on September 1 that it had repaid the remaining convertible notes '
                              'at maturity and had no outstanding debt. The announcement described approximately '
                              '$38m of cash and investments after giving pro forma effect to the repayment '
                              'against June 30 balances. It did not report a September cash balance. '
                              '[S4](#source-s4)',
                              'I see debt retirement as a meaningful achievement. Removing the remaining '
                              'principal maturity lets management focus the next phase of capital allocation on '
                              'the operating business. For a consistent funding analysis, the June balance '
                              'sheet’s $72.314m of cash and short-term investments must be adjusted for that '
                              'payment. The disclosed pro forma amount gives a useful reference, while actual '
                              'later balances will incorporate subsequent operating and other cash movements.',
                              'The cash-flow statement supplies another useful distinction. Cash including '
                              'restricted balances rose during H1, partly because investments matured or were '
                              'sold. Turning an investment into cash increases the cash line without creating '
                              'operating value. The model reconciles the reported cash movement, but the decision '
                              'uses cash and investments together rather than counting investment maturities as a '
                              'second source of liquidity.',
                              'A debt-free balance sheet makes the transition easier to understand: the remaining '
                              'liquid resources support the business’s next operating choices. Because the '
                              'retired notes carried a zero coupon, the model assumes no recurring '
                              'coupon-interest saving from their repayment. Leases, taxes and other operating '
                              'liabilities remain. The positive change is the removal of the principal repayment '
                              'obligation, alongside a clearer view of the resources available for the next '
                              'stage.'],
               'table': {'caption': 'Three balances that answer different questions',
                         'columns': ['Definition', 'USD millions', 'Period / treatment'],
                         'rows': [['Cash and cash equivalents', '44.623', 'June 30; excludes restricted cash'],
                                  ['Short-term investments', '27.691', 'June 30'],
                                  ['Cash plus investments', '72.314', 'June 30; sum of the two lines'],
                                  ['Remaining note principal', '33.860', 'June 30; paid at September maturity'],
                                  ['Cash plus investments less principal', '38.454', 'Arithmetic pro forma only'],
                                  ['Reference liquidity used in the stress test',
                                   '38.000',
                                   'Rounded management pro forma disclosure']],
                         'note': 'The model uses $38m as a disclosed reference point, not observed current cash. '
                                 'Principal differs from the $33.845m net carrying value because of issuance '
                                 'costs. [S2](#source-s2) [S4](#source-s4)'}},
              {'id': 'replacement-growth',
               'title': 'Give the growth ambition a measurable target',
               'paragraphs': ['A replacement-growth calculation gives the strategy a measurable hurdle. Take the '
                              'Q2 2026 revenue base and suppose Academic Services loses another 30% in a '
                              'comparable quarter. That removes $10.2945m. With no change elsewhere, Skilling '
                              'would need 58.7% growth from its $17.534m base simply to hold total revenue flat. '
                              'This is an illustrative scenario, not management guidance.',
                              'Revenue is only the first hurdle. Suppose, for analysis, that each academic '
                              'revenue dollar contributes 70 cents before shared operating costs and each '
                              'skilling dollar contributes 45 cents. The skilling growth needed to preserve that '
                              'contribution becomes 91.3%. The required growth is higher because the replacement '
                              'revenue contributes less cash per dollar under these assumptions.',
                              'Chegg does not disclose the product-line contribution margins used here. The point '
                              'is the relationship, not a claim that these are its actual unit economics. If the '
                              'margins were equal, the revenue and contribution hurdles would coincide. A higher '
                              'skilling contribution margin lowers the hurdle; delivery-intensive growth raises '
                              'it. The downloadable inputs expose both margins so readers can test their own '
                              'view.',
                              'The formula turns the growth ambition into a planning target: required skilling '
                              'growth equals academic revenue lost divided by the skilling revenue base. For '
                              'contribution replacement, multiply by the academic-to-skilling contribution-margin '
                              'ratio. Cost reductions can close part of that gap. I see this as a useful '
                              'operating framework for the reinvention: grow the new business, improve its '
                              'contribution and align shared costs with the scale it can support.'],
               'table': {'caption': 'One-quarter replacement hurdle · illustrative',
                         'columns': ['Assumed academic decline',
                                     'Revenue lost · $m',
                                     'Skilling growth for flat revenue',
                                     'Skilling growth for flat contribution'],
                         'rows': [['20%', '6.863', '39.1%', '60.9%'],
                                  ['30%', '10.295', '58.7%', '91.3%'],
                                  ['40%', '13.726', '78.3%', '121.8%']],
                         'note': 'Q2 2026 reported revenue bases; author-assumed 70% academic / 45% skilling '
                                 'contribution margins. These are comparable-period decline scenarios, not '
                                 'sequential rates or forecasts. No fixed-cost changes are included.'}},
              {'id': 'stress-test-design',
               'title': 'Pressure-test the plan behind the conviction',
               'paragraphs': ['The next calculation asks how much room a reference balance buys when the '
                              'transition is slower or faster. It begins with $38m of liquidity and uses the '
                              'midpoints of management’s Q3 guidance—$43.5m of revenue and $1.5m of adjusted '
                              'EBITDA—as a calibration point. Management’s guidance remains an August outlook; '
                              'the model’s earnings proxy is not a reported EBITDA result. [S3](#source-s3)',
                              'I allocate that starting revenue to $26m of Academic Services and $17.5m of '
                              'Skilling, then apply the same assumed contribution margins. Implied shared cash '
                              'operating costs are $24.575m: $26m × 70% + $17.5m × 45% − $1.5m. That makes the '
                              'first quarter reconcile before the paths diverge.',
                              'Each quarter subtracts $0.5m for net cash-conversion effects and $3m of cash '
                              'capex. The first also pays $1.2m of assumed residual severance, roughly the June '
                              'restructuring liability. The timing and conversion drag are assumptions; the model '
                              'does not claim these are scheduled company payments. Debt repayment is already '
                              'reflected in the reference opening balance and is never deducted again.',
                              'The three paths then change academic revenue, skilling revenue and operating costs '
                              'sequentially. They deliberately omit seasonality, acquisition spending, fresh '
                              'borrowing, litigation recoveries, buybacks and changes in investment value. Model '
                              'quarters 1–4 are hypothetical steps, not estimates of specific reported quarters. '
                              'Repeating a weak-quarter calibration across a year is a stress choice, not a '
                              'normalized annual forecast.',
                              'Management expects meaningful second-half free cash flow, an encouraging outlook '
                              'for the transition. The deliberately pressured model can differ from that outlook '
                              'without disproving it. I use it to identify which operating choices preserve the '
                              'most flexibility if progress takes longer than hoped. It tests declared conditions '
                              'rather than assigning probabilities or predicting the actual cash balance Chegg '
                              'will report.'],
               'table': {'caption': 'Common inputs in the quarterly stress test',
                         'columns': ['Input', 'Assumed value / basis'],
                         'rows': [['Opening liquid resources', '$38.0m; June pro forma reference'],
                                  ['Reserve floor', '$25.0m; author’s illustrative policy'],
                                  ['Starting revenue', '$43.5m; Q3 guidance midpoint'],
                                  ['Starting earnings proxy', '$1.5m; EBITDA guidance midpoint'],
                                  ['Product contribution margins', 'Academic 70%; skilling 45%; assumptions'],
                                  ['Starting cash operating costs', '$24.575m; calibrated residual'],
                                  ['Cash capex', '$3.0m each quarter; assumption'],
                                  ['Other cash-conversion drag', '$0.5m each quarter; assumption'],
                                  ['Residual severance', '$1.2m in model quarter 1; timing assumed']],
                         'note': 'The $25m floor is not a disclosed covenant, company policy or insolvency '
                                 'threshold. All scenarios share the same opening balance and first-quarter '
                                 'calibration.'}},
              {'id': 'stress-test-results',
               'title': 'Operating discipline creates room to rebuild',
               'paragraphs': ['The managed-decline path shows why timely cost adjustment matters. Academic '
                              'revenue falls 10% sequentially after the starting quarter, skilling grows 5%, and '
                              'cash operating costs fall 3%. After four model quarters, liquidity is $25.4m, or '
                              '$0.4m above the illustrative floor, with a final-quarter earnings proxy '
                              'approximately at break-even. This path identifies the operating discipline needed '
                              'to preserve the reference cushion through a slower transition.',
                              'In the faster-erosion path, academic revenue falls 20% sequentially, skilling '
                              'grows 2%, and the same 3% cost reductions continue. Liquidity falls below the $25m '
                              'floor in model quarter 3 and ends at $15.0m. The result describes a policy breach, '
                              'not a prediction of insolvency. It says that waiting for the final cash balance to '
                              'deteriorate would leave less room to change the operating plan.',
                              'The stronger-transition path is the most encouraging comparison. It combines 10% '
                              'academic declines, 10% skilling growth and 5% cost reductions, ending with $30.8m '
                              'of liquidity. It still consumes $7.2m over the four quarters under the common cash '
                              'assumptions, but preserves substantially more room to keep building. The '
                              'comparison shows how better growth and a better-aligned cost base can work '
                              'together.',
                              'A useful sensitivity is direct and inspectable. Each extra $1m of quarterly capex '
                              'or conversion drag reduces four-quarter ending liquidity by $4m, holding the '
                              'operating paths fixed. An $8m incremental investment paid at the start reduces '
                              'every later balance by $8m. In the managed-decline path, that would turn a thin '
                              'cushion into a material reserve breach.',
                              'I see these comparisons as a way to support the recovery. They identify the '
                              'operating levers that leave Chegg with more capacity to invest, and the conditions '
                              'that call for a different pace of spending. Investment can create valuable future '
                              'contribution; testing its cash cost and payment schedule helps fund that '
                              'opportunity through a difficult period.'],
               'table': {'caption': 'Stress paths · rates apply after model quarter 1',
                         'columns': ['Path',
                                     'Academic decline / qtr',
                                     'Skilling growth / qtr',
                                     'Opex reduction / qtr',
                                     'Ending liquidity · $m'],
                         'rows': [['Managed decline', '10%', '5%', '3%', '25.4'],
                                  ['Faster erosion', '20%', '2%', '3%', '15.0'],
                                  ['Stronger transition', '10%', '10%', '5%', '30.8']],
                         'note': 'Illustrative sequential rates, distinct from the comparable-period '
                                 'replacement-growth table. Ending liquidity is a model output, not company '
                                 'guidance.'},
               'figures': [{'src': '/images/research/chegg-liquidity-stress-test.svg',
                            'label': '03 · Illustrative liquidity',
                            'alt': 'Three four-quarter stress paths start at the same $38m reference liquidity. '
                                   'Managed decline ends at $25.4m, faster erosion at $15.0m and stronger '
                                   'transition at $30.8m. The faster-erosion path crosses a $25m illustrative '
                                   'reserve floor in quarter 3.',
                            'caption': 'Operating discipline preserves more room for Chegg’s reinvention. These '
                                       'are hypothetical sequential paths from a June pro forma reference, '
                                       'without seasonality; they are not reported or forecast calendar-quarter '
                                       'cash balances. The $25m line is an author-assumed reserve policy.',
                            'width': 2160,
                            'height': 1296}]},
              {'id': 'capital-allocation',
               'title': 'Back the opportunity with disciplined investment',
               'paragraphs': ['My conclusion is to back Chegg’s reinvention with staged investment in skilling '
                              'and a clear transition reserve. I believe in the opportunity, and I want that '
                              'opportunity funded in a way the business can sustain. Debt retirement is '
                              'accomplished. The next step is to connect investment with evidence of demand, '
                              'recurring contribution and a payment schedule that protects operating flexibility.',
                              'The first investment milestone would test demand quality. Separate signed '
                              'partnerships, enrolled learners, recognized revenue and cash collected, then '
                              'follow renewal or repeat purchase by cohort. Enterprise distribution becomes more '
                              'valuable when it creates profitable incremental customers who continue to use the '
                              'service. That evidence would support the case for committing more capital to '
                              'growth.',
                              'The second milestone would test economics after delivery. Include instructors or '
                              'coaches, curriculum maintenance, platform costs, partner economics and customer '
                              'acquisition. A contribution target should match the service actually sold. '
                              'Improving those economics can make skilling more capable of financing its own '
                              'expansion and supporting the wider company.',
                              'The third milestone would test cash timing. Before releasing a new investment '
                              'tranche, update a near-term schedule with actual payments and collections, '
                              'preserve an explicit reserve and test weaker academic demand. The reserve should '
                              'reflect liabilities, volatility and committed spending. The $25m used here '
                              'illustrates that discipline; it is not a proposed company policy.',
                              'This approach gives Chegg room to pursue growth while retaining the flexibility to '
                              'adjust. Discretionary projects and share repurchases can be assessed against that '
                              'funding need. A securities-repurchase authorization establishes permission to '
                              'spend; the operating plan determines how much spending the transition can support. '
                              'I would prioritize allocations that strengthen the next business and its capacity '
                              'to generate cash.']},
              {'id': 'evidence-to-watch',
               'title': 'The milestones that would reinforce my belief',
               'paragraphs': ['I believe in Chegg’s ability to move into a stronger next chapter. The coming '
                              'results can show how that conviction is translating into operating progress. '
                              'Reported liquidity after the debt repayment will replace the pro forma reference; '
                              'recurring cash generation at a stable investment level will show how much '
                              'reinvestment the business can fund.',
                              'The milestones I would most like to see are growing absolute skilling '
                              'contribution, durable customer cohorts and positive operating cash flow as '
                              'restructuring payments settle. Together, those would demonstrate that Chegg is '
                              'becoming more capable of supporting its own growth. If progress takes longer, the '
                              'same measures can guide adjustments to the pace of investment without abandoning '
                              'the long-term opportunity.',
                              'Product-line contribution margins, cohort retention, partnership conversion, '
                              'normalized development needs and a current post-repayment cash balance remain '
                              'important areas to assess. The model keeps those gaps visible rather than '
                              'replacing them with undisclosed company estimates. My belief in Chegg is '
                              'compatible with looking for better evidence: each new observation can make the '
                              'investment and operating case more precise.'],
               'bullets': ['Replacement: compare skilling’s incremental dollars and contribution with the legacy '
                           'dollars and contribution lost.',
                           'Cash quality: separate operating improvement from capex reductions and temporary '
                           'releases of working capital.',
                           'Investment quality: connect spending to retention, reliable delivery and customer '
                           'payback.',
                           'Liquidity: use the newly reported post-repayment balance and actual commitments, not '
                           'the June pro forma amount.']}],
 'conclusion': {'title': 'Why I believe in Chegg’s next chapter',
                'content': 'I believe in Chegg. Debt retirement, cash generation through restructuring and the '
                           'emerging skilling business give me reasons to be optimistic about its reinvention. '
                           'The company has already made tangible progress in reshaping its financial position. '
                           'Its next opportunity is to turn that progress into a more focused learning business '
                           'with recurring demand, productive investment and a cost base its revenue can support. '
                           'The calculations in this case make that path measurable. My conviction is that Chegg '
                           'can build on the reset it has achieved and create a stronger business for the next '
                           'chapter of learning and work.'},
 'sources': [{'id': 'S1',
              'label': 'Chegg FY2025 Form 10-K',
              'href': 'https://www.sec.gov/Archives/edgar/data/1364954/000136495426000021/chgg-20251231.htm',
              'publisher': 'Chegg / SEC EDGAR',
              'date': 'Year ended 2025-12-31',
              'type': 'Audited annual filing',
              'note': 'FY2024/FY2025 product-line revenues; AI/search risk discussion; Note 2 capitalization '
                      'policy; Note 5 content and internal-use software assets.',
              'limitation': "Company risk attribution is not an independent estimate of AI's causal impact. Book "
                            'asset values do not measure future product quality.',
              'lastVerified': '2026-10-12'},
             {'id': 'S2',
              'label': 'Chegg Q2 2026 Form 10-Q',
              'href': 'https://www.sec.gov/Archives/edgar/data/1364954/000136495426000088/chgg-20260630.htm',
              'publisher': 'Chegg / SEC EDGAR',
              'date': '2026-08-06',
              'type': 'Unaudited quarterly filing',
              'note': 'Q2 product-line revenues; H1 operating cash flows and cash capex; cash/restricted-cash '
                      'reconciliation; June balance sheet; Note 6 debt principal and carrying amount.',
              'limitation': 'June 30 balances precede the September debt repayment. Product-line revenues are '
                            'disclosed; the contribution margins used in the model are not.',
              'lastVerified': '2026-10-12'},
             {'id': 'S3',
              'label': 'Chegg Q2 2026 earnings release',
              'href': 'https://investor.chegg.com/Press-Releases/press-release-details/2026/Chegg-Reports-Second-Quarter-2026-Earnings/default.aspx',
              'publisher': 'Chegg Investor Relations',
              'date': '2026-08-06',
              'type': 'Company results and outlook',
              'note': 'Adjusted EBITDA reconciliation; H1 free-cash-flow reconciliation; severance payments; '
                      'capital-spending target; Q3 revenue and EBITDA guidance.',
              'limitation': 'Adjusted EBITDA and free cash flow are company-defined non-GAAP measures. Q3 '
                            "guidance is management's August outlook, not a reported result or this article's "
                            'forecast.',
              'lastVerified': '2026-10-12'},
             {'id': 'S4',
              'label': 'Chegg announces full repayment of convertible notes',
              'href': 'https://investor.chegg.com/Press-Releases/press-release-details/2026/Chegg-Announces-Full-Repayment-of-Convertible-Notes/default.aspx',
              'publisher': 'Chegg Investor Relations',
              'date': '2026-09-01',
              'type': 'Subsequent-event disclosure',
              'note': 'Confirms repayment of remaining $33.9m principal and no outstanding debt. Approximately '
                      '$38m cash and investments is explicitly June 30 pro forma for repayment.',
              'limitation': 'Does not disclose actual September 1 or September 30 cash. Debt-free status does not '
                            'remove operating leases and other liabilities.',
              'lastVerified': '2026-10-12'},
             {'id': 'S5',
              'label': 'Chegg FY2025 earnings release',
              'href': 'https://investor.chegg.com/Press-Releases/press-release-details/2026/Chegg-Reports-2025-Fourth-Quarter-and-Full-Year-Financial-Results/default.aspx',
              'publisher': 'Chegg Investor Relations',
              'date': '2026-02-09',
              'type': 'Company results and strategy',
              'note': "Full-year revenue and adjusted EBITDA; management's two-business strategy: grow skilling "
                      'and manage legacy academic services for cash.',
              'limitation': 'Strategic targets are management expectations, not proof of future growth or '
                            'independent market sizing.',
              'lastVerified': '2026-10-12'},
             {'id': 'S6',
              'label': 'Chegg Q1 2026 earnings release',
              'href': 'https://investor.chegg.com/Press-Releases/press-release-details/2026/Chegg-Reports-First-Quarter-2026-Earnings/default.aspx',
              'publisher': 'Chegg Investor Relations',
              'date': '2026-05-06',
              'type': 'Company results and outlook',
              'note': 'Q1 revenue, skilling growth and profitability; discussion of enterprise/channel '
                      'partnerships and AI-focused offerings.',
              'limitation': 'Quarterly growth and named distribution partnerships do not establish long-run '
                            'retention, unit margins or customer acquisition payback.',
              'lastVerified': '2026-10-12'}],
 'resources': [{'label': 'Reproduce the Chegg case study',
                'href': '/downloads/research/chegg-cash-flow-model.zip',
                'description': 'Reported inputs and sources, standard-library Python model, quarterly CSVs, '
                               'executed notebook and figure code. Edit the assumptions and rerun the stress '
                               'paths.',
                'format': 'ZIP'}]}
article["sources"] = json.loads((ROOT/"source-register.json").read_text())["sources"]

def write_manuscript(article):
    lines=["# "+article["displayTitle"],"",article["subtitle"],"",article["ledeMarkdown"]]
    for s in article["sections"]:
        lines.extend(["","## "+s["title"],"",*sum(([p,""] for p in s.get("paragraphs",[])),[])])
        for b in s.get("bullets",[]): lines.append("- "+b)
        if "table" in s:
            t=s["table"]; lines.extend(["",t["caption"],"","| "+" | ".join(t["columns"])+" |","| "+" | ".join("---" for _ in t["columns"])+" |"])
            lines.extend("| "+" | ".join(r)+" |" for r in t["rows"]); lines.extend(["",t["note"]])
        for f in s.get("figures",[]): lines.extend(["",f["label"],"",f["caption"]])
    lines.extend(["","## "+article["conclusion"]["title"],"",article["conclusion"]["content"],"","## Scope", "",article["evidenceBoundary"],"","## Sources"])
    for s in article["sources"]: lines.extend(["",f"**{s['id']} · [{s['label']}]({s['href']})** — {s['date']}",s["note"],s["limitation"]])
    (ROOT/"manuscript.md").write_text("\n".join(lines)+"\n")


if __name__ == "__main__":
    path=SITE/"src/personal/editorial/data/articles"/(SLUG+".json")
    path.write_text(json.dumps(article,ensure_ascii=False,indent=2)+"\n")
    write_manuscript(article)
    print(path)
