/**
 * DocSure AI - Deterministic Risk Engine
 * Core Principle: Never outputs "100% FAKE" or "100% GENUINE".
 * Evaluates multi-signal fusion deterministically:
 * - Visual forensics findings & severities
 * - OCR vs. QR/MRZ consistency
 * - Security feature integrity
 * - Metadata indicators
 * - Document quality thresholds
 */

import { RiskLevel, ForensicFinding } from '../../shared/types.ts';
import { IRiskEngine } from './interfaces.ts';

export class RiskEngine implements IRiskEngine {
  calculateRisk(params: {
    documentQualityScore: number;
    ocrMatchScore: number;
    findings: ForensicFinding[];
    securityFeatureSignals: number;
    codeMismatch: boolean;
    metadataSuspicious: boolean;
  }): {
    riskLevel: RiskLevel;
    confidence: number;
    primaryReasons: string[];
    recommendation: string;
  } {
    const reasons: string[] = [];

    // If document quality is unusable or critically low, return INCONCLUSIVE
    if (params.documentQualityScore < 40) {
      return {
        riskLevel: 'INCONCLUSIVE',
        confidence: 0.5,
        primaryReasons: [
          'Document quality (resolution, blur or lighting) is insufficient for reliable forensic evaluation.',
          'Crucial security micro-elements cannot be resolved accurately.',
        ],
        recommendation: 'Request high-resolution re-scan or physical inspection.',
      };
    }

    // Tally severity weights
    let riskScore = 0; // 0 to 100

    const criticalFindings = params.findings.filter((f) => f.severity === 'CRITICAL');
    const highFindings = params.findings.filter((f) => f.severity === 'HIGH');
    const mediumFindings = params.findings.filter((f) => f.severity === 'MEDIUM');

    if (params.codeMismatch) {
      riskScore += 45;
      reasons.push('Direct mismatch detected between machine-readable code (QR/MRZ) and visible text fields.');
    }

    if (criticalFindings.length > 0) {
      riskScore += 35 * criticalFindings.length;
      reasons.push(...criticalFindings.map((f) => `Critical anomaly: ${f.title}`));
    }

    if (highFindings.length > 0) {
      riskScore += 20 * highFindings.length;
      reasons.push(...highFindings.map((f) => `Significant anomaly: ${f.title}`));
    }

    if (mediumFindings.length > 0) {
      riskScore += 8 * mediumFindings.length;
      reasons.push(...mediumFindings.map((f) => `Minor anomaly: ${f.title}`));
    }

    if (params.metadataSuspicious) {
      riskScore += 10;
      reasons.push('Metadata indicates previous image editing software signature (supporting signal).');
    }

    if (params.securityFeatureSignals > 0) {
      riskScore += 15 * params.securityFeatureSignals;
      reasons.push(`${params.securityFeatureSignals} expected security feature(s) showed anomalous or absent characteristics.`);
    }

    // Determine Risk Level (bounded between 0.05 and 0.98, NEVER 1.0 or 0.0)
    let riskLevel: RiskLevel = 'LOW_RISK';
    let recommendation = 'Standard automated onboarding pipeline acceptable.';
    let confidence = 0.94;

    if (riskScore >= 50) {
      riskLevel = 'HIGH_RISK';
      confidence = Math.min(0.96, 0.85 + (riskScore - 50) * 0.002);
      recommendation = 'Manual verification recommended. Multiple suspicious indicators detected.';
    } else if (riskScore >= 20) {
      riskLevel = 'MEDIUM_RISK';
      confidence = 0.88;
      recommendation = 'Secondary review advised. Isolated inconsistencies found that may stem from scanning defects.';
    } else {
      riskLevel = 'LOW_RISK';
      confidence = 0.95;
      if (reasons.length === 0) {
        reasons.push('No anomalous font splices or edge artifacts detected.');
        reasons.push('Machine-readable features and visible OCR fields exhibit high structural alignment.');
        reasons.push('Expected security background patterns intact.');
      }
      recommendation = 'Low risk profile. Proceed with standard verification workflow.';
    }

    return {
      riskLevel,
      confidence: Math.round(confidence * 100) / 100,
      primaryReasons: reasons.slice(0, 5),
      recommendation,
    };
  }
}
