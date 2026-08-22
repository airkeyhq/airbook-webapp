'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import {
  Dismiss24Filled,
  CheckmarkCircle24Filled,
  DocumentSignature24Filled,
  Sparkle24Filled,
  ShieldCheckmark24Regular,
  ArrowReset24Filled,
  Camera24Filled,
  Warning24Regular,
} from '@fluentui/react-icons';

interface WaiverTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  requireSignature: boolean;
  requirePhotoConsent: boolean;
  requireAllergyDeclaration: boolean;
}

interface WaiverPadModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  initialClientName?: string;
  initialClientEmail?: string;
  initialClientPhone?: string;
  appointmentId?: string;
  onSignedSuccess?: (signedWaiver: any) => void;
}

export const WaiverPadModal: React.FC<WaiverPadModalProps> = ({
  isOpen,
  onClose,
  clientId,
  initialClientName = '',
  initialClientEmail = '',
  initialClientPhone = '',
  appointmentId,
  onSignedSuccess,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Templates
  const [templates, setTemplates] = useState<WaiverTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Form & Clauses
  const [clientName, setClientName] = useState(initialClientName);
  const [clientEmail, setClientEmail] = useState(initialClientEmail);
  const [clientPhone, setClientPhone] = useState(initialClientPhone);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [photoConsent, setPhotoConsent] = useState(true);
  const [allergiesDeclared, setAllergiesDeclared] = useState(true);
  const [allergyNotes, setAllergyNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialClientName) setClientName(initialClientName);
    if (initialClientEmail) setClientEmail(initialClientEmail);
    if (initialClientPhone) setClientPhone(initialClientPhone);
  }, [initialClientName, initialClientEmail, initialClientPhone]);

  // Fetch templates from API
  useEffect(() => {
    if (!isOpen) return;

    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const res = await fetch('/api/waivers');
        const data = await res.json();
        if (data.success && Array.isArray(data.templates) && data.templates.length > 0) {
          setTemplates(data.templates);
          setSelectedTemplateId(data.templates[0].id);
        }
      } catch (err) {
        console.warn('Failed to load waiver templates:', err);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [isOpen]);

  // Setup Canvas
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#007AFF';
      ctx.lineWidth = 2.5;
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Submit Waiver
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      addToast('Client name is required.', 'error');
      return;
    }

    if (!hasSignature) {
      addToast('Please provide your digital signature.', 'error');
      return;
    }

    if (!termsAgreed) {
      addToast('You must accept the terms to proceed.', 'error');
      return;
    }

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas ? canvas.toDataURL('image/png') : '';

    const currentTemplate = templates.find((t) => t.id === selectedTemplateId);

    try {
      setSubmitting(true);
      const res = await fetch('/api/waivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplateId || undefined,
          templateTitle: currentTemplate?.title || 'General Liability & Health Release',
          clientId: clientId || undefined,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim() || undefined,
          clientPhone: clientPhone.trim() || undefined,
          appointmentId: appointmentId || undefined,
          signatureDataUrl,
          agreedClauses: {
            termsAgreed,
            photoConsent,
            allergiesDeclared,
            allergyNotes: allergyNotes.trim() || undefined,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.signedWaiver) {
        addToast(t('waiverSignedSuccess'), 'success');
        if (onSignedSuccess) {
          onSignedSuccess(data.signedWaiver);
        }
        onClose();
      } else {
        addToast(data.error || 'Failed to submit signed waiver.', 'error');
      }
    } catch (err) {
      console.error('Error submitting waiver:', err);
      addToast('Network error submitting waiver.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[94vh] md:max-h-[90vh] overflow-hidden"
        >
          {/* Mobile & Tablet Top Pull Bar */}
          <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          {/* Header */}
          <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                <DocumentSignature24Filled className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                  {t('waiverPadTitle')}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('waiverPadDesc')}
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

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Template Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] block">
                  {t('waiverTemplate')}
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {templates.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.title} ({tmpl.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Scrollable Agreement Terms */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] max-h-40 overflow-y-auto text-xs text-[var(--text-secondary)] leading-relaxed space-y-2 select-none">
                <p className="font-bold text-[var(--text-primary)]">{currentTemplate?.title}</p>
                <p className="whitespace-pre-line">{currentTemplate?.content}</p>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)] block">
                    {t('guestName')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)] block">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 019-2834"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--text-secondary)] block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Consent Clauses */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] cursor-pointer hover:border-blue-500/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {t('termsAgreementClause')}
                  </span>
                </label>

                {currentTemplate?.requirePhotoConsent && (
                  <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] cursor-pointer hover:border-blue-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={photoConsent}
                      onChange={(e) => setPhotoConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {t('photoConsentClause')}
                    </span>
                  </label>
                )}

                {currentTemplate?.requireAllergyDeclaration && (
                  <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] cursor-pointer hover:border-blue-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={allergiesDeclared}
                      onChange={(e) => setAllergiesDeclared(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {t('allergyDeclarationClause')}
                    </span>
                  </label>
                )}
              </div>

              {/* HTML5 Vector Signature Canvas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <DocumentSignature24Filled className="w-4 h-4 text-blue-500" />
                    <span>{t('drawSignaturePrompt')}</span>
                  </span>

                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowReset24Filled className="w-3.5 h-3.5" />
                    <span>{t('clearSignature')}</span>
                  </button>
                </div>

                <div className="relative w-full h-36 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-blue-500/40 overflow-hidden shadow-inner touch-none">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair block"
                  />
                  {!hasSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-bold text-blue-500/30">
                      Sign Here ✍️
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                <ShieldCheckmark24Regular className="w-4 h-4 flex-shrink-0" />
                <span>
                  Tamper-evident audit lock: SHA-256 Vector Signature · Timestamp Verified
                </span>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 rounded-none flex-shrink-0 z-30 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={submitting || !hasSignature}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckmarkCircle24Filled className="w-4 h-4" />
                <span>{submitting ? 'Recording…' : t('signWaiver')}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
