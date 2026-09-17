'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { FloatingInput, FloatingTextarea } from '@/components/FloatingInput';
import { CustomSelect } from '@/components/CustomSelect';
import { EmptyState } from '@/components/EmptyState';
import {
  Sparkle24Filled,
  Sparkle24Regular,
  Clock24Regular,
  CheckmarkCircle24Filled,
  Dismiss24Filled,
  Person24Regular,
  Mail24Regular,
  Call24Regular,
  Building24Regular,
  Location24Regular,
  Globe24Regular,
  Tag24Regular,
  DataTrending24Regular,
  Search24Regular,
  Filter24Regular,
  ArrowRight24Filled,
  ArrowLeft24Filled,
  Edit24Regular,
  Calendar24Regular,
  ChatMultiple24Regular,
  Copy24Filled,
  Open24Regular,
  Checkmark24Filled,
} from '@fluentui/react-icons';

interface FoundingApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  city: string;
  country: string;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  staffCount: number;
  monthlyAppointments: string;
  currentSoftware: string;
  primaryPainPoint?: string | null;
  feedbackCommitment: string;
  status: 'pending' | 'under_review' | 'call_scheduled' | 'approved' | 'rejected' | 'activated';
  qualificationScore: number;
  internalNotes?: string | null;
  locale: string;
  createdAt: string;
}

export default function FoundingApplicationsAdminPage() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<FoundingApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Selected Application Drawer
  const [selectedApp, setSelectedApp] = useState<FoundingApplication | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState<string>('pending');
  const [drawerNotes, setDrawerNotes] = useState<string>('');
  const [drawerScore, setDrawerScore] = useState<number>(50);
  const [copiedRef, setCopiedRef] = useState(false);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/founding-applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openReviewDrawer = (app: FoundingApplication) => {
    setSelectedApp(app);
    setDrawerStatus(app.status);
    setDrawerNotes(app.internalNotes || '');
    setDrawerScore(app.qualificationScore || 50);
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (newStatus?: string) => {
    if (!selectedApp) return;

    try {
      setIsUpdating(true);
      const targetStatus = newStatus || drawerStatus;
      const res = await fetch('/api/founding-applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedApp.id,
          status: targetStatus,
          internalNotes: drawerNotes,
          qualificationScore: drawerScore,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local list
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? { ...a, ...data.application } : a))
        );
        setSelectedApp(data.application);
        setDrawerStatus(data.application.status);
      }
    } catch (err) {
      console.error('Error updating application:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Metrics
  const totalApps = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'pending' || a.status === 'under_review').length;
  const callCount = applications.filter((a) => a.status === 'call_scheduled').length;
  const approvedCount = applications.filter((a) => a.status === 'approved' || a.status === 'activated').length;
  const avgScore = totalApps > 0 ? Math.round(applications.reduce((acc, a) => acc + (a.qualificationScore || 0), 0) / totalApps) : 0;

  // Filtered List
  const filteredApps = applications.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesType = typeFilter === 'all' || a.businessType === typeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      a.businessName.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q);
    return matchesStatus && matchesType && matchesQuery;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'activated':
        return {
          label: 'Aprobado · 2M Gratis',
          color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
        };
      case 'call_scheduled':
        return {
          label: 'Llamada Agendada',
          color: 'bg-[#8338EC]/10 border-[#8338EC]/20 text-[#8338EC]',
        };
      case 'under_review':
        return {
          label: 'En Evaluación',
          color: 'bg-[#2BB5FF]/10 border-[#2BB5FF]/20 text-[#0284C7] dark:text-[#2BB5FF]',
        };
      case 'rejected':
        return {
          label: 'No Calificado',
          color: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
        };
      default:
        return {
          label: 'Pendiente',
          color: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
        };
    }
  };

  const formatBusinessType = (type: string) => {
    const map: Record<string, string> = {
      hair_salon: 'Salón de Belleza',
      barbershop: 'Barbería',
      spa_wellness: 'Spa & Bienestar',
      medspa: 'Clínica Estética',
      nails: 'Estudio de Uñas',
      other: 'Belleza / Otro',
    };
    return map[type] || type;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 pb-16">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
            <Link href="/in" className="hover:text-[var(--text-primary)] transition-colors">
              Console
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)]">Founding Clients</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Programa de Clientes Fundadores · Pilot Review
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Postulaciones recibidas para el beneficio de 2 meses gratis de AirBook.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchApplications}
            className="btn-secondary h-10 px-4 rounded-2xl text-xs font-bold flex items-center gap-2"
          >
            <span>Actualizar</span>
          </button>
          <Link
            href="/founding"
            target="_blank"
            className="btn-primary h-10 px-4 rounded-2xl text-xs font-bold flex items-center gap-2"
          >
            <span>Ver Landing Pública</span>
            <Open24Regular className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
            Total Postulaciones
          </span>
          <p className="text-2xl font-black text-[var(--text-primary)]">{totalApps}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
            Por Evaluar
          </span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#8338EC] tracking-wider">
            Llamada Agendada
          </span>
          <p className="text-2xl font-black text-[#8338EC]">{callCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
            Aprobados (2M Free)
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{approvedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] uppercase font-bold text-[#2BB5FF] tracking-wider">
            Score Promedio
          </span>
          <p className="text-2xl font-black text-[#0284C7] dark:text-[#2BB5FF]">{avgScore}/100</p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <FloatingInput
              label="Buscar por salón, titular, email o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search24Regular className="w-4 h-4" />}
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-1">
            <CustomSelect
              label="Estado de Calificación"
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'pending', label: 'Pendiente' },
                { value: 'under_review', label: 'En Evaluación' },
                { value: 'call_scheduled', label: 'Llamada Agendada' },
                { value: 'approved', label: 'Aprobado (2M Gratis)' },
                { value: 'rejected', label: 'No Calificado' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-1">
            <CustomSelect
              label="Giro de Negocio"
              options={[
                { value: 'all', label: 'Todos los giros' },
                { value: 'hair_salon', label: 'Salón de Belleza' },
                { value: 'barbershop', label: 'Barbería' },
                { value: 'spa_wellness', label: 'Spa & Bienestar' },
                { value: 'medspa', label: 'Clínica Estética' },
                { value: 'nails', label: 'Estudio de Uñas' },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
            />
          </div>
        </div>

        {/* Structured Interactive Applications List */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)]/30 rounded-3xl border border-[var(--border-subtle)]">
            Cargando postulaciones desde PostgreSQL...
          </div>
        ) : filteredApps.length === 0 ? (
          <EmptyState
            icon={Sparkle24Regular}
            title="Sin postulaciones en esta vista"
            description="No se encontraron registros de clientes fundadores que coincidan con los filtros seleccionados."
            action={{
              label: 'Ver Formulario Público',
              onClick: () => window.open('/founding/form', '_blank'),
            }}
          />
        ) : (
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] overflow-hidden divide-y divide-[var(--border-subtle)] shadow-xs">
            {filteredApps.map((app) => {
              const statusInfo = getStatusBadge(app.status);
              return (
                <div
                  key={app.id}
                  onClick={() => openReviewDrawer(app)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--bg-secondary)]/50 transition-colors cursor-pointer group"
                >
                  {/* Left info: Salon & Owner */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-[var(--text-primary)] group-hover:text-[#2BB5FF] transition-colors">
                        {app.businessName}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                        {formatBusinessType(app.businessType)}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">•</span>
                      <span className="text-xs text-[var(--text-secondary)] font-medium">
                        {app.city}, {app.country}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
                      <span className="font-bold text-[var(--text-primary)]">{app.name}</span>
                      <span>{app.email}</span>
                      <span>{app.phone}</span>
                    </div>

                    {app.primaryPainPoint && (
                      <p className="text-xs text-[var(--text-muted)] italic truncate max-w-xl">
                        "{app.primaryPainPoint}"
                      </p>
                    )}
                  </div>

                  {/* Operational metrics */}
                  <div className="flex items-center gap-4 text-xs flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-extrabold text-[var(--text-primary)]">{app.staffCount} especialistas</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{app.monthlyAppointments}</p>
                    </div>

                    {/* Score Pill */}
                    <div className="px-2.5 py-1 rounded-xl bg-[#2BB5FF]/10 text-[#0284C7] dark:text-[#2BB5FF] font-mono font-bold text-xs">
                      {app.qualificationScore} pts
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`px-2.5 py-1 rounded-full border text-[11px] font-extrabold whitespace-nowrap ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>

                    <button
                      type="button"
                      className="btn-secondary h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span>Revisar</span>
                      <ArrowRight24Filled className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review & Qualification Modal / Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedApp && (
          <div className="fixed inset-0 z-[300] flex items-center justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-full max-w-xl h-full bg-[var(--bg-primary)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between gap-4 flex-shrink-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">
                      REF: AB-FC-{selectedApp.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[var(--text-primary)] truncate">
                    {selectedApp.businessName}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-2xl hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Applicant Contact Card */}
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Contacto del Titular
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[var(--text-muted)]">Nombre</p>
                      <p className="font-extrabold text-[var(--text-primary)]">{selectedApp.name}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Ubicación</p>
                      <p className="font-extrabold text-[var(--text-primary)]">
                        {selectedApp.city}, {selectedApp.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Correo</p>
                      <a href={`mailto:${selectedApp.email}`} className="font-bold text-[#2BB5FF] hover:underline">
                        {selectedApp.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Teléfono / WhatsApp</p>
                      <a
                        href={`https://wa.me/${selectedApp.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-500 hover:underline"
                      >
                        {selectedApp.phone}
                      </a>
                    </div>
                  </div>

                  {/* Social links if provided */}
                  {(selectedApp.instagramUrl || selectedApp.websiteUrl) && (
                    <div className="pt-2 border-t border-[var(--border-subtle)]/60 flex items-center gap-3 text-xs">
                      {selectedApp.instagramUrl && (
                        <span className="text-[var(--text-secondary)] font-medium">
                          IG: <strong className="text-[var(--text-primary)]">{selectedApp.instagramUrl}</strong>
                        </span>
                      )}
                      {selectedApp.websiteUrl && (
                        <a
                          href={selectedApp.websiteUrl.startsWith('http') ? selectedApp.websiteUrl : `https://${selectedApp.websiteUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2BB5FF] font-medium hover:underline flex items-center gap-1"
                        >
                          <span>Web</span>
                          <Open24Regular className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Operations & Scale */}
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Operación y Escala
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-[var(--text-muted)]">Equipo</p>
                      <p className="font-black text-[var(--text-primary)]">{selectedApp.staffCount} Especialistas</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Citas Estimadas</p>
                      <p className="font-black text-[var(--text-primary)]">{selectedApp.monthlyAppointments}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Software Actual</p>
                      <p className="font-black text-[var(--text-primary)]">{selectedApp.currentSoftware}</p>
                    </div>
                  </div>

                  {selectedApp.primaryPainPoint && (
                    <div className="pt-2 border-t border-[var(--border-subtle)]/60 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                        Problema u Obstáculo Declarado
                      </p>
                      <p className="text-xs text-[var(--text-primary)] bg-[var(--bg-primary)] p-3 rounded-xl border border-[var(--border-subtle)]">
                        {selectedApp.primaryPainPoint}
                      </p>
                    </div>
                  )}
                </div>

                {/* Qualification Form */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-[var(--text-primary)]">
                    Calificación de la Cuenta
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <CustomSelect
                      label="Estado"
                      options={[
                        { value: 'pending', label: 'Pendiente' },
                        { value: 'under_review', label: 'En Evaluación' },
                        { value: 'call_scheduled', label: 'Llamada Agendada' },
                        { value: 'approved', label: 'Aprobar (2 Meses Gratis)' },
                        { value: 'rejected', label: 'Rechazar / Cupo Lleno' },
                      ]}
                      value={drawerStatus}
                      onChange={setDrawerStatus}
                    />

                    <FloatingInput
                      label="Puntaje de Ajuste (0-100)"
                      type="number"
                      min="0"
                      max="100"
                      value={drawerScore}
                      onChange={(e) => setDrawerScore(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>

                  <FloatingTextarea
                    label="Notas Internas (Bitácora de llamada o revisión)"
                    value={drawerNotes}
                    onChange={(e) => setDrawerNotes(e.target.value)}
                    placeholder="Ej. Hablé con la propietaria. Tienen 4 estilistas, vienen de Fresha buscando eliminar el 20% de comisión. Tienen excelente disposición para dar feedback."
                    rows={4}
                  />

                  {/* Pre-formatted WhatsApp Trigger */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Mensaje de Seguimiento por WhatsApp
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        Abrir chat directo con {selectedApp.name.split(' ')[0]}
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${selectedApp.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hola ${selectedApp.name.split(' ')[0]}, ¡muchas gracias por postularte como Cliente Fundador de AirBook! Te saluda Maria del equipo de AirBook México. Queremos coordinar tu llamada breve de alineación de 10 minutos para activar tus 2 meses 100% gratis.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary h-8 px-3 rounded-xl text-xs font-bold whitespace-nowrap"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] flex items-center justify-between gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="btn-secondary h-11 px-5 rounded-2xl text-xs font-bold cursor-pointer"
                >
                  Cerrar
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus('approved')}
                    className="btn-primary h-11 px-5 rounded-2xl text-xs font-bold flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 border-emerald-600 cursor-pointer shadow-md"
                  >
                    <Sparkle24Filled className="w-4 h-4" />
                    <span>Aprobar 2M Gratis</span>
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus()}
                    className="btn-primary h-11 px-5 rounded-2xl text-xs font-bold cursor-pointer shadow-md"
                  >
                    {isUpdating ? 'Guardando…' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
