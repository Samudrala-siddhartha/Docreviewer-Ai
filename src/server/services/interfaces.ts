/**
 * DocSure AI - Service Interfaces
 * Defines contracts for all domain services to ensure modularity,
 * testability, and clean separation between business logic and transport.
 */

import {
  UserProfile,
  UserRole,
  ActiveSession,
  ScanRecord,
  DocumentType,
  RiskLevel,
  ForensicFinding,
  SupportTicket,
  ReferenceTemplate,
  ModelVersion,
  DatasetEntry,
  AuditEvent,
} from '../../shared/types.ts';

export interface IAuthService {
  signup(email: string, name: string, password: string, organization?: string): Promise<{ user: UserProfile; token: string }>;
  login(email: string, password: string, ip: string, userAgent: string): Promise<{ user: UserProfile; token: string }>;
  logout(token: string): Promise<boolean>;
  validateSession(token: string): Promise<UserProfile | null>;
  getUserSessions(userId: string): Promise<ActiveSession[]>;
  revokeSession(sessionId: string): Promise<boolean>;
  changePassword(userId: string, oldPass: string, newPass: string): Promise<boolean>;
  toggle2FA(userId: string, enable: boolean): Promise<boolean>;
}

export interface IStorageService {
  storeTemporaryFile(buffer: Buffer, originalName: string, mimeType: string): Promise<{ fileId: string; safePath: string; hash: string; size: number }>;
  getTemporaryFile(fileId: string): Promise<{ buffer: Buffer; mimeType: string } | null>;
  purgeTemporaryFile(fileId: string): Promise<boolean>;
}

export interface IMalwareScanner {
  scan(buffer: Buffer, filename: string): Promise<{ isClean: boolean; threats: string[]; engineVersion: string; isMock: boolean }>;
}

export interface IDigiLockerService {
  isMock: boolean;
  authorize(authCode: string): Promise<{ accessToken: string; expiresAt: string }>;
  getPermittedDocuments(): Promise<Array<{ docId: string; docType: DocumentType; issuer: string; date: string }>>;
  retrieveDocument(docId: string): Promise<{ docType: DocumentType; fileBuffer: Buffer; metadata: Record<string, string> }>;
}

export interface CardInspectionResult {
  isOfficialGovernmentDoc: boolean;
  detectedCardType: string;
  issuingCountry: string;
  issuingAuthority: string;
  standardClassification: DocumentType;
  datasetStandard: string;
  isOriginal: boolean;
  riskLevel: RiskLevel;
  confidence: number;
  recommendation: string;
  primaryReasons: string[];
  findings: ForensicFinding[];
  extractedFields: Array<{
    field: string;
    label: string;
    value: string;
    confidence: number;
    matchesReferenceRule?: boolean;
  }>;
  qualityScore: number;
  qualityNotes: string;
}

export interface IGeminiService {
  isAvailable(): boolean;
  analyzeDocumentSemantics(
    imageBufferBase64: string,
    mimeType: string,
    documentType: DocumentType
  ): Promise<{
    semanticObservations: string[];
    potentialAnomalies: Array<{ title: string; description: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' }>;
    explanation: string;
  }>;
  inspectAndClassifyCard(
    imageBufferBase64: string,
    mimeType: string,
    requestedDocType?: DocumentType | string,
    scenario?: string
  ): Promise<CardInspectionResult>;
  askAssistant(query: string, context?: { scanId?: string; riskLevel?: RiskLevel; docType?: string }): Promise<string>;
}

export interface IRiskEngine {
  calculateRisk(params: {
    documentQualityScore: number;
    ocrMatchScore: number;
    findings: ForensicFinding[];
    securityFeatureSignals: number; // count of anomalous or missing
    codeMismatch: boolean;
    metadataSuspicious: boolean;
  }): {
    riskLevel: RiskLevel;
    confidence: number;
    primaryReasons: string[];
    recommendation: string;
  };
}

export interface IAuditService {
  record(action: AuditEvent['action'], details: string, ip: string, user?: UserProfile, severity?: AuditEvent['severity']): Promise<void>;
  getRecentLogs(limit?: number): Promise<AuditEvent[]>;
}
