import type { WorkDocument } from './work-document'
import { workContributions } from './work-curation.ts'
import { caseNarratives } from './case-narratives.ts'

/** Sources and editorial decisions: .cache/work-material-20261004/source-products.md and source-engineering.md. */
export const workNarratives: Record<string, WorkDocument> = {
  chegg: {
    role: workContributions.chegg.role,
    deck: 'Student research, recruiting data and AI product work at Internships.com.',
    summary: workContributions.chegg.summary,
    chapters: [
      {
        id: 'question',
        label: 'Student journey',
        title: 'From finding a role to preparing for it',
        body: [
          'My product work at Internships.com connects student research with internship-search workflows and AI tools. The work spans the search itself and the preparation that follows: helping a student find a relevant role and practice for the conversation ahead.'
        ]
      },
      {
        id: 'system',
        label: 'Recruiting data',
        title: 'The data behind the search',
        body: [
          'I build and validate recruiting-data pipelines with product, engineering, data science and marketing teams. This work connects the data a search experience depends on with the people designing, building and evaluating the product.'
        ]
      },
      {
        id: 'practice',
        label: 'AI interviewer',
        title: 'Practice that carries the conversation forward',
        body: [
          'I built an AI mock interviewer with adaptive follow-ups, conversation memory, failure recovery and feedback. These parts support a continuing exchange: the interviewer can follow an answer, retain context and give the student feedback on their practice.'
        ]
      },
      {
        id: 'growth',
        label: 'Growth research',
        title: 'Learning from public conversations',
        body: [
          'I analyze public social posts with embeddings and machine learning to inform student-focused growth experiments. That research sits alongside product development and student research in my Product Intern, Growth role at Chegg.'
        ]
      }
    ],
    links: [
      { label: 'Role & contributions', href: '#/resume', description: 'My public résumé records the Chegg role and the contributions described here.' },
      { label: 'Internships.com', href: 'https://www.internships.com/', description: 'The public product associated with this work; internal implementation is not published here.' },
      { label: 'Chegg', href: 'https://www.chegg.com/', description: 'The company and its public student products.' }
    ]
  },
  void: {
    role: workContributions.void.role,
    deck: 'Growth strategy, financial analysis, AI workflows and web systems.',
    summary: workContributions.void.summary,
    chapters: [
      {
        id: 'question',
        label: 'The consultancy',
        title: 'A business question, then a working system',
        body: [
          'Through VOID, I develop operating plans and software tools for small businesses and technology clients. The work brings together growth strategy, financial analysis, AI workflows and web systems. Atlas gives a concrete view of the engineering: a website audit workflow whose findings stay connected to the evidence behind them.'
        ]
      },
      {
        id: 'system',
        label: 'Atlas engineering',
        title: 'Atlas: a local evidence console',
        body: [
          ...caseNarratives.atlas.chapters[0].body,
          ...caseNarratives.atlas.chapters[1].body
        ],
        links: caseNarratives.atlas.chapters[1].links
      },
      { ...caseNarratives.atlas.chapters[2], id: 'practice' },
      { ...caseNarratives.atlas.chapters[3], id: 'gaps' },
      { ...caseNarratives.atlas.chapters[4], id: 'sources' }
    ],
    links: [
      { label: 'VOID', href: 'https://www.void-agency.com/', description: 'The consultancy’s public site.' },
      { label: 'Role & contributions', href: '#/resume', description: 'My public résumé records VOID’s scope and the Atlas build.' }
    ]
  },
  internshipdeadlines: {
    role: 'Founder & product lead',
    deck: 'AI-assisted internship search and application planning.',
    summary: workContributions.internshipdeadlines.summary,
    chapters: [
      {
        id: 'question',
        label: 'Source pipeline',
        title: 'A record that keeps its sources',
        body: [
          'My pipeline standardizes employer, role, and location, then merges duplicates only when the source identifies the same job. It keeps employer-posted dates, first detection, deadlines, and verification time separate. Historical coverage and recently verified availability remain different states.'
        ],
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
        title: 'From search to the employer',
        body: [
          'I integrated local language models for role classification and query understanding alongside search ranking. Each result keeps its employer reference and verification time, so applicants can check the original posting before applying.'
        ],
        links: [
          {
            label: 'How source checks work',
            href: 'https://internshipdeadlines.com/methodology/',
            description: 'The published rules for employer verification, missing deadlines, and availability changes.'
          }
        ]
      },
      {
        id: 'practice',
        label: 'Saved applications',
        title: 'The applicant’s own plan',
        body: [
          'A saved application keeps a stage, next action, personal target date, and notes beside the employer record. Those plans stay in the browser, with backup and import. A personal target never overwrites an employer deadline, and a closed listing does not erase the student’s work.'
        ],
        links: [{ label: 'My plan', href: 'https://internshipdeadlines.com/saved/', description: 'The product’s saved-role and application-planning view.' }]
      },
      {
        id: 'preparation',
        label: 'Preparation',
        title: 'A guide with a worked exercise',
        body: [
          'The first-internship résumé guide maps a posting’s tasks to evidence from coursework, jobs, and projects. Four fictional experiences form a worked selection exercise; a downloadable worksheet lets students repeat it with their own material. At the October 12, 2026 check, public guides and the planning page were available while listing search was temporarily unavailable.'
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
    summary: workContributions.sapien.summary,
    chapters: [
      {
        id: 'question',
        label: 'Content function',
        title: 'Content organized around the buyer’s decision',
        body: [
          'As Growth Manager, I built the SEO and content function around research jobs: pricing, concept testing, messaging, and choosing a service. Articles and category pages became inputs for recorded explainers, creative briefs, ads, and sales material. The work connected the research question to evidence and a usable deliverable.'
        ],
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
        title: 'A pricing result a buyer can inspect',
        body: [
          'The published AI-tools guide compares two 256GB offers using the same assigned profiles at both prices within each cohort. The lower price raises modeled qualification but gives up $400 per sale; selecting a better margin still requires costs and realized demand.'
        ],
        table: {
          caption: 'Matched pricing example · modeled qualification',
          columns: ['Cohort / profiles', '$1,999', '$1,599'],
          rows: [
            ['Core / 2,103', '5.52%', '11.27%'],
            ['Expansion / 2,897', '6.18%', '12.50%']
          ],
          note: 'Same profiles at both prices within each cohort. Published Sapien Team study; modeled responses, not observed purchases.'
        }
      },
      {
        id: 'practice',
        label: 'Research review',
        title: 'Reporting the useful misses',
        body: [
          'I review validation studies at the scenario and measurement level. In Sapien’s 14-study comparison, the used-car scenario without nearby fast charging gives 53.1% simulated EV choice against about 34.7% reconstructed from the human model, reversing the new-versus-used direction. That mismatch belongs in the explanation, rather than an average accuracy headline.'
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
        title: 'Published work',
        body: [
          'Selected buyer guides from the content function I built, published under the Sapien Team byline. They compare research jobs, evidence sources, delivery models, and what a buyer receives.'
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
    summary: 'I build financial models and source-led research on infrastructure, software ownership, and AI power economics, alongside work at Texas Venture Labs.',
    chapters: [
      {
        id: 'question',
        label: 'Toll-road ownership',
        title: 'Who holds the rights to a road?',
        body: [
          'My nine-record ownership table separates public title from concession rights, equity, creditors, operations, and billing. North Tarrant Express’s sponsor percentages describe the concession business; highway land remains public and revenue rights extend through 2061. SH 288’s termination proceeds repaid debt, including TIFIA, before the remainder became available to shareholders.'
        ],
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
        title: 'A comparable cash-flow denominator',
        body: [
          'The tolling model separates original-cost recovery, road debt, system debt, legal tolling authority, and private concession rights. Its seven-system table retains differing revenue definitions; the per-$100 comparison includes only CTTS and Grand Parkway on the same TxDOT FY2025 basis. The methodology records the exclusions at the September 2, 2026 cutoff.'
        ],
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
        title: 'Liquidity is different from a control exit',
        body: [
          'I assembled 25 software transactions announced in 2020–2022, totaling $171.2 billion in mixed-definition headline values. At the August 17, 2026 cutoff, 23 remained sponsor-owned, one had transferred to creditors, and one had partial liquidity. None met the stated clean control-exit definition; those classifications do not establish losses, returns, or a cohort IRR.'
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
        title: 'What a gigawatt can support',
        body: [
          'The workbook converts facility power through PUE and external IT overhead into 142 kW, 72-GPU rack equivalents. At PUE 1.145 and 10% overhead, one nominal facility gigawatt gives about 402,574 B300 GPU equivalents. Utilization changes equivalent compute hours, while installed fleet and paid workload remain separate claims. The methodology retains the August 16, 2026 evidence cutoff.'
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
    summary: 'I modeled original project sculptures and built the GLB pipeline and ink-and-paper renderer used across this site.',
    chapters: [
      {
        id: 'question',
        label: 'Geometry',
        title: 'Geometry made for ink',
        body: [
          'I built seven original sculptures from folded membranes, pierced castings, branching filaments and layered relief. Each gives its project a distinct physical abstraction. Broad surfaces, real openings and fitted edge details keep the forms legible in ink. Geometry is centered and merged by material before export, so the browser loads the actual GLB instead of constructing a lookalike.'
        ],
        links: [
          {
            label: 'Unfinished Continuum · GLB',
            href: './portfolio-models/work-miscellaneous.glb',
            description: 'The sculpture above, including its local transforms, materials, and articulated parts.',
            download: true
          }
        ]
      },
      {
        id: 'system',
        label: 'Dithering',
        title: 'One material language',
        body: [
          'The project shader uses the same engraved dot screen as the opening helmet, with continuous highlights inside the pattern. Beveled edges and recessed channels remain visible as the object turns. Source geometry carries the form; shading supplies the shared print character.'
        ],
        links: [{ label: 'Original shader study', href: './shader.html', description: 'The preserved independent study of lighting and ordered dithering.' }]
      },
      {
        id: 'practice',
        label: 'Articulation',
        title: 'Parts keep their own structure',
        body: [
          'Named parts retain local pivots, unit axes and motion records through export. The seated three-blade rotor in Unfinished Continuum turns at 0.12 radians per second, with its carved inlays attached to the same physical parent. The renderer fits the complete swept geometry, and reduced motion settles the rotor while keeping manual rotation available. These construction records remain inspectable in the downloadable GLB.'
        ],
      },
      {
        id: 'assets',
        label: 'Asset pipeline',
        title: 'Retained detail, smaller delivery',
        body: [
          'Project sculptures are exported directly as compressed GLBs with their authored hierarchy and motion records. The optimizer checks byte sizes, geometry, materials, texture dimensions and validation results. The retained scan and globe comparison shows delivery reductions without treating equal triangle counts as bit-identical geometry.'
        ],
        table: {
          caption: 'Portfolio derivatives · decimal MB',
          columns: ['Asset', 'Source → portfolio', 'Triangles retained'],
          rows: [
            ['Helmet', '2.26 → 1.76 MB', '299,992'],
            ['Contact sculpture', '6.55 → 2.61 MB', '119,244'],
            ['Globe', '1.64 → 0.41 MB', '78,130']
          ],
          note: 'Sizes are from the asset manifest. Draco quantizes attributes; unchanged triangle counts do not mean bit-identical geometry.'
        }
      },
      {
        id: 'rendering',
        label: 'Frame budget',
        title: 'A bounded rendering clock',
        body: [
          'Detailed project views use a capped render target with smoother edges and retained highlight range. The renderer tracks visible frame cadence and suspends offscreen work. Drag a project sculpture or use the arrow keys to rotate it; double-click or press Home to reset. The artwork stays blank while its GLB loads. Reduced motion settles automatic animation while keeping direct rotation available.'
        ]
      }
    ],
    links: [{ label: 'Atlas', href: '#/work/atlas', description: 'Another implementation study: crawl evidence, versioned artifacts, and reviewable findings.' }]
  }
}
