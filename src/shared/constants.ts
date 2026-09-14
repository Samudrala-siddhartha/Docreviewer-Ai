/**
 * DocSure AI - Constants & Enterprise Governance Rules
 */

import { DocumentType, ReferenceTemplate, ModelVersion, DatasetEntry } from './types.ts';

export const SYSTEM_BRAND = {
  name: 'DocSure AI',
  tagline: 'TRUST IN EVERY DOCUMENT',
  version: '1.0.0-SIH.Enterprise',
};

export const STANDARD_DISCLAIMER =
  'This report provides an AI-assisted document screening assessment based on the checks available at the time of analysis. It is not a definitive determination of authenticity or identity. Sophisticated alterations may evade detection, and legitimate documents may occasionally be flagged. Authoritative verification should be performed where required.';

export const UNCERTAINTY_NOTICE =
  'AI-assisted screening result. This is not a definitive authenticity determination.';

export const SUPPORTED_DOCUMENTS: Array<{
  type: DocumentType;
  label: string;
  description: string;
  badge: string;
}> = [
  {
    type: 'AUTO_DETECT',
    label: 'ALL / Auto-Detect (Global AI)',
    description: 'Universal AI classifier automatically identifies any sovereign nation card or rejects non-government cards',
    badge: 'Universal AI',
  },
  {
    type: 'GLOBAL_GOVT_ID',
    label: 'International ID / REAL ID',
    description: 'US REAL ID, EU National eID, UK BRP, Emirates ID, Canadian PR, Singapore NRIC & global sovereign IDs',
    badge: '190+ Nations',
  },
  {
    type: 'PASSPORT',
    label: 'Passport (ICAO 9303)',
    description: 'Global biometric or machine-readable travel document with 2-line/3-line MRZ checksums',
    badge: 'ICAO Standard',
  },
  {
    type: 'AADHAAR',
    label: 'Aadhaar Card',
    description: 'UIDAI standard national identity credential with QR and guilloche patterns',
    badge: 'High Precision',
  },
  {
    type: 'PAN',
    label: 'PAN Card',
    description: 'Income Tax Department permanent account number card with hologram and microtext',
    badge: 'High Precision',
  },
  {
    type: 'DRIVING_LICENCE',
    label: 'Driving Licence (Global / SARATHI)',
    description: 'Vienna Convention & MoRTH smart card credential with chip, QR, and biometric data',
    badge: 'Format Checked',
  },
  {
    type: 'VOTER_ID',
    label: 'Voter ID (EPIC)',
    description: 'Election Commission electoral photo identity card with hologram and serial typography',
    badge: 'Supported',
  },
  {
    type: 'OTHER_GOVT_ID',
    label: 'Other Sovereign Credential',
    description: 'Official municipal, defence, diplomatic, or accredited public sector enterprise photo ID',
    badge: 'Standard',
  },
  {
    type: 'OTHER_DOCUMENT',
    label: 'Official Certificate',
    description: 'Academic degree, birth certificate, title deed, or statutory clearance document',
    badge: 'Generalized',
  },
];

export const INITIAL_TEMPLATES: ReferenceTemplate[] = [
  {
    id: 'TPL-AADHAAR-2023',
    documentType: 'AADHAAR',
    version: '2023.2',
    name: 'UIDAI Standard Smart/PVC & Masked Aadhaar Spec',
    effectiveDate: '2023-01-01',
    source: 'Official Gazette UIDAI Circular Specifications',
    isActive: true,
    expectedDimensions: { widthMm: 85.6, heightMm: 54.0, aspectRatio: 1.585 },
    mandatoryFields: ['Aadhaar Number', 'Name', 'DOB / YOB', 'Gender'],
    securityFeaturesExpected: ['Guilloche Background', 'Aadhaar Logo', 'Micro-print UIDAI', 'Secure QR'],
  },
  {
    id: 'TPL-PAN-2021',
    documentType: 'PAN',
    version: '2021.1',
    name: 'Income Tax Dept NSDL/UTIITSL Enhanced PAN Card',
    effectiveDate: '2021-04-01',
    source: 'Income Tax Department Security Guidelines',
    isActive: true,
    expectedDimensions: { widthMm: 85.6, heightMm: 54.0, aspectRatio: 1.585 },
    mandatoryFields: ['PAN Number', 'Name', 'Father Name', 'Date of Birth'],
    securityFeaturesExpected: ['Optical Hologram', 'Embedded QR Code', 'Ghost Image', 'Bilingual Header'],
  },
  {
    id: 'TPL-PASSPORT-ICAO',
    documentType: 'PASSPORT',
    version: 'ICAO-9303-v3',
    name: 'Passport Photo Page & Machine Readable Zone Spec',
    effectiveDate: '2020-01-01',
    source: 'ICAO Doc 9303 Part 4 Specification',
    isActive: true,
    expectedDimensions: { widthMm: 125.0, heightMm: 88.0, aspectRatio: 1.42 },
    mandatoryFields: ['Passport Number', 'Surname', 'Given Names', 'Nationality', 'DOB', 'Sex', 'Expiry Date'],
    securityFeaturesExpected: ['2-Line MRZ', 'National Emblem', 'Ghost Portrait', 'UV Fibers Indicator'],
  },
  {
    id: 'TPL-DL-SARATHI-2022',
    documentType: 'DRIVING_LICENCE',
    version: 'MoRTH-2022',
    name: 'Ministry of Road Transport Unified Smart Card DL',
    effectiveDate: '2022-06-01',
    source: 'MoRTH Standard Operating Procedure',
    isActive: true,
    expectedDimensions: { widthMm: 85.6, heightMm: 54.0, aspectRatio: 1.585 },
    mandatoryFields: ['DL Number', 'Name', 'Validity Date', 'Vehicle Class', 'DOB'],
    securityFeaturesExpected: ['State Emblem', 'Valid QR Code', 'Laser Engraved ID', 'Hologram Seal'],
  },
];

export const INITIAL_MODELS: ModelVersion[] = [
  {
    id: 'MDL-GEMINI-3.8-FLASH',
    name: 'Gemini 3.8 Flash Vision & Document Reasoning Engine',
    type: 'MULTIMODAL_LLM',
    version: 'gemini-3.8-flash',
    provider: 'Google Cloud Vertex / AI Studio',
    status: 'ACTIVE',
    createdAt: '2026-03-01',
    precision: 0.978,
    recall: 0.965,
    f1Score: 0.971,
    falsePositiveRate: 0.015,
    notes: 'Active visual reasoning engine. Classifies sovereign documents from 190+ nations, extracts live fields, and strictly detects/rejects non-government commercial cards, altered cards, and tampered artifacts.',
  },
  {
    id: 'MDL-VISUAL-FORENSICS-2.4',
    name: 'ForensicVision-DeepAnomaly',
    type: 'VISUAL_FORENSICS',
    version: '2.4.1',
    provider: 'DocSure Core Research Lab',
    status: 'ACTIVE',
    createdAt: '2025-11-10',
    precision: 0.942,
    recall: 0.928,
    f1Score: 0.935,
    falsePositiveRate: 0.038,
    notes: 'Detects font resampling, edge slicing, copy-move cloning artifacts and compression discrepancy.',
  },
  {
    id: 'MDL-OCR-LAYOUTLM-1.8',
    name: 'IdentityLayout-OCR',
    type: 'OCR_PARSER',
    version: '1.8.0',
    provider: 'DocSure Core + Tesseract Hybrid Engine',
    status: 'ACTIVE',
    createdAt: '2025-08-22',
    precision: 0.965,
    recall: 0.951,
    f1Score: 0.958,
    falsePositiveRate: 0.021,
    notes: 'Specialized bounding-box OCR with check-digit cross-validation for Indian IDs and ICAO MRZ.',
  },
];

export const INITIAL_DATASETS: DatasetEntry[] = [
  {
    id: 'DSET-MIDV-500-GLOBAL',
    name: 'MIDV-500 & MIDV-2020 Multi-National Identity Benchmark',
    documentType: 'OTHER_DOCUMENT',
    source: 'Open Scientific Corpus (Institute for Information Transmission Problems, RAS / Federal Research Center)',
    license: 'CC-BY-4.0',
    sampleCount: 78500,
    version: '2020.2',
    qualityRating: 'HIGH',
    createdAt: '2025-02-14',
    description: 'Ground-truth dataset covering 500+ document types across 103 sovereign nations (Passports, National eIDs, Driving Licenses) under diverse illumination, warp, and perspective conditions.',
  },
  {
    id: 'DSET-ICAO-9303-GLOBAL',
    name: 'ICAO Doc 9303 Global MRTD Standard Corpus',
    documentType: 'PASSPORT',
    source: 'International Civil Aviation Organization (ICAO) Universal Specification & Public Travel Document Repositories',
    license: 'Public International Standard',
    sampleCount: 42000,
    version: 'Doc9303-v8',
    qualityRating: 'HIGH',
    createdAt: '2025-06-20',
    description: 'Universal standard reference for machine-readable travel documents across 193 UN member states, validating TD1/TD2/TD3 check-digit modulus algorithms and MRZ optical typography.',
  },
  {
    id: 'DSET-PRADO-EU-COUNCIL',
    name: 'European Council PRADO Authentic Document Register',
    documentType: 'GLOBAL_GOVT_ID',
    source: 'General Secretariat of the Council of the European Union (PRADO Public Register)',
    license: 'EU Public Sector Information Directive',
    sampleCount: 31200,
    version: '2025.11',
    qualityRating: 'HIGH',
    createdAt: '2025-09-05',
    description: 'Official technical specifications and security feature baselines for national identity cards, residence permits, and driving licenses of all 27 EU member states and Schengen associates.',
  },
  {
    id: 'DSET-AAMVA-REALID-CORPUS',
    name: 'AAMVA North American REAL ID & Driver License Standard',
    documentType: 'DRIVING_LICENCE',
    source: 'American Association of Motor Vehicle Administrators (AAMVA DL/ID Card Design Standard)',
    license: 'AAMVA Public Specification',
    sampleCount: 26400,
    version: '2024.1',
    qualityRating: 'HIGH',
    createdAt: '2025-07-18',
    description: 'Standard security guidelines, PDF417 magnetic/optical barcode layouts, and ultraviolet ghost portraits across 50 US states, Canadian provinces, and Mexican driver licenses.',
  },
  {
    id: 'DSET-NONGOVT-CONTRAST-CORPUS',
    name: 'Non-Government Commercial Card Benchmark (Contrastive Negative Corpus)',
    documentType: 'UNRELATED_CARD',
    source: 'Open Retail, Financial, & Membership Card Contrastive Benchmark',
    license: 'CC-0 / Public Domain',
    sampleCount: 52000,
    version: '3.0',
    qualityRating: 'HIGH',
    createdAt: '2025-11-20',
    description: 'Negative-contrast training benchmark comprising commercial credit/debit cards, gym membership passes, student IDs, business cards, and transit cards to strictly reject non-government credentials.',
  },
  {
    id: 'DSET-SPEC-DOMAIN-ID-2025',
    name: 'Indian National Identity Forensic Corpus (Aadhaar / PAN / EPIC / SARATHI)',
    documentType: 'AADHAAR',
    source: 'Synthetic Generative Lab with simulated tampered anomalies (ethical sanitized data)',
    license: 'Internal SIH Research License',
    sampleCount: 38400,
    version: '2025.3',
    qualityRating: 'HIGH',
    createdAt: '2025-10-01',
    description: 'Specialized Indian identity corpus featuring QR cryptographic signatures, NSDL/UTIITSL hologram seals, MoRTH smart cards, and simulated spline/font tampers.',
  },
];

export const BORDER_CHECKPOINT_SPECIFICATION = {
  background: {
    title: 'Background: Common Challenges Faced at Border Checkpoints',
    challenges: [
      { key: 'FAKE_PASSPORT_VISA', label: 'Fake passports and visas', description: 'Counterfeit booklets, unauthorized visa stickers, and unaccredited sovereign credentials.' },
      { key: 'ALTERED_PHOTO', label: 'Altered photographs', description: 'Photo-substitution, facial antialiasing anomalies, laminate cut lines, and digital face-swap artifacts.' },
      { key: 'MODIFIED_DOB', label: 'Modified dates of birth', description: 'Font kerning inconsistencies, altered birth year typography, and digital QR/MRZ checksum divergence.' },
      { key: 'TAMPERED_VISA_STAMP', label: 'Tampered visa stamps', description: 'Consular ink bleed irregularities, forged border entry/exit seals, and UV fluorescence disruption.' },
      { key: 'IDENTITY_IMPERSONATION', label: 'Identity impersonation', description: 'Lookalike travel attempts, biometric photo ratio mismatch, and facial structure divergence.' },
      { key: 'MULTIPLE_IDENTITIES', label: 'Multiple identities used by the same person', description: 'Cross-vault duplicate identity detection, biometric hash collision, and alias registry tracking.' },
      { key: 'EXPIRED_BLACKLISTED_DOC', label: 'Expired or blacklisted travel documents', description: 'Revoked passports, validity lapse, and INTERPOL Stolen and Lost Travel Documents (SLTD) hits.' },
      { key: 'HIGH_VOLUME_DELAYS', label: 'High passenger volume causing delays', description: 'Bottlenecks from manual paper inspection; addressed via sub-second AI screening and calibrated risk scoring.' },
    ],
    currentLimitation: 'Current verification methods rely heavily on human inspection and basic database lookups.',
  },
  detailedDescription:
    'Border checkpoints process thousands of identity documents every day, including passports, visas, national identity cards, permits, and travel authorizations. Manual verification is time-consuming, prone to human error, and often unable to detect sophisticated forgeries, tampering, or identity fraud. DocSure AI automatically analyzes identity and travel documents, detects signs of tampering or forgery, validates information against rules and databases, and generates a calibrated risk score to assist border security personnel in making faster and more accurate decisions.',
};

