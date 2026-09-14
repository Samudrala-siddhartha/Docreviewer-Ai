/**
 * DocSure AI - Shared Types and Domain Entities
 * Tagline: TRUST IN EVERY DOCUMENT
 *
 * Core Principle: The system never claims "100% FAKE" or "100% GENUINE".
 * Screening results communicate uncertainty honestly via risk levels and evidence.
 */

export type UserRole = 'USER' | 'REVIEWER' | 'ADMIN';

export type RiskLevel = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'INCONCLUSIVE';

export type DocumentType =
  | 'AUTO_DETECT'
  | 'AADHAAR'
  | 'PAN'
  | 'PASSPORT'
  | 'DRIVING_LICENCE'
  | 'VOTER_ID'
  | 'NATIONAL_ID'
  | 'GLOBAL_GOVT_ID'
  | 'OTHER_GOVT_ID'
  | 'UNRELATED_CARD'
  | 'OTHER_DOCUMENT';

export type QualityGrade = 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'UNUSABLE';

export type FindingCategory =
  | 'VISUAL_FORENSICS'
  | 'OCR_MISMATCH'
  | 'SECURITY_FEATURE'
  | 'TEMPLATE_ANOMALY'
  | 'QR_BARCODE_MRZ'
  | 'METADATA_ANOMALY'
  | 'QUALITY_ISSUE'
  | 'DUPLICATE_SUSPECT'
  | 'FACE_INCONSISTENCY';

export type FindingSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SignalStatus = 'PRESENT' | 'ABSENT' | 'ANOMALOUS' | 'UNCERTAIN' | 'NOT_APPLICABLE';

export type ScanStatus =
  | 'UPLOADED'
  | 'VALIDATING'
  | 'QUALITY_CHECK'
  | 'CLASSIFYING'
  | 'OCR_EXTRACTING'
  | 'FORENSIC_ANALYSIS'
  | 'RISK_SCORING'
  | 'COMPLETED'
  | 'FAILED';

export type ManualReviewDecision =
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_MORE_INFORMATION'
  | 'INCONCLUSIVE';

export type TicketCategory =
  | 'SCAN_DISPUTE'
  | 'DOCUMENT_QUALITY'
  | 'PRIVACY_REQUEST'
  | 'ACCOUNT_ACCESS'
  | 'TECHNICAL_SUPPORT'
  | 'OTHER';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';

export type AuditAction =
  | 'LOGIN'
  | 'FAILED_LOGIN'
  | 'LOGOUT'
  | 'SCAN_CREATED'
  | 'SCAN_ANALYZED'
  | 'REPORT_GENERATED'
  | 'REPORT_ACCESSED'
  | 'MANUAL_REVIEW_REQUESTED'
  | 'MANUAL_REVIEW_DECIDED'
  | 'ADMIN_ACTION'
  | 'PERMISSION_CHANGE'
  | 'SECURITY_EVENT'
  | 'DELETION'
  | 'DATA_EXPORT';

export interface BoundingBox {
  x: number;      // percentage 0-100 from left
  y: number;      // percentage 0-100 from top
  width: number;  // percentage 0-100
  height: number; // percentage 0-100
}

export interface ForensicFinding {
  id: string;
  category: FindingCategory;
  title: string;
  description: string;
  severity: FindingSeverity;
  confidence: number; // 0.0 - 1.0
  region?: BoundingBox;
  evidenceType: string;
  modelVersion: string;
  explanation: string;
}

export interface ExtractedField {
  field: string;
  label: string;
  value: string;
  confidence: number; // 0.0 - 1.0
  boundingBox?: BoundingBox;
  matchesReferenceRule?: boolean;
}

export interface DocumentQualityAssessment {
  overall: QualityGrade;
  blurScore: number;       // 0-100 (higher = sharper)
  resolutionWidth: number;
  resolutionHeight: number;
  rotationAngle: number;
  perspectiveDistortion: boolean;
  glareDetected: boolean;
  shadowsDetected: boolean;
  boundaryClear: boolean;
  readabilityScore: number;
  recommendations: string[];
}

export interface DocumentMetadataSummary {
  fileSize: number;
  mimeType: string;
  fileNameSanitized: string;
  sha256Hash: string;
  createdTime?: string;
  modifiedTime?: string;
  softwareDetected?: string;
  isEditedSoftwareSuspect: boolean;
  explanation: string;
}

export interface SecurityFeatureResult {
  featureName: string;
  status: SignalStatus;
  confidence: number;
  notes: string;
  isCrucial: boolean;
}

export interface CodeAnalysisResult {
  type: 'QR' | 'BARCODE' | 'MRZ' | 'NONE';
  detected: boolean;
  decodedData?: Record<string, string>;
  matchesOCR: 'MATCH' | 'MISMATCH' | 'UNAVAILABLE' | 'UNREADABLE' | 'NOT_APPLICABLE';
  mismatchedFields?: string[];
  notes?: string;
}

export interface DuplicateDetectionResult {
  exactMatchFound: boolean;
  perceptualSimilarityScore: number; // 0-100
  previousScanTimestamp?: string;
  notes: string;
}

export interface FaceConsistencyResult {
  portraitDetectedInDocument: boolean;
  selfieProvided: boolean;
  consistencyGrade: 'HIGH_CONSISTENCY' | 'MEDIUM_CONSISTENCY' | 'LOW_CONSISTENCY' | 'UNAVAILABLE';
  similarityScore?: number; // 0-100
  notes: string;
}

export interface ScreeningResult {
  riskLevel: RiskLevel;
  confidence: number; // 0.0 - 1.0
  primaryReasons: string[];
  checksCompleted: string[];
  checksUnavailable: string[];
  recommendation: string;
  disclaimer: string;
}

export interface PipelinePhaseReport {
  phaseNumber: number;
  id: string;
  name: string;
  category: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FLAGGED' | 'FAILED';
  durationMs: number;
  summary: string;
  findingsCount: number;
  metrics: Record<string, string | number | boolean>;
  details: string[];
}

export interface BorderCheckResult {
  checkKey:
    | 'FAKE_PASSPORT_VISA'
    | 'ALTERED_PHOTO'
    | 'MODIFIED_DOB'
    | 'TAMPERED_VISA_STAMP'
    | 'IDENTITY_IMPERSONATION'
    | 'MULTIPLE_IDENTITIES'
    | 'EXPIRED_BLACKLISTED_DOC'
    | 'HIGH_VOLUME_RAPID_CLEARANCE';
  name: string;
  status: 'PASSED' | 'FLAGGED' | 'DISQUALIFIED' | 'MISSING_FEATURE';
  verdict: string;
  details: string;
  technicalIndicator: string;
  anomalyRegion?: BoundingBox;
}

export interface BorderCheckpointAudit {
  isAccreditedDocument: boolean;
  documentCategory: 'SOVEREIGN_TRAVEL_OR_IDENTITY' | 'UNACCREDITED_COMMERCIAL_OR_PRIVATE' | 'UNIDENTIFIED_OBJECT';
  originalityVerdict: 'ORIGINAL_SOVEREIGN_DOCUMENT' | 'FORGED_OR_TAMPERED_SPECIMEN' | 'DISQUALIFIED_NON_GOVERNMENT' | 'WATCHLIST_HIT';
  summaryText: string;
  missingSovereignRequirements?: string[];
  checks: BorderCheckResult[];
  screeningLatencyMs: number;
  checkpointThroughputScore: string;
}

export interface ScanRecord {
  id: string;
  userId: string;
  documentType: DocumentType;
  classifiedType?: DocumentType;
  classificationConfidence?: number;
  detectedCardType?: string;
  issuingCountry?: string;
  issuingAuthority?: string;
  isOfficialGovernmentDoc?: boolean;
  datasetReference?: string;
  isOriginal?: boolean;
  isOriginalSummary?: string;
  status: ScanStatus;
  createdAt: string;
  updatedAt: string;
  quality?: DocumentQualityAssessment;
  metadata?: DocumentMetadataSummary;
  extractedFields?: ExtractedField[];
  findings: ForensicFinding[];
  securityFeatures?: SecurityFeatureResult[];
  codeAnalysis?: CodeAnalysisResult;
  duplicateAnalysis?: DuplicateDetectionResult;
  faceConsistency?: FaceConsistencyResult;
  result?: ScreeningResult;
  pipelinePhases?: PipelinePhaseReport[];
  borderAudit?: BorderCheckpointAudit;
  manualReviewStatus?: ManualReviewDecision;
  manualReviewNotes?: string;
  reviewerId?: string;
  reviewedAt?: string;
  mockIntegrationSource?: 'NONE' | 'DIGILOCKER_DEMO';
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
  activeSessionsCount: number;
  organization?: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  scanId?: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolutionNotes?: string;
}

export interface ReferenceTemplate {
  id: string;
  documentType: DocumentType;
  version: string;
  name: string;
  effectiveDate: string;
  source: string;
  isActive: boolean;
  expectedDimensions: { widthMm: number; heightMm: number; aspectRatio: number };
  mandatoryFields: string[];
  securityFeaturesExpected: string[];
}

export interface ModelVersion {
  id: string;
  name: string;
  type: 'VISUAL_FORENSICS' | 'OCR_PARSER' | 'CLASSIFIER' | 'MULTIMODAL_LLM';
  version: string;
  provider: string;
  status: 'ACTIVE' | 'TESTING' | 'RETIRED';
  createdAt: string;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  notes: string;
}

export interface DatasetEntry {
  id: string;
  name: string;
  documentType: DocumentType;
  source: string;
  license: string;
  sampleCount: number;
  version: string;
  qualityRating: 'HIGH' | 'MEDIUM' | 'EXPERIMENTAL';
  createdAt: string;
  description: string;
}

export interface AuditEvent {
  id: string;
  userId?: string;
  userEmail?: string;
  role?: UserRole;
  action: AuditAction;
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface SystemMetrics {
  totalScans: number;
  highRiskCount: number;
  averageProcessingTimeMs: number;
  errorRate: string;
}

export type AuditLogEntry = AuditEvent;
export type ModelVersionInfo = ModelVersion;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    category: string;
    details?: any;
  };
  meta?: Record<string, any>;
}
