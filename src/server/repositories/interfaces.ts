/**
 * DocSure AI - Repository Interfaces
 * Abstraction layer separating business logic from storage engines (Firestore, PostgreSQL, In-Memory)
 */

import {
  UserProfile,
  UserRole,
  ActiveSession,
  ScanRecord,
  SupportTicket,
  ReferenceTemplate,
  ModelVersion,
  DatasetEntry,
  AuditEvent,
} from '../../shared/types.ts';

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<UserProfile | null>;
  create(user: Omit<UserProfile, 'id' | 'createdAt'> & { passwordHash?: string }): Promise<UserProfile>;
  update(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null>;
  listAll(): Promise<UserProfile[]>;
  verifyPassword(email: string, plainTextPassword: string): Promise<UserProfile | null>;
  updatePassword(id: string, newPasswordHash: string): Promise<boolean>;
}

export interface ISessionRepository {
  createSession(userId: string, ipAddress: string, userAgent: string): Promise<ActiveSession>;
  findSessionById(sessionId: string): Promise<ActiveSession | null>;
  listUserSessions(userId: string): Promise<ActiveSession[]>;
  revokeSession(sessionId: string): Promise<boolean>;
  revokeAllUserSessions(userId: string): Promise<void>;
  touchSession(sessionId: string): Promise<void>;
}

export interface IScanRepository {
  create(scan: Omit<ScanRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScanRecord>;
  findById(id: string): Promise<ScanRecord | null>;
  listByUserId(userId: string): Promise<ScanRecord[]>;
  listAll(limit?: number): Promise<ScanRecord[]>;
  update(id: string, updates: Partial<ScanRecord>): Promise<ScanRecord | null>;
  delete(id: string): Promise<boolean>;
}

export interface ITicketRepository {
  create(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket>;
  findById(id: string): Promise<SupportTicket | null>;
  listByUserId(userId: string): Promise<SupportTicket[]>;
  listAll(): Promise<SupportTicket[]>;
  update(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null>;
}

export interface ITemplateRepository {
  listAll(): Promise<ReferenceTemplate[]>;
  findById(id: string): Promise<ReferenceTemplate | null>;
  findByDocumentType(docType: string): Promise<ReferenceTemplate[]>;
}

export interface IModelRegistryRepository {
  listAll(): Promise<ModelVersion[]>;
  findById(id: string): Promise<ModelVersion | null>;
  getActiveModel(type: string): Promise<ModelVersion | null>;
}

export interface IDatasetRepository {
  listAll(): Promise<DatasetEntry[]>;
  findById(id: string): Promise<DatasetEntry | null>;
}

export interface IAuditRepository {
  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent>;
  listEvents(limit?: number): Promise<AuditEvent[]>;
  listUserEvents(userId: string): Promise<AuditEvent[]>;
}
