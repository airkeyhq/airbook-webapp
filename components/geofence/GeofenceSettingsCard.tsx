'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { FloatingInput } from '@/components/FloatingInput';
import { CustomSelect } from '@/components/CustomSelect';
import {
  Location24Filled,
  Location24Regular,
  ShieldCheckmark24Filled,
  ShieldCheckmark24Regular,
  Phone24Regular,
  Laptop24Regular,
  People24Regular,
  Clock24Regular,
  Key24Regular,
  Key24Filled,
  Navigation24Filled,
  Checkmark24Filled,
  Save24Filled,
  ArrowClockwise24Filled,
  Globe24Regular,
  Alert24Regular,
  Shield24Regular,
  LockClosed24Filled,
  LockClosed16Filled,
} from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import {
  DEFAULT_GEOFENCE_CONFIG,
  type GeofenceConfig,
  type GeofenceRole,
  type GeofenceDeviceScope,
  type GeofenceStrictness,
} from '@/lib/geofence';

const GeofenceMapPicker = dynamic(
  () => import('@/components/geofence/GeofenceMapPicker').then((mod) => mod.GeofenceMapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 sm:h-80 rounded-2xl border border-[var(--border-subtle)] bg-black/5 dark:bg-white/5 animate-pulse flex items-center justify-center text-xs text-[var(--text-muted)] font-bold">
        Loading Map...
      </div>
    ),
  }
);

interface GeofenceSettingsCardProps {
  initialConfig?: GeofenceConfig;
  salonAddress?: string | null;
  hasSupervisorPin?: boolean;
}

const RADIUS_PRESETS = [50, 100, 250, 500, 1000];

function ToggleSwitch({
  enabled,
  onToggle,
  disabled = false,
}: {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
        enabled ? 'bg-[#2BB5FF]' : 'bg-black/15 dark:bg-white/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-pressed={enabled}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center"
      />
    </button>
  );
}

export function GeofenceSettingsCard({
  initialConfig = DEFAULT_GEOFENCE_CONFIG,
  salonAddress,
  hasSupervisorPin: initialHasSupervisorPin = false,
}: GeofenceSettingsCardProps) {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [config, setConfig] = useState<GeofenceConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [supervisorPinInput, setSupervisorPinInput] = useState('');
  const [hasSupervisorPin, setHasSupervisorPin] = useState(initialHasSupervisorPin);

  // Live testing state
  const [testingGps, setTestingGps] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    inside: boolean;
    distanceMeters: number | null;
    allowedRadiusMeters: number;
  } | null>(null);

  // IP list raw string
  const [trustedIpsInput, setTrustedIpsInput] = useState(
    (initialConfig.trustedIps || []).join(', ')
  );

  // Load existing config on mount
  useEffect(() => {
    fetch('/api/geofence')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.config) {
          setConfig(data.config);
          setHasSupervisorPin(data.hasSupervisorPin);
          if (Array.isArray(data.config.trustedIps)) {
            setTrustedIpsInput(data.config.trustedIps.join(', '));
          }
        }
      })
      .catch((e) => console.warn('Failed to load geofence settings:', e));
  }, []);

  const handleToggleRole = (role: GeofenceRole) => {
    setConfig((prev) => {
      const exists = prev.enforcedRoles.includes(role);
      const updated = exists
        ? prev.enforcedRoles.filter((r) => r !== role)
        : [...prev.enforcedRoles, role];
      return { ...prev, enforcedRoles: updated };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Parse trusted IPs
      const cleanIps = trustedIpsInput
        .split(',')
        .map((ip) => ip.trim())
        .filter((ip) => ip.length > 0);

      const payload: any = {
        config: {
          ...config,
          trustedIps: cleanIps,
        },
      };

      if (supervisorPinInput.trim().length >= 4) {
        payload.supervisorPin = supervisorPinInput.trim();
      }

      const res = await fetch('/api/geofence', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConfig(data.config);
        setHasSupervisorPin(data.hasSupervisorPin);
        setSupervisorPinInput('');
        addToast(t('geofenceSavedSuccess'), 'success');
      } else {
        addToast(data.error || t('somethingWentWrong'), 'error');
      }
    } catch {
      addToast(t('somethingWentWrong'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestDistance = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      addToast(t('geofenceErrorUnsupported'), 'error');
      return;
    }

    setTestingGps(true);
    setTestResult(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch('/api/geofence/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }),
          });
          const data = await res.json();
          if (data.success) {
            setTestResult({
              tested: true,
              inside: data.inside,
              distanceMeters: data.distanceMeters,
              allowedRadiusMeters: data.allowedRadiusMeters,
            });
          }
        } catch {
          addToast(t('geofenceErrorVerificationFailed'), 'error');
        } finally {
          setTestingGps(false);
        }
      },
      (err) => {
        setTestingGps(false);
        addToast(err.message || t('geofenceErrorGenericLocation'), 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Slider progress percentage
  const sliderPercent = Math.min(
    100,
    Math.max(0, ((config.radiusMeters - 50) / (2000 - 50)) * 100)
  );

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* 1. Header Banner & Master Activation Switch */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              config.enabled
                ? 'bg-[#2BB5FF]/15 text-[#2BB5FF] border border-[#2BB5FF]/30'
                : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)]'
            }`}
          >
            <ShieldCheckmark24Filled className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                {t('geofenceTitle')}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  config.enabled
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                }`}
              >
                {config.enabled ? t('geofenceActive') : t('geofenceInactive')}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-xl leading-relaxed">
              {t('geofenceSub')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs font-bold text-[var(--text-secondary)]">
            {config.enabled ? t('enabledState') : t('disabledState')}
          </span>
          <ToggleSwitch
            enabled={config.enabled}
            onToggle={() => setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
          />
        </div>
      </div>

      {/* 2. Interactive Map & Coordinates Selection */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Location24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t('geofenceMapSectionTitle')}
            </h4>
          </div>

          <button
            type="button"
            onClick={() => setShowManualCoords(!showManualCoords)}
            className="text-[11px] font-bold text-[var(--color-accent-primary)] hover:underline"
          >
            {showManualCoords ? t('geofenceHideCoords') : t('geofenceEditCoordsManually')}
          </button>
        </div>

        {/* Manual Coordinates Toggle */}
        {showManualCoords && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <FloatingInput
              label={t('geofenceLatitude')}
              type="number"
              step="any"
              value={config.latitude ?? ''}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  latitude: e.target.value === '' ? null : parseFloat(e.target.value),
                }))
              }
            />
            <FloatingInput
              label={t('geofenceLongitude')}
              type="number"
              step="any"
              value={config.longitude ?? ''}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  longitude: e.target.value === '' ? null : parseFloat(e.target.value),
                }))
              }
            />
          </div>
        )}

        {/* Map Picker */}
        <GeofenceMapPicker
          latitude={config.latitude}
          longitude={config.longitude}
          radiusMeters={config.radiusMeters}
          salonAddress={salonAddress}
          onChange={(lat, lng) =>
            setConfig((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lng,
            }))
          }
        />
      </div>

      {/* 3. Perimeter Radius Slider & Presets */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t('geofenceRadiusTitle')}
            </h4>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#2BB5FF]/10 text-[#2BB5FF] font-extrabold text-xs">
            {config.radiusMeters}m ({Math.round(config.radiusMeters * 3.28084)} ft)
          </span>
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          {t('geofenceRadiusDesc')}
        </p>

        {/* Tactile Range Slider */}
        <div className="py-2">
          <input
            type="range"
            min={50}
            max={2000}
            step={25}
            value={config.radiusMeters}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, radiusMeters: Number(e.target.value) }))
            }
            className="w-full cursor-pointer h-2.5 rounded-full"
            style={{
              background: `linear-gradient(to right, #2BB5FF 0%, #2BB5FF ${sliderPercent}%, rgba(148, 163, 184, 0.25) ${sliderPercent}%, rgba(148, 163, 184, 0.25) 100%)`,
            }}
          />
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-[var(--text-muted)] mr-1">
            {t('geofencePresets')}:
          </span>
          {RADIUS_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, radiusMeters: preset }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                config.radiusMeters === preset
                  ? 'bg-[#2BB5FF] text-white shadow-xs'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {preset}m
            </button>
          ))}
        </div>
      </div>

      {/* 4. Granular Device Scope & Enforcement Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Scope */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Phone24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t('geofenceDeviceScopeTitle')}
            </h4>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {t('geofenceDeviceScopeDesc')}
          </p>

          <div className="space-y-2 pt-1">
            <label
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                config.deviceScope === 'mobile_only'
                  ? 'border-[#2BB5FF] bg-[#2BB5FF]/5'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]'
              }`}
            >
              <input
                type="radio"
                name="deviceScope"
                value="mobile_only"
                checked={config.deviceScope === 'mobile_only'}
                onChange={() => setConfig((prev) => ({ ...prev, deviceScope: 'mobile_only' }))}
                className="mt-1"
              />
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] block">
                  {t('geofenceMobileOnlyTitle')}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {t('geofenceMobileOnlySub')}
                </span>
              </div>
            </label>

            <label
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                config.deviceScope === 'all'
                  ? 'border-[#2BB5FF] bg-[#2BB5FF]/5'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]'
              }`}
            >
              <input
                type="radio"
                name="deviceScope"
                value="all"
                checked={config.deviceScope === 'all'}
                onChange={() => setConfig((prev) => ({ ...prev, deviceScope: 'all' }))}
                className="mt-1"
              />
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] block">
                  {t('geofenceAllDevicesTitle')}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {t('geofenceAllDevicesSub')}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Roles & Admin Exemption */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <People24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t('geofenceRolesTitle')}
            </h4>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {t('geofenceRolesDesc')}
          </p>

          <div className="space-y-2 pt-1">
            {(['staff', 'receptionist', 'manager'] as GeofenceRole[]).map((role) => {
              const checked = config.enforcedRoles.includes(role);
              return (
                <label
                  key={role}
                  className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="text-xs font-bold text-[var(--text-primary)] capitalize">
                    {t(`geofenceRole_${role}` as any)}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleRole(role)}
                    className="w-4 h-4 rounded text-[#2BB5FF]"
                  />
                </label>
              );
            })}

            {/* Exempt Owners */}
            <div className="p-3.5 rounded-2xl bg-[#2BB5FF]/5 border border-[#2BB5FF]/20 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] block">
                  {t('geofenceExemptAdminsTitle')}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  {t('geofenceExemptAdminsDesc')}
                </span>
              </div>
              <ToggleSwitch
                enabled={config.exemptAdmins}
                onToggle={() =>
                  setConfig((prev) => ({ ...prev, exemptAdmins: !prev.exemptAdmins }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Wi-Fi Whitelist & Strictness Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salon Wi-Fi & Trusted IP Whitelist */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Globe24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t('geofenceWifiTitle')}
            </h4>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {t('geofenceWifiDesc')}
          </p>

          <FloatingInput
            label={t('geofenceTrustedIpsLabel')}
            placeholder="e.g. 73.189.44.12, 192.168.1.*"
            value={trustedIpsInput}
            onChange={(e) => setTrustedIpsInput(e.target.value)}
          />
        </div>

        {/* Strictness & Shift Validity */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Clock24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t('geofenceShiftSessionTitle')}
            </h4>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {t('geofenceShiftSessionDesc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <CustomSelect
              label={t('geofenceStrictModeLabel')}
              value={config.strictness}
              onChange={(val) =>
                setConfig((prev) => ({ ...prev, strictness: val as GeofenceStrictness }))
              }
              options={[
                { value: 'strict', label: t('geofenceStrictEnforcement') },
                { value: 'warn_and_audit', label: t('geofenceAuditMode') },
              ]}
            />

            <CustomSelect
              label={t('geofenceSessionHoursLabel')}
              value={String(config.sessionDurationHours)}
              onChange={(val) =>
                setConfig((prev) => ({
                  ...prev,
                  sessionDurationHours: parseInt(val, 10) || 8,
                }))
              }
              options={[
                { value: '4', label: `4 ${t('hoursUnit')}` },
                { value: '8', label: `8 ${t('hoursUnit')} (${t('standardShift')})` },
                { value: '12', label: `12 ${t('hoursUnit')}` },
                { value: '24', label: `24 ${t('hoursUnit')}` },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 6. Supervisor Emergency PIN & Live Distance Test Utility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supervisor PIN */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Key24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                {t('geofenceSupervisorPinTitle')}
              </h4>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                hasSupervisorPin
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              {hasSupervisorPin ? t('geofencePinConfigured') : t('geofencePinNotConfigured')}
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {t('geofenceSupervisorPinDesc')}
          </p>

          <FloatingInput
            label={t('geofenceNewSupervisorPinLabel')}
            type="password"
            maxLength={6}
            placeholder="••••"
            value={supervisorPinInput}
            onChange={(e) => setSupervisorPinInput(e.target.value)}
          />
        </div>

        {/* Live Distance Tool */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Navigation24Filled className="w-4 h-4 text-[#2BB5FF]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t('geofenceLiveTestTitle')}
            </h4>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            {t('geofenceLiveTestDesc')}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestDistance}
              disabled={testingGps}
              className="btn-secondary h-11 px-4 rounded-2xl text-xs font-bold flex items-center gap-2"
            >
              {testingGps ? (
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Navigation24Filled className="w-4 h-4 text-[#2BB5FF]" />
              )}
              <span>{t('geofenceTestCurrentDistance')}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs ${
                testResult.inside
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {testResult.inside ? (
                  <ShieldCheckmark24Filled className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Alert24Regular className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span>
                  {testResult.inside
                    ? t('geofenceTestInsidePerimeter')
                    : t('geofenceTestOutsidePerimeter')}
                </span>
              </div>
              <p className="text-[11px] mt-1 opacity-90">
                {t('geofenceMeasuredDistance')}: <strong>{testResult.distanceMeters ?? 0}m</strong> ·{' '}
                {t('geofenceAllowed')}: <strong>{testResult.allowedRadiusMeters}m</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 7. Save Changes Primary Action Button */}
      <div className="pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={saving}
          className="btn-primary h-12 px-6 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md"
        >
          {saving ? (
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Save24Filled className="w-4 h-4" />
          )}
          <span>{t('save')}</span>
        </motion.button>
      </div>
    </form>
  );
}
