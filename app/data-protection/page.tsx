'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  ShieldCheckmark24Regular,
  LockClosed24Regular,
  Key24Regular,
  Payment24Regular,
  Server24Regular,
  ArrowRight24Filled,
  CheckmarkCircle24Filled,
  Globe24Regular,
  Sparkle24Regular,
} from '@fluentui/react-icons';

export default function DataProtectionPage() {
  const { language } = useTranslation();
  const lang = (['en', 'es', 'de', 'fr'].includes(language) ? language : 'en') as 'en' | 'es' | 'de' | 'fr';
  const [activeSection, setActiveSection] = useState('architecture');

  const content = {
    badge: {
      en: 'Trust & Security Architecture',
      es: 'Arquitectura de Seguridad y Confianza',
      de: 'Sicherheitsarchitektur & Compliance',
      fr: 'Architecture de Sécurité & Confiance',
    },
    title: {
      en: 'Data Protection & Security',
      es: 'Protección de Datos y Seguridad',
      de: 'Datenschutz & Sicherheit',
      fr: 'Protection des Données & Sécurité',
    },
    lastUpdated: {
      en: 'Security Audit: September 2026 · SOC2 / GDPR Compliant',
      es: 'Auditoría de Seguridad: Septiembre 2026 · Cumplimiento SOC2 / RGPD',
      de: 'Sicherheitsaudit: September 2026 · SOC2 / DSGVO-konform',
      fr: 'Audit de Sécurité : Septembre 2026 · Conforme SOC2 / RGPD',
    },
    subtitle: {
      en: 'How we safeguard your studio schedules, payment payouts, and client records with passwordless cryptography, multi-tenant database isolation, and global edge encryption.',
      es: 'Cómo protegemos la agenda de tu estudio, las transferencias de cobro y los registros de tus clientes con criptografía sin contraseñas, aislamiento de base de datos y cifrado global.',
      de: 'Wie wir Ihre Termine, Umsätze und Kundendaten durch passwortlose Kryptografie, Datenbank-Isolation und moderne Verschlüsselung schützen.',
      fr: 'Comment nous protégeons vos plannings, vos paiements et vos fiches clients grâce à la cryptographie sans mot de passe et au chiffrement sécurisé.',
    },
    tocTitle: {
      en: 'Security Pillars',
      es: 'Pilares de Seguridad',
      de: 'Säulen der Sicherheit',
      fr: 'Piliers de Sécurité',
    },
  };

  const sections = [
    {
      id: 'architecture',
      title: {
        en: '1. Encryption & Cloud Infrastructure',
        es: '1. Cifrado e Infraestructura Cloud',
        de: '1. Verschlüsselung & Infrastruktur',
        fr: '1. Chiffrement & Infrastructure Cloud',
      },
      icon: Server24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook runs on modern, fault-tolerant cloud architecture engineered for enterprise reliability and zero single-point-of-failure vulnerability:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-xs text-[var(--text-primary)]">
                  <ShieldCheckmark24Regular className="w-4 h-4 text-[#2BB5FF]" />
                  <span>AES-256 Encryption at Rest</span>
                </div>
                <p className="text-xs">
                  All databases, backups, uploaded brand assets, and client profiles are encrypted with industry-standard AES-256 bit keys.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-xs text-[var(--text-primary)]">
                  <LockClosed24Regular className="w-4 h-4 text-[#2BB5FF]" />
                  <span>TLS 1.3 In-Transit Encryption</span>
                </div>
                <p className="text-xs">
                  Every request between client booking phones, studio workstations, and our servers is secured over modern TLS 1.3 with Perfect Forward Secrecy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-xs text-[var(--text-primary)]">
                  <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                  <span>Automated Hourly Snapshots</span>
                </div>
                <p className="text-xs">
                  Databases are continuously replicated with hourly point-in-time recovery points to ensure zero data loss in disaster scenarios.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-xs text-[var(--text-primary)]">
                  <Globe24Regular className="w-4 h-4 text-[#2BB5FF]" />
                  <span>Global Edge CDN &amp; DDoS Shield</span>
                </div>
                <p className="text-xs">
                  Traffic is routed through high-speed edge nodes with automated Web Application Firewall (WAF) and layer-7 DDoS mitigation.
                </p>
              </div>
            </div>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook opera en una infraestructura en la nube moderna y tolerante a fallos, diseñada para garantizar máxima estabilidad y seguridad:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-xs text-[var(--text-primary)]">
                  <ShieldCheckmark24Regular className="w-4 h-4 text-[#2BB5FF]" />
                  <span>Cifrado AES-256 en Reposo</span>
                </div>
                <p className="text-xs">
                  Bases de datos, respaldos y fotos se cifran con claves de alta seguridad AES-256.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-xs text-[var(--text-primary)]">
                  <LockClosed24Regular className="w-4 h-4 text-[#2BB5FF]" />
                  <span>Cifrado TLS 1.3 en Tránsito</span>
                </div>
                <p className="text-xs">
                  Todas las conexiones entre teléfonos de clientes y servidores viajan cifradas con TLS 1.3.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-xs text-[var(--text-primary)]">
                  <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                  <span>Respaldos Automáticos Cada Hora</span>
                </div>
                <p className="text-xs">
                  Réplicas continuas con puntos de restauración por minuto para prevenir pérdida de información.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-xs text-[var(--text-primary)]">
                  <Globe24Regular className="w-4 h-4 text-[#2BB5FF]" />
                  <span>Red Edge Global y Protección DDoS</span>
                </div>
                <p className="text-xs">
                  Mitigación automática de ataques DDoS y firewall perimetral para máxima rapidez.
                </p>
              </div>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Vollständige AES-256-Verschlüsselung im Ruhezustand, TLS 1.3 bei der Übertragung und stündliche automatische Backups schützen Ihre Daten rund um die Uhr.</p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Chiffrement AES-256 au repos, TLS 1.3 en transit et sauvegardes continues pour une sécurité optimale de vos données.</p>
          </div>
        ),
      },
    },
    {
      id: 'passwordless',
      title: {
        en: '2. Passwordless WebAuthn & Biometric Identity',
        es: '2. Identidad Biométrica y WebAuthn Sin Contraseñas',
        de: '2. Passwortlose WebAuthn-Authentifizierung',
        fr: '2. Authentification Biométrique Sans Mot de Passe',
      },
      icon: Key24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Passwords are fundamentally flawed. They get reused, phished, intercepted, and leaked. AirBook is built 100% passwordless from the ground up using the official <strong>FIDO Alliance WebAuthn standard</strong>:
            </p>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 space-y-2">
              <p className="font-extrabold flex items-center gap-2">
                <CheckmarkCircle24Filled className="w-5 h-5 text-emerald-600" />
                How Passkey Authentication Protects You:
              </p>
              <ul className="space-y-1.5 text-xs">
                <li><strong>Private Key Remains on Device:</strong> Your biometric credential (Face ID, Touch ID, Windows Hello) generates a public-private keypair. The private key never leaves your physical device.</li>
                <li><strong>Immune to Phishing:</strong> Passkeys are cryptographically bound to <code>getairbook.com</code>. Fake phishing websites cannot solicit or intercept your login credentials.</li>
                <li><strong>Zero Database Targets:</strong> Because our database holds only public validation keys, there are zero passwords for hackers to compromise or breach.</li>
              </ul>
            </div>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Las contraseñas tradicionales son vulnerables al phishing y la reutilización. AirBook es 100% libre de contraseñas utilizando el estándar <strong>WebAuthn de la FIDO Alliance</strong>:
            </p>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 space-y-2">
              <p className="font-extrabold flex items-center gap-2">
                <CheckmarkCircle24Filled className="w-5 h-5 text-emerald-600" />
                Cómo te protegen las Llaves de Acceso (Passkeys):
              </p>
              <ul className="space-y-1.5 text-xs">
                <li><strong>La Clave Privada no sale de tu Dispositivo:</strong> Tu huella o rostro genera un par de llaves criptográficas. La clave privada nunca se transmite por internet.</li>
                <li><strong>Inmune al Phishing:</strong> Las Passkeys están vinculadas criptográficamente al dominio oficial. Ningún sitio falso puede robar tu acceso.</li>
                <li><strong>Sin Contraseñas en la Base de Datos:</strong> Nuestra base de datos solo almacena firmas públicas, eliminando por completo el riesgo de filtraciones de contraseñas.</li>
              </ul>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Durch den Einsatz von FIDO2/WebAuthn Passkeys sind Sie und Ihre Mitarbeiter optimal vor Phishing und Datenlecks geschützt.</p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Le standard FIDO WebAuthn garantit une sécurité absolue contre le phishing et les vols de mot de passe.</p>
          </div>
        ),
      },
    },
    {
      id: 'payments',
      title: {
        en: '3. Financial Isolation & PCI-DSS Level 1 Compliance',
        es: '3. Aislamiento Financiero y Cumplimiento PCI-DSS Nivel 1',
        de: '3. PCI-DSS Level 1 & Zahlungsabwicklung',
        fr: '3. Conformité PCI-DSS Niveau 1 & Paiements',
      },
      icon: Payment24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook never touches, routes, or stores raw credit card numbers, CVVs, or cardholder magnetic tracks.
            </p>
            <p>
              All payment collection, card vaulting for no-show deposit guarantees, and instant merchant bank payouts are delegated directly to <strong>Stripe</strong> via client-side Stripe Elements and Stripe Financial Services, certified under the most stringent <strong>PCI-DSS Level 1</strong> audit standards.
            </p>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook nunca almacena ni procesa números de tarjeta de crédito o códigos de seguridad CVV.
            </p>
            <p>
              Todo el cobro de anticipos, retenciones y transferencias bancarias se delega directamente en <strong>Stripe</strong>, con certificación oficial <strong>PCI-DSS Nivel 1</strong>.
            </p>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Alle Zahlungen und Kartendaten werden direkt über die zertifizierte PCI-DSS Level 1 Infrastruktur von Stripe verarbeitet.</p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Toutes les transactions par carte bancaire sont sécurisées par Stripe conformément à la norme PCI-DSS Niveau 1.</p>
          </div>
        ),
      },
    },
    {
      id: 'subprocessors',
      title: {
        en: '4. Sub-processors & Infrastructure Partners',
        es: '4. Subprocesadores y Proveedores de Infraestructura',
        de: '4. Unterauftragsverarbeiter & Partner',
        fr: '4. Sous-traitants & Partenaires d’Infrastructure',
      },
      icon: Server24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>We work exclusively with vetted, enterprise cloud providers that maintain verified SOC2 Type II, ISO 27001, and GDPR certifications:</p>
            <div className="border border-[var(--border-subtle)] rounded-2xl overflow-hidden divide-y divide-[var(--border-subtle)] text-xs">
              <div className="p-3.5 flex items-center justify-between bg-[var(--bg-secondary)] font-extrabold text-[var(--text-primary)]">
                <span>Partner / Entity</span>
                <span>Role / Service</span>
                <span>Data Center Region</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Stripe, Inc.</span>
                <span>Card deposits &amp; bank payouts</span>
                <span>US / EU Multi-region</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Vercel, Inc.</span>
                <span>Global edge compute &amp; SSL CDN</span>
                <span>Global Edge Network</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Neon Database Inc.</span>
                <span>Encrypted PostgreSQL database</span>
                <span>US East / EU West</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Twilio, Inc.</span>
                <span>Automated SMS reminder dispatch</span>
                <span>Global Telecom Network</span>
              </div>
            </div>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Colaboramos únicamente con proveedores líderes en la nube con certificaciones SOC2 Tipo II, ISO 27001 y cumplimiento del RGPD:</p>
            <div className="border border-[var(--border-subtle)] rounded-2xl overflow-hidden divide-y divide-[var(--border-subtle)] text-xs">
              <div className="p-3.5 flex items-center justify-between bg-[var(--bg-secondary)] font-extrabold text-[var(--text-primary)]">
                <span>Proveedor</span>
                <span>Función</span>
                <span>Región de Servidores</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Stripe, Inc.</span>
                <span>Cobro de anticipos y transferencias</span>
                <span>EE. UU. / Europa</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Vercel, Inc.</span>
                <span>Red edge y alojamiento SSL</span>
                <span>Red Global Edge</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Neon Database Inc.</span>
                <span>Base de datos PostgreSQL cifrada</span>
                <span>EE. UU. / Europa</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Twilio, Inc.</span>
                <span>Envío de recordatorios SMS</span>
                <span>Red Global</span>
              </div>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Unsere zertifizierten Partner (Stripe, Vercel, Neon, Twilio) erfüllen höchste internationale Sicherheits- und Datenschutzstandards.</p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Nos sous-traitants d&apos;infrastructure (Stripe, Vercel, Neon, Twilio) sont rigoureusement certifiés SOC2 et conformes au RGPD.</p>
          </div>
        ),
      },
    },
    {
      id: 'vulnerability',
      title: {
        en: '5. Security Vulnerability Reporting',
        es: '5. Reporte de Vulnerabilidades de Seguridad',
        de: '5. Schwachstellenmeldung & Kontakt',
        fr: '5. Signalement de Vulnérabilités',
      },
      icon: ShieldCheckmark24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>We welcome responsible security research. If you discover a potential vulnerability, please notify us immediately:</p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1 text-xs">
              <p className="font-extrabold text-[var(--text-primary)]">AirBook Security Team</p>
              <p>PGP Encrypted / Direct Contact: <a href="mailto:security@getairbook.com" className="text-[#2BB5FF] font-bold">security@getairbook.com</a></p>
              <p className="text-[11px] text-[var(--text-muted)] pt-2">Security reports are prioritized with triage within 6 hours.</p>
            </div>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Fomentamos la investigación responsable de seguridad. Si descubres una vulnerabilidad, contáctanos de inmediato:</p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1 text-xs">
              <p className="font-extrabold text-[var(--text-primary)]">Equipo de Seguridad de AirBook</p>
              <p>Contacto Directo: <a href="mailto:security@getairbook.com" className="text-[#2BB5FF] font-bold">security@getairbook.com</a></p>
              <p className="text-[11px] text-[var(--text-muted)] pt-2">Los reportes de seguridad son evaluados y respondidos en menos de 6 horas.</p>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Sicherheitsmeldungen richten Sie bitte an: <a href="mailto:security@getairbook.com" className="text-[#2BB5FF] font-bold">security@getairbook.com</a></p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Pour tout signalement de sécurité : <a href="mailto:security@getairbook.com" className="text-[#2BB5FF] font-bold">security@getairbook.com</a></p>
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
            <ShieldCheckmark24Regular className="w-4 h-4" />
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
                href="/terms"
                className="flex items-center justify-between text-xs font-extrabold text-[var(--text-primary)] hover:text-[#2BB5FF] transition-colors"
              >
                <span>Terms of Service</span>
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
