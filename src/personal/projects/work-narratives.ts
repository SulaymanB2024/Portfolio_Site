import type { WorkDocument } from './work-document'

/** Sources and editorial decisions: .cache/work-material-20261004/source-products.md and source-engineering.md. */
export const workNarratives: Record<string, WorkDocument> = {
  internshipdeadlines: {
    role: 'Founder & product lead',
    deck: 'Internship search, source records, and application planning.',
    summary: 'I built the recruiting data pipeline and student product, from listing classification and search ranking to saved applications and preparation guides.',
    chapters: [
      {
        id: 'question',
        label: 'Source pipeline',
        title: 'Building the recruiting record',
        artifact: 'system',
        body: [
          'A job can appear on an employer site, a job board, and a program page with different titles or dates. My pipeline validates the source, standardizes the company, role, and location, and merges duplicates only when the evidence identifies the same job. The original employer link remains attached.',
          'The directory distinguishes historical coverage from verified availability. A recent check needs employer evidence and a valid application state; visiting a listing does not renew that check. First seen, program term, application deadline, and verification time are stored as separate facts.'
        ],
        table: {
          caption: 'Information retained with a recruiting record',
          columns: ['Field', 'Treatment'],
          rows: [
            ['Identity', 'Match the employer and job before merging records from different sources.'],
            ['Availability', 'Keep known closures, unconfirmed availability, and recently verified roles distinct.'],
            ['Dates', 'Retain the employer’s stated deadline; leave it unknown when the source supplies none.'],
            ['Provenance', 'Carry the source URL and check time through the listing and employer handoff.']
          ]
        },
        links: [
          {
            label: 'Listing methodology',
            href: 'https://internshipdeadlines.com/methodology/',
            description: 'Identity, dates, availability changes, and the evidence needed to verify a role.'
          }
        ]
      },
      {
        id: 'system',
        label: 'Search',
        title: 'From a query to an employer posting',
        body: [
          'I use local language models for role classification and query understanding alongside search ranking. Role, employer, and location fields support discovery; the result sends applicants back to the employer’s requirements and application.',
          'NVIDIA’s Spring 2027 Developer and Performance Technology listing shows how this information fits together: the program term and Santa Clara location are recorded, the employer link is retained, and the deadline remains unconfirmed. Its dated history is evidence of a past check, rather than a claim that it is open today.'
        ],
        links: [
          {
            label: 'Inspect the NVIDIA listing',
            href: 'https://internshipdeadlines.com/internships/nvidia-e63b7085/nvidia-spring-2027-internships-developer-and-performance-technology-a24959af/',
            description: 'A public record with program details, source link, check history, and preparation actions.'
          }
        ]
      },
      {
        id: 'practice',
        label: 'Saved applications',
        title: 'A separate record for the applicant',
        body: [
          'The student’s plan keeps a stage, next action, personal target date, and notes beside the saved role. A target date belongs to the applicant; it does not overwrite the employer’s deadline. A closed posting can still have a useful saved record.',
          'Plans are stored in the browser with a backup and import path. Employer research and preparation stay connected to the application, so a shortlist can carry the work of applying rather than simply accumulating bookmarks.'
        ],
        table: {
          caption: 'Two states that must remain independent',
          columns: ['Employer record', 'Student plan'],
          rows: [
            ['Open, closed, or unconfirmed availability', 'The applicant’s own preparation or application stage'],
            ['Published application deadline', 'A personal target and the next action'],
            ['Source evidence and verification history', 'Private notes retained with the saved role']
          ]
        },
        links: [{ label: 'My plan', href: 'https://internshipdeadlines.com/saved/', description: 'The product’s saved-role and application-planning view.' }]
      },
      {
        id: 'preparation',
        label: 'Preparation',
        title: 'A résumé guide with a worked exercise',
        body: [
          'The first-internship résumé guide takes a posting’s tasks and maps them to evidence from coursework, employment, and projects. It covers choosing material for one page, writing a specific bullet, and checking the final file and its links.',
          'A worked exercise gives four fictional experiences to choose from, then explains which evidence fits the role. The downloadable worksheet lets a student repeat the process with their own experience.'
        ],
        links: [
          {
            label: 'First-internship résumé guide',
            href: 'https://internshipdeadlines.com/guides/first-internship-resume',
            description: 'The task-to-evidence exercise, worked answer, and submission checks.'
          },
          {
            label: 'Résumé worksheet',
            href: 'https://internshipdeadlines.com/guides/first-internship-resume/worksheet.md',
            description: 'A Markdown worksheet for selecting evidence and drafting a role-specific bullet.'
          }
        ]
      }
    ],
    links: [{ label: 'Explore InternshipDeadlines', href: 'https://internshipdeadlines.com/', description: 'The live search, employer records, and preparation product.' }]
  },
  sapien: {
    role: 'Growth Manager',
    deck: 'Research content, buyer guides, and product positioning.',
    summary:
      'I built Sapien’s SEO and content function: editorial, category pages, ad creative, recorded explainers, and sales material for a simulated-audience research platform.',
    chapters: [
      {
        id: 'question',
        label: 'Content function',
        title: 'Articles, category pages, and sales material',
        artifact: 'system',
        note: 'Study: Sapien Team. Portfolio contribution: content, research review, and growth.',
        body: [
          'My work connects pricing, concept testing, messaging, and consumer-research use cases to the material a buyer needs to evaluate the product. I develop articles and category pages for search, then use the research in explainers, creative briefs, ad concepts, and sales material.',
          'A services comparison needs to distinguish the research question, evidence source, delivery model, and deliverable. A pricing buyer needs tested offers and assumptions; a concept buyer needs comparative responses and a revision brief. Those distinctions give the content its structure.'
        ],
        table: {
          caption: 'How a buyer’s question changes the material',
          columns: ['Research job', 'Material to explain'],
          rows: [
            ['Pricing', 'The audience, offer variants, choice question, and modeled response at each price.'],
            ['Concept testing', 'Comparable alternatives, segment reactions, and what to revise in the concept.'],
            ['Selecting a research service', 'Evidence source, delivery process, outputs, and pricing basis.']
          ]
        },
        links: [
          {
            label: 'Market research services guide',
            href: 'https://www.asksapien.ai/blog/market-research-services',
            description: 'Published Sapien material on research jobs, delivery models, and what a buyer receives.'
          }
        ]
      },
      {
        id: 'system',
        label: 'Pricing example',
        title: 'Two prices, with the audience held fixed',
        body: [
          'The published AI-tools guide includes a matched comparison of 256GB offers at $1,999 and $1,599. Within each cohort, the same assigned profiles considered both prices. Keeping the audience fixed makes the change in modeled qualification legible.',
          'Qualification rises from 5.52% to 11.27% in the core cohort and from 6.18% to 12.50% in the expansion cohort. The lower offer also gives up $400 per sale. The result alone cannot select the better margin: that needs costs, realized demand, and the rest of the offer.'
        ]
      },
      {
        id: 'practice',
        label: 'Research review',
        title: 'Reviewing validation studies',
        body: [
          'I review academic work, validation studies, and competing methods before turning a result into an article or product explanation. The useful details are often the scenario, comparison group, and unit of measurement, rather than a single accuracy headline.',
          'Sapien’s 14-study comparison includes a useful miss: without nearby fast charging, simulated EV choice in the used-car case was 53.1%, against approximately 34.7% reconstructed from the human choice model. The new-versus-used direction reverses. Reporting that scenario explains more than averaging it into a general success rate.',
          'A match to qualitative findings also has a different meaning from matching population prevalence. I keep those distinctions in the explanation so a reader can assess where a method fits their own research question.'
        ],
        links: [
          {
            label: 'The 14 human-study comparisons',
            href: 'https://www.asksapien.ai/blog/how-accurate-are-synthetic-users',
            description: 'Sapien Team’s study-by-study explanation, including the EV scenario and mismatches.'
          }
        ]
      },
      {
        id: 'published',
        label: 'Published material',
        title: 'Selected buyer guides',
        body: [
          'The buyer guides compare tools and providers by research job, evidence source, deliverables, and pricing. The services guide explains how to scope a purchase; the category guides help a reader build a shortlist for that scope.',
          'Selected publications from the content function I built, published under the Sapien Team byline:'
        ],
        links: [
          {
            label: '13 AI market-research tools',
            href: 'https://www.asksapien.ai/blog/ai-market-research-tools',
            description: 'Tool comparison and the matched pricing study shown above.'
          },
          {
            label: '17 market-research companies',
            href: 'https://www.asksapien.ai/blog/market-research-companies',
            description: 'Custom studies, retail measurement, market intelligence, and specialist research providers.'
          },
          {
            label: '15 consumer-insights providers',
            href: 'https://www.asksapien.ai/blog/consumer-insights-companies',
            description: 'Audience research, purchase evidence, retail measurement, and how the deliverables differ.'
          },
          {
            label: '13 qualitative-research companies',
            href: 'https://www.asksapien.ai/blog/qualitative-research-companies',
            description: 'Audience, interview method, evidence, and outputs for qualitative study buyers.'
          }
        ]
      }
    ],
    links: [{ label: 'Sapien', href: 'https://www.asksapien.ai/', description: 'The research platform, audience workflows, and published use cases.' }]
  },
  'investing-markets': {
    role: 'Finance student · Texas Venture Labs · Independent research',
    deck: 'Infrastructure rights, software ownership, and AI power economics.',
    summary:
      'At UT Austin and Texas Venture Labs, I work with market research, pricing, financial models, and unit economics. My independent studies retain the documents, assumptions, and calculations behind each conclusion.',
    chapters: [
      {
        id: 'question',
        label: 'Toll-road ownership',
        title: 'Mapping the claims on a Texas toll road',
        body: [
          'My toll-road investigation separates public title, concession rights, equity, creditors, operating responsibilities, and billing. North Tarrant Express illustrates the distinction: sponsor percentages describe the concession business, while the highway land remains publicly owned. The concession’s revenue rights extend through 2061.',
          'SH 288 provides a different event. When Texas terminated its private concession, the proceeds first repaid outstanding debt, including the federal TIFIA loan; the remainder was available to shareholders. The ownership table records nine facilities or systems with their operator, revenue claimant, term, and supporting sources.'
        ],
        artifact: 'system',
        links: [
          {
            label: 'Who owns Texas toll roads?',
            href: '#/writing/who-owns-texas-toll-roads',
            description: 'The full investigation into title, concessions, bankruptcy, and termination rights.'
          },
          {
            label: 'Ownership table · CSV',
            href: './research/texas-toll-road-ownership-2026.csv',
            description: 'Nine facility or system records with evidence dates and source IDs; July 23, 2026.',
            download: true
          }
        ]
      },
      {
        id: 'system',
        label: 'Cash-flow model',
        title: 'Choosing a comparable revenue basis',
        body: [
          'The follow-up model separates five questions: recovery of original cost, road debt, system debt, legal tolling authority, and private concession rights. Paying down one balance does not answer all five.',
          'The system table retains seven systems, but the per-$100 comparison includes only CTTS and Grand Parkway on the same TxDOT FY2025 basis. Other systems have different revenue categories or reconciliation limits. Keeping those exclusions visible avoids a precise-looking comparison built from incompatible denominators.'
        ],
        table: {
          caption: 'The five tests in the tolling analysis',
          columns: ['Question', 'Evidence required'],
          rows: [
            ['Original cost recovered?', 'Comparable capital cost and the relevant revenue period.'],
            ['Road or system debt retired?', 'Debt balances and the facilities pledged to each obligation.'],
            ['Tolls legally required or permitted?', 'Statutory authority, bond terms, and concession rights.']
          ],
          note: 'Research cutoff: September 2, 2026. Road and system debt are separate tests, as are public tolling authority and private rights.'
        },
        links: [
          {
            label: 'System comparison · CSV',
            href: './research/texas-toll-roads-stay-tolled-system-comparison.csv',
            description: 'Revenue basis, operating costs, debt service, coverage, and inclusion decisions.',
            download: true
          },
          {
            label: 'Cash-flow methodology',
            href: './research/texas-toll-roads-stay-tolled-methodology.md',
            description: 'Definitions, comparability rules, and exclusions for each system.',
            download: true
          }
        ]
      },
      {
        id: 'practice',
        label: 'Software buyouts',
        title: 'Classifying liquidity and control separately',
        body: [
          'I assembled 25 software transactions announced in 2020–2022, with $171.2 billion in mixed-definition headline deal values. Each record follows who still controls the company, rather than treating every IPO or financing event as a completed sponsor exit.',
          'At the August 17, 2026 cutoff, 23 remained in continuing sponsor ownership, one had transferred to creditors, and one had partial liquidity. None met the stated clean control-exit definition. That classification is not an estimate of losses or returns: the public record does not support a cohort IRR, and most deals were only three to five years into ownership.'
        ],
        links: [
          {
            label: 'Software-buyout study',
            href: './research/software-buyout-cohort-2020-2022.html',
            description: 'The web edition with transaction context, definitions, and the counter-case.'
          },
          {
            label: '25-deal cohort · CSV',
            href: './research/software-buyout-cohort-2020-2022.csv',
            description: 'Transaction values, ownership events, outcome classifications, and sources.',
            download: true
          },
          {
            label: 'Classification methodology',
            href: './research/software-buyout-cohort-methodology.md',
            description: 'Control-exit definition, classification order, and limits on inferred returns.',
            download: true
          }
        ]
      },
      {
        id: 'power',
        label: 'AI infrastructure',
        title: 'Turning a gigawatt claim into a model',
        body: [
          'The AI-power model distinguishes a grid request, facility capacity, IT capacity, rack nameplate, installed fleet, and utilization. Each boundary changes what a “1 GW” announcement can support.',
          'The workbook converts facility power through PUE and external IT overhead to 142 kW, 72-GPU rack equivalents. At PUE 1.145 and 10% overhead, one nominal facility gigawatt gives about 402,574 B300 GPU equivalents. Changing utilization changes annual equivalent compute hours; it does not establish a paid workload or a verified installed fleet.'
        ],
        links: [
          {
            label: 'AI-power workbook · XLSX',
            href: './research/the-ai-megawatt-model.xlsx',
            description: 'Six worksheets with formulas, boundary calculations, and scenario assumptions.',
            download: true
          },
          {
            label: 'Sensitivity table · CSV',
            href: './research/the-ai-megawatt-sensitivity.csv',
            description: 'PUE and overhead scenarios with explicit capacity and utilization outputs.',
            download: true
          },
          {
            label: 'Power-model methodology',
            href: './research/the-ai-megawatt-methodology.md',
            description: 'Definitions, formulas, source transformations, and evidence cutoff of August 16, 2026.',
            download: true
          }
        ]
      }
    ],
    links: [
      {
        label: 'Appian durability memo',
        href: './research/appian-enterprise-software-durability-memo.pdf',
        description: 'A five-page software-business memo with base and downside assumptions.',
        download: true
      }
    ]
  },
  miscellaneous: {
    role: 'Geometry, shaders & interaction',
    deck: 'The construction and rendering of this site’s sculptures.',
    summary:
      'I built the work objects as GLB assets, developed their ink-and-paper shading, and connected their moving parts to a renderer that suspends work when it is out of view.',
    chapters: [
      {
        id: 'question',
        label: 'Geometry',
        title: 'Modeling a surface that survives halftone',
        body: [
          'The sculptures are built offline from modeled relief, cut openings, rounded shoulders, bearings, and separate moving parts. Bevels give lighting a wide enough transition to survive a binary threshold; recessed channels keep details readable at phone scale.',
          'The forms include an engraved calendar and an escapement, portrait busts arranged around prototypes, a relief globe within armillary rails, and five meshing gears under open shrouds. Geometry is merged by material and part, centered, and exported with named pivots. The browser loads these files rather than rebuilding them every frame.'
        ],
        links: [
          {
            label: 'Experimental mechanism · GLB',
            href: './portfolio-models/work-miscellaneous.glb',
            description: 'The sculpture above, including its local transforms, materials, and articulated parts.',
            download: true
          }
        ]
      },
      {
        id: 'system',
        label: 'Dithering',
        title: 'From lit surfaces to ink coverage',
        body: [
          'The portfolio shader converts the lit model to luminance, applies an ordered Bayer threshold, and maps coverage to ink and paper. Linear-light weights and display conversion keep material tone consistent; filtered transparent edges are handled before thresholding to avoid a dark fringe.',
          'The dot pattern stays in a fixed grid. Subtle modulation changes the threshold continuously instead of assigning new random grain every frame. On Work, CSS-sized cells travel with the object’s viewport region, keeping grain and sculpture aligned while the page scrolls.'
        ],
        artifact: 'system',
        links: [{ label: 'Original shader study', href: './shader.html', description: 'The preserved independent study of lighting and ordered dithering.' }]
      },
      {
        id: 'practice',
        label: 'Articulation',
        title: 'Motion from shafts and tooth counts',
        body: [
          'Moving nodes retain names, pivots, unit axes, and shaft metadata in their GLB extras. The five-gear mechanism uses a shared module and twenty-degree pressure angle. Its 36-tooth driver turns at 0.46 radians per second; neighboring ratios follow the tooth counts and reverse across each mesh.',
          'The renderer advances shafts from accumulated visible playback time. Pause, a hidden tab, or an offscreen object stops that clock, preserving orientation on return. Direct interaction gets an immediate frame; automatic movement targets 30 fps, with settled paths for reduced motion.'
        ],
        table: {
          caption: 'Motion data retained with the object',
          columns: ['Exported data', 'Runtime use'],
          rows: [
            ['Local pivot and axis', 'Rotate the part around its modeled shaft, preserving the assembly.'],
            ['Signed drive ratio', 'Angle = visible time × driver speed × ratio.'],
            ['Interactive name and extras', 'Keep selected parts and animation behavior intact through compression.']
          ]
        }
      },
      {
        id: 'assets',
        label: 'Asset pipeline',
        title: 'Smaller derivatives, retained geometry',
        body: [
          'The helmet and Contact derivatives reduce texture dimensions while retaining their compressed geometry bytes. The globe uses its existing compressed variant. Work and About models use Draco attribute quantization at 18/14/16 bits for positions, normals, and UVs, without reducing triangle counts.',
          'The optimizer records hashes, byte sizes, hierarchy, materials, texture dimensions, and validator results. It checks names and animation extras before and after decoding. Loading uses one local Draco worker per renderer, abortable fetches, and disposal of results that arrive after their view has been replaced.'
        ],
        table: {
          caption: 'Portfolio derivatives · decimal MB',
          columns: ['Asset', 'Source → portfolio', 'Triangles retained'],
          rows: [
            ['Helmet', '2.26 → 1.76 MB', '299,992'],
            ['Contact sculpture', '6.55 → 2.61 MB', '119,244'],
            ['Globe', '1.64 → 0.41 MB', '78,130'],
            ['Gear mechanism', '2.95 → 0.54 MB', '99,490']
          ],
          note: 'Sizes are from the asset manifest. Draco quantizes attributes; unchanged triangle counts do not mean bit-identical geometry.'
        }
      },
      {
        id: 'rendering',
        label: 'Frame budget',
        title: 'Rendering work only when it is needed',
        body: [
          'Work caps its backing buffer at 1.35 million pixels and a DPR of 1.25. The runtime watches rendered-frame cadence separately from CPU submission time. After two two-second windows averaging over 40 ms, automatic motion reduces backing dimensions to 80%; eight seconds below 35 ms restores them.',
          'Resolution changes wait during dragging and route handoffs. Offscreen suspension removes recurring frame work, while direct input can request a fresh frame. Development telemetry updates at most once per 750 ms so observing the renderer does not become another animation loop.'
        ]
      }
    ],
    links: [{ label: 'Atlas', href: '#/work/atlas', description: 'Another implementation study: crawl evidence, versioned artifacts, and reviewable findings.' }]
  }
}
