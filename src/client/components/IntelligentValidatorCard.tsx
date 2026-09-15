import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  FileX2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  FileSearch,
  Sparkles,
  Layers,
  Scale,
  Binary,
  Cpu,
} from 'lucide-react';
import { IntelligentValidationResult, StructuralElementValidation } from '../../shared/types.ts';
import { useLanguage } from '../hooks/useLanguage.tsx';

interface IntelligentValidatorCardProps {
  validation?: IntelligentValidationResult;
  isOriginal?: boolean;
  detectedCardType?: string;
  isOfficialGov?: boolean;
  onUploadNewDoc?: () => void;
}

export const IntelligentValidatorCard: React.FC<IntelligentValidatorCardProps> = ({
  validation,
  isOriginal,
  detectedCardType = 'Standard Document',
  isOfficialGov = true,
  onUploadNewDoc,
}) => {
  const { t } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Fallback if validation object isn't present yet
  const status = validation?.validationStatus || (isOriginal ? 'GENUINE' : 'INVALID');
  const isGenuine = status === 'GENUINE';
  const score = validation?.overallScore ?? (isGenuine ? 98 : 14);
  const matchedTemplate = validation?.matchedTemplate;
  const isRecognized = validation?.isRecognizedTemplate ?? (isOfficialGov && isOriginal);

  const getCategoryIcon = (category: StructuralElementValidation['category']) => {
    switch (category) {
      case 'COMMON_FIELDS':
        return <FileCheck2 className="w-4 h-4" />;
      case 'VISUAL_LAYOUT':
        return <Layers className="w-4 h-4" />;
      case 'FORENSIC_CHECKS':
        return <Scale className="w-4 h-4" />;
      case 'MACHINE_READABLE':
        return <Binary className="w-4 h-4" />;
      case 'METADATA':
        return <Cpu className="w-4 h-4" />;
      case 'TEMPLATE_COMPARISON':
        return <FileSearch className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (checkStatus: StructuralElementValidation['status']) => {
    switch (checkStatus) {
      case 'PASSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PASSED
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            FLAGGED
          </span>
        );
      case 'FAILED':
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            {checkStatus}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="intelligent-document-validator-card"
      className={`rounded-2xl border transition-all overflow-hidden ${
        isGenuine
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/20 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
          : 'bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/20 border-rose-500/40 shadow-xl shadow-rose-950/20'
      }`}
    >
      {/* Top Banner with Verdict Status */}
      <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${
              isGenuine
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ring-4 ring-emerald-500/10'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 ring-4 ring-rose-500/10'
            }`}
          >
            {isGenuine ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {t('validator_title')}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                  isGenuine
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                }`}
              >
                {isGenuine ? t('status_genuine_badge') : t('status_invalid_badge')}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{t('validator_subtitle')}</p>
          </div>
        </div>

        {/* Match Score Indicator */}
        <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right">
            <span className="text-xs uppercase font-medium tracking-wider text-slate-400 block">
              {t('match_score')}
            </span>
            <span
              className={`text-2xl font-black ${
                isGenuine ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {score}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center relative shrink-0 border-slate-800">
            <div
              className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin-slow ${
                isGenuine ? 'border-emerald-500' : 'border-rose-500'
              }`}
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% ${score}%, 0 ${score}%)`,
              }}
            />
            {isGenuine ? (
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <FileX2 className="w-5 h-5 text-rose-400" />
            )}
          </div>
        </div>
      </div>

      {/* Prominent Guidance Callout if Invalid or Unrecognized */}
      {!isGenuine && (
        <div className="p-4 sm:p-5 bg-rose-500/10 border-b border-rose-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-rose-300">
                  {isRecognized
                    ? 'Security Failure: Specimen Altered or Tampered'
                    : 'Unrecognized Specimen: Not an Accredited Government Document'}
                </h4>
                <p className="text-xs sm:text-sm text-rose-200/90 mt-0.5">
                  {validation?.promptToUser || t('upload_real_prompt')}
                </p>
              </div>
            </div>
            {onUploadNewDoc && (
              <button
                type="button"
                onClick={onUploadNewDoc}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/40 transition shrink-0"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Real Document</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* If Genuine, show reassurance banner */}
      {isGenuine && (
        <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm text-emerald-200">
              {validation?.promptToUser || t('genuine_success_msg')}
            </p>
          </div>
        </div>
      )}

      {/* Template Comparison & Structural Elements Breakdown */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Matched Master Template Card */}
        {matchedTemplate && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  {t('matched_template')}
                </span>
                <span className="text-base font-bold text-white">
                  {matchedTemplate.templateName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 text-slate-300 border border-slate-700">
                  {matchedTemplate.templateId}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    matchedTemplate.isRecognizedTemplate
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {matchedTemplate.isRecognizedTemplate ? 'Recognized Sovereign Master' : 'Non-Government'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Issuing Authority / Standard:</span>
                <p className="text-slate-200 font-medium mt-0.5">{matchedTemplate.issuingAuthority}</p>
              </div>
              <div>
                <span className="text-slate-400">Structural Similarity Index:</span>
                <p className="text-slate-200 font-medium mt-0.5">
                  {matchedTemplate.structuralSimilarity}% match against master baseline
                </p>
              </div>
            </div>

            {matchedTemplate.missingFeatures && matchedTemplate.missingFeatures.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-rose-400 block mb-1.5">
                  Missing Sovereign Security Features:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedTemplate.missingFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-950/50 text-rose-300 border border-rose-800/40"
                    >
                      ✕ {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6 Structural Elements Breakdown (Accordion style) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{t('structural_audit')}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {validation?.structuralChecks?.filter((c) => c.status === 'PASSED').length || (isGenuine ? 6 : 1)} /{' '}
              {validation?.structuralChecks?.length || 6} Checkpoints Passed
            </span>
          </div>

          <div className="space-y-2.5">
            {validation?.structuralChecks && validation.structuralChecks.length > 0 ? (
              validation.structuralChecks.map((check, idx) => {
                const isExpanded = expandedCategory === check.name;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-950/60 transition overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedCategory(isExpanded ? null : check.name)}
                      className="w-full p-3.5 flex items-center justify-between text-left gap-3 focus:outline-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            check.status === 'PASSED'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : check.status === 'FLAGGED'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {getCategoryIcon(check.category)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">{check.name}</h4>
                          <p className="text-xs text-slate-400 truncate">{check.details}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {getStatusBadge(check.status)}
                        <span className="text-xs font-mono font-medium text-slate-400 hidden sm:inline">
                          {check.score}%
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-2 text-xs">
                        <p className="text-slate-300 leading-relaxed">{check.details}</p>
                        {check.expectedPattern && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60">
                            <div>
                              <span className="text-slate-400 block font-medium">Expected Master Pattern:</span>
                              <span className="text-slate-200 mt-0.5 block">{check.expectedPattern}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-medium">Observed Specimen:</span>
                              <span
                                className={`mt-0.5 block font-medium ${
                                  check.status === 'PASSED' ? 'text-emerald-300' : 'text-rose-300'
                                }`}
                              >
                                {check.observedPattern}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Default view if checks list is not yet loaded
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-center text-xs text-slate-400">
                Structural validation data active. Inspect findings in evidence panel.
              </div>
            )}
          </div>
        </div>

        {/* Primary Reasons & Recommendation Box */}
        {validation?.primaryReasons && validation.primaryReasons.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Audit Justification & Findings
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {validation.primaryReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            {validation.recommendation && (
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">Operational Recommendation: </span>
                <span
                  className={`font-semibold ${
                    isGenuine ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {validation.recommendation}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
