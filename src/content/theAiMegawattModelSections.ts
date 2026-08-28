import type { ArticleSection } from './articleModels';

export const THE_AI_MEGAWATT_MODEL_SECTIONS: ArticleSection[] = [
  {
        id: 'network-overhead',
        title: 'The external network is not a rounding error',
        paragraphs: [
          'NVIDIA’s eight-SU bill of materials provides a rare public anchor. Eight racks contain 576 GPUs and require 44 compute-core switches, 11 converged-core switches, and 16 OOB management switches. Applying NVIDIA’s stated typical power gives 53.27 kW for the high-speed switches at the SN5600 passive-cable figure plus the SN2201 units. That is 4.69% of the eight racks’ combined 1.136 MW nameplate before storage systems, support servers, customer-edge equipment, and additional network tiers. [S3][S6][S7]',
          'The documentation contains a material inconsistency. The BOM and logical-architecture tables name SN5600. The networking-hardware page names SN5610. The SN5610 specification lists 900 W with passive cables and 2.08 kW with 64 optical modules. Substituting the optical figure for the 55 high-speed switches raises the comparator to 115.97 kW, or 10.21% of rack nameplate. That is not a claim that every port is populated. It shows why chassis-only figures and optical population cannot be collapsed into one silent assumption. [S3][S5][S6]',
          'The small-cluster BOM cannot simply be multiplied by hundreds. NVIDIA says larger designs use separate fabrics and introduces a super-spine around 1,024 nodes. It also identifies storage, customer, support-server, and management networks outside the compute fabric. A one-gigawatt homogeneous reference fleet would contain roughly 100,000 compute trays, far beyond the tested eight-SU design point. The external-IT allowance must therefore be a range, not an eight-rack extrapolation. [S4]',
          'The model uses 6%, 10%, and 14%. Six percent sits just above the documented passive-switch floor. Ten percent is close to the optical-switch comparator before unquantified support equipment. Fourteen percent matches the total-IT/server overhead factor in a GB200-era Epoch decomposition and serves as an external magnitude check, not a GB300 measurement. [S9]',
        ],
        table: {
          caption: 'Eight-SU network-power reconstruction; calculated from vendor counts and typical-power specifications',
          columns: ['Component', 'Count', 'Lower typical power', 'Optical comparator', 'Notes'],
          rows: [
            ['Compute-core high-speed switches', '44', '41.36 kW', '91.52 kW', 'BOM says SN5600; comparator uses SN5610 with 64 optical modules'],
            ['Converged-core high-speed switches', '11', '10.34 kW', '22.88 kW', 'Same model-name contradiction'],
            ['OOB switches', '16', '1.57 kW', '1.57 kW', 'SN2201 at 98 W typical'],
            ['Total external switches', '71', '53.27 kW', '115.97 kW', 'Excludes support servers, storage, super-spine, and facility infrastructure'],
            ['Share of eight-rack nameplate', '8 × 142 kW', '4.69%', '10.21%', 'Denominator is compute-rack nameplate'],
          ],
        },
      },
  {
        id: 'facility-conversion',
        title: 'A 1 GW facility supports about 356,000 to 435,000 B300 GPUs in the model',
        paragraphs: [
          'LBNL estimates an average PUE of 1.145 in 2024 for facilities serving AI equipment. PUE is total facility energy divided by IT energy. In the reference case, dividing 1,000 MW by 1.145 leaves 873.36 MW for all IT. Reserving 10% on top of compute-rack nameplate for external IT leaves 793.97 MW for GB300 racks. At 142 kW per rack and 72 GPUs per rack, the result is 5,591.31 rack equivalents and 402,574 installed B300 GPUs. [S1][S8]',
          'The efficient case uses PUE 1.10 and 6% external IT overhead. It produces 434,856 GPUs. The conservative case uses PUE 1.25 and 14% external IT overhead. It produces 355,819. These endpoints are not statistical confidence bounds. They show how two engineering choices move the installed fleet while the facility headline stays fixed.',
          'The sensitivity is economically large. The 79,037-GPU spread between the endpoints is equivalent to about 1,098 GB300 racks. Yet it is still smaller than the definitional error produced by treating a grid request as IT capacity or by applying PUE to a number that already sits at the IT boundary.',
        ],
        table: {
          caption: '1 GW total-facility-nameplate scenarios; all values calculated',
          columns: ['Scenario', 'PUE', 'External IT overhead', 'IT MW', 'GB300 rack MW', 'Rack equivalents', 'Installed B300 GPUs'],
          rows: [
            ['Efficient', '1.1', '6%', '909.09', '857.63', '6,040', '434,856'],
            ['Reference', '1.145', '10%', '873.36', '793.97', '5,591', '402,574'],
            ['Conservative', '1.25', '14%', '800.00', '701.75', '4,942', '355,819'],
          ],
        },
        figures: [
          {
            src: '/images/research/the-ai-megawatt-power-ladder.svg',
            alt: 'Bar chart converting a one-gigawatt total facility nameplate into 873 megawatts of IT nameplate and 794 megawatts of GB300 rack nameplate in the reference case.',
            label: 'Reference capacity ladder',
            caption: 'Calculated: 1,000 MW facility ÷ 1.145 PUE ÷ 1.10 external-IT factor. The figure is a nameplate conversion, not annual average draw.',
            width: 2200,
            height: 1232,
          },
          {
            src: '/images/research/the-ai-megawatt-sensitivity.svg',
            alt: 'Line chart showing installed B300 GPU capacity declining as PUE and external IT overhead increase.',
            label: 'PUE and external-IT sensitivity',
            caption: 'Calculated for a 1,000 MW total facility nameplate, 142 kW per GB300 rack, and 72 B300 GPUs per rack.',
            width: 2200,
            height: 1320,
          },
        ],
      },
  {
        id: 'boundary-tests',
        title: 'The same “1 GW” headline can imply 461,000 GPUs—or no GPU estimate at all',
        paragraphs: [
          'Epoch’s current one-gigawatt cost model defines its site as 1 GW of IT nameplate, then separately applies PUE and utilization to estimate operating energy. Under this article’s 10% external-IT allowance, 1 GW at the IT boundary leaves 909.09 MW for compute racks and supports about 460,948 B300 GPUs. That is roughly 58,000 more than the reference facility-nameplate result because facility overhead sits outside the named gigawatt. [S10]',
          'At the other extreme, a 1 GW interconnection request does not reveal installed fleet. Applying LBNL’s illustrative 50% average utilization produces 500 MW of average facility draw and 4.38 TWh per year. It does not reveal whether the site has 1 GW of facility nameplate, 700 MW, 500 MW, or a staged set of halls with future reserved capacity. It also does not reveal PUE, external-IT share, rack density, or occupancy. [S8]',
          'A completed campus claim can still be temporally ambiguous. Epoch’s Frontier Data Centers Hub notes that large campuses come online in stages and that companies do not always clarify incremental timelines. The model therefore treats announced, under-construction, energized, commissioned, and occupied capacity as different states. [S11]',
        ],
        table: {
          caption: 'Boundary tests for a nominal 1 GW statement',
          columns: ['What 1 GW means', 'Immediate implication', 'Reference arithmetic', 'Installed GPU inference'],
          rows: [
            ['Total facility nameplate', 'Whole-building maximum capacity', '873.36 IT MW after PUE', '≈ 402,574 GPUs with 10% external IT overhead'],
            ['IT nameplate', 'Servers + external network/storage/support IT', '909.09 compute-rack MW after 10% allowance', '≈ 460,948 GPUs'],
            ['Interconnection request', 'Maximum requested at grid point, including margins', '500 MW average and 4.38 TWh/year at 50%', 'Not identifiable from the request alone'],
            ['Average facility draw', 'Time-weighted whole-building power', '8.76 TWh/year at 1 GW average', 'Not identifiable without nameplate, PUE, and loading'],
          ],
        },
      }
];
