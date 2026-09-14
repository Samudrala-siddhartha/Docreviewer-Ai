/**
 * DocSure AI - Ephemeral Storage Service
 * Privacy Guarantee: Documents are held only temporarily in memory/ephemeral storage
 * during screening, never permanently stored by default.
 */

import { IStorageService } from './interfaces.ts';

interface EphemeralFile {
  id: string;
  buffer: Buffer;
  mimeType: string;
  originalName: string;
  hash: string;
  size: number;
  expiresAt: number; // timestamp ms
}

export class StorageService implements IStorageService {
  private fileStore = new Map<string, EphemeralFile>();
  private defaultTtlMs = 15 * 60 * 1000; // 15 minutes max processing lifespan

  constructor() {
    // Background garbage collection every 2 minutes
    setInterval(() => this.purgeExpired(), 2 * 60 * 1000);
  }

  async storeTemporaryFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<{ fileId: string; safePath: string; hash: string; size: number }> {
    // Generate secure randomized ID, never trust user filename
    const fileId = `doc_tmp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Simple SHA-256 calculation for file integrity check
    let hash = 'simulated-sha256';
    try {
      const crypto = await import('crypto');
      hash = crypto.createHash('sha256').update(buffer).digest('hex');
    } catch {
      hash = `hash_${Math.random().toString(36).substring(2, 12)}`;
    }

    const file: EphemeralFile = {
      id: fileId,
      buffer,
      mimeType,
      originalName: originalName.replace(/[^a-zA-Z0-9._-]/g, '_'),
      hash,
      size: buffer.length,
      expiresAt: Date.now() + this.defaultTtlMs,
    };

    this.fileStore.set(fileId, file);

    return {
      fileId,
      safePath: `/ephemeral/${fileId}`,
      hash,
      size: buffer.length,
    };
  }

  async getTemporaryFile(fileId: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    const file = this.fileStore.get(fileId);
    if (!file) return null;
    if (Date.now() > file.expiresAt) {
      this.fileStore.delete(fileId);
      return null;
    }
    return { buffer: file.buffer, mimeType: file.mimeType };
  }

  async purgeTemporaryFile(fileId: string): Promise<boolean> {
    return this.fileStore.delete(fileId);
  }

  private purgeExpired() {
    const now = Date.now();
    for (const [id, f] of this.fileStore.entries()) {
      if (now > f.expiresAt) {
        this.fileStore.delete(id);
      }
    }
  }
}
