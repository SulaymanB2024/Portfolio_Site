export const TEXAS_TOLL_DIRECT_ANSWER =
  'Most Texas toll roads are publicly owned, not privately owned. TxDOT, counties, and public toll authorities own most roadways. Four major concessions—North Tarrant Express, LBJ Express, NTE 35W, and SH 130 Segments 5–6—give private companies time-limited operating and toll-revenue rights while Texas retains title to the pavement.';

export const TEXAS_TOLL_OWNERSHIP_CSV_PATH = '/research/texas-toll-road-ownership-2026.csv';
export const TEXAS_TOLL_OWNERSHIP_JSON_PATH = '/research/texas-toll-road-ownership-2026.json';
export const TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE = '2026-07-23';

export interface TexasTollOwnershipRow {
  facility: string;
  region: string;
  physicalOwner: string;
  operator: string;
  tollRevenueClaimant: string;
  concessionaire: string;
  term: string;
  privateRightsStatus: string;
  billingAgency: string;
  evidenceDate: string;
  sourceIds: readonly string[];
}

export const TEXAS_TOLL_OWNERSHIP_ROWS = [
  {
    facility: 'TxDOT-operated toll systems',
    region: 'Austin, Houston, and Dallas–Fort Worth',
    physicalOwner: 'State of Texas / TxDOT',
    operator: 'TxDOT and its public project entities',
    tollRevenueClaimant: 'The applicable public toll system or project entity',
    concessionaire: 'None',
    term: 'Ongoing public ownership',
    privateRightsStatus: 'No private concession',
    billingAgency: 'HCTRA',
    evidenceDate: TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE,
    sourceIds: ['s21', 's22', 's26'],
  },
  {
    facility: 'North Texas Tollway Authority system',
    region: 'Dallas–Fort Worth',
    physicalOwner: 'NTTA; Sam Rayburn Tollway is held through a state right of use',
    operator: 'NTTA',
    tollRevenueClaimant: 'NTTA system',
    concessionaire: 'None',
    term: 'Ongoing public system; Sam Rayburn use right ends 2058',
    privateRightsStatus: 'No private concession',
    billingAgency: 'NTTA',
    evidenceDate: TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE,
    sourceIds: ['s15', 's16', 's26'],
  },
  {
    facility: 'Harris County Toll Road Authority system',
    region: 'Houston',
    physicalOwner: 'Harris County',
    operator: 'HCTRA',
    tollRevenueClaimant: 'HCTRA enterprise fund',
    concessionaire: 'None',
    term: 'Ongoing county ownership',
    privateRightsStatus: 'No private concession',
    billingAgency: 'HCTRA',
    evidenceDate: TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE,
    sourceIds: ['s17', 's26'],
  },
  {
    facility: 'Regional and county toll authorities',
    region: 'Austin, East Texas, Houston, Fort Bend, and Rio Grande Valley',
    physicalOwner: 'Applicable public authority, county, or public right-of-way owner',
    operator: 'CTRMA, NET RMA, BCTRA, FBCTRA, MCTRA, CCRMA, or applicable public authority',
    tollRevenueClaimant: 'The applicable public authority or pledged system',
    concessionaire: 'None',
    term: 'Ongoing public ownership or right of use',
    privateRightsStatus: 'No private concession',
    billingAgency: 'CTRMA, NTTA, HCTRA, or CCRMA, depending on the facility',
    evidenceDate: TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE,
    sourceIds: ['s18', 's19', 's20', 's26'],
  },
  {
    facility: 'North Tarrant Express',
    region: 'Dallas–Fort Worth',
    physicalOwner: 'State of Texas / TxDOT',
    operator: 'NTE Mobility Partners, LLC',
    tollRevenueClaimant: 'NTE Mobility Partners, LLC, subject to debt and public sharing',
    concessionaire: 'NTE Mobility Partners, LLC',
    term: '2009–2061',
    privateRightsStatus: 'Yes—time-limited operating and toll-revenue rights',
    billingAgency: 'NTTA',
    evidenceDate: TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE,
    sourceIds: ['s6', 's7', 's26'],
  },
  {
    facility: 'LBJ Express',
    region: 'Dallas–Fort Worth',
    physicalOwner: 'State of Texas / TxDOT',
    operator: 'LBJ Infrastructure Group, LLC',
    tollRevenueClaimant: 'LBJ Infrastructure Group, LLC, subject to debt and public sharing',
    concessionaire: 'LBJ Infrastructure Group, LLC',
    term: '2009–2061',
    privateRightsStatus: 'Yes—time-limited operating and toll-revenue rights',
    billingAgency: 'NTTA',
    evidenceDate: TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE,
    sourceIds: ['s6', 's8', 's26'],
  },
  {
    facility: 'NTE 35W',
    region: 'Dallas–Fort Worth',
    physicalOwner: 'State of Texas / TxDOT',
    operator: 'NTE Mobility Partners Segments 3, LLC',
    tollRevenueClaimant: 'NTE Mobility Partners Segments 3, LLC, subject to debt and public sharing',
    concessionaire: 'NTE Mobility Partners Segments 3, LLC',
    term: '2013–2061',
    privateRightsStatus: 'Yes—time-limited operating and toll-revenue rights',
    billingAgency: 'NTTA',
    evidenceDate: TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE,
    sourceIds: ['s6', 's9', 's26'],
  },
  {
    facility: 'SH 130 Segments 5–6',
    region: 'Austin–San Antonio corridor',
    physicalOwner: 'State of Texas / TxDOT',
    operator: 'SH 130 Concession Company, LLC',
    tollRevenueClaimant: 'SH 130 Concession Company, LLC, after debt and public sharing',
    concessionaire: 'SH 130 Concession Company, LLC',
    term: '2007–2062',
    privateRightsStatus: 'Yes—time-limited operating and toll-revenue rights',
    billingAgency: 'HCTRA',
    evidenceDate: TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE,
    sourceIds: ['s10', 's11', 's13', 's14', 's26'],
  },
  {
    facility: 'SH 288 managed lanes (former concession)',
    region: 'Houston',
    physicalOwner: 'State of Texas / TxDOT',
    operator: 'Texas Transportation Finance Corporation / public structure',
    tollRevenueClaimant: 'Public project structure',
    concessionaire: 'None since October 8, 2024',
    term: 'Private term ended; original expiry was March 2068',
    privateRightsStatus: 'No current private rights; the concession was terminated',
    billingAgency: 'HCTRA',
    evidenceDate: TEXAS_TOLL_OWNERSHIP_EVIDENCE_DATE,
    sourceIds: ['s1', 's2', 's3', 's21', 's22', 's26'],
  },
] as const satisfies readonly TexasTollOwnershipRow[];
