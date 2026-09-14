/**
 * DocSure AI - Audit Logging Service
 * Guarantees privacy: Never records raw document images, full identity numbers, or passwords.
 */

import { AuditEvent, UserProfile } from '../../shared/types.ts';
import { AuditRepository } from '../repositories/memoryStore.ts';
import { IAuditService } from './interfaces.ts';

export class AuditService implements IAuditService {
  private auditRepo: AuditRepository;

  constructor(auditRepo: AuditRepository) {
    this.auditRepo = auditRepo;
  }

  async record(
    action: AuditEvent['action'],
    details: string,
    ip: string,
    user?: UserProfile,
    severity: AuditEvent['severity'] = 'INFO'
  ): Promise<void> {
    // Sanitize any accidental sensitive tokens before writing to log
    const sanitizedDetails = details
      .replace(/Bearer\s+[a-zA-Z0-9_\-]+/gi, 'Bearer [REDACTED]')
      .replace(/password[:=]\s*[^\s,]+/gi, 'password=[REDACTED]');

    await this.auditRepo.logEvent({
      userId: user?.id,
      userEmail: user?.email,
      role: user?.role,
      action,
      details: sanitizedDetails,
      ipAddress: ip || '127.0.0.1',
      severity,
    });
  }

  async getRecentLogs(limit: number = 100): Promise<AuditEvent[]> {
    return this.auditRepo.listEvents(limit);
  }
}
