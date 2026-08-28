import type { ArticleSection } from './articleModels';

export const THE_AI_MEGAWATT_CAPACITY_SECTIONS: ArticleSection[] = [
  {
        id: 'capacity-dictionary',
        title: 'One gigawatt names several different assets',
        paragraphs: [
          'The same unit appears in utility filings, construction announcements, hardware plans, and investor models, but the numerator changes. An interconnection request is a right or request at the grid boundary. Facility nameplate includes cooling, power conversion, lighting, and other infrastructure. IT nameplate excludes that facility layer. Rack nameplate excludes much of the network, storage, and control plane. Average demand is a time-weighted flow. None is a synonym for the others.',
          'LBNL explicitly warns that annual energy, average demand, maximum demand, facility nameplate, and requested interconnection capacity are difficult to convert without project-specific relationships. Its glossary defines grid interconnection capacity as the maximum power requested at the connection point, including total facility needs and design margins. It also estimates current interconnection utilization around 50% because of redundancy and maintenance, while stressing that the value is not well documented. That estimate is useful for a worked example, not a universal ratio. [S8]',
          'This creates a strict stopping rule: the source must state boundary, status, and time basis. “Announced 1 GW” is weaker than “1 GW requested.” Requested is weaker than firm. Firm is weaker than energized. Energized is weaker than commissioned and occupied. An installed fleet can be smaller still when the site is phased or reserves space and power for later equipment.',
        ],
        table: {
          caption: 'Capacity dictionary: what a 1 GW statement can and cannot establish',
          columns: ['Term', 'Boundary or state', 'What can be calculated', 'What remains unknown'],
          rows: [
            ['Announced program capacity', 'Corporate plan; may combine sites and phases', 'Nothing mechanical without further disclosure', 'Site, timing, boundary, firmness, equipment'],
            ['Requested interconnection', 'Maximum requested at grid point, including margins', 'Illustrative annual energy if average utilization is assumed', 'Firmness, energization, facility design, installed fleet'],
            ['Firm / energized interconnection', 'Contracted or physically available grid capacity', 'Upper electrical envelope at that boundary', 'Average draw, PUE, occupancy, rack mix'],
            ['Facility nameplate', 'Whole-building maximum electrical capacity', 'IT capacity after PUE; rack capacity after external IT allowance', 'Actual average draw and utilization'],
            ['IT nameplate', 'Servers, network, storage, and support IT', 'Rack capacity after external IT allowance', 'Facility draw unless PUE is known'],
            ['Compute-rack nameplate', 'GB300 rack “up to” requirements', 'Rack and installed-GPU equivalents', 'Actual workload draw and useful work'],
            ['Average facility demand', 'Time-weighted facility power', 'Annual MWh/TWh', 'Installed fleet without nameplate and utilization'],
            ['Full-load-equivalent compute', 'Installed fleet × computational utilization × time', 'Comparable accelerator-hours within a defined generation', 'Useful work, service quality, and revenue'],
          ],
        },
      },
  {
        id: 'research-contract',
        title: 'The conversion contract',
        paragraphs: [
          'The unit of analysis is one nominal “1 GW” statement. The primary reference case treats it as 1,000 MW of total facility nameplate. That choice is not a claim about how most announcements are written. It is a controlled starting point that permits PUE to be applied exactly once.',
          'The hardware population is homogeneous GB300 NVL72. Real campuses mix accelerators, CPU fleets, storage systems, network generations, development clusters, spares, and partially occupied halls. Homogeneity is useful because it isolates the boundary problem. It is not a forecast of a specific company’s asset register.',
          'The model has three explicit transformations. First, facility MW becomes IT MW by dividing by PUE. Second, IT MW becomes compute-rack MW by reserving an external-IT allowance for scale-out network, storage, support servers, and management. Third, compute-rack MW becomes rack equivalents and installed GPUs using NVIDIA’s rack specification. Every result is therefore conditional on the stated boundary and factors.',
        ],
        table: {
          caption: 'Reference formulas and units',
          columns: ['Step', 'Formula', 'Reference input', 'Reference output'],
          rows: [
            ['Facility → IT', 'IT MW = facility MW ÷ PUE', '1,000 MW ÷ 1.145', '873.36 MW'],
            ['IT → compute racks', 'Rack MW = IT MW ÷ (1 + external IT overhead)', '873.36 MW ÷ 1.10', '793.97 MW'],
            ['Rack MW → racks', 'Racks = rack MW × 1,000 ÷ 142 kW', '793.97 MW', '5,591.31 rack equivalents'],
            ['Racks → GPUs', 'GPUs = racks × 72', '5,591.31 × 72', '402,574 B300 GPUs'],
            ['Fleet → FLE hours', 'FLE = GPUs × 8,760 × utilization', '80% training utilization', '2.82B GPU-hours/year'],
          ],
        },
      },
  {
        id: 'start-at-the-rack',
        title: 'Start at the rack, not the GPU TDP',
        paragraphs: [
          'NVIDIA’s current enterprise reference architecture defines one GB300 NVL72 scalable unit as one liquid-cooled rack with 18 compute trays, 72 B300 GPUs, and 36 Grace CPUs. The full rack can require up to 142 kW. Each tray contains four B300 GPUs, two Grace CPUs, ConnectX-8 adapters, a BlueField DPU, boot storage, and local cache. The rack boundary already includes far more than accelerator silicon. [S1][S2]',
          'This is why dividing one gigawatt by a per-GPU thermal design figure is structurally wrong. The electrical system serves CPUs, memory, NVLink, local storage, network adapters, management hardware, and power-conversion losses inside the rack before it serves anything outside the cabinet. Rack density is the appropriate first hardware unit for this model.',
          'The phrase “up to 142 kW” also matters. It is a nameplate or maximum requirement, not an assertion that every occupied rack draws 142 kW every hour. Using it for installed-fleet capacity is conservative with respect to rack count at a fixed compute-rack nameplate. Using it for annual energy without a utilization model would be wrong.',
        ],
        table: {
          caption: 'GB300 NVL72 reference unit used in the model',
          columns: ['Element', 'Quantity', 'Power or role', 'Treatment'],
          rows: [
            ['GB300 rack / scalable unit', '1', 'Up to 142 kW', 'Compute-rack nameplate denominator'],
            ['Compute trays', '18', '4 B300 + 2 Grace per tray', 'Node count and internal system boundary'],
            ['B300 GPUs', '72', 'Accelerators in one NVLink domain', 'Installed fleet output'],
            ['Grace CPUs', '36', 'Host compute and memory', 'Included inside rack nameplate'],
            ['In-rack management switches', '2 SN2201', 'OOB access; DC busbar', 'Included inside rack specification'],
            ['External fabrics', 'Compute, converged, storage/customer, support, OOB', 'Scale-out and operations', 'Reserved in external-IT overhead'],
          ],
        },
      }
];
