/**
 * DocSure AI - In-Memory Enterprise Store with Seeded Governance Data
 * Drop-in replaceable with Firestore or PostgreSQL without changing service contracts.
 */

import crypto from 'crypto';
import {
  UserProfile,
  ActiveSession,
  ScanRecord,
  SupportTicket,
  ReferenceTemplate,
  ModelVersion,
  DatasetEntry,
  AuditEvent,
} from '../../shared/types.ts';
import {
  INITIAL_TEMPLATES,
  INITIAL_MODELS,
  INITIAL_DATASETS,
} from '../../shared/constants.ts';
import {
  IUserRepository,
  ISessionRepository,
  IScanRepository,
  ITicketRepository,
  ITemplateRepository,
  IModelRegistryRepository,
  IDatasetRepository,
  IAuditRepository,
} from './interfaces.ts';

// Internal store structures
interface UserStoreRecord extends UserProfile {
  passwordHash: string;
}

// Cryptographic password utilities (PBKDF2 with salt + constant-time comparison)
export function hashPassword(plainText: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(plainText, salt, 10000, 64, 'sha512').toString('hex');
  return `pbkdf2$${salt}$${hash}`;
}

export function comparePassword(plainText: string, storedHash: string): boolean {
  if (!storedHash || !plainText) return false;
  // If stored in PBKDF2 format
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const originalHash = parts[2];
    const computedHash = crypto.pbkdf2Sync(plainText, salt, 10000, 64, 'sha512').toString('hex');
    try {
      const bufA = Buffer.from(computedHash, 'hex');
      const bufB = Buffer.from(originalHash, 'hex');
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }
  // Constant-time fallback for initial demo seeded credentials
  const bufA = Buffer.from(plainText);
  const bufB = Buffer.from(storedHash);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

class InMemoryDatabase {
  users: Map<string, UserStoreRecord> = new Map();
  sessions: Map<string, ActiveSession> = new Map();
  scans: Map<string, ScanRecord> = new Map();
  tickets: Map<string, SupportTicket> = new Map();
  templates: Map<string, ReferenceTemplate> = new Map();
  models: Map<string, ModelVersion> = new Map();
  datasets: Map<string, DatasetEntry> = new Map();
  auditLogs: AuditEvent[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed templates, models, datasets
    INITIAL_TEMPLATES.forEach((t) => this.templates.set(t.id, t));
    INITIAL_MODELS.forEach((m) => this.models.set(m.id, m));
    INITIAL_DATASETS.forEach((d) => this.datasets.set(d.id, d));

    // Seed Enterprise Demo Users with PBKDF2 hashes
    const defaultUsers: UserStoreRecord[] = [
      {
        id: 'usr_enterprise_01',
        email: 'user@docsure.ai',
        name: 'Aarav Sharma',
        role: 'USER',
        isEmailVerified: true,
        twoFactorEnabled: true,
        createdAt: '2025-01-10T09:00:00.000Z',
        activeSessionsCount: 1,
        organization: 'FinTech Onboarding Desk',
        passwordHash: hashPassword('User@1234'),
      },
      {
        id: 'usr_reviewer_02',
        email: 'reviewer@docsure.ai',
        name: 'Dr. Priya Sen (Forensics Lead)',
        role: 'REVIEWER',
        isEmailVerified: true,
        twoFactorEnabled: true,
        createdAt: '2024-11-05T08:30:00.000Z',
        activeSessionsCount: 1,
        organization: 'DocSure SIH Verification Unit',
        passwordHash: hashPassword('Reviewer@1234'),
      },
      {
        id: 'usr_admin_03',
        email: 'admin@docsure.ai',
        name: 'Siddartha Samudrala (Chief Architect)',
        role: 'ADMIN',
        isEmailVerified: true,
        twoFactorEnabled: true,
        createdAt: '2024-09-01T00:00:00.000Z',
        activeSessionsCount: 2,
        organization: 'DocSure AI Enterprise Gov',
        passwordHash: hashPassword('Admin@1234'),
      },
    ];

    defaultUsers.forEach((u) => this.users.set(u.id, u));

    // Seed some initial scans for realistic SIH demonstration & audit inspection
    const sampleScan1: ScanRecord = {
      id: 'scn_aadhaar_clean_981',
      userId: 'usr_enterprise_01',
      documentType: 'AADHAAR',
      classifiedType: 'AADHAAR',
      classificationConfidence: 0.98,
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      quality: {
        overall: 'GOOD',
        blurScore: 88,
        resolutionWidth: 1920,
        resolutionHeight: 1080,
        rotationAngle: 0,
        perspectiveDistortion: false,
        glareDetected: false,
        shadowsDetected: false,
        boundaryClear: true,
        readabilityScore: 94,
        recommendations: ['Image has sufficient contrast and clear boundaries.'],
      },
      metadata: {
        fileSize: 420512,
        mimeType: 'image/jpeg',
        fileNameSanitized: 'id_doc_aadhaar_front_sanitized.jpg',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        softwareDetected: 'Camera Hardware Sensor (Samsung S23)',
        isEditedSoftwareSuspect: false,
        explanation: 'Metadata is consistent with direct camera capture without graphic editor signatures.',
      },
      extractedFields: [
        { field: 'name', label: 'Full Name', value: 'Aarav Sharma', confidence: 0.98, matchesReferenceRule: true },
        { field: 'dob', label: 'Date of Birth', value: '14/08/1992', confidence: 0.97, matchesReferenceRule: true },
        { field: 'gender', label: 'Gender', value: 'Male / M', confidence: 0.99, matchesReferenceRule: true },
        { field: 'id_number', label: 'Aadhaar Number', value: 'XXXX XXXX 4192 (Masked)', confidence: 0.99, matchesReferenceRule: true },
      ],
      findings: [],
      securityFeatures: [
        { featureName: 'Guilloche Security Pattern', status: 'PRESENT', confidence: 0.96, notes: 'Continuous unbroken geometric fine line work detected.', isCrucial: true },
        { featureName: 'UIDAI Logo Geometry', status: 'PRESENT', confidence: 0.99, notes: 'Aspect ratio and PMS ink match standard specification.', isCrucial: true },
        { featureName: 'Micro-text Line', status: 'PRESENT', confidence: 0.91, notes: 'Consistent micro-resolution typography.', isCrucial: false },
      ],
      codeAnalysis: {
        type: 'QR',
        detected: true,
        matchesOCR: 'MATCH',
        notes: 'Secure QR signature decoded successfully; demographic digest matches visible text.',
      },
      duplicateAnalysis: {
        exactMatchFound: false,
        perceptualSimilarityScore: 12,
        notes: 'No unauthorized duplicate in enterprise hash repository.',
      },
      result: {
        riskLevel: 'LOW_RISK',
        confidence: 0.96,
        primaryReasons: [
          'No anomalous font splices or edge artifacts detected.',
          'Secure QR payload cryptographically matches visible demographic fields.',
          'Guilloche wave background is continuous across all text boundaries.',
        ],
        checksCompleted: ['File Integrity', 'Quality Assessment', 'OCR Extraction', 'QR Signature', 'Forensic Geometry'],
        checksUnavailable: ['Government Central Database Live Ping (Requires Authorized Production Registrar Access)'],
        recommendation: 'Standard automated workflow acceptable. Proceed with standard verification.',
        disclaimer: 'AI-assisted screening result. This is not a definitive authenticity determination.',
      },
    };

    const sampleScan2: ScanRecord = {
      id: 'scn_pan_tampered_742',
      userId: 'usr_enterprise_01',
      documentType: 'PAN',
      classifiedType: 'PAN',
      classificationConfidence: 0.95,
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 23).toISOString(),
      quality: {
        overall: 'ACCEPTABLE',
        blurScore: 71,
        resolutionWidth: 1200,
        resolutionHeight: 760,
        rotationAngle: 2,
        perspectiveDistortion: false,
        glareDetected: false,
        shadowsDetected: true,
        boundaryClear: true,
        readabilityScore: 78,
        recommendations: ['Slight JPEG compression noise observed around text bounding blocks.'],
      },
      metadata: {
        fileSize: 184500,
        mimeType: 'image/jpeg',
        fileNameSanitized: 'pan_card_submitted_scan.jpg',
        sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        softwareDetected: 'Adobe Photoshop 24.2 (Windows)',
        isEditedSoftwareSuspect: true,
        explanation: 'Metadata indicates prior editing software; this is a supporting signal and does not independently establish document fraud.',
      },
      extractedFields: [
        { field: 'name', label: 'Cardholder Name', value: 'VIKRAMADITYA K. JOSHI', confidence: 0.89 },
        { field: 'father_name', label: 'Father Name', value: 'KESHAV JOSHI', confidence: 0.92 },
        { field: 'dob', label: 'Date of Birth', value: '01/01/1985', confidence: 0.81, matchesReferenceRule: false },
        { field: 'id_number', label: 'PAN Number', value: 'ABCDE1234F', confidence: 0.95 },
      ],
      findings: [
        {
          id: 'EV-001',
          category: 'VISUAL_FORENSICS',
          title: 'Font Rendering & Baseline Inconsistency',
          description: 'DOB text characters show different pixel antialiasing and baseline drop compared to adjacent parent name field.',
          severity: 'HIGH',
          confidence: 0.92,
          region: { x: 12, y: 48, width: 38, height: 12 },
          evidenceType: 'Error Level Analysis (ELA) & Typography Gradient',
          modelVersion: 'MDL-VISUAL-FORENSICS-2.4',
          explanation: 'Significant compression anomaly around the date digits indicating potential localized replacement.',
        },
        {
          id: 'EV-002',
          category: 'QR_BARCODE_MRZ',
          title: 'QR / OCR Demographic Mismatch',
          description: 'Decoded QR block yields birth year 1990, while visible text OCR field displays 1985.',
          severity: 'CRITICAL',
          confidence: 0.97,
          region: { x: 68, y: 35, width: 28, height: 45 },
          evidenceType: 'Demographic Check Digit Comparison',
          modelVersion: 'MDL-OCR-LAYOUTLM-1.8',
          explanation: 'A discrepancy between visible text and embedded machine-readable data strongly indicates alteration of one source.',
        },
        {
          id: 'EV-003',
          category: 'SECURITY_FEATURE',
          title: 'Optical Hologram Region Flatness',
          description: 'Hologram position shows specular uniform reflection without rainbow diffraction dispersion.',
          severity: 'MEDIUM',
          confidence: 0.84,
          region: { x: 5, y: 15, width: 20, height: 25 },
          evidenceType: 'Reflectance & Texture Gradient Map',
          modelVersion: 'MDL-VISUAL-FORENSICS-2.4',
          explanation: 'Holographic sticker lacks dynamic angular optical dispersion pattern expected on legitimate physical cards.',
        },
      ],
      securityFeatures: [
        { featureName: 'ITD Hologram', status: 'ANOMALOUS', confidence: 0.84, notes: 'Reflectance signature lacks multi-angle diffraction.', isCrucial: true },
        { featureName: 'Ghost Image Behind Photo', status: 'ABSENT', confidence: 0.79, notes: 'Secondary transparent portrait watermark not detected.', isCrucial: false },
      ],
      codeAnalysis: {
        type: 'QR',
        detected: true,
        matchesOCR: 'MISMATCH',
        mismatchedFields: ['Date of Birth (QR: 1990 vs OCR: 1985)'],
        notes: 'Discrepancy detected between QR demographic payload and card surface OCR.',
      },
      duplicateAnalysis: {
        exactMatchFound: false,
        perceptualSimilarityScore: 24,
        notes: 'No prior match in localized repository.',
      },
      result: {
        riskLevel: 'HIGH_RISK',
        confidence: 0.93,
        primaryReasons: [
          'Direct conflict between machine-readable QR demographic record and visible DOB text.',
          'Local compression and typography antialiasing anomaly detected around DOB field.',
          'Supporting metadata points to recent graphic editing application.',
        ],
        checksCompleted: ['File Integrity', 'Quality Assessment', 'OCR Extraction', 'QR Signature', 'Forensic Geometry', 'Metadata Audit'],
        checksUnavailable: ['Physical Tactile Inspection', 'Microscopic Optical Microscopy'],
        recommendation: 'Manual verification recommended. Do not approve automated onboarding without secondary proof.',
        disclaimer: 'AI-assisted screening result. This is not a definitive authenticity determination.',
      },
      manualReviewStatus: 'NEEDS_MORE_INFORMATION',
      manualReviewNotes: 'Flagged for reviewer inspection. Requested applicant provide original DigiLocker issued PDF or physically inspect card.',
      reviewerId: 'usr_reviewer_02',
      reviewedAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    };

    this.scans.set(sampleScan1.id, sampleScan1);
    this.scans.set(sampleScan2.id, sampleScan2);

    // Seed sample support ticket
    const ticket1: SupportTicket = {
      id: 'TCK-2026-081',
      userId: 'usr_enterprise_01',
      userEmail: 'user@docsure.ai',
      scanId: 'scn_pan_tampered_742',
      category: 'SCAN_DISPUTE',
      priority: 'HIGH',
      subject: 'Inquiry on QR/OCR mismatch result for applicant ID',
      description: 'The scan shows high risk due to QR date mismatch. We would like clarification on how to submit a secondary verification document.',
      status: 'IN_PROGRESS',
      createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      assignedTo: 'Dr. Priya Sen (Forensics Lead)',
    };
    this.tickets.set(ticket1.id, ticket1);

    // Seed audit logs
    this.auditLogs.push(
      {
        id: 'aud_001',
        userId: 'usr_admin_03',
        userEmail: 'admin@docsure.ai',
        role: 'ADMIN',
        action: 'LOGIN',
        details: 'Admin logged in with verified 2FA token from IP 192.168.1.1',
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
        severity: 'INFO',
      },
      {
        id: 'aud_002',
        userId: 'usr_enterprise_01',
        userEmail: 'user@docsure.ai',
        role: 'USER',
        action: 'SCAN_CREATED',
        details: 'Scan initialized for document category PAN (ID: scn_pan_tampered_742)',
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
        severity: 'INFO',
      },
      {
        id: 'aud_003',
        userId: 'usr_enterprise_01',
        userEmail: 'user@docsure.ai',
        role: 'USER',
        action: 'SCAN_ANALYZED',
        details: 'Scan completed with deterministic Risk Rating: HIGH_RISK (QR/OCR mismatch)',
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
        severity: 'WARNING',
      }
    );
  }
}

// Global in-memory singleton
export const db = new InMemoryDatabase();

// Repository Implementations
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<UserProfile | null> {
    const user = db.users.get(id);
    if (!user) return null;
    const { passwordHash, ...profile } = user;
    return profile;
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const cleanEmail = (email || '').trim().toLowerCase();
    for (const user of db.users.values()) {
      if (user.email.trim().toLowerCase() === cleanEmail) {
        const { passwordHash, ...profile } = user;
        return profile;
      }
    }
    return null;
  }

  async create(userData: Omit<UserProfile, 'id' | 'createdAt'> & { passwordHash?: string }): Promise<UserProfile> {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const record: UserStoreRecord = {
      ...userData,
      email: cleanEmail,
      id,
      createdAt: new Date().toISOString(),
      passwordHash: userData.passwordHash ? (userData.passwordHash.startsWith('pbkdf2$') ? userData.passwordHash : hashPassword(userData.passwordHash)) : hashPassword('Default@1234'),
    };
    db.users.set(id, record);
    const { passwordHash, ...profile } = record;
    return profile;
  }

  async update(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const existing = db.users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    if (updates.email) {
      updated.email = updates.email.trim().toLowerCase();
    }
    db.users.set(id, updated);
    const { passwordHash, ...profile } = updated;
    return profile;
  }

  async listAll(): Promise<UserProfile[]> {
    return Array.from(db.users.values()).map(({ passwordHash, ...p }) => p);
  }

  async verifyPassword(email: string, plainText: string): Promise<UserProfile | null> {
    const cleanEmail = (email || '').trim().toLowerCase();
    for (const user of db.users.values()) {
      if (user.email.trim().toLowerCase() === cleanEmail) {
        if (comparePassword(plainText, user.passwordHash)) {
          const { passwordHash, ...profile } = user;
          return profile;
        }
      }
    }
    return null;
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<boolean> {
    const existing = db.users.get(id);
    if (!existing) return false;
    existing.passwordHash = newPasswordHash.startsWith('pbkdf2$') ? newPasswordHash : hashPassword(newPasswordHash);
    return true;
  }
}

export class SessionRepository implements ISessionRepository {
  async createSession(userId: string, ipAddress: string, userAgent: string): Promise<ActiveSession> {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const session: ActiveSession = {
      id: sessionId,
      userId,
      ipAddress: ipAddress || '127.0.0.1',
      userAgent: userAgent || 'DocSure Client/1.0',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      isCurrent: true,
    };
    db.sessions.set(sessionId, session);
    return session;
  }

  async findSessionById(sessionId: string): Promise<ActiveSession | null> {
    const session = db.sessions.get(sessionId);
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      db.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  async listUserSessions(userId: string): Promise<ActiveSession[]> {
    const now = Date.now();
    const list: ActiveSession[] = [];
    for (const s of db.sessions.values()) {
      if (s.userId === userId && new Date(s.expiresAt).getTime() > now) {
        list.push(s);
      }
    }
    return list;
  }

  async revokeSession(sessionId: string): Promise<boolean> {
    return db.sessions.delete(sessionId);
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    for (const [id, s] of db.sessions.entries()) {
      if (s.userId === userId) {
        db.sessions.delete(id);
      }
    }
  }

  async touchSession(sessionId: string): Promise<void> {
    const s = db.sessions.get(sessionId);
    if (s) {
      s.expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    }
  }
}

export class ScanRepository implements IScanRepository {
  async create(scanData: Omit<ScanRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScanRecord> {
    const id = `scn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const record: ScanRecord = {
      ...scanData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    db.scans.set(id, record);
    return record;
  }

  async findById(id: string): Promise<ScanRecord | null> {
    return db.scans.get(id) || null;
  }

  async listByUserId(userId: string): Promise<ScanRecord[]> {
    const list: ScanRecord[] = [];
    for (const s of db.scans.values()) {
      if (s.userId === userId) {
        list.push(s);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async listAll(limit: number = 50): Promise<ScanRecord[]> {
    return Array.from(db.scans.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async update(id: string, updates: Partial<ScanRecord>): Promise<ScanRecord | null> {
    const existing = db.scans.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    db.scans.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return db.scans.delete(id);
  }
}

export class TicketRepository implements ITicketRepository {
  async create(data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> {
    const id = `TCK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const ticket: SupportTicket = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    db.tickets.set(id, ticket);
    return ticket;
  }

  async findById(id: string): Promise<SupportTicket | null> {
    return db.tickets.get(id) || null;
  }

  async listByUserId(userId: string): Promise<SupportTicket[]> {
    const list: SupportTicket[] = [];
    for (const t of db.tickets.values()) {
      if (t.userId === userId) list.push(t);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async listAll(): Promise<SupportTicket[]> {
    return Array.from(db.tickets.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async update(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null> {
    const existing = db.tickets.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    db.tickets.set(id, updated);
    return updated;
  }
}

export class TemplateRepository implements ITemplateRepository {
  async listAll(): Promise<ReferenceTemplate[]> {
    return Array.from(db.templates.values());
  }

  async findById(id: string): Promise<ReferenceTemplate | null> {
    return db.templates.get(id) || null;
  }

  async findByDocumentType(docType: string): Promise<ReferenceTemplate[]> {
    return Array.from(db.templates.values()).filter((t) => t.documentType === docType);
  }
}

export class ModelRegistryRepository implements IModelRegistryRepository {
  async listAll(): Promise<ModelVersion[]> {
    return Array.from(db.models.values());
  }

  async findById(id: string): Promise<ModelVersion | null> {
    return db.models.get(id) || null;
  }

  async getActiveModel(type: string): Promise<ModelVersion | null> {
    for (const m of db.models.values()) {
      if (m.type === type && m.status === 'ACTIVE') return m;
    }
    return null;
  }
}

export class DatasetRepository implements IDatasetRepository {
  async listAll(): Promise<DatasetEntry[]> {
    return Array.from(db.datasets.values());
  }

  async findById(id: string): Promise<DatasetEntry | null> {
    return db.datasets.get(id) || null;
  }
}

export class AuditRepository implements IAuditRepository {
  async logEvent(eventData: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
    const event: AuditEvent = {
      ...eventData,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    db.auditLogs.unshift(event);
    if (db.auditLogs.length > 500) {
      db.auditLogs.pop();
    }
    return event;
  }

  async listEvents(limit: number = 100): Promise<AuditEvent[]> {
    return db.auditLogs.slice(0, limit);
  }

  async listUserEvents(userId: string): Promise<AuditEvent[]> {
    return db.auditLogs.filter((e) => e.userId === userId);
  }
}
