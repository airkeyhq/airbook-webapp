'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { signOut } from '@/lib/auth-client';
import {
  Location24Filled,
  Location24Regular,
  ShieldCheckmark24Filled,
  ShieldCheckmark24Regular,
  Shield24Filled,
  Key24Filled,
  Navigation24Filled,
  ArrowClockwise24Filled,
  Dismiss24Filled,
  SignOut24Filled,
  Alert24Regular,
  LockClosed24Filled,
} from '@fluentui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface GeofenceVerificationGateProps {
  required: boolean;
  salonName: string;
  allowedRadiusMeters: number;
  canSupervisorBypass?: boolean;
  hasSupervisorPinConfigured?: boolean;
  strictness?: 'strict' | 'warn_and_audit';
  onVerified?: () => void;
}

export function GeofenceVerificationGate({
  required,
  salonName,
  allowedRadiusMeters,
  canSupervisorBypass = true,
  hasSupervisorPinConfigured = false,
  strictness = 'strict',
  onVerified,
}: GeofenceVerificationGateProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(required);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'locating' | 'verifying' | 'inside' | 'outside' | 'permission_denied' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [showSupervisorBypass, setShowSupervisorBypass] = useState(false);
  const [supervisorPin, setSupervisorPin] = useState('');
  const [bypassReason, setBypassReason] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setIsOpen(required);
  }, [required]);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  const handleVerifyLocation = () => {
    setLoading(true);
    setStatus('locating');
    setErrorMessage(null);

    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setStatus('error');
      setLoading(false);
      setErrorMessage(t('geofenceErrorUnsupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setStatus('verifying');
        try {
          const res = await fetch('/api/geofence/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            }),
          });

          const data = await res.json();

          if (res.ok && data.success) {
            setStatus('inside');
            setDistanceMeters(data.distanceMeters ?? 0);
            setTimeout(() => {
              setIsOpen(false);
              onVerified?.();
              router.refresh();
            }, 850);
          } else {
            setStatus('outside');
            setDistanceMeters(data.distanceMeters ?? null);
            setErrorMessage(
              data.distanceMeters
                ? `${t('geofenceOutsideRadius')} (${data.distanceMeters}m / ${t('geofenceAllowed')}: ${allowedRadiusMeters}m)`
                : t('geofenceOutsideGeneric')
            );
          }
        } catch (err: any) {
          setStatus('error');
          setErrorMessage(err?.message || t('geofenceErrorVerificationFailed'));
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setStatus('permission_denied');
          setErrorMessage(t('geofenceErrorPermissionDenied'));
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setStatus('error');
          setErrorMessage(t('geofenceErrorPositionUnavailable'));
        } else if (geoError.code === geoError.TIMEOUT) {
          setStatus('error');
          setErrorMessage(t('geofenceErrorTimeout'));
        } else {
          setStatus('error');
          setErrorMessage(t('geofenceErrorGenericLocation'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSupervisorBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorPin.trim()) {
      setPinError(t('geofencePinRequired'));
      return;
    }

    setPinLoading(true);
    setPinError(null);

    try {
      const res = await fetch('/api/geofence/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: supervisorPin.trim(),
          reason: bypassReason.trim() || 'Supervisor Mobile Override',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('inside');
        setTimeout(() => {
          setIsOpen(false);
          onVerified?.();
          router.refresh();
        }, 850);
      } else {
        setPinError(
          data.error === 'invalid_pin'
            ? t('geofenceInvalidPin')
            : data.error || t('geofenceBypassFailed')
        );
      }
    } catch (err: any) {
      setPinError(err?.message || t('geofenceBypassFailed'));
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="w-full md:max-w-lg bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
        >
          {/* Mobile Drag Handle Bar */}
          <div className="pt-3 pb-1 md:hidden flex justify-center flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          {/* Modal Header */}
          <div className="p-5 sm:p-6 pb-4 flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  status === 'inside'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : status === 'outside' || status === 'permission_denied'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-[#2BB5FF]/15 text-[#2BB5FF] border border-[#2BB5FF]/30'
                }`}
              >
                {status === 'inside' ? (
                  <ShieldCheckmark24Filled className="w-6 h-6" />
                ) : status === 'outside' || status === 'permission_denied' ? (
                  <Shield24Filled className="w-6 h-6" />
                ) : (
                  <Location24Filled className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] tracking-tight">
                  {t('geofenceGateTitle')}
                </h3>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">
                  {salonName}
                </p>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {strictness === 'strict' ? t('geofenceStrictEnforcement') : t('geofenceAuditMode')}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {t('geofenceGateDesc')}
            </p>

            {/* Status Feedback Banners */}
            {status === 'inside' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
                <ShieldCheckmark24Filled className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="font-bold">{t('geofenceVerifiedSuccess')}</span>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {distanceMeters !== null
                      ? `${t('geofenceCurrentDistance')}: ${distanceMeters}m (${t('geofenceAllowed')}: ${allowedRadiusMeters}m)`
                      : t('geofenceAccessGranted')}
                  </p>
                </div>
              </div>
            )}

            {(status === 'outside' || status === 'permission_denied' || status === 'error') && errorMessage && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  <Alert24Regular className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span>{t('geofenceAccessRestricted')}</span>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">{errorMessage}</p>
                {status === 'outside' && distanceMeters !== null && (
                  <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    {t('geofenceMeasuredDistance')}: {distanceMeters}m · {t('geofenceRadiusPerimeter')}: {allowedRadiusMeters}m
                  </p>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleVerifyLocation}
                disabled={loading || status === 'inside'}
                className="btn-primary w-full h-12 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>{status === 'locating' ? t('geofenceAcquiringGps') : t('geofenceVerifyingPerimeter')}</span>
                  </>
                ) : status === 'outside' || status === 'error' ? (
                  <>
                    <ArrowClockwise24Filled className="w-4 h-4" />
                    <span>{t('geofenceRetryGps')}</span>
                  </>
                ) : (
                  <>
                    <Navigation24Filled className="w-4 h-4" />
                    <span>{t('geofenceVerifyLocationCta')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Supervisor Emergency Override Collapsible */}
            {canSupervisorBypass && (
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                {!showSupervisorBypass ? (
                  <button
                    type="button"
                    onClick={() => setShowSupervisorBypass(true)}
                    className="text-[11px] font-bold text-[var(--color-accent-primary)] hover:underline flex items-center gap-1.5 mx-auto"
                  >
                    <Key24Filled className="w-3.5 h-3.5" />
                    <span>{t('geofenceSupervisorOverrideToggle')}</span>
                  </button>
                ) : (
                  <form onSubmit={handleSupervisorBypass} className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <LockClosed24Filled className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        {t('geofenceSupervisorPinTitle')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSupervisorBypass(false)}
                        className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        {t('cancel')}
                      </button>
                    </div>

                    <input
                      type="password"
                      maxLength={8}
                      placeholder={t('geofenceEnterPinPlaceholder')}
                      value={supervisorPin}
                      onChange={(e) => setSupervisorPin(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold tracking-widest text-[var(--text-primary)] text-center focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-2 focus:ring-[#1A8EFF]/20"
                    />

                    <input
                      type="text"
                      placeholder={t('geofenceOverrideReasonPlaceholder')}
                      value={bypassReason}
                      onChange={(e) => setBypassReason(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-accent-primary)]"
                    />

                    {pinError && (
                      <p className="text-[11px] text-red-500 font-semibold">{pinError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={pinLoading || !supervisorPin.trim()}
                      className="btn-secondary w-full h-10 rounded-2xl text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {pinLoading ? (
                        <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
                      ) : (
                        <Key24Filled className="w-3.5 h-3.5" />
                      )}
                      <span>{t('geofenceAuthorizeBypass')}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Side-to-Side Bottom Banner for Sign Out / Switch Account */}
          <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 p-3.5 px-5 flex items-center justify-between gap-3 flex-shrink-0">
            <span className="text-[11px] text-[var(--text-muted)]">
              {t('geofenceWrongAccount')}
            </span>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn-tertiary px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center gap-1.5"
            >
              <SignOut24Filled className="w-3.5 h-3.5" />
              <span>{signingOut ? t('geofenceSigningOut') : t('geofenceSignOut')}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
