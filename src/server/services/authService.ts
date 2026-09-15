/**
 * DocSure AI - Authentication Service
 * Enterprise session management, role verification, and privacy-conscious credentials handling.
 */

import { UserProfile, ActiveSession } from '../../shared/types.ts';
import { UserRepository, SessionRepository } from '../repositories/memoryStore.ts';
import { IAuthService, IAuditService } from './interfaces.ts';

export class AuthService implements IAuthService {
  private userRepo: UserRepository;
  private sessionRepo: SessionRepository;
  private auditService: IAuditService;

  constructor(userRepo: UserRepository, sessionRepo: SessionRepository, auditService: IAuditService) {
    this.userRepo = userRepo;
    this.sessionRepo = sessionRepo;
    this.auditService = auditService;
  }

  async signup(
    email: string,
    name: string,
    password: string,
    organization?: string,
    ip: string = '127.0.0.1',
    userAgent: string = 'DocSure Web Client'
  ): Promise<{ user: UserProfile; token: string }> {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    // Standard RFC-compliant email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new Error('Please provide a valid email address.');
    }

    if (!cleanName) {
      throw new Error('Name is required and cannot be blank.');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const existing = await this.userRepo.findByEmail(cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const user = await this.userRepo.create({
      email: cleanEmail,
      name: cleanName,
      role: 'USER',
      isEmailVerified: true, // For demo convenience
      twoFactorEnabled: false,
      activeSessionsCount: 1,
      organization: (organization || 'Standard User Desk').trim(),
      passwordHash: password,
    });

    const session = await this.sessionRepo.createSession(user.id, ip, userAgent);
    await this.auditService.record('LOGIN', `New user registered and authenticated: ${user.email}`, ip, user);

    return { user, token: session.id };
  }

  async login(email: string, password: string, ip: string, userAgent: string): Promise<{ user: UserProfile; token: string }> {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Email and password are required.');
    }

    const user = await this.userRepo.verifyPassword(cleanEmail, password);
    if (!user) {
      await this.auditService.record('FAILED_LOGIN', `Failed login attempt for identifier ${cleanEmail}`, ip, undefined, 'WARNING');
      throw new Error('Invalid email or password.');
    }

    const session = await this.sessionRepo.createSession(user.id, ip, userAgent);
    await this.auditService.record('LOGIN', `User signed in successfully: ${user.email} (Role: ${user.role})`, ip, user);

    return { user, token: session.id };
  }

  async logout(token: string): Promise<boolean> {
    const session = await this.sessionRepo.findSessionById(token);
    if (session) {
      const user = await this.userRepo.findById(session.userId);
      if (user) {
        await this.auditService.record('LOGOUT', `Session revoked: ${token.substring(0, 10)}...`, session.ipAddress, user);
      }
      return this.sessionRepo.revokeSession(token);
    }
    return false;
  }

  async validateSession(token: string): Promise<UserProfile | null> {
    if (!token) return null;
    const session = await this.sessionRepo.findSessionById(token);
    if (!session) return null;

    const user = await this.userRepo.findById(session.userId);
    if (!user) return null;

    await this.sessionRepo.touchSession(token);
    return user;
  }

  async getUserSessions(userId: string): Promise<ActiveSession[]> {
    return this.sessionRepo.listUserSessions(userId);
  }

  async revokeSession(sessionId: string): Promise<boolean> {
    return this.sessionRepo.revokeSession(sessionId);
  }

  async changePassword(userId: string, oldPass: string, newPass: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user) return false;

    const verified = await this.userRepo.verifyPassword(user.email, oldPass);
    if (!verified) {
      throw new Error('Current password does not match.');
    }

    if (newPass.length < 8) {
      throw new Error('New password must be at least 8 characters.');
    }

    await this.userRepo.updatePassword(userId, newPass);
    await this.auditService.record('SECURITY_EVENT', `Password changed for user ${user.email}`, '127.0.0.1', user, 'INFO');
    return true;
  }

  async toggle2FA(userId: string, enable: boolean): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user) return false;

    await this.userRepo.update(userId, { twoFactorEnabled: enable });
    await this.auditService.record(
      'SECURITY_EVENT',
      `Two-factor authentication ${enable ? 'enabled' : 'disabled'}`,
      '127.0.0.1',
      user,
      'INFO'
    );
    return true;
  }
}
