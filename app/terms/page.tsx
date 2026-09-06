'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  DocumentText24Regular,
  ShieldCheckmark24Regular,
  Payment24Regular,
  Clock24Regular,
  Key24Regular,
  ArrowRight24Filled,
  CheckmarkCircle24Filled,
} from '@fluentui/react-icons';

export default function TermsOfServicePage() {
  const { language } = useTranslation();
  const lang = (['en', 'es', 'de', 'fr'].includes(language) ? language : 'en') as 'en' | 'es' | 'de' | 'fr';
  const [activeSection, setActiveSection] = useState('agreement');

  const content = {
    badge: {
      en: 'Terms & Conditions',
      es: 'Términos y Condiciones',
      de: 'Nutzungsbedingungen',
      fr: 'Conditions Générales',
    },
    title: {
      en: 'Terms of Service',
      es: 'Términos del Servicio',
      de: 'Allgemeine Geschäftsbedingungen',
      fr: 'Conditions d’Utilisation',
    },
    lastUpdated: {
      en: 'Last updated: September 1, 2026 · Version 2.2',
      es: 'Última actualización: 1 de septiembre de 2026 · Versión 2.2',
      de: 'Zuletzt aktualisiert: 1. September 2026 · Version 2.2',
      fr: 'Dernière mise à jour : 1er septembre 2026 · Version 2.2',
    },
    subtitle: {
      en: 'Clear, reasonable, and transparent service terms designed for independent studios, suites, and wellness professionals worldwide.',
      es: 'Términos de servicio claros, justos y transparentes diseñados para estudios independientes, suites y profesionales del bienestar.',
      de: 'Klare, faire und transparente Nutzungsbedingungen für Salons, Studios und selbstständige Dienstleister.',
      fr: 'Des conditions de service claires, équitables et transparentes conçues pour les professionnels indépendants et leurs studios.',
    },
    tocTitle: {
      en: 'Table of Contents',
      es: 'Tabla de Contenidos',
      de: 'Inhaltsverzeichnis',
      fr: 'Table des matières',
    },
  };

  const sections = [
    {
      id: 'agreement',
      title: {
        en: '1. Acceptance of Terms & Service Scope',
        es: '1. Aceptación de los Términos y Alcance',
        de: '1. Geltungsbereich & Zustimmung',
        fr: '1. Acceptation des Conditions & Champ d’Application',
      },
      icon: DocumentText24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              By creating an AirBook account, subscribing to our services, or configuring a public booking storefront, you agree to be bound by these Terms of Service. If you are operating on behalf of a salon, spa, or barbershop team, you represent that you have authority to bind that entity.
            </p>
            <p>
              AirBook grants you a revocable, non-exclusive, non-transferable right to access the booking engine, staff workspace, analytics ribbon, and payment capture tools for your business operations.
            </p>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Al registrar una cuenta en AirBook, suscribirte a nuestros servicios o configurar una página pública de reservas, aceptas quedar vinculado por estos Términos de Servicio.
            </p>
            <p>
              AirBook te otorga un derecho no exclusivo y revocable para utilizar el motor de citas, calendario de equipo, panel de métricas y herramientas de cobro para la operación de tu negocio.
            </p>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Mit der Registrierung bei AirBook akzeptieren Sie diese allgemeinen Nutzungsbedingungen für Ihre Salon- oder Studioverwaltung.</p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>En créant un compte AirBook, vous acceptez l&apos;ensemble des présentes conditions de service pour la gestion de votre activité.</p>
          </div>
        ),
      },
    },
    {
      id: 'ownership',
      title: {
        en: '2. 100% Studio Data Ownership',
        es: '2. Propiedad Total de tus Datos Comerciales',
        de: '2. Vollständige Dateninhaberschaft',
        fr: '2. Propriété Totale de Vos Données',
      },
      icon: ShieldCheckmark24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-[#0284C7] dark:text-[#2BB5FF] space-y-2">
              <p className="font-extrabold flex items-center gap-2">
                <CheckmarkCircle24Filled className="w-5 h-5 text-[#2BB5FF]" />
                You Own 100% of Your Client and Studio Records
              </p>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                We make zero claim of ownership over your customer lists, photos, pricing catalogs, formulas, or booking history. Unlike closed directory platforms, AirBook will never market competing businesses to your clients.
              </p>
            </div>
            <p>
              You maintain the absolute right to export your complete customer database in CSV or JSON format at any time with zero lock-in penalties or export fees.
            </p>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-[#0284C7] dark:text-[#2BB5FF] space-y-2">
              <p className="font-extrabold flex items-center gap-2">
                <CheckmarkCircle24Filled className="w-5 h-5 text-[#2BB5FF]" />
                Eres el Dueño del 100% de los Registros de tus Clientes
              </p>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                No reclamamos propiedad sobre tus listas de clientes, fórmulas, fotos ni historial de citas. A diferencia de otros directorios, AirBook nunca promocionará negocios competidores a tus clientes.
              </p>
            </div>
            <p>
              Tienes el derecho incondicional de exportar tu base de datos completa en formato CSV o JSON en cualquier momento, sin costo ni penalizaciones.
            </p>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Ihre Kundendaten, Rezepturen und Buchungshistorien gehören zu 100% Ihnen. Wir werben niemals für fremde Salons bei Ihren Kunden.</p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Vous êtes l&apos;unique propriétaire de votre fichier client et de vos données. Aucun démarchage concurrent n&apos;est effectué auprès de vos clients.</p>
          </div>
        ),
      },
    },
    {
      id: 'payments',
      title: {
        en: '3. Payments, Deposits & Stripe Processing',
        es: '3. Pagos, Depósitos y Procesamiento con Stripe',
        de: '3. Zahlungen, Anzahlungen & Stripe-Auszahlungen',
        fr: '3. Paiements, Acomptes & Traitement Stripe',
      },
      icon: Payment24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Payment transactions, card pre-authorizations, and automatic no-show deposit collections are processed via Stripe Connect. By enabling online payments, you agree to the Stripe Connected Account Agreement.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Direct Merchant Payouts:</strong> Client deposits flow directly from the customer to your connected bank account according to your local Stripe payout schedule.</li>
              <li><strong>No-Show &amp; Cancellation Enforcement:</strong> You establish your own deposit percentages and minimum cancellation notice windows in your studio settings.</li>
              <li><strong>Refunds &amp; Disputes:</strong> As the service merchant of record, you retain full discretion over issuing customer refunds or handling service disputes.</li>
            </ul>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Los cobros con tarjeta, depósitos de seguridad y transferencias se procesan a través de Stripe Connect.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Transferencias Directas:</strong> Los anticipos de tus clientes se transfieren directamente a tu cuenta bancaria configurada.</li>
              <li><strong>Políticas de Cancelación:</strong> Tú defines los montos de anticipo y plazos mínimos de cancelación en los ajustes de tu estudio.</li>
              <li><strong>Reembolsos:</strong> Como comercio emisor, mantienes el control para emitir reembolsos a tus clientes.</li>
            </ul>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Zahlungen und Anzahlungen werden direkt und sicher über Stripe Connect abgewickelt.</p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Les règlements et acomptes sont traités directement via Stripe Connect sur votre compte bancaire.</p>
          </div>
        ),
      },
    },
    {
      id: 'uptime',
      title: {
        en: '4. Service Reliability & Uptime Commitment',
        es: '4. Confiabilidad y Garantía de Disponibilidad',
        de: '4. Verfügbarkeit & SLA-Garantie',
        fr: '4. Disponibilité & Engagements de Service',
      },
      icon: Clock24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              We know your calendar is the heartbeat of your livelihood. AirBook targets 99.9% uptime with globally distributed edge replication, automated hourly cloud backups, and zero-downtime rolling software deployments.
            </p>
            <p>
              Offline mode caching in our progressive web app ensures that you can review daily appointments and station bookings even during intermittent local internet interruptions.
            </p>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Sabemos que tu agenda es el corazón de tu negocio. AirBook mantiene un compromiso del 99.9% de disponibilidad con réplicas globales en la nube y respaldos automáticos continuos.
            </p>
            <p>
              El modo sin conexión de nuestra aplicación permite consultar tus citas diarias incluso si se interrumpe temporalmente la conexión a internet de tu local.
            </p>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Wir gewährleisten eine Zielverfügbarkeit von 99,9% mit kontinuierlichen Backups und Offline-Cache für Ihren Tagesablauf.</p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Nous visons une disponibilité de 99,9% avec sauvegarde automatique et consultation hors ligne de vos rendez-vous du jour.</p>
          </div>
        ),
      },
    },
    {
      id: 'contact',
      title: {
        en: '5. Contact & Support',
        es: '5. Contacto y Soporte Legal',
        de: '5. Kontakt & Rechtsabteilung',
        fr: '5. Contact & Assistance Juridique',
      },
      icon: Key24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>For questions regarding enterprise terms, billing inquiries, or data processing agreements, reach out to our team:</p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1 text-xs">
              <p className="font-extrabold text-[var(--text-primary)]">AirBook Support &amp; Legal Inquiries</p>
              <p>Legal: <a href="mailto:legal@getairbook.com" className="text-[#2BB5FF] font-bold">legal@getairbook.com</a></p>
              <p>Billing &amp; Support: <a href="mailto:support@getairbook.com" className="text-[#2BB5FF] font-bold">support@getairbook.com</a></p>
            </div>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Para consultas sobre términos corporativos, facturación o acuerdos de procesamiento de datos:</p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1 text-xs">
              <p className="font-extrabold text-[var(--text-primary)]">Soporte y Consultas Legales de AirBook</p>
              <p>Legal: <a href="mailto:legal@getairbook.com" className="text-[#2BB5FF] font-bold">legal@getairbook.com</a></p>
              <p>Facturación y Soporte: <a href="mailto:support@getairbook.com" className="text-[#2BB5FF] font-bold">support@getairbook.com</a></p>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Kontaktieren Sie unsere Rechtsabteilung unter: <a href="mailto:legal@getairbook.com" className="text-[#2BB5FF] font-bold">legal@getairbook.com</a></p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Pour toute question juridique : <a href="mailto:legal@getairbook.com" className="text-[#2BB5FF] font-bold">legal@getairbook.com</a></p>
          </div>
        ),
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white font-sans">
      <MarketingHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
        {/* Top Hero Banner */}
        <div className="max-w-4xl space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2BB5FF]/10 text-[#0284C7] dark:text-[#2BB5FF] text-xs font-black uppercase tracking-wider">
            <DocumentText24Regular className="w-4 h-4" />
            <span>{content.badge[lang]}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-primary)]">
            {content.title[lang]}
          </h1>

          <p className="text-xs font-mono font-bold text-[var(--text-muted)]">
            {content.lastUpdated[lang]}
          </p>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-medium max-w-3xl">
            {content.subtitle[lang]}
          </p>
        </div>

        {/* 2-Column Content Layout: Left Sticky TOC / Right Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Table of Contents */}
          <aside className="lg:col-span-4 sticky top-28 p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4 hidden lg:block">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
              {content.tocTitle[lang]}
            </p>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`block px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeSection === sec.id
                      ? 'bg-[var(--bg-primary)] text-[#2BB5FF] shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]/50'
                  }`}
                >
                  {sec.title[lang]}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
              <Link
                href="/privacy"
                className="flex items-center justify-between text-xs font-extrabold text-[var(--text-primary)] hover:text-[#2BB5FF] transition-colors"
              >
                <span>Privacy Policy</span>
                <ArrowRight24Filled className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/data-protection"
                className="flex items-center justify-between text-xs font-extrabold text-[var(--text-primary)] hover:text-[#2BB5FF] transition-colors"
              >
                <span>Data Protection Architecture</span>
                <ArrowRight24Filled className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* Right Detailed Sections */}
          <div className="lg:col-span-8 space-y-10">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4 text-left"
                >
                  <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
                    <div className="w-9 h-9 rounded-2xl bg-[#2BB5FF]/15 text-[#0284C7] dark:text-[#2BB5FF] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] tracking-tight">
                      {sec.title[lang]}
                    </h2>
                  </div>
                  <div>{sec.text[lang]}</div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
