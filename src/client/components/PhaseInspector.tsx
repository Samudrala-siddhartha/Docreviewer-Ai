import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
  Eye,
  Hash,
  Activity,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { PipelinePhaseReport } from '../../shared/types.ts';

interface PhaseInspectorProps {
  phases: PipelinePhaseReport[];
  currentRunningPhase?: number; // 1-7 or undefined
  isStepByStepMode?: boolean;
  onRunNextPhase?: () => void;
  isLoadingNext?: boolean;
}

export const PhaseInspector: React.FC<PhaseInspectorProps> = ({
  phases,
  currentRunningPhase,
  isStepByStepMode,
  onRunNextPhase,
  isLoadingNext,
}) => {
  const [selectedPhaseNum, setSelectedPhaseNum] = useState<number>(1);

  const activePhase = phases.find((p) => p.phaseNumber === selectedPhaseNum) || phases[0];

  const getPhaseIcon = (category: string) => {
    switch (category) {
      case 'SECURITY_PREFLIGHT':
        return ShieldCheck;
      case 'IMAGE_PREPROCESSING':
        return Activity;
      case 'CLASSIFICATION':
        return Layers;
      case 'OCR_EXTRACTION':
        return FileCheck2;
      case 'VISUAL_FORENSICS':
        return Eye;
      case 'CRYPTOGRAPHIC_VERIFICATION':
        return Hash;
      case 'EVIDENCE_FUSION':
      default:
        return Cpu;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#657572]/20 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#657572]/15 bg-[#F8F5ED]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#063F3A] text-[#E1B95A] font-mono text-[10px] font-bold">
              7 PHASES VERIFIED
            </span>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#063F3A]">
              Screening Pipeline Phase-by-Phase Audit
            </h3>
          </div>
          <p className="text-xs text-[#657572]">
            Detailed diagnostic metrics and mathematical checks across all 7 verification stages.
          </p>
        </div>

        {isStepByStepMode && onRunNextPhase && (
          <button
            type="button"
            onClick={onRunNextPhase}
            disabled={isLoadingNext}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#063F3A] text-white text-xs font-bold hover:bg-[#0B6B5E] shadow-sm disabled:opacity-50 transition-all shrink-0"
          >
            {isLoadingNext ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin text-[#E1B95A]" />
                <span>Executing Phase...</span>
              </>
            ) : (
              <>
                <span>Execute Next Phase</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E1B95A]" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Grid: Left phase stepper, Right phase details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#657572]/15">
        {/* Left: 7 Phases List */}
        <div className="lg:col-span-5 p-3 sm:p-4 space-y-2 bg-[#F8F5ED]/20">
          <p className="px-2 text-[10px] font-mono uppercase tracking-wider font-semibold text-[#657572] mb-1">
            Execution Sequence (Phases 1 — 7)
          </p>

          <div className="space-y-1.5">
            {phases.map((phase) => {
              const isSelected = phase.phaseNumber === selectedPhaseNum;
              const isRunning = currentRunningPhase === phase.phaseNumber;
              const Icon = getPhaseIcon(phase.category);

              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setSelectedPhaseNum(phase.phaseNumber)}
                  className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-white border-[#0B6B5E] shadow-xs ring-1 ring-[#0B6B5E]/30'
                      : 'bg-white/60 border-transparent hover:bg-white hover:border-[#657572]/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                        phase.status === 'COMPLETED'
                          ? 'bg-[#218A68]/15 text-[#218A68]'
                          : phase.status === 'FLAGGED'
                          ? 'bg-[#C94A45]/15 text-[#A5342F]'
                          : isRunning
                          ? 'bg-[#E1B95A]/20 text-[#063F3A] animate-pulse'
                          : 'bg-[#657572]/15 text-[#657572]'
                      }`}
                    >
                      {phase.phaseNumber}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#102321] truncate">
                        {phase.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#657572]">
                        <span className="font-mono">{phase.durationMs}ms</span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            phase.findingsCount > 0 ? 'text-[#C94A45]' : 'text-[#218A68]'
                          }`}
                        >
                          {phase.findingsCount > 0
                            ? `${phase.findingsCount} flagged issue(s)`
                            : 'All checks passed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {phase.status === 'COMPLETED' && (
                      <CheckCircle2 className="w-4 h-4 text-[#218A68]" />
                    )}
                    {phase.status === 'FLAGGED' && (
                      <AlertTriangle className="w-4 h-4 text-[#C94A45]" />
                    )}
                    {isRunning && (
                      <Clock className="w-4 h-4 text-[#0B6B5E] animate-spin" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Phase Granular Diagnostic Deep-Dive */}
        <div className="lg:col-span-7 p-5 sm:p-6 space-y-5">
          {activePhase ? (
            <>
              {/* Active Phase Badge & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#657572]/15">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#063F3A]/10 text-[#063F3A] font-mono text-[10px] font-bold">
                      PHASE {activePhase.phaseNumber} OF 7
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                        activePhase.status === 'COMPLETED'
                          ? 'bg-[#218A68]/15 text-[#218A68] border-[#218A68]/30'
                          : activePhase.status === 'FLAGGED'
                          ? 'bg-[#C94A45]/15 text-[#A5342F] border-[#C94A45]/30'
                          : 'bg-[#C58A25]/15 text-[#8F6A15] border-[#C58A25]/30'
                      }`}
                    >
                      {activePhase.status}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#063F3A]">
                    {activePhase.name}
                  </h4>
                </div>

                <div className="text-right font-mono text-xs text-[#657572]">
                  <div>Execution: <span className="font-bold text-[#102321]">{activePhase.durationMs} ms</span></div>
                  <div className="text-[10px] text-[#0B6B5E]">{activePhase.category}</div>
                </div>
              </div>

              {/* Phase Summary */}
              <div className="p-3.5 rounded-xl bg-[#F8F5ED] border border-[#657572]/15 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#063F3A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>Phase Executive Summary</span>
                </div>
                <p className="text-xs text-[#102321] leading-relaxed">
                  {activePhase.summary}
                </p>
              </div>

              {/* Technical Metrics Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#063F3A]">
                    Empirical Phase Metrics & Thresholds
                  </span>
                  <span className="text-[10px] font-mono text-[#657572]">
                    Algorithmic Telemetry
                  </span>
                </div>

                <div className="border border-[#657572]/15 rounded-xl overflow-hidden divide-y divide-[#657572]/15 text-xs">
                  {Object.entries(activePhase.metrics).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between px-3.5 py-2 hover:bg-[#F8F5ED]/40">
                      <span className="text-[#657572] font-medium">{key}</span>
                      <span className="font-mono font-semibold text-[#102321] text-right">
                        {String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Algorithmic Verification Steps Executed */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#063F3A]">
                  Algorithmic Verification Subroutines
                </span>
                <ul className="space-y-1.5 text-xs text-[#657572]">
                  {activePhase.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B5E] mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next/Prev Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-[#657572]/15">
                <button
                  type="button"
                  disabled={activePhase.phaseNumber <= 1}
                  onClick={() => setSelectedPhaseNum((n) => Math.max(1, n - 1))}
                  className="text-xs text-[#063F3A] hover:underline disabled:opacity-30 disabled:no-underline font-semibold"
                >
                  ← Previous Phase
                </button>
                <button
                  type="button"
                  disabled={activePhase.phaseNumber >= phases.length}
                  onClick={() => setSelectedPhaseNum((n) => Math.min(phases.length, n + 1))}
                  className="text-xs text-[#063F3A] hover:underline disabled:opacity-30 disabled:no-underline font-semibold"
                >
                  Next Phase →
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-[#657572]">
              Select a phase from the left list to inspect its forensic metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
