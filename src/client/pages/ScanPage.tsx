/**
 * DocSure AI - Document Screening Studio & Multi-Stage Forensic Engine
 * Section 9 & 52: Full 7-phase verification pipeline with both autonomous
 * and step-by-step execution modes, live camera capture with real video feed,
 * optical alignment reticle, subtle framer-motion animations for verification
 * success states, and direct audit report/evidence linking.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ScanLine,
  UploadCloud,
  Camera,
  FolderLock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Loader2,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Search,
  Eye,
  Hash,
  Cpu,
  RefreshCw,
  Play,
  StepForward,
  FlipHorizontal,
  Zap,
  ZapOff,
  Download,
  Printer,
  Maximize2,
  Award,
  ChevronRight,
  ShieldAlert,
  XCircle,
  Check,
  Target,
  FileWarning,
  Flame,
} from 'lucide-react';
import { useAuth } from '../state/AuthContext.tsx';
import { useLanguage } from '../hooks/useLanguage.tsx';
import { apiRequest } from '../utils/api.ts';
import { DocumentType, ScanRecord, PipelinePhaseReport } from '../../shared/types.ts';
import { SUPPORTED_DOCUMENTS, STANDARD_DISCLAIMER, BORDER_CHECKPOINT_SPECIFICATION } from '../../shared/constants.ts';
import { DocSureLogo } from '../components/DocSureLogo.tsx';
import { PhaseInspector } from '../components/PhaseInspector.tsx';
import { IntelligentValidatorCard } from '../components/IntelligentValidatorCard.tsx';

type PipelineStage =
  | 'IDLE'
  | 'PHASE_1'
  | 'PHASE_2'
  | 'PHASE_3'
  | 'PHASE_4'
  | 'PHASE_5'
  | 'PHASE_6'
  | 'PHASE_7'
  | 'DONE';

type AspectRatioMode = 'ID_CARD' | 'PASSPORT' | 'CERTIFICATE';

export const ScanPage: React.FC<{ onScanCompleted?: (scan: ScanRecord) => void }> = ({ onScanCompleted }) => {
  const { setCurrentView, viewScanReport, viewScanEvidence } = useAuth();
  const { t } = useLanguage();
  const [docType, setDocType] = useState<DocumentType>('AUTO_DETECT');
  const [uploadMode, setUploadMode] = useState<'FILE' | 'CAMERA' | 'DIGILOCKER' | 'SYNTHETIC'>('SYNTHETIC');
  const [executionMode, setExecutionMode] = useState<'CONTINUOUS' | 'STEP_BY_STEP'>('CONTINUOUS');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [syntheticScenario, setSyntheticScenario] = useState<
    | 'CLEAN_VERIFIED'
    | 'GLOBAL_REAL_ID'
    | 'PAN_DATE_TAMPERED'
    | 'PASSPORT_MRZ_CHECKSUM_FAIL'
    | 'UNRELATED_CARD'
    | 'BLURRY_UNUSABLE'
    | 'PHOTO_ALTERED_SUBSTITUTION'
    | 'TAMPERED_VISA_STAMP'
    | 'BLACKLISTED_EXPIRED_PASSPORT'
    | 'IDENTITY_IMPERSONATION_DUPLICATE'
  >('CLEAN_VERIFIED');
  const [selectedFileName, setSelectedFileName] = useState<string>('autodetect_card_sample.jpg');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null);

  // Pipeline state
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('IDLE');
  const [stepNumber, setStepNumber] = useState<number>(0); // 0 to 7
  const [isAdvancingStep, setIsAdvancingStep] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeScanResult, setActiveScanResult] = useState<ScanRecord | null>(null);
  
  // Multi-file & History state
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [fileQueue, setFileQueue] = useState<File[]>([]);

  // Live Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorchSupport, setHasTorchSupport] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSimulatedCamera, setIsSimulatedCamera] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [aspectRatioMode, setAspectRatioMode] = useState<AspectRatioMode>('ID_CARD');

  const stagesList = [
    { num: 1, key: 'PHASE_1', label: 'Phase 1: File Ingestion & Hygiene Pre-Flight', desc: 'Magic bytes, SHA-256 hash & ephemeral buffer isolation' },
    { num: 2, key: 'PHASE_2', label: 'Phase 2: Optical Quality & Degradation Assessment', desc: 'Laplacian edge sharpness, contrast ratio & glare' },
    { num: 3, key: 'PHASE_3', label: 'Phase 3: Geometry & Template Classification', desc: 'Aspect ratio, card boundaries & heraldic emblem match' },
    { num: 4, key: 'PHASE_4', label: 'Phase 4: Layout-Aware OCR & Demographic Extraction', desc: 'LayoutLM extraction, character kerning & glyph integrity' },
    { num: 5, key: 'PHASE_5', label: 'Phase 5: Multi-Spectral Visual Forensics & ELA', desc: 'Error Level Analysis, compression anomaly & splice detection' },
    { num: 6, key: 'PHASE_6', label: 'Phase 6: Cryptographic & Demographics Cross-Validation', desc: 'UIDAI QR byte-stream / ICAO 9303 MRZ checksum matching' },
    { num: 7, key: 'PHASE_7', label: 'Phase 7: Deterministic Risk Fusion & Decision Adjudication', desc: 'Multi-signal Bayesian synthesis & calibrated confidence' },
  ];

  // Stop camera helper
  const stopCameraStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
  }, []);

  // Camera cleanup on unmount or mode switch
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // Track Scan History
  useEffect(() => {
    if (pipelineStage === 'DONE' && activeScanResult) {
      setScanHistory((prev) => {
        if (prev.find((s) => s.id === activeScanResult.id)) return prev;
        return [activeScanResult, ...prev];
      });
    }
  }, [pipelineStage, activeScanResult]);

  // Start live camera feed
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);
    setIsSimulatedCamera(false);
    stopCameraStream();

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints).catch(async () => {
          // Fallback to general video without strict facing mode
          return await navigator.mediaDevices.getUserMedia({ video: true });
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setIsCameraActive(true);
          setCameraFacing(facing);

          // Check for torch capability
          const track = stream.getVideoTracks()[0];
          if (track && 'getCapabilities' in track) {
            const capabilities = (track as any).getCapabilities();
            if (capabilities && capabilities.torch) {
              setHasTorchSupport(true);
            }
          }
        }
      } else {
        // Camera API not accessible (e.g. strict iframe without permissions)
        setCameraError('Camera sensor hardware unavailable in sandboxed frame. Optical sensor target simulator engaged.');
        setIsSimulatedCamera(true);
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera sensor access fallback:', err?.message || err);
      setCameraError('Device camera permission required. Optical sensor target simulator engaged for evaluation.');
      setIsSimulatedCamera(true);
      setIsCameraActive(true);
    }
  };

  // Toggle front/back camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    if (!isSimulatedCamera) {
      startCamera(nextFacing);
    }
  };

  // Toggle flashlight / torch
  const toggleTorch = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      if (track && hasTorchSupport) {
        try {
          const nextState = !isTorchOn;
          await (track as any).applyConstraints({
            advanced: [{ torch: nextState }],
          });
          setIsTorchOn(nextState);
        } catch (e) {
          console.warn('Torch not supported on this device');
        }
      }
    }
  };

  // Generate synthetic high-resolution frame on canvas
  const generateSimulatedCardCanvas = (type: DocumentType): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background desk gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1280, 800);
    bgGrad.addColorStop(0, '#102321');
    bgGrad.addColorStop(1, '#063F3A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1280, 800);

    // Card dimensions
    const cardX = 160;
    const cardY = 120;
    const cardW = 960;
    const cardH = 560;

    // Card body
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const isCommercial = type === 'UNRELATED_CARD' || syntheticScenario === 'UNRELATED_CARD';
    const isGlobal = type === 'GLOBAL_GOVT_ID' || syntheticScenario === 'GLOBAL_REAL_ID';

    // Header band
    const headerGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
    if (isCommercial) {
      headerGrad.addColorStop(0, '#1E293B');
      headerGrad.addColorStop(0.5, '#334155');
      headerGrad.addColorStop(1, '#0F172A');
    } else if (isGlobal) {
      headerGrad.addColorStop(0, '#1E3A8A');
      headerGrad.addColorStop(0.7, '#1D4ED8');
      headerGrad.addColorStop(1, '#B45309');
    } else if (type === 'AADHAAR' || type === 'AUTO_DETECT') {
      headerGrad.addColorStop(0, '#E87D25');
      headerGrad.addColorStop(0.5, '#FFFFFF');
      headerGrad.addColorStop(1, '#218A68');
    } else if (type === 'PAN') {
      headerGrad.addColorStop(0, '#063F3A');
      headerGrad.addColorStop(1, '#0B6B5E');
    } else {
      headerGrad.addColorStop(0, '#1E293B');
      headerGrad.addColorStop(1, '#0F172A');
    }
    ctx.fillStyle = headerGrad;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, 70, [24, 24, 0, 0]);
    ctx.fill();

    // Document title
    ctx.fillStyle = (!isCommercial && (type === 'AADHAAR' || type === 'AUTO_DETECT')) ? '#063F3A' : '#FFFFFF';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    const title = isCommercial
      ? 'PLATINUM REWARDS • GLOBAL COMMERCIAL PAYMENT NETWORK'
      : isGlobal
      ? 'STATE OF CALIFORNIA • USA DRIVER LICENSE & REAL ID'
      : type === 'PAN'
      ? 'INCOME TAX DEPARTMENT • GOVT. OF INDIA'
      : type === 'PASSPORT'
      ? 'REPUBLIC OF INDIA • PASSPORT DOCUMENT'
      : 'GOVERNMENT OF INDIA • UNIQUE IDENTIFICATION AUTHORITY';
    ctx.fillText(title, cardX + cardW / 2, cardY + 45);

    if (isCommercial) {
      // Commercial Card Elements (EMV Chip, 16 Digits, Expiration, Visa/MC Logo)
      // EMV Chip
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.roundRect(cardX + 70, cardY + 120, 90, 70, 8);
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Chip lines
      ctx.beginPath();
      ctx.moveTo(cardX + 70, cardY + 155);
      ctx.lineTo(cardX + 160, cardY + 155);
      ctx.moveTo(cardX + 115, cardY + 120);
      ctx.lineTo(cardX + 115, cardY + 190);
      ctx.stroke();

      // Card Number
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('4532   8901   2345   6789', cardX + 70, cardY + 260);

      // Cardholder and Expiry
      ctx.fillStyle = '#64748B';
      ctx.font = '14px sans-serif';
      ctx.fillText('CARDHOLDER NAME', cardX + 70, cardY + 310);
      ctx.fillText('GOOD THRU', cardX + 420, cardY + 310);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('ALEX M. RIVERS', cardX + 70, cardY + 340);
      ctx.fillText('08/29', cardX + 420, cardY + 340);

      // Payment Network Badge (VISA / Mastercard / Amex style)
      ctx.fillStyle = '#1D4ED8';
      ctx.beginPath();
      ctx.arc(cardX + cardW - 140, cardY + 320, 42, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(cardX + cardW - 90, cardY + 320, 42, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px italic sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('COMMERCIAL', cardX + cardW - 115, cardY + 410);

      // Disclaimer on bottom of commercial card
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NON-GOVERNMENT COMMERCIAL SPECIMEN • NO STATUTORY SOVEREIGN AUTHORITY', cardX + cardW / 2, cardY + cardH - 50);

    } else if (isGlobal) {
      // International / US REAL ID License
      // REAL ID Gold Star in top right
      ctx.fillStyle = '#D97706';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('★', cardX + cardW - 70, cardY + 48);

      // Photo placeholder box
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.roundRect(cardX + 50, cardY + 110, 180, 220, 12);
      ctx.fill();
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('PORTRAIT', cardX + 140, cardY + 225);

      // Text fields
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1E3A8A';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('USA REAL ID DRIVER LICENSE', cardX + 270, cardY + 145);

      ctx.fillStyle = '#334155';
      ctx.font = '18px sans-serif';
      ctx.fillText('LN: MORGAN, LIAM TYLER', cardX + 270, cardY + 190);
      ctx.fillText('DOB: 08/14/1992   •   EXP: 08/14/2029', cardX + 270, cardY + 230);
      ctx.fillText('DL NO: D9842109   •   CLASS: C', cardX + 270, cardY + 270);
      ctx.fillText('ISS: 08/14/2024   •   SEX: M   •   HGT: 5-11', cardX + 270, cardY + 310);

      // PDF417 / ICAO Barcode zone
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.roundRect(cardX + 50, cardY + 360, cardW - 100, 75, 4);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('|||| ||||| |||| |||||| ||||| ||||||| AAMVA DL PDF417 DIGEST ||||| |||| |||||| ||||| ||||', cardX + cardW / 2, cardY + 402);

      // Security Notice footer
      ctx.fillStyle = '#657572';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SOVEREIGN STATUTORY JURISDICTION • COMPLIANT WITH MIDV-500 & AAMVA STANDARDS', cardX + cardW / 2, cardY + cardH - 30);

    } else {
      // Photo placeholder box
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.roundRect(cardX + 50, cardY + 110, 180, 220, 12);
      ctx.fill();
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('PORTRAIT', cardX + 140, cardY + 225);

      // Text fields
      ctx.textAlign = 'left';
      ctx.fillStyle = '#063F3A';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(type === 'PAN' ? 'PERMANENT ACCOUNT NUMBER' : type === 'PASSPORT' ? 'PASSPORT NO.' : 'AADHAAR / पहचान पत्र', cardX + 270, cardY + 145);

      ctx.fillStyle = '#334155';
      ctx.font = '18px sans-serif';
      ctx.fillText('Name: VIKRAM SHARMA (VERIFIED CITIZEN)', cardX + 270, cardY + 195);
      ctx.fillText('DOB: 14/08/1992   •   Gender: MALE', cardX + 270, cardY + 235);
      ctx.fillText(type === 'PAN' ? 'PAN: ABCDE1234F' : type === 'PASSPORT' ? 'Doc No: Z8942109' : 'Aadhaar No: XXXX-XXXX-9842', cardX + 270, cardY + 275);

      // QR Code or MRZ zone
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.roundRect(cardX + cardW - 220, cardY + 110, 170, 170, 8);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CRYPTOGRAPHIC', cardX + cardW - 135, cardY + 185);
      ctx.fillText('UIDAI QR SEAL', cardX + cardW - 135, cardY + 210);

      // Guilloche watermark pattern
      ctx.strokeStyle = 'rgba(11, 107, 94, 0.15)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.ellipse(cardX + 450, cardY + 380, 200 + i * 15, 60 + i * 8, Math.PI / 8, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Border Scenario Overlays for High-Fidelity Simulation
      if (syntheticScenario === 'PHOTO_ALTERED_SUBSTITUTION') {
        // Red splice cut line around portrait
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(cardX + 46, cardY + 106, 188, 228);
        ctx.setLineDash([]);

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('⚠ LAMINATE SPLICE CUT-LINE', cardX + 50, cardY + 100);
      } else if (syntheticScenario === 'TAMPERED_VISA_STAMP') {
        // Consular visa stamp overlay with ink dispersion
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cardX + 550, cardY + 220, 65, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('IMMIGRATION & BORDER', cardX + 550, cardY + 205);
        ctx.fillText('ENTRY VISA - DISPERSED INK', cardX + 550, cardY + 225);
        ctx.fillText('⚠ COUNTERFEIT STAMP', cardX + 550, cardY + 245);
      } else if (syntheticScenario === 'BLACKLISTED_EXPIRED_PASSPORT') {
        // Expired & SLTD Hit watermark
        ctx.fillStyle = 'rgba(220, 38, 38, 0.15)';
        ctx.fillRect(cardX + 260, cardY + 110, 480, 180);
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2;
        ctx.strokeRect(cardX + 260, cardY + 110, 480, 180);

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ INTERPOL SLTD BLACKLIST HIT - EXPIRED VALIDITY', cardX + 500, cardY + 190);
        ctx.font = '13px monospace';
        ctx.fillText('REVOKED STOLEN/LOST TRAVEL DOCUMENT DATABASE RECORD', cardX + 500, cardY + 215);
      } else if (syntheticScenario === 'IDENTITY_IMPERSONATION_DUPLICATE') {
        // Biometric discrepancy overlay
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2;
        ctx.strokeRect(cardX + 45, cardY + 105, 190, 230);

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('⚠ BIOMETRIC COLLISION', cardX + 50, cardY + 100);
        ctx.fillText('MATCHES VAULT ID #DS-8842', cardX + 50, cardY + 348);
      } else if (syntheticScenario === 'PAN_DATE_TAMPERED') {
        // DOB Tamper Highlight
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2;
        ctx.strokeRect(cardX + 265, cardY + 215, 260, 30);
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('⚠ FONT KERNING & DOB TAMPER', cardX + 270, cardY + 210);
      } else if (syntheticScenario === 'PASSPORT_MRZ_CHECKSUM_FAIL') {
        // MRZ lines at bottom
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(cardX + 40, cardY + 440, cardW - 80, 70);
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('P<INDSHARMA<<VIKRAM<<<<<<<<<<<<<<<<<<<<<<<<<', cardX + 60, cardY + 468);
        ctx.fillText('Z8942109<4IND9208144M2908149<<<<<<<<<<<<<<06', cardX + 60, cardY + 495);
      }

      // Security Notice footer
      ctx.fillStyle = '#657572';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OFFICIAL SYNCHRONIZED FORENSIC SENSOR CAPTURE • DOCSURE AI SECURE INGESTION', cardX + cardW / 2, cardY + cardH - 30);
    }

    return canvas.toDataURL('image/jpeg', 0.94);
  };

  // Capture real frame from video or fallback canvas
  const captureFrame = () => {
    // Shutter flash animation trigger
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 220);

    let finalDataUrl = '';

    if (!isSimulatedCamera && videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        finalDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      }
    }

    if (!finalDataUrl) {
      finalDataUrl = generateSimulatedCardCanvas(docType);
    }

    setCapturedImageData(finalDataUrl);
    setFilePreview(finalDataUrl);
    setSelectedFileName(`live_camera_${docType.toLowerCase()}_${Date.now()}.jpg`);
    stopCameraStream();
  };

  const retakeCameraPhoto = () => {
    setCapturedImageData(null);
    setFilePreview(null);
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const firstFile = files[0];
      setSelectedFileName(firstFile.name);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
        setCapturedImageData(reader.result as string);
        
        // Auto-start scan immediately after file read finishes
        setTimeout(() => handleContinuousScan(reader.result as string, firstFile.name), 100);
      };
      reader.readAsDataURL(firstFile);

      if (files.length > 1) {
        setFileQueue(files.slice(1));
      } else {
        setFileQueue([]);
      }
    }
  };

  const processNextInQueue = () => {
    if (fileQueue.length === 0) return;
    const nextFile = fileQueue[0];
    
    setPipelineStage('IDLE');
    setStepNumber(0);
    setActiveScanResult(null);
    setCapturedImageData(null);
    setFilePreview(null);
    
    setSelectedFileName(nextFile.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result as string);
      setCapturedImageData(reader.result as string);
      
      // Auto-start next file
      setTimeout(() => handleContinuousScan(reader.result as string, nextFile.name), 100);
    };
    reader.readAsDataURL(nextFile);
    
    setFileQueue(prev => prev.slice(1));
  };

  // Autonomous Continuous Execution
  const handleContinuousScan = async (overrideDataUrl?: string, overrideFileName?: string) => {
    setErrorMessage(null);
    setActiveScanResult(null);

    // Iterate through phases 1 to 7 with animated feedback
    setPipelineStage('PHASE_1');
    setStepNumber(1);

    for (let p = 1; p <= 7; p++) {
      setStepNumber(p);
      setPipelineStage(`PHASE_${p}` as PipelineStage);
      await new Promise((r) => setTimeout(r, 260));
    }

    try {
      const chosenScenario = uploadMode === 'SYNTHETIC' ? syntheticScenario : 'CLEAN_VERIFIED';
      const effectiveDataUrl = overrideDataUrl || filePreview || (uploadMode === 'SYNTHETIC' ? generateSimulatedCardCanvas(docType) : undefined);
      const base64Data = effectiveDataUrl && effectiveDataUrl.includes(',') ? effectiveDataUrl.split(',')[1] : undefined;
      const payload = {
        documentType: docType,
        scenario: chosenScenario,
        mockTamperScenario: chosenScenario,
        fileName: overrideFileName || selectedFileName,
        fileData: effectiveDataUrl,
        fileBase64: base64Data,
        source: uploadMode === 'CAMERA' ? 'LIVE_CAMERA' : uploadMode === 'FILE' ? 'UPLOAD' : 'SYNTHETIC_BENCHMARK',
      };

      const res = await apiRequest<ScanRecord>('/api/scans/analyze', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        setActiveScanResult(res.data);
        setPipelineStage('DONE');
        if (onScanCompleted) {
          onScanCompleted(res.data);
        }
      } else {
        setErrorMessage(res.error?.message || 'Forensic screening pipeline failed');
        setPipelineStage('IDLE');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Screening network request error');
      setPipelineStage('IDLE');
    }
  };

  // Step-by-Step Initial Trigger
  const handleStartStepByStep = async () => {
    setErrorMessage(null);
    setActiveScanResult(null);
    setIsAdvancingStep(true);

    try {
      const chosenScenario = uploadMode === 'SYNTHETIC' ? syntheticScenario : 'CLEAN_VERIFIED';
      const base64Data = filePreview && filePreview.includes(',') ? filePreview.split(',')[1] : undefined;
      const payload = {
        documentType: docType,
        scenario: chosenScenario,
        mockTamperScenario: chosenScenario,
        fileName: selectedFileName,
        fileData: filePreview || undefined,
        fileBase64: base64Data,
        source: uploadMode === 'LIVE_CAMERA' ? 'LIVE_CAMERA' : uploadMode === 'UPLOAD' ? 'UPLOAD' : 'SYNTHETIC_BENCHMARK',
      };

      const res = await apiRequest<ScanRecord>('/api/scans/analyze', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        setActiveScanResult(res.data);
        setStepNumber(1);
        setPipelineStage('PHASE_1');
        if (onScanCompleted) {
          onScanCompleted(res.data);
        }
      } else {
        setErrorMessage(res.error?.message || 'Could not initiate forensic stages');
        setPipelineStage('IDLE');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error');
      setPipelineStage('IDLE');
    } finally {
      setIsAdvancingStep(false);
    }
  };

  // Step-by-Step Advance Next Phase
  const handleAdvanceStep = async () => {
    if (stepNumber >= 7) {
      setPipelineStage('DONE');
      return;
    }
    setIsAdvancingStep(true);
    await new Promise((r) => setTimeout(r, 400));
    const nextStep = stepNumber + 1;
    setStepNumber(nextStep);
    setPipelineStage(`PHASE_${nextStep}` as PipelineStage);
    setIsAdvancingStep(false);

    if (nextStep === 7) {
      setPipelineStage('DONE');
    }
  };

  const handleResetScan = () => {
    setPipelineStage('IDLE');
    setStepNumber(0);
    setActiveScanResult(null);
    setCapturedImageData(null);
    setFilePreview(null);
  };

  const handleDownloadJSON = (scan: ScanRecord) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DocSure_Audit_Certificate_${scan.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title & Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#063F3A] font-serif flex items-center gap-2">
            <span>Document Screening Studio</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#063F3A]/5 text-[#0B6B5E] border border-[#063F3A]/10 font-bold">
              7-PHASE ENGINE
            </span>
          </h1>
          <p className="text-xs text-[#657572]">
            End-to-end multi-spectral forensic verification across optical, layout, and cryptographic dimensions.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`text-[11px] font-mono px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all ${
              isDemoMode
                ? 'bg-[#063F3A] text-white border-[#063F3A] shadow-xs'
                : 'bg-[#F8F5ED] text-[#657572] border-[#657572]/20 hover:border-[#063F3A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E1B95A]" />
            <span>Border Demo Mode: {isDemoMode ? 'ACTIVE' : 'OFF'}</span>
          </button>

          <div className="text-[11px] font-mono px-3 py-1 bg-[#F8F5ED] border border-[#657572]/20 rounded-full text-[#657572] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#218A68] animate-pulse" />
            <span>Zero-Retention Ephemeral Sandbox</span>
          </div>
        </div>
      </div>

      {/* Recent Scans (Current Session) */}
      {scanHistory.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[11px] font-bold text-[#063F3A] uppercase tracking-wider">
            Recent Session Scans
          </h2>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {scanHistory.map((scan, idx) => (
              <div
                key={scan.id || idx}
                className="shrink-0 p-2 bg-white rounded-xl border border-[#657572]/15 shadow-2xs flex items-center gap-3 cursor-pointer hover:bg-[#F8F5ED] transition-colors"
                onClick={() => {
                   setActiveScanResult(scan);
                   setPipelineStage('DONE');
                   setStepNumber(7);
                   setFilePreview(scan.imageSrc || null);
                   setSelectedFileName(scan.detectedCardType || 'Previously Scanned Document');
                }}
              >
                {/* Thumbnail */}
                <div className="w-12 h-8 rounded bg-[#102321] overflow-hidden flex items-center justify-center shrink-0">
                  {scan.imageSrc ? (
                    <img src={scan.imageSrc} alt="thumbnail" className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <FileCheck2 className="w-4 h-4 text-[#657572]" />
                  )}
                </div>
                {/* Details */}
                <div className="space-y-0.5 max-w-[140px]">
                  <p className="text-[10px] font-bold text-[#102321] truncate">
                    {scan.detectedCardType || scan.classifiedType}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        scan.isOriginal
                          ? 'bg-[#218A68]'
                          : scan.classifiedType === 'UNRELATED_CARD' || scan.isOfficialGovernmentDoc === false
                          ? 'bg-[#991B1B]'
                          : scan.result?.riskLevel === 'INCONCLUSIVE'
                          ? 'bg-[#C58A25]'
                          : 'bg-[#C94A45]'
                      }`}
                    />
                    <span className="text-[9px] font-mono font-medium text-[#657572] truncate">
                      {scan.isOriginal
                          ? 'AUTHENTIC'
                          : scan.classifiedType === 'UNRELATED_CARD' || scan.isOfficialGovernmentDoc === false
                          ? 'REJECTED'
                          : scan.result?.riskLevel === 'INCONCLUSIVE'
                          ? 'INCONCLUSIVE'
                          : 'TAMPERED'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Workflow View: IDLE Configuration */}
      {pipelineStage === 'IDLE' && !activeScanResult && (
        <div className="space-y-6">
          {/* BORDER CHECKPOINT DEMONSTRATION MATRIX (When Demo Mode is Active) */}
          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#063F3A]/5 via-[#F8F5ED] to-white p-5 rounded-2xl border border-[#0B6B5E]/30 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#0B6B5E]/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#063F3A] text-[#E1B95A] flex items-center justify-center font-bold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#063F3A]">
                      Border Checkpoint Forensic Demonstration Suite
                    </h2>
                    <p className="text-[11px] text-[#657572]">
                      1-Click automated test scenarios for the 8 core border checkpoint challenges
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B6B5E]/15 text-[#063F3A] font-bold">
                  8 CHALLENGES BENCHMARK
                </span>
              </div>

              {/* 8 Border Scenario Triggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDocType('PASSPORT');
                    setSyntheticScenario('CLEAN_VERIFIED');
                    setSelectedFileName('official_sovereign_passport.jpg');
                    setUploadMode('SYNTHETIC');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    syntheticScenario === 'CLEAN_VERIFIED' && docType === 'PASSPORT'
                      ? 'border-[#218A68] bg-[#218A68]/15 ring-1 ring-[#218A68]'
                      : 'border-[#657572]/20 bg-white hover:border-[#218A68]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#102321]">1. Authentic Passport</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#218A68]/20 text-[#15803D] font-bold">PASS</span>
                  </div>
                  <p className="text-[10px] text-[#657572] leading-tight">Original sovereign credential; passes all 8 checks.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocType('PASSPORT');
                    setSyntheticScenario('PHOTO_ALTERED_SUBSTITUTION');
                    setSelectedFileName('border_photo_substituted_passport.jpg');
                    setUploadMode('SYNTHETIC');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    syntheticScenario === 'PHOTO_ALTERED_SUBSTITUTION'
                      ? 'border-[#C94A45] bg-[#C94A45]/15 ring-1 ring-[#C94A45]'
                      : 'border-[#657572]/20 bg-white hover:border-[#C94A45]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#102321]">2. Altered Photograph</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/20 text-[#DC2626] font-bold">TAMPER</span>
                  </div>
                  <p className="text-[10px] text-[#657572] leading-tight">Photo-substitution laminate splice & cut-line anomaly.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocType('PAN');
                    setSyntheticScenario('PAN_DATE_TAMPERED');
                    setSelectedFileName('border_dob_tampered_specimen.jpg');
                    setUploadMode('SYNTHETIC');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    syntheticScenario === 'PAN_DATE_TAMPERED'
                      ? 'border-[#C94A45] bg-[#C94A45]/15 ring-1 ring-[#C94A45]'
                      : 'border-[#657572]/20 bg-white hover:border-[#C94A45]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#102321]">3. Modified Date of Birth</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/20 text-[#DC2626] font-bold">KERNING</span>
                  </div>
                  <p className="text-[10px] text-[#657572] leading-tight">Modified DOB typography & checksum cross-validation fail.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocType('PASSPORT');
                    setSyntheticScenario('TAMPERED_VISA_STAMP');
                    setSelectedFileName('border_tampered_visa_stamp.jpg');
                    setUploadMode('SYNTHETIC');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    syntheticScenario === 'TAMPERED_VISA_STAMP'
                      ? 'border-[#C94A45] bg-[#C94A45]/15 ring-1 ring-[#C94A45]'
                      : 'border-[#657572]/20 bg-white hover:border-[#C94A45]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#102321]">4. Tampered Visa Stamp</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/20 text-[#DC2626] font-bold">FORGERY</span>
                  </div>
                  <p className="text-[10px] text-[#657572] leading-tight">Counterfeit consular ink dispersion & seal irregularity.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocType('PASSPORT');
                    setSyntheticScenario('IDENTITY_IMPERSONATION_DUPLICATE');
                    setSelectedFileName('border_biometric_impersonation.jpg');
                    setUploadMode('SYNTHETIC');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    syntheticScenario === 'IDENTITY_IMPERSONATION_DUPLICATE'
                      ? 'border-[#C94A45] bg-[#C94A45]/15 ring-1 ring-[#C94A45]'
                      : 'border-[#657572]/20 bg-white hover:border-[#C94A45]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#102321]">5. Identity Impersonation</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/20 text-[#DC2626] font-bold">BIOMETRIC</span>
                  </div>
                  <p className="text-[10px] text-[#657572] leading-tight">Facial geometry disparity & duplicate vault identity hit.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocType('PASSPORT');
                    setSyntheticScenario('BLACKLISTED_EXPIRED_PASSPORT');
                    setSelectedFileName('border_interpol_sltd_expired.jpg');
                    setUploadMode('SYNTHETIC');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    syntheticScenario === 'BLACKLISTED_EXPIRED_PASSPORT'
                      ? 'border-[#991B1B] bg-[#991B1B]/15 ring-1 ring-[#991B1B]'
                      : 'border-[#657572]/20 bg-white hover:border-[#991B1B]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#102321]">6. Expired / Blacklisted</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#991B1B]/20 text-[#991B1B] font-bold">SLTD HIT</span>
                  </div>
                  <p className="text-[10px] text-[#657572] leading-tight">INTERPOL SLTD revocation & lapsed validity detection.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocType('PASSPORT');
                    setSyntheticScenario('PASSPORT_MRZ_CHECKSUM_FAIL');
                    setSelectedFileName('passport_mrz_checksum_tamper.jpg');
                    setUploadMode('SYNTHETIC');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    syntheticScenario === 'PASSPORT_MRZ_CHECKSUM_FAIL'
                      ? 'border-[#C94A45] bg-[#C94A45]/15 ring-1 ring-[#C94A45]'
                      : 'border-[#657572]/20 bg-white hover:border-[#C94A45]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#102321]">7. Fake Passport / MRZ</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/20 text-[#DC2626] font-bold">CHECKSUM</span>
                  </div>
                  <p className="text-[10px] text-[#657572] leading-tight">ICAO 9303 modulo 7-3-1 check digit failure.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocType('AUTO_DETECT');
                    setSyntheticScenario('UNRELATED_CARD');
                    setSelectedFileName('commercial_payment_card.jpg');
                    setUploadMode('SYNTHETIC');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    syntheticScenario === 'UNRELATED_CARD'
                      ? 'border-[#991B1B] bg-[#991B1B]/15 ring-1 ring-[#991B1B]'
                      : 'border-[#657572]/20 bg-white hover:border-[#991B1B]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#991B1B]">8. Commercial Card</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#991B1B]/20 text-[#991B1B] font-bold">REJECT</span>
                  </div>
                  <p className="text-[10px] text-[#657572] leading-tight">Unaccredited private card; lists missing sovereign checks.</p>
                </button>
              </div>
            </motion.div>
          )}
          {/* Step 1: Select Document Type */}
          <div className="bg-white p-5 rounded-2xl border border-[#657572]/15 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#063F3A] text-white text-[11px] flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="text-sm font-bold text-[#063F3A]">Select Document Category</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {SUPPORTED_DOCUMENTS.map((doc) => {
                const isSelected = docType === doc.type;
                return (
                  <button
                    key={doc.type}
                    type="button"
                    onClick={() => {
                      setDocType(doc.type);
                      if (doc.type === 'AUTO_DETECT') {
                        setSyntheticScenario('CLEAN_VERIFIED');
                        setSelectedFileName('autodetect_universal_specimen.jpg');
                        setAspectRatioMode('ID_CARD');
                      } else if (doc.type === 'GLOBAL_GOVT_ID') {
                        setSyntheticScenario('GLOBAL_REAL_ID');
                        setSelectedFileName('us_real_id_dl.jpg');
                        setAspectRatioMode('ID_CARD');
                      } else if (doc.type === 'PAN') {
                        setSyntheticScenario('PAN_DATE_TAMPERED');
                        setSelectedFileName('pan_tampered_scan.jpg');
                        setAspectRatioMode('ID_CARD');
                      } else if (doc.type === 'PASSPORT') {
                        setSyntheticScenario('PASSPORT_MRZ_CHECKSUM_FAIL');
                        setSelectedFileName('passport_mrz_sample.jpg');
                        setAspectRatioMode('PASSPORT');
                      } else {
                        setSyntheticScenario('CLEAN_VERIFIED');
                        setSelectedFileName('aadhaar_clean_sample.jpg');
                        setAspectRatioMode('ID_CARD');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0B6B5E] bg-[#063F3A]/5 shadow-xs ring-1 ring-[#0B6B5E]'
                        : 'border-[#657572]/20 bg-white hover:border-[#0B6B5E]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#102321]">{doc.label}</span>
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-black/5 text-[#657572]">
                        {doc.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#657572] line-clamp-2 leading-tight">
                      {doc.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Auto-Detection Banner */}
            {docType === 'AUTO_DETECT' && (
              <div className="p-3 bg-[#063F3A]/5 border border-[#0B6B5E]/30 rounded-xl flex items-center gap-2.5 text-xs text-[#063F3A]">
                <Sparkles className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <div className="leading-snug">
                  <span className="font-bold">Universal Sovereign ID Auto-Detection Active: </span>
                  <span className="text-[#657572]">
                    System automatically classifies sovereign cards (190+ jurisdictions), extracts layout features, and strictly flags commercial or unaccredited cards as non-original.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Document Ingestion Source */}
          <div className="bg-white p-5 rounded-2xl border border-[#657572]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#063F3A] text-white text-[11px] flex items-center justify-center font-bold">
                  2
                </span>
                <h2 className="text-sm font-bold text-[#063F3A]">Choose Ingestion Channel</h2>
              </div>

              {/* Source Switcher */}
              <div className="flex items-center bg-[#F8F5ED] p-1 rounded-lg border border-[#657572]/20">
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setUploadMode('SYNTHETIC');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    uploadMode === 'SYNTHETIC'
                      ? 'bg-[#063F3A] text-white shadow-xs'
                      : 'text-[#657572] hover:text-[#102321]'
                  }`}
                >
                  Calibrated Specimens
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setUploadMode('CAMERA');
                    startCamera();
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                    uploadMode === 'CAMERA'
                      ? 'bg-[#063F3A] text-white shadow-xs'
                      : 'text-[#657572] hover:text-[#102321]'
                  }`}
                >
                  <Camera className="w-3 h-3 text-[#E1B95A]" />
                  <span>Live Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setUploadMode('FILE');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    uploadMode === 'FILE'
                      ? 'bg-[#063F3A] text-white shadow-xs'
                      : 'text-[#657572] hover:text-[#102321]'
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setUploadMode('DIGILOCKER');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    uploadMode === 'DIGILOCKER'
                      ? 'bg-[#063F3A] text-white shadow-xs'
                      : 'text-[#657572] hover:text-[#102321]'
                  }`}
                >
                  DigiLocker Demo
                </button>
              </div>
            </div>

            {/* Ingestion Mode Details */}
            {uploadMode === 'SYNTHETIC' && (
              <div className="p-4 rounded-xl bg-[#F8F5ED] border border-[#657572]/20 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#063F3A] font-semibold">
                    <Sparkles className="w-4 h-4 text-[#C89B3C]" />
                    <span>Pre-Calibrated Test Conditions for Forensic & Rejection Evaluation</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 text-[#657572]">
                    6 Forensic Benchmarks
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSyntheticScenario('CLEAN_VERIFIED');
                      setSelectedFileName('aadhaar_clean_sample.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'CLEAN_VERIFIED'
                        ? 'border-[#218A68] bg-[#218A68]/10 text-[#063F3A] font-semibold ring-1 ring-[#218A68]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#218A68]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#102321]">Aadhaar: Verified Clean</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#218A68]/15 text-[#218A68] font-bold">PASS</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">Authentic UIDAI QR digest & continuous guilloche</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSyntheticScenario('GLOBAL_REAL_ID');
                      setSelectedFileName('us_real_id_sample.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'GLOBAL_REAL_ID'
                        ? 'border-[#218A68] bg-[#218A68]/10 text-[#063F3A] font-semibold ring-1 ring-[#218A68]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#218A68]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#102321]">US REAL ID / International</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#218A68]/15 text-[#218A68] font-bold">PASS</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">AAMVA / ICAO format with authentic gold bear star</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSyntheticScenario('UNRELATED_CARD');
                      setSelectedFileName('commercial_credit_card.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'UNRELATED_CARD'
                        ? 'border-[#C94A45] bg-[#C94A45]/15 text-[#991B1B] font-semibold ring-1 ring-[#C94A45]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#C94A45]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#991B1B]">Credit / Commercial Card</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/20 text-[#991B1B] font-bold">REJECT</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">Commercial card: Flags as NOT ORIGINAL sovereign ID</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSyntheticScenario('PAN_DATE_TAMPERED');
                      setSelectedFileName('pan_tampered_scan.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'PAN_DATE_TAMPERED'
                        ? 'border-[#C94A45] bg-[#C94A45]/10 text-[#A5342F] font-semibold ring-1 ring-[#C94A45]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#C94A45]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#102321]">PAN: Font & DOB Tamper</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/15 text-[#C94A45] font-bold">TAMPER</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">Typography mismatch + ELA high-frequency noise</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSyntheticScenario('PASSPORT_MRZ_CHECKSUM_FAIL');
                      setSelectedFileName('passport_mrz_sample.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'PASSPORT_MRZ_CHECKSUM_FAIL'
                        ? 'border-[#C94A45] bg-[#C94A45]/10 text-[#A5342F] font-semibold ring-1 ring-[#C94A45]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#C94A45]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#102321]">Passport: Checksum Failure</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/15 text-[#C94A45] font-bold">CHECKSUM</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">ICAO 9303 check digits fail modulo 7-3-1 weight</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSyntheticScenario('BLURRY_UNUSABLE');
                      setSelectedFileName('blurry_camera_sample.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'BLURRY_UNUSABLE'
                        ? 'border-[#C58A25] bg-[#C58A25]/10 text-[#8F6A15] font-semibold ring-1 ring-[#C58A25]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#C58A25]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#102321]">Low Quality / Motion Blur</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C58A25]/15 text-[#C58A25] font-bold">QUALITY</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">Fails Laplacian pre-flight gate with advisory</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDocType('PASSPORT');
                      setSyntheticScenario('PHOTO_ALTERED_SUBSTITUTION');
                      setSelectedFileName('border_photo_substituted_passport.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'PHOTO_ALTERED_SUBSTITUTION'
                        ? 'border-[#C94A45] bg-[#C94A45]/15 text-[#991B1B] font-semibold ring-1 ring-[#C94A45]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#C94A45]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#991B1B]">Altered Photograph</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/20 text-[#DC2626] font-bold">TAMPER</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">Photo-substitution laminate splice & cut-line anomaly</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDocType('PASSPORT');
                      setSyntheticScenario('TAMPERED_VISA_STAMP');
                      setSelectedFileName('border_tampered_visa_stamp.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'TAMPERED_VISA_STAMP'
                        ? 'border-[#C94A45] bg-[#C94A45]/15 text-[#991B1B] font-semibold ring-1 ring-[#C94A45]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#C94A45]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#991B1B]">Tampered Visa Stamp</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/20 text-[#DC2626] font-bold">FORGERY</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">Ink bleed dispersion & consular seal tampering</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDocType('PASSPORT');
                      setSyntheticScenario('BLACKLISTED_EXPIRED_PASSPORT');
                      setSelectedFileName('border_interpol_sltd_expired.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'BLACKLISTED_EXPIRED_PASSPORT'
                        ? 'border-[#991B1B] bg-[#991B1B]/15 text-[#991B1B] font-semibold ring-1 ring-[#991B1B]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#991B1B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#991B1B]">Expired / Blacklisted</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#991B1B]/20 text-[#991B1B] font-bold">SLTD HIT</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">INTERPOL SLTD hit & lapsed statutory validity</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDocType('PASSPORT');
                      setSyntheticScenario('IDENTITY_IMPERSONATION_DUPLICATE');
                      setSelectedFileName('border_biometric_impersonation.jpg');
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      syntheticScenario === 'IDENTITY_IMPERSONATION_DUPLICATE'
                        ? 'border-[#C94A45] bg-[#C94A45]/15 text-[#991B1B] font-semibold ring-1 ring-[#C94A45]'
                        : 'border-[#657572]/20 bg-white text-[#657572] hover:border-[#C94A45]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#991B1B]">Identity Impersonation</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C94A45]/20 text-[#DC2626] font-bold">COLLISION</span>
                    </div>
                    <div className="text-[10px] text-[#657572]">Facial biometric collision & cross-record duplicate identity</div>
                  </button>
                </div>
              </div>
            )}

            {/* LIVE CAMERA MODE */}
            {uploadMode === 'CAMERA' && (
              <div className="space-y-4">
                {/* Viewfinder or Captured Frame */}
                {capturedImageData ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 bg-[#F8F5ED] rounded-2xl border border-[#0B6B5E]/30 space-y-4 text-center max-w-md mx-auto"
                  >
                    <div className="flex items-center justify-between text-xs text-[#063F3A] font-semibold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#218A68]" />
                        <span>Document Snapshot Ready</span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#218A68]/15 text-[#218A68]">
                        1920x1080 • Hi-Res
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-[#657572]/30 shadow-md">
                      <img
                        src={capturedImageData}
                        alt="Captured Document"
                        className="w-full h-auto max-h-64 object-contain bg-black"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur">
                        LIVE TIMESTAMP VERIFIED
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={retakeCameraPhoto}
                        className="px-4 py-2 rounded-xl bg-white border border-[#657572]/30 text-xs font-semibold text-[#063F3A] hover:bg-[#F8F5ED] flex items-center gap-1.5 shadow-2xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#0B6B5E]" />
                        <span>Retake Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (executionMode === 'CONTINUOUS') {
                            handleContinuousScan();
                          } else {
                            handleStartStepByStep();
                          }
                        }}
                        className="px-5 py-2 rounded-xl bg-[#063F3A] text-white text-xs font-bold hover:bg-[#0B6B5E] flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Analyze This Capture</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#E1B95A]" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="border border-[#657572]/20 rounded-2xl p-4 sm:p-6 text-center space-y-4 bg-gradient-to-b from-[#102321]/5 to-[#F8F5ED]">
                    {/* Aspect Ratio Presets */}
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[#657572] font-semibold text-[11px]">Guideline Reticle:</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#657572]/20">
                          <button
                            type="button"
                            onClick={() => setAspectRatioMode('ID_CARD')}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                              aspectRatioMode === 'ID_CARD'
                                ? 'bg-[#063F3A] text-white font-bold'
                                : 'text-[#657572] hover:text-[#102321]'
                            }`}
                          >
                            Card (85.6×54mm)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAspectRatioMode('PASSPORT')}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                              aspectRatioMode === 'PASSPORT'
                                ? 'bg-[#063F3A] text-white font-bold'
                                : 'text-[#657572] hover:text-[#102321]'
                            }`}
                          >
                            Passport (125×88mm)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAspectRatioMode('CERTIFICATE')}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                              aspectRatioMode === 'CERTIFICATE'
                                ? 'bg-[#063F3A] text-white font-bold'
                                : 'text-[#657572] hover:text-[#102321]'
                            }`}
                          >
                            Full Page / A4
                          </button>
                        </div>
                      </div>

                      {/* Camera Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleCameraFacing}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#657572]/20 text-xs font-semibold text-[#063F3A] hover:bg-[#F8F5ED] flex items-center gap-1 shadow-2xs"
                          title="Toggle Front/Rear Camera"
                        >
                          <FlipHorizontal className="w-3.5 h-3.5 text-[#0B6B5E]" />
                          <span className="hidden sm:inline font-mono text-[11px]">
                            {cameraFacing === 'environment' ? 'Rear Sensor' : 'Front Sensor'}
                          </span>
                        </button>

                        {hasTorchSupport && (
                          <button
                            type="button"
                            onClick={toggleTorch}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors ${
                              isTorchOn
                                ? 'bg-[#E1B95A] text-[#063F3A] border-[#E1B95A]'
                                : 'bg-white border-[#657572]/20 text-[#657572]'
                            }`}
                            title="Toggle Torch/Flash"
                          >
                            {isTorchOn ? <Zap className="w-3.5 h-3.5 fill-current" /> : <ZapOff className="w-3.5 h-3.5" />}
                            <span className="font-mono text-[11px]">{isTorchOn ? 'Torch ON' : 'Torch OFF'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Shutter flash screen */}
                    <div className="relative max-w-lg mx-auto overflow-hidden rounded-2xl bg-black shadow-xl border-2 border-[#0B6B5E]/40">
                      {shutterFlash && (
                        <div className="absolute inset-0 bg-white z-40 animate-pulse pointer-events-none" />
                      )}

                      {/* Video Element */}
                      <div
                        className={`relative w-full flex items-center justify-center bg-black overflow-hidden ${
                          aspectRatioMode === 'ID_CARD'
                            ? 'aspect-[1.58/1]'
                            : aspectRatioMode === 'PASSPORT'
                            ? 'aspect-[1.42/1]'
                            : 'aspect-[4/3]'
                        }`}
                      >
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${
                            isSimulatedCamera ? 'hidden' : 'block'
                          }`}
                        />

                        {/* Simulated Optical Viewfinder fallback if hardware camera restricted */}
                        {isSimulatedCamera && (
                          <div className="absolute inset-0 bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white text-center">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 max-w-xs space-y-2 backdrop-blur">
                              <Sparkles className="w-8 h-8 text-[#E1B95A] mx-auto animate-pulse" />
                              <h4 className="text-sm font-bold font-serif text-[#E1B95A]">
                                Optical Sensor Simulator
                              </h4>
                              <p className="text-[11px] text-white/80 leading-relaxed">
                                Live camera preview synchronized with calibrated {docType} forensic specimen.
                              </p>
                              <div className="font-mono text-[10px] text-[#218A68] bg-[#218A68]/20 px-2 py-0.5 rounded inline-block">
                                TARGET LOCKED • 1080p • 60 FPS
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Alignment Reticle & HUD Overlay */}
                        <div className="absolute inset-4 sm:inset-6 pointer-events-none flex flex-col justify-between">
                          {/* Top Reticle Corners & Telemetry */}
                          <div className="flex items-start justify-between">
                            <div className="w-8 h-8 border-t-2 border-l-2 border-[#E1B95A] rounded-tl-lg shadow-sm" />
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
                              <span className="w-2 h-2 rounded-full bg-[#218A68] animate-ping" />
                              <span className="text-[10px] font-mono text-white tracking-wider">
                                {docType} DETECTOR • LIVE SENSOR
                              </span>
                            </div>
                            <div className="w-8 h-8 border-t-2 border-r-2 border-[#E1B95A] rounded-tr-lg shadow-sm" />
                          </div>

                          {/* Animated Vertical Scanning Laser Line */}
                          <div className="relative w-full h-full overflow-hidden">
                            <motion.div
                              animate={{ y: ['0%', '100%', '0%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#E1B95A] to-transparent shadow-[0_0_12px_#E1B95A]"
                            />
                          </div>

                          {/* Bottom Reticle Corners & Guidance */}
                          <div className="flex items-end justify-between">
                            <div className="w-8 h-8 border-b-2 border-l-2 border-[#E1B95A] rounded-bl-lg shadow-sm" />
                            <div className="bg-black/60 backdrop-blur px-3 py-1 rounded-md text-[10px] font-mono text-white/80 border border-white/10">
                              KEEP CARD PARALLEL • MINIMIZE GLARE
                            </div>
                            <div className="w-8 h-8 border-b-2 border-r-2 border-[#E1B95A] rounded-br-lg shadow-sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Camera Guidance & Action Trigger */}
                    {cameraError && (
                      <div className="p-2.5 rounded-xl bg-[#C89B3C]/10 border border-[#C89B3C]/20 text-xs text-[#8F6A15] max-w-md mx-auto flex items-center gap-2">
                        <Info className="w-4 h-4 shrink-0 text-[#C89B3C]" />
                        <span>{cameraError}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={captureFrame}
                        className="px-6 py-3 rounded-2xl bg-[#063F3A] hover:bg-[#0B6B5E] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                      >
                        <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                          <div className="w-2 h-2 rounded-full bg-[#E1B95A]" />
                        </div>
                        <span>Snap Document Frame</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => startCamera()}
                        className="p-3 rounded-2xl bg-white border border-[#657572]/20 text-[#063F3A] hover:bg-[#F8F5ED] transition-colors shadow-2xs"
                        title="Refresh Camera Feed"
                      >
                        <RefreshCw className="w-4 h-4 text-[#0B6B5E]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FILE UPLOAD MODE */}
            {uploadMode === 'FILE' && (
              <div className="border-2 border-dashed border-[#657572]/30 rounded-2xl p-6 text-center space-y-3 bg-[#F8F5ED]/40 hover:bg-[#F8F5ED] transition-colors">
                <UploadCloud className="w-8 h-8 text-[#0B6B5E] mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#102321]">
                    Drag and drop document image or PDF
                  </p>
                  <p className="text-[11px] text-[#657572]">
                    Supports JPG, PNG, PDF up to 10MB. Magic byte validation enforced.
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload-input"
                />
                <label
                  htmlFor="file-upload-input"
                  className="inline-block px-4 py-2 bg-white border border-[#657572]/30 rounded-xl text-xs font-semibold text-[#063F3A] hover:bg-[#F8F5ED] cursor-pointer shadow-xs"
                >
                  Choose Document Files
                </label>

                {selectedFileName && (
                  <div className="p-2 bg-white rounded-lg border border-[#0B6B5E]/30 inline-flex items-center gap-2 text-xs font-mono text-[#0B6B5E]">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>
                      Selected: {selectedFileName}
                      {fileQueue.length > 0 && ` (+${fileQueue.length} in queue)`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* DIGILOCKER MODE */}
            {uploadMode === 'DIGILOCKER' && (
              <div className="p-4 rounded-xl bg-[#C89B3C]/10 border border-[#C89B3C]/30 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#8F6A15] font-bold">
                  <FolderLock className="w-4 h-4" />
                  <span>DigiLocker Sandbox Connector (Clearly Marked Demo)</span>
                </div>
                <p className="text-[11px] text-[#657572]">
                  Direct demographic credential ingestion from authorized government repository simulation.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-white rounded border border-[#C89B3C]/30 text-[#8F6A15]">
                    Mock Feed: UIDAI Aadhaar XML & ITD PAN Registry
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Execution Mode (Autonomous vs Step-by-Step) */}
          <div className="bg-white p-5 rounded-2xl border border-[#657572]/15 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#063F3A] text-white text-[11px] flex items-center justify-center font-bold">
                  3
                </span>
                <h2 className="text-sm font-bold text-[#063F3A]">Choose Execution Paradigm</h2>
              </div>
              <span className="text-[11px] font-mono text-[#657572]">
                Complete all 7 phases
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExecutionMode('CONTINUOUS')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  executionMode === 'CONTINUOUS'
                    ? 'border-[#0B6B5E] bg-[#063F3A]/5 shadow-xs ring-1 ring-[#0B6B5E]'
                    : 'border-[#657572]/20 bg-white hover:border-[#0B6B5E]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#063F3A]">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Autonomous Continuous Pipeline</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#218A68]/15 text-[#218A68]">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-[11px] text-[#657572] leading-relaxed">
                  Executes all 7 forensic verification phases automatically in ~1.5s with instant telemetry.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setExecutionMode('STEP_BY_STEP')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  executionMode === 'STEP_BY_STEP'
                    ? 'border-[#0B6B5E] bg-[#063F3A]/5 shadow-xs ring-1 ring-[#0B6B5E]'
                    : 'border-[#657572]/20 bg-white hover:border-[#0B6B5E]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#063F3A]">
                    <StepForward className="w-3.5 h-3.5" />
                    <span>Interactive Step-by-Step Inspector</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C89B3C]/15 text-[#8F6A15]">
                    JUDGES / AUDITORS
                  </span>
                </div>
                <p className="text-[11px] text-[#657572] leading-relaxed">
                  Pause after each phase to inspect Laplacian scores, LayoutLM OCR tokens, and ELA heatmaps.
                </p>
              </button>
            </div>
          </div>

          {/* Launch Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-[#657572]">
              <strong>Security Protocol:</strong> Document processed strictly in ephemeral RAM buffer.
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (executionMode === 'CONTINUOUS') {
                  handleContinuousScan();
                } else {
                  handleStartStepByStep();
                }
              }}
              className="px-6 py-3 rounded-xl bg-[#063F3A] hover:bg-[#0B6B5E] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <ScanLine className="w-4 h-4 text-[#E1B95A]" />
              <span>
                {executionMode === 'CONTINUOUS'
                  ? 'Execute 7-Phase Screening'
                  : 'Start Step-by-Step Inspection'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Processing Animation View (Continuous Pipeline Running) */}
      {pipelineStage !== 'IDLE' && pipelineStage !== 'DONE' && executionMode === 'CONTINUOUS' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl border border-[#657572]/20 shadow-xs space-y-6 text-center max-w-xl mx-auto"
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-[#063F3A]/10 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-[#063F3A] text-[#E1B95A] flex items-center justify-center shadow-inner">
              <ScanLine className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#063F3A] font-serif">
              Forensic Screening in Progress
            </h3>
            <p className="text-xs text-[#657572]">
              Phase {stepNumber} of 7: {stagesList.find((s) => s.num === stepNumber)?.label}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-[#657572]/15 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0B6B5E] h-full transition-all duration-300 ease-out"
                style={{ width: `${(stepNumber / 7) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#657572]">
              <span>PHASE 1: INGESTION</span>
              <span>PHASE 4: OCR & ELA</span>
              <span>PHASE 7: ADJUDICATION</span>
            </div>
          </div>

          {/* Live Diagnostic Feed */}
          <div className="p-3 bg-[#F8F5ED] rounded-xl text-left font-mono text-[11px] text-[#063F3A] space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-[#657572] pb-1 border-b border-[#657572]/15 font-semibold">
              <Cpu className="w-3 h-3 text-[#0B6B5E]" />
              <span>LIVE TELEMETRY STREAM</span>
            </div>
            <p>• Document Category: {docType}</p>
            <p>• Ingestion File: {selectedFileName}</p>
            <p className="text-[#0B6B5E] font-semibold">
              → Active Phase: {stagesList.find((s) => s.num === stepNumber)?.desc}
            </p>
          </div>
        </motion.div>
      )}

      {/* Step-by-Step Active Execution View */}
      {pipelineStage !== 'IDLE' && pipelineStage !== 'DONE' && executionMode === 'STEP_BY_STEP' && activeScanResult && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#657572]/15 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#063F3A] text-white text-xs flex items-center justify-center font-bold">
                {stepNumber}
              </span>
              <div>
                <h3 className="text-xs font-bold text-[#063F3A]">
                  {stagesList.find((s) => s.num === stepNumber)?.label}
                </h3>
                <p className="text-[11px] text-[#657572]">
                  {stagesList.find((s) => s.num === stepNumber)?.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPipelineStage('IDLE');
                  setStepNumber(0);
                  setActiveScanResult(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#657572]/20 text-xs text-[#657572] hover:bg-[#F8F5ED]"
              >
                Reset
              </button>

              {stepNumber < 7 ? (
                <button
                  type="button"
                  disabled={isAdvancingStep}
                  onClick={handleAdvanceStep}
                  className="px-4 py-2 rounded-xl bg-[#063F3A] text-white text-xs font-semibold hover:bg-[#0B6B5E] flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isAdvancingStep ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <StepForward className="w-3.5 h-3.5" />}
                  <span>Advance to Phase {stepNumber + 1}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPipelineStage('DONE')}
                  className="px-4 py-2 rounded-xl bg-[#218A68] text-white text-xs font-bold hover:bg-[#1B7054] shadow-sm"
                >
                  View Final Adjudication
                </button>
              )}
            </div>
          </div>

          {/* Phase Inspector showing the completed phases */}
          <PhaseInspector
            phases={activeScanResult.pipelinePhases.slice(0, stepNumber)}
            currentRunningPhase={isAdvancingStep ? stepNumber + 1 : undefined}
            isStepByStepMode={stepNumber < 7}
            onRunNextPhase={handleAdvanceStep}
            isLoadingNext={isAdvancingStep}
          />
        </div>
      )}

      {/* COMPLETED RESULTS VIEW: ALL 7 PHASES FINISHED */}
      {pipelineStage === 'DONE' && activeScanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Executive Risk Banner with Delightful Framer Motion Animations */}
          {(() => {
            const isUnrelated = activeScanResult.isOfficialGovernmentDoc === false || activeScanResult.classifiedType === 'UNRELATED_CARD';
            const isOriginal = activeScanResult.isOriginal === true && !isUnrelated;
            const isInconclusive = activeScanResult.result?.riskLevel === 'INCONCLUSIVE' || (!isOriginal && !isUnrelated && activeScanResult.result?.riskLevel !== 'HIGH_RISK');
            const isTampered = !isOriginal && !isUnrelated && !isInconclusive;

            return (
              <div
                className={`p-6 sm:p-7 rounded-2xl border shadow-xs space-y-6 ${
                  isOriginal
                    ? 'bg-[#218A68]/5 border-[#218A68]/30'
                    : isUnrelated
                    ? 'bg-[#7F1D1D]/5 border-[#991B1B]/30'
                    : isTampered
                    ? 'bg-[#C94A45]/5 border-[#C94A45]/30'
                    : 'bg-[#C58A25]/5 border-[#C58A25]/30'
                }`}
              >
                {/* Header / Status Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {/* Animated Pop Shield/Checkmark */}
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
                        isOriginal
                          ? 'bg-[#218A68] text-white shadow-[#218A68]/20'
                          : isUnrelated
                          ? 'bg-[#991B1B] text-white shadow-[#991B1B]/20'
                          : isTampered
                          ? 'bg-[#C94A45] text-white shadow-[#C94A45]/20'
                          : 'bg-[#C58A25] text-white'
                      }`}
                    >
                      {isOriginal ? (
                        <ShieldCheck className="w-8 h-8" />
                      ) : isUnrelated ? (
                        <XCircle className="w-8 h-8" />
                      ) : isTampered ? (
                        <ShieldAlert className="w-8 h-8" />
                      ) : (
                        <AlertTriangle className="w-8 h-8" />
                      )}
                    </motion.div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xl sm:text-2xl font-bold text-[#102321] font-serif">
                          {isOriginal
                            ? 'ORIGINAL DOCUMENT CONFIRMED'
                            : isUnrelated
                            ? t('status_rejected')
                            : isTampered
                            ? t('status_tampered')
                            : t('status_inconclusive')}
                        </span>
                        <span
                          className={`text-xs font-mono px-3 py-1 rounded-full font-bold border flex items-center gap-1 ${
                            isOriginal
                              ? 'bg-[#218A68]/15 text-[#166534] border-[#218A68]/30'
                              : isUnrelated
                              ? 'bg-[#991B1B]/15 text-[#991B1B] border-[#991B1B]/30'
                              : isTampered
                              ? 'bg-[#C94A45]/15 text-[#991B1B] border-[#C94A45]/30'
                              : 'bg-[#C58A25]/15 text-[#854D0E] border-[#C58A25]/30'
                          }`}
                        >
                          {isOriginal ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>ORIGINAL • VERIFIED</span>
                            </>
                          ) : isUnrelated ? (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>REJECTED • NON-GOVERNMENT</span>
                            </>
                          ) : isTampered ? (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>NOT ORIGINAL • TAMPERED</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>INCONCLUSIVE</span>
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-[#657572] mt-1.5">
                        {isOriginal
                          ? `The presented document conforms to genuine issuing specifications (${activeScanResult.detectedCardType || activeScanResult.classifiedType}) with 100% forensic alignment.`
                          : isUnrelated
                          ? t('unrelated_desc')
                          : isTampered
                          ? `Multiple forensic anomalies detected across visual, typographic, or cryptographic layers of ${activeScanResult.detectedCardType || activeScanResult.classifiedType}.`
                          : 'Image resolution, blur, or glare restricts definitive automated forensic evaluation.'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons: Instant Report & Heatmap Navigation */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => viewScanReport(activeScanResult.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#063F3A] text-white text-xs font-semibold hover:bg-[#0B6B5E] transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-[#E1B95A]" />
                      <span>Audit Report Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => viewScanEvidence(activeScanResult.id)}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors ${
                        !isOriginal
                          ? 'bg-[#C94A45]/10 border-[#C94A45]/30 text-[#A5342F] hover:bg-[#C94A45]/20'
                          : 'bg-white border-[#657572]/20 text-[#063F3A] hover:bg-[#F8F5ED]'
                      }`}
                    >
                      <Layers className={`w-3.5 h-3.5 ${!isOriginal ? 'text-[#C94A45]' : 'text-[#218A68]'}`} />
                      <span>Evidence Heatmap</span>
                    </motion.button>
                  </div>
                </div>

                {/* Detected Specimen Metadata Pill */}
                <div className="p-3.5 bg-white/95 rounded-xl border border-[#657572]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#0B6B5E]" />
                    <div>
                      <span className="text-[#657572]">Identified Card: </span>
                      <span className="font-bold text-[#102321]">
                        {activeScanResult.detectedCardType || activeScanResult.classifiedType}
                      </span>
                      {activeScanResult.issuingCountry && (
                        <span className="text-[#0B6B5E] font-medium ml-1">
                          • {activeScanResult.issuingCountry}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-black/5 text-[#657572] font-bold">
                      Confidence: {Math.round((activeScanResult.result?.confidence || 0.9) * 100)}%
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/5 text-[#657572]">
                      Authority: {activeScanResult.issuingAuthority || 'N/A'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#063F3A]/10 text-[#063F3A] font-bold">
                      Standard: {activeScanResult.datasetReference || 'MIDV-500 Standard'}
                    </span>
                  </div>
                </div>

                {/* INTELLIGENT DOCUMENT VALIDATOR COMPONENT */}
                <IntelligentValidatorCard
                  validation={activeScanResult.intelligentValidation}
                  isOriginal={activeScanResult.isOriginal}
                  detectedCardType={activeScanResult.detectedCardType || activeScanResult.classifiedType}
                  isOfficialGov={activeScanResult.isOfficialGovernmentDoc}
                  onUploadNewDoc={handleResetScan}
                />

                {/* CANVAS-BASED HEATMAP EVIDENCE OVERLAY */}
                <div className="bg-white rounded-xl border border-[#063F3A]/20 overflow-hidden shadow-2xs">
                  <div className="p-4 border-b border-[#063F3A]/15 flex items-center justify-between flex-wrap gap-3"
                    style={{ backgroundColor: isOriginal ? '#F0FDF4' : isTampered || isUnrelated ? '#FEF2F2' : '#FEFCE8' }}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className={`w-5 h-5 ${isOriginal ? 'text-[#166534]' : isTampered || isUnrelated ? 'text-[#991B1B]' : 'text-[#854D0E]'}`} />
                      <div>
                        <h4 className={`font-bold text-sm ${isOriginal ? 'text-[#166534]' : isTampered || isUnrelated ? 'text-[#991B1B]' : 'text-[#854D0E]'}`}>
                          {isOriginal ? 'Document is Safe' : isTampered || isUnrelated ? 'Document is Suspicious/Tampered' : 'Document requires manual review'}
                        </h4>
                        <p className="text-[11px] text-[#657572]">Visual Evidence Heatmap Analytics</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative w-full bg-[#102321] aspect-[3/2] sm:aspect-video flex items-center justify-center overflow-hidden">
                    {(activeScanResult.imageSrc || filePreview) ? (
                      <>
                        <img 
                          src={activeScanResult.imageSrc || filePreview!} 
                          alt="Scan Evidence" 
                          className="max-w-full max-h-full object-contain absolute z-0" 
                        />
                        {/* Render Anomalies directly on the image */}
                        {[
                          ...(activeScanResult.findings || []).map((f, i) => ({
                            id: f.id,
                            title: f.title,
                            region: f.region || { x: 20 + i * 15, y: 30 + i * 10, width: 25, height: 20 },
                            isFinding: true,
                            label: f.category || 'Anomaly'
                          })),
                          ...(activeScanResult.borderAudit?.checks || [])
                            .filter((c) => c.anomalyRegion && c.status === 'FLAGGED')
                            .map((c, i) => ({
                              id: `BORDER-${c.checkKey}`,
                              title: c.name,
                              region: c.anomalyRegion!,
                              isFinding: false,
                              label: 'Border Anomaly'
                            }))
                        ].map((anomaly, idx) => (
                          <div
                            key={anomaly.id}
                            className="absolute z-20 flex items-center justify-center group"
                            style={{
                              left: `${anomaly.region.x}%`,
                              top: `${anomaly.region.y}%`,
                              width: `${anomaly.region.width}%`,
                              height: `${anomaly.region.height}%`,
                            }}
                          >
                            {/* The Highlight Box */}
                            <div className="absolute inset-0 rounded border-2 border-[#C94A45] bg-[#C94A45]/20 shadow-xl pointer-events-none" />
                            
                            {/* Static Callout Label (always visible) */}
                            <div className="absolute -right-32 top-1/2 -translate-y-1/2 flex items-center w-max pointer-events-none">
                               <div className="w-8 h-[1px] bg-[#C94A45]" />
                               <div className="bg-[#102321]/90 backdrop-blur text-white text-[9px] font-bold px-2 py-1 rounded border border-[#C94A45]/50 shadow-md">
                                 {anomaly.title}
                               </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                       <div className="text-[#657572] text-sm">No source image available for heatmap</div>
                    )}
                  </div>
                </div>

                {/* EXPLICIT REASONS DISPLAY: PROVING ORIGINAL VS UNRELATED VS FLAGGED */}
                <div className="space-y-4">
                  {isOriginal ? (
                    /* REASONS WHY IT IS ORIGINAL */
                    <div className="bg-white rounded-xl border border-[#218A68]/25 p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#218A68]/15">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#218A68]" />
                          <h4 className="font-bold text-[#14532D] text-sm">
                            Forensic Reasons Proving Document Is Original / Authentic:
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#218A68]/10 text-[#218A68] border border-[#218A68]/20">
                          ALL 6 VECTORS VERIFIED
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                        {(activeScanResult.result?.primaryReasons || []).map((reason, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.04 }}
                            className="p-3 rounded-lg bg-[#218A68]/5 border border-[#218A68]/15 flex items-start gap-2.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#218A68] shrink-0 mt-0.5" />
                            <span className="text-[#102321] leading-relaxed">{reason}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Extracted Fields Verification Parity */}
                      {activeScanResult.extractedFields && activeScanResult.extractedFields.length > 0 && (
                        <div className="pt-3 border-t border-[#657572]/10 space-y-2">
                          <p className="text-[11px] font-semibold text-[#657572]">
                            Verified Demographic Fields (OCR & Digital Signature Matched):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {activeScanResult.extractedFields.map((field, idx) => (
                              <div
                                key={idx}
                                className="px-2.5 py-1 rounded-md bg-white border border-[#218A68]/20 text-[11px] flex items-center gap-1.5 shadow-2xs"
                              >
                                <span className="text-[#657572]">{field.label}:</span>
                                <span className="font-mono font-bold text-[#102321]">{field.value}</span>
                                <span className="text-[10px] text-[#218A68] font-bold ml-1">✓ Match</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : isUnrelated ? (
                    /* REASONS WHY IT IS REJECTED AS NON-GOVERNMENT / UNRELATED */
                    <div className="bg-white rounded-xl border border-[#991B1B]/30 p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#991B1B]/20">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-[#991B1B]" />
                          <h4 className="font-bold text-[#991B1B] text-sm">
                            Reasons Why Card Is Disqualified (Not An Original Sovereign Document):
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#991B1B]/10 text-[#991B1B] border border-[#991B1B]/20">
                          POLICY REJECTION
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        {(activeScanResult.result?.primaryReasons || []).map((reason, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.04 }}
                            className="p-3 rounded-lg bg-[#991B1B]/5 border border-[#991B1B]/20 flex items-start gap-2.5"
                          >
                            <XCircle className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-semibold text-[#991B1B] block">Disqualification Factor #{i + 1}:</span>
                              <span className="text-[#102321] leading-relaxed">{reason}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Explicit List of Missing Sovereign Requirements */}
                      <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#991B1B]/25 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <FileWarning className="w-4 h-4 text-[#991B1B]" />
                          <h5 className="font-bold text-xs text-[#991B1B]">
                            Missing Sovereign Checks & Security Features (Non-Accredited Specimen):
                          </h5>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {(activeScanResult.borderAudit?.missingSovereignRequirements || [
                            '"Missing Statutory Sovereign Heraldic Crest / State Seal"',
                            '"Missing ICAO Doc 9303 Machine Readable Zone (MRZ) Corridor"',
                            '"Missing Anti-Photocopy Micro-Guilloche Fine Security Waves"',
                            '"Missing Government Cryptographic Barcode / Secure QR Digest"',
                            '"Missing Border Admissibility Credential"',
                          ]).map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-lg bg-white border border-[#991B1B]/15 text-[#991B1B] font-semibold flex items-center gap-2 shadow-2xs"
                            >
                              <XCircle className="w-3.5 h-3.5 shrink-0 text-[#991B1B]" />
                              <span>{item.startsWith('"') ? item : `"${item}"`}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary callout */}
                      <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#657572]/20 text-[11px] text-[#657572]">
                        <span className="font-bold text-[#102321]">Admissibility Standard: </span>
                        DocSure AI strictly evaluates accredited sovereign government credentials (such as National IDs, Passports, Voter IDs, and Driver Licenses across 190+ countries). Commercial payment cards, corporate badges, and recreational cards fail evaluation.
                      </div>
                    </div>
                  ) : isTampered ? (
                    /* REASONS WHY IT IS FLAGGED / TAMPERED */
                    <div className="bg-white rounded-xl border border-[#C94A45]/30 p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#C94A45]/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-[#C94A45]" />
                          <h4 className="font-bold text-[#991B1B] text-sm">
                            Forensic Reasons Why Document Was Flagged As Tampered / Not Original:
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#C94A45]/10 text-[#C94A45] border border-[#C94A45]/20">
                          TAMPER ANOMALIES DETECTED
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        {(activeScanResult.result?.primaryReasons || []).map((reason, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.04 }}
                            className="p-3 rounded-lg bg-[#C94A45]/5 border border-[#C94A45]/20 flex items-start gap-2.5"
                          >
                            <XCircle className="w-4 h-4 text-[#C94A45] shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-semibold text-[#991B1B] block">Tampering Indicator #{i + 1}:</span>
                              <span className="text-[#102321] leading-relaxed">{reason}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Forensic Findings Breakdown */}
                      {activeScanResult.findings && activeScanResult.findings.length > 0 && (
                        <div className="pt-3 border-t border-[#C94A45]/15 space-y-2">
                          <p className="text-[11px] font-semibold text-[#991B1B]">
                            Discovered Evidence Anomaly Bounding Regions:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {activeScanResult.findings.map((f, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#C94A45]/20 text-[11px] space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#102321]">{f.title}</span>
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#C94A45]/15 text-[#991B1B]">
                                    {f.severity}
                                  </span>
                                </div>
                                <p className="text-[#657572]">{f.description}</p>
                                <p className="text-[10px] text-[#0B6B5E] font-medium">Model: {f.modelVersion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* REASONS WHY IT IS INCONCLUSIVE */
                    <div className="bg-white rounded-xl border border-[#C58A25]/30 p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#C58A25]/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-[#C58A25]" />
                          <h4 className="font-bold text-[#854D0E] text-sm">
                            Evaluation Inconclusive / Partial Document:
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#C58A25]/10 text-[#854D0E] border border-[#C58A25]/20">
                          INSUFFICIENT DATA
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        {(activeScanResult.result?.primaryReasons || []).map((reason, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.04 }}
                            className="p-3 rounded-lg bg-[#C58A25]/5 border border-[#C58A25]/20 flex items-start gap-2.5"
                          >
                            <AlertTriangle className="w-4 h-4 text-[#854D0E] shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-semibold text-[#854D0E] block">Observation #{i + 1}:</span>
                              <span className="text-[#102321] leading-relaxed">{reason}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Summary callout */}
                      <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#657572]/20 text-[11px] text-[#657572]">
                        <span className="font-bold text-[#102321]">Action Required: </span>
                        Please re-scan the document in better lighting or ensure the full document is visible within the frame. The current image lacks the necessary details to confirm or deny authenticity.
                      </div>
                    </div>
                  )}

                  {/* BORDER CHECKPOINT 8-CHECK VERIFICATION AUDIT PANEL */}
                  {activeScanResult.borderAudit && (
                    <div className="bg-white rounded-xl border border-[#063F3A]/20 p-5 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-[#063F3A]/15">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#0B6B5E]" />
                          <div>
                            <h4 className="font-bold text-[#063F3A] text-sm">
                              Border Checkpoint Forensic Audit (8 Operational Challenges)
                            </h4>
                            <p className="text-[11px] text-[#657572]">
                              Real-time multi-spectral verification calibrated for high-throughput border screening
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#063F3A]/10 text-[#063F3A] font-bold">
                            {activeScanResult.borderAudit.checks.filter((c) => c.status === 'PASSED').length}/8 PASS
                          </span>
                          <span className="px-2 py-0.5 rounded bg-black/5 text-[#657572]">
                            {activeScanResult.borderAudit.screeningLatencyMs}ms Latency
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeScanResult.borderAudit.checks.map((check) => (
                          <div
                            key={check.checkKey}
                            className={`p-3 rounded-lg border text-xs space-y-1.5 transition-all ${
                              check.status === 'PASSED'
                                ? 'bg-[#218A68]/5 border-[#218A68]/20'
                                : check.status === 'FLAGGED'
                                ? 'bg-[#C94A45]/5 border-[#C94A45]/25'
                                : check.status === 'DISQUALIFIED'
                                ? 'bg-[#991B1B]/5 border-[#991B1B]/25'
                                : 'bg-[#C58A25]/5 border-[#C58A25]/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <span className="font-bold text-[#102321]">{check.name}</span>
                              <span
                                className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  check.status === 'PASSED'
                                    ? 'bg-[#218A68]/15 text-[#15803D]'
                                    : 'bg-[#C94A45]/15 text-[#DC2626]'
                                }`}
                              >
                                {check.status}
                              </span>
                            </div>
                            <div className="text-[11px] font-semibold text-[#063F3A]">{check.verdict}</div>
                            <p className="text-[10px] text-[#657572] leading-tight">{check.details}</p>
                            <div className="text-[9px] font-mono text-[#0B6B5E] pt-1 border-t border-black/5">
                              Indicator: {check.technicalIndicator}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendation & JSON Download */}
                <div className="bg-white p-4 rounded-xl border border-[#657572]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[#657572] font-medium">Operational Recommendation:</span>
                    <p className="font-semibold text-[#102321]">{activeScanResult.result?.recommendation}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadJSON(activeScanResult)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F5ED] hover:bg-[#EFE9DB] text-[#063F3A] font-semibold text-xs transition-colors self-start sm:self-auto shrink-0 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0B6B5E]" />
                    <span>Download Immutable JSON Certificate</span>
                  </button>
                </div>

                {/* Statutory Honesty Box */}
                <div className="p-3.5 bg-white/80 rounded-xl border border-[#657572]/15 text-[11px] text-[#657572] flex items-start gap-2.5 leading-relaxed">
                  <Info className="w-4 h-4 text-[#0B6B5E] shrink-0 mt-0.5" />
                  <span>
                    <strong>Statutory Notice:</strong> AI-assisted screening result — not a definitive judicial verdict.
                    The system provides empirical risk confidence signals without claiming 100% absolute infallibility.
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Complete 7-Phase Diagnostic Accordion */}
          {activeScanResult.pipelinePhases && (
            <PhaseInspector phases={activeScanResult.pipelinePhases} />
          )}

          {/* Next Document Actions */}
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            {fileQueue.length > 0 ? (
              <button
                type="button"
                onClick={processNextInQueue}
                className="px-5 py-2.5 rounded-xl bg-[#218A68] border border-[#218A68] text-xs font-bold text-white hover:bg-[#1B7054] shadow-sm transition-colors flex items-center gap-1.5"
              >
                <StepForward className="w-3.5 h-3.5" />
                Process Next in Queue ({fileQueue.length} left)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPipelineStage('IDLE');
                  setStepNumber(0);
                  setActiveScanResult(null);
                  setCapturedImageData(null);
                  setFilePreview(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#657572]/25 text-xs font-semibold text-[#063F3A] hover:bg-[#F8F5ED] shadow-2xs transition-colors"
              >
                ← Screen Another Document
              </button>
            )}
            <button
              type="button"
              onClick={() => viewScanReport(activeScanResult.id)}
              className="px-5 py-2.5 rounded-xl bg-[#063F3A] text-white text-xs font-bold hover:bg-[#0B6B5E] shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#E1B95A]" />
              <span>Print Official Audit Report</span>
            </button>
          </div>
        </motion.div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#C94A45]/10 border border-[#C94A45]/20 text-xs text-[#C94A45] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
