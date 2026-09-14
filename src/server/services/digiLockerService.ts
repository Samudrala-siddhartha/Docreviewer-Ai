/**
 * DocSure AI - DigiLocker Integration Abstraction
 * Section 32 & 72: Mock integration clearly labeled for SIH hackathon demonstration.
 * Never claims government authority or definitive verification.
 */

import { DocumentType } from '../../shared/types.ts';
import { IDigiLockerService } from './interfaces.ts';

export class MockDigiLockerService implements IDigiLockerService {
  readonly isMock = true;

  async authorize(authCode: string): Promise<{ accessToken: string; expiresAt: string }> {
    return {
      accessToken: `mock_digilocker_token_${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    };
  }

  async getPermittedDocuments(): Promise<Array<{ docId: string; docType: DocumentType; issuer: string; date: string }>> {
    return [
      {
        docId: 'DL-MOCK-AADHAAR-01',
        docType: 'AADHAAR',
        issuer: 'UIDAI (Demo Sandbox Feed)',
        date: '2023-05-14',
      },
      {
        docId: 'DL-MOCK-PAN-02',
        docType: 'PAN',
        issuer: 'Income Tax Department (Demo Sandbox Feed)',
        date: '2022-11-20',
      },
      {
        docId: 'DL-MOCK-DL-03',
        docType: 'DRIVING_LICENCE',
        issuer: 'Ministry of Road Transport and Highways (MoRTH)',
        date: '2021-08-05',
      },
    ];
  }

  async retrieveDocument(docId: string): Promise<{ docType: DocumentType; fileBuffer: Buffer; metadata: Record<string, string> }> {
    const syntheticContent = Buffer.from(
      `SYNTHETIC DEMO DIGILOCKER PAYLOAD FOR ${docId}\nTHIS IS NOT AN OFFICIAL GOVERNMENT PRODUCTION RECORD.`
    );

    let docType: DocumentType = 'AADHAAR';
    if (docId.includes('PAN')) docType = 'PAN';
    if (docId.includes('DL')) docType = 'DRIVING_LICENCE';

    return {
      docType,
      fileBuffer: syntheticContent,
      metadata: {
        retrievedFrom: 'DigiLocker Mock Sandbox v1.0',
        issuerNotice: 'Demo integration only. Official production linkage requires UIDAI/DigiLocker API credentials.',
        documentRef: docId,
      },
    };
  }
}
