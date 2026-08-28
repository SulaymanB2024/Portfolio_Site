import type { ArticleSection } from './articleModels';

export const THE_AI_MEGAWATT_OUTPUT_SECTIONS: ArticleSection[] = [
  {
        id: 'installed-vs-utilized',
        title: 'Installed accelerators are not annual compute output',
        paragraphs: [
          'The reference fleet contains 402,574 installed B300 GPUs. If they remain powered on for a full year, that is 3.53 billion powered-on GPU-hours. This number still says nothing about computational intensity. It counts time, not work.',
          'LBNL defines utilization as average computational intensity relative to maximum. Its reference assumption is 80% for training, with a 75%–85% uncertainty range, and 20% for inference by 2030 with a 30% high-inference case. Applying those values to the same installed fleet produces 2.64–3.00 billion training full-load-equivalent GPU-hours, 0.705 billion at 20% inference utilization, and 1.06 billion at 30%. [S8]',
          'Full-load-equivalent GPU-hours are still not useful-work units. They do not capture model architecture, precision, sparsity, communication overhead, checkpointing, failed jobs, software quality, thermal throttling, or generation-to-generation performance. They are best used to prevent an installed-fleet number from being mistaken for an annual output number.',
          'They are even farther from revenue. Paid utilization depends on reservations, service-level obligations, internal workloads, customer mix, pricing, credits, and whether idle capacity is economically necessary to meet peak demand. Public engineering documentation does not answer those questions.',
        ],
        table: {
          caption: 'Reference installed fleet under LBNL computational-utilization scenarios',
          columns: ['Workload case', 'Computational utilization', 'FLE B300 GPU-hours/year', 'Average rated-power fraction at 20% idle'],
          rows: [
            ['Training low', '75%', '2.645B', '80.0%'],
            ['Training reference', '80%', '2.821B', '84.0%'],
            ['Training high', '85%', '2.998B', '88.0%'],
            ['Inference reference', '20%', '0.705B', '36.0%'],
            ['Inference high', '30%', '1.058B', '44.0%'],
          ],
        },
        figures: [
          {
            src: '/images/research/the-ai-megawatt-utilization.svg',
            alt: 'Bar chart showing full-load-equivalent B300 GPU-hours under training and inference utilization scenarios for the same installed fleet.',
            label: 'Installed fleet versus annual computational utilization',
            caption: 'Calculated from 402,574 installed B300 GPUs and 8,760 hours/year. Utilization scenarios come from LBNL; they are not revenue-utilization estimates.',
            width: 2200,
            height: 1232,
          },
        ],
      },
  {
        id: 'disclosure-standard',
        title: 'A minimum disclosure standard for every AI-capacity claim',
        paragraphs: [
          'A credible capacity statement should be reconstructable without private interpretation. The first field is the electrical boundary. The second is status. The third is time. Hardware, facility, and utilization fields follow. Without them, comparisons reward whoever uses the most expansive boundary.',
          'For investors, the distinction changes capex intensity, commissioning risk, time to revenue, depreciation, and the meaning of utilization. For utilities, it changes load forecasts and reserve requirements. For operators, it changes whether a constraint sits in grid interconnection, mechanical plant, white space, power delivery, network fabric, storage, or workload scheduling.',
          'The proposed standard is intentionally strict. A company can disclose ranges or mark fields unknown. It should not compress requested power, energized power, installed IT, and active compute into one promotional number.',
        ],
        bullets: [
          'Boundary: interconnection, facility, IT, rack, or average draw.',
          'Status: announced, requested, firm, energized, commissioned, occupied, or active.',
          'Time basis: current, phase date, full-build date, peak, or annual average.',
          'Redundancy and margin: what is reserved and why.',
          'PUE: value, period, load point, and measurement boundary.',
          'IT allocation: server/rack, network, storage, support, and management shares.',
          'Hardware: accelerator generation, rack architecture, quantity, and mix.',
          'Utilization: computational, electrical, scheduling, and paid utilization kept separate.',
          'Staging: phase-by-phase energized and occupied capacity.',
          'Source: utility filing, one-line, vendor order, asset register, or management estimate.',
        ],
      },
  {
        id: 'limits',
        title: 'What the model does not know',
        paragraphs: [
          'The model does not estimate a specific hyperscaler campus. It does not know the project’s firm interconnection, topology, PUE curve, cooling design, storage system, network port population, spares, power caps, rack-loading distribution, accelerator mix, occupancy, workload schedule, or customer bookings.',
          'The 142 kW rack figure is a nameplate input. A site can install more racks than the nameplate arithmetic suggests if average or capped draw is lower, provided its electrical and thermal design permits that operating policy. The reverse can also occur when redundancy, stranded capacity, maintenance, or topology prevents full occupancy.',
          'The external-IT range is not measured at gigawatt scale. It is bounded by a documented eight-SU switch reconstruction, an optics comparator, architecture requirements, and an external GB200-era sense-check. Storage and support infrastructure remain unquantified.',
          'The final uncertainty is semantic. A “GPU” is not a stable performance unit across generations, precisions, models, software stacks, and workloads. This article therefore reports physical B300 units and B300 GPU-hours only. It does not convert them into H100-equivalents, FLOP/s, tokens, training runs, or revenue.',
        ],
      }
];
