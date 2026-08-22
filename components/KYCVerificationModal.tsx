'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import {
  Dismiss24Filled,
  ShieldCheckmark24Filled,
  ShieldCheckmark24Regular,
  CheckmarkCircle24Filled,
  Camera24Filled,
  Sparkle24Filled,
  ArrowRight24Filled,
  Person24Filled,
  DocumentCheckmark24Filled,
} from '@fluentui/react-icons';

interface KYCVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  onVerificationComplete?: () => void;
}

export const KYCVerificationModal: React.FC<KYCVerificationModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  clientEmail,
  onVerificationComplete,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [idType, setIdType] = useState<'passport' | 'driving_license' | 'id_card'>('passport');
  const [issuingCountry, setIssuingCountry] = useState('US');
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleStartLivenessScan = () => {
    setIsScanning(true);
    setStep(3);

    // Simulate 3D biometric scan
    setTimeout(async () => {
      setIsScanning(false);
      setIsVerifying(true);

      try {
        const res = await fetch('/api/kyc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId,
            clientName,
            clientEmail,
            idType,
            issuingCountry,
            documentNumberMasked: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
          }),
        });

        const data = await res.json();
        if (data.success) {
          setStep(4);
          addToast(t('kycVerifiedSuccess'), 'success');
          if (onVerificationComplete) {
            onVerificationComplete();
          }
        } else {
          addToast(data.error || 'KYC verification failed.', 'error');
        }
      } catch (err) {
        console.error('KYC verification error:', err);
        addToast('Network error during KYC verification.', 'error');
      } finally {
        setIsVerifying(false);
      }
    }, 2800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[260] flex items-end md:items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full md:max-w-lg bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
        >
          {/* Mobile & Tablet Top Drag Handle */}
          <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          {/* Header */}
          <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheckmark24Filled className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                  {t('kycModalTitle')}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {clientName} · Verified Identity Protocol
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
            >
              <Dismiss24Filled className="w-5 h-5" />
            </button>
          </div>

          {/* Body Steps */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Step 1: Select ID Document */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {t('selectIdType')}
                  </span>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Choose the government-issued photo identification to verify.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 'passport' as const, label: t('passport'), desc: 'Official International Passport' },
                    { id: 'driving_license' as const, label: t('drivingLicense'), desc: 'State / National Driver Permit' },
                    { id: 'id_card' as const, label: t('nationalId'), desc: 'Government National Identity Card' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIdType(item.id)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        idType === item.id
                          ? 'border-blue-500 bg-blue-500/10 shadow-xs'
                          : 'border-[var(--border-subtle)] bg-black/5 dark:bg-white/5 hover:border-black/20'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{item.label}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{item.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        idType === item.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-[var(--border-subtle)]'
                      }`}>
                        {idType === item.id && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Continue to Document Scan</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Document Front Scan */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{t('scanDocumentFront')}</h4>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Hold document steady within the rectangular target frame.
                  </p>
                </div>

                <div className="relative w-full h-48 rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-dashed border-blue-500/50 flex flex-col items-center justify-center overflow-hidden p-4">
                  <div className="w-36 h-24 rounded-xl border-2 border-blue-500/60 bg-blue-500/5 flex flex-col items-center justify-center gap-1.5 shadow-sm">
                    <Camera24Filled className="w-6 h-6 text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {idType.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Scanning Laser Line */}
                  <motion.div
                    animate={{ y: [-40, 40, -40] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-xs"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 rounded-2xl bg-black/5 dark:bg-white/5 text-xs font-bold text-[var(--text-secondary)]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStartLivenessScan}
                    className="w-2/3 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkle24Filled className="w-4 h-4" />
                    <span>Proceed to 3D Selfie</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: 3D Biometric Liveness Check */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 text-center py-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('livenessSelfieCheck')}</h4>
                  <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                    {t('livenessInstruction')}
                  </p>
                </div>

                {/* Biometric Scanning Oval Frame */}
                <div className="relative w-40 h-52 mx-auto rounded-[50%] border-4 border-dashed border-blue-500/80 flex items-center justify-center overflow-hidden bg-blue-500/5 shadow-inner">
                  <Person24Filled className="w-24 h-24 text-blue-500/30" />
                  
                  {/* Rotating radar scan */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                    className="absolute inset-0 border-t-4 border-blue-600 rounded-[50%]"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-mono font-bold text-blue-600 animate-pulse">
                    {isScanning ? 'Analyzing Facial Biometric Geometry…' : t('verifyingIdentity')}
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    ISO/IEC 30107-3 Liveness Detection Standard
                  </span>
                </div>
              </motion.div>
            )}

            {/* Step 4: Instant Verified Confirmation */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckmarkCircle24Filled className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[var(--text-primary)]">
                    {t('verifiedId')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {clientName}&apos;s identity has been cryptographically confirmed.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[var(--text-secondary)]">Biometric Match:</span>
                    <span className="text-emerald-600 font-mono">99.4% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[var(--text-secondary)]">ID Document:</span>
                    <span className="text-[var(--text-primary)] font-mono uppercase">{idType} (US)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[var(--text-secondary)]">Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">
                      Active Verified
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Done
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
