'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  ShieldCheckmark24Regular,
  LockClosed24Regular,
  DocumentBulletList24Regular,
  Eye24Regular,
  PersonDelete24Regular,
  Key24Regular,
  Sparkle24Regular,
  ArrowRight24Filled,
  CheckmarkCircle24Filled,
} from '@fluentui/react-icons';

export default function PrivacyPolicyPage() {
  const { language } = useTranslation();
  const lang = (['en', 'es', 'de', 'fr'].includes(language) ? language : 'en') as 'en' | 'es' | 'de' | 'fr';
  const [activeSection, setActiveSection] = useState('overview');

  const content = {
    badge: {
      en: 'Legal & Trust Center',
      es: 'Centro Legal y de Confianza',
      de: 'Recht & Datenschutz-Zentrum',
      fr: 'Centre Légal & Confiance',
    },
    title: {
      en: 'Privacy Policy',
      es: 'Política de Privacidad',
      de: 'Datenschutzerklärung',
      fr: 'Politique de Confidentialité',
    },
    lastUpdated: {
      en: 'Last updated: September 1, 2026 · Version 2.4',
      es: 'Última actualización: 1 de septiembre de 2026 · Versión 2.4',
      de: 'Zuletzt aktualisiert: 1. September 2026 · Version 2.4',
      fr: 'Dernière mise à jour : 1er septembre 2026 · Version 2.4',
    },
    subtitle: {
      en: 'We believe privacy policies should be honest, clear, and easy to understand. We never sell your personal data, we never store passwords, and you always maintain complete ownership of your studio and client records.',
      es: 'Creemos que las políticas de privacidad deben ser honestas, claras y comprensibles. Nunca vendemos tus datos personales, nunca almacenamos contraseñas y siempre mantienes la propiedad total de tus registros y clientes.',
      de: 'Wir glauben, dass Datenschutzerklärungen ehrlich, klar und leicht verständlich sein müssen. Wir verkaufen niemals Ihre Daten, speichern niemals Passwörter und Sie behalten stets die volle Kontrolle über Ihre Kundendaten.',
      fr: 'Nous croyons que les politiques de confidentialité doivent être transparentes, claires et compréhensibles. Nous ne vendons jamais vos données personnelles, ne stockons aucun mot de passe et vous restez seul propriétaire de vos données clients.',
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
      id: 'overview',
      title: {
        en: '1. Overview & Plain-English Commitments',
        es: '1. Resumen y Compromisos Claros',
        de: '1. Überblick & Grundsätze',
        fr: '1. Aperçu & Engagements Clairs',
      },
      icon: Sparkle24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides a modern, passwordless appointment booking and studio management platform. This Privacy Policy describes how we collect, use, process, and safeguard personal information when you use our website, mobile interface, APIs, and client booking links.
            </p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <p className="font-extrabold text-[var(--text-primary)]">Our 4 Core Privacy Guarantees:</p>
              <ul className="space-y-1.5 text-xs font-medium">
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Zero Password Storage:</strong> We authenticate exclusively through biometrics (WebAuthn Passkeys), magic links, and Google OAuth.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>No Data Brokering:</strong> We never sell, rent, or trade your or your clients&apos; personal data to advertisers or third-party brokers.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Data Portability:</strong> You can export 100% of your appointments, client profiles, and financial ledger at any moment in open JSON/CSV format.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Strict Encryption:</strong> All data is encrypted in transit via TLS 1.3 and at rest with AES-256 encryption.</span>
                </li>
              </ul>
            </div>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook (&quot;nosotros&quot; o &quot;nuestro&quot;) ofrece una plataforma moderna y sin contraseñas para la gestión de citas y estudios. Esta Política de Privacidad describe cómo recopilamos, usamos, procesamos y protegemos la información personal cuando utilizas nuestro sitio web, interfaz móvil, APIs y enlaces públicos de reserva.
            </p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <p className="font-extrabold text-[var(--text-primary)]">Nuestras 4 Garantías Fundamentales de Privacidad:</p>
              <ul className="space-y-1.5 text-xs font-medium">
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Cero Almacenamiento de Contraseñas:</strong> Autenticamos exclusivamente mediante biometría (Passkeys WebAuthn), enlaces mágicos y Google OAuth.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Sin Venta de Datos:</strong> Nunca vendemos, alquilamos ni comercializamos tus datos o los de tus clientes a anunciantes o intermediarios.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Portabilidad Total:</strong> Puedes exportar el 100% de tus citas, perfiles de clientes e historial financiero en cualquier momento en formatos JSON/CSV.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Cifrado Estricto:</strong> Todos los datos se cifran en tránsito con TLS 1.3 y en reposo mediante cifrado AES-256.</span>
                </li>
              </ul>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook bietet eine moderne, passwortlose Buchungs- und Verwaltungsplattform für Salons, Studios und Praxen. Diese Datenschutzerklärung erläutert, wie wir personenbezogene Daten erfassen, verarbeiten und schützen.
            </p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <p className="font-extrabold text-[var(--text-primary)]">Unsere 4 Datenschutz-Garantien:</p>
              <ul className="space-y-1.5 text-xs font-medium">
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Keine Passwörter:</strong> Authentifizierung erfolgt ausschließlich über Biometrie (WebAuthn Passkeys), Magic Links und Google OAuth.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Kein Datenverkauf:</strong> Wir verkaufen oder vermieten Ihre Daten und die Ihrer Kunden zu keinem Zeitpunkt.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Datenportabilität:</strong> Sie können jederzeit alle Buchungen, Kundenprofile und Umsätze als CSV/JSON exportieren.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Vollständige Verschlüsselung:</strong> TLS 1.3 während der Übertragung und AES-256 im Ruhezustand.</span>
                </li>
              </ul>
            </div>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook fournit une plateforme de réservation sans mot de passe conçue pour les professionnels et leurs clients. Cette politique détaille nos engagements stricts envers la confidentialité de vos données.
            </p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <p className="font-extrabold text-[var(--text-primary)]">Nos 4 Engagements Fondamentaux :</p>
              <ul className="space-y-1.5 text-xs font-medium">
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Zéro Mot de Passe :</strong> Authentification biométrique par Passkeys WebAuthn, liens magiques et Google OAuth.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Aucune Vente de Données :</strong> Nous ne vendons ni ne louons vos informations à des tiers publicitaires.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Portabilité Totale :</strong> Exportez vos rendez-vous et vos fiches clients à tout instant en CSV ou JSON.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Chiffrement Sécurisé :</strong> TLS 1.3 en transit et AES-256 au repos.</span>
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    },
    {
      id: 'collection',
      title: {
        en: '2. Information We Collect',
        es: '2. Información que Recopilamos',
        de: '2. Erfasste Daten',
        fr: '2. Informations Collectées',
      },
      icon: DocumentBulletList24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>We only collect the minimal information necessary to deliver appointment bookings, automated reminders, and payment payouts:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Studio Account Data:</strong> Business name, work email, phone number, physical address, business hours, and service pricing catalog.</li>
              <li><strong>Client Booking Data:</strong> Full name, email address, phone number, appointment time, chosen service, and optional booking notes submitted during appointment creation.</li>
              <li><strong>Payment Information:</strong> Handled directly by Stripe (PCI-DSS Level 1 compliant). AirBook never receives, handles, or stores full credit card numbers or CVV codes.</li>
              <li><strong>Device &amp; Telemetry Metadata:</strong> Browser type, operating system, IP address, and timestamped authentication session tokens to protect against fraudulent access.</li>
            </ul>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Solo recopilamos la información mínima necesaria para gestionar citas, recordatorios y transferencias:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Datos del Estudio:</strong> Nombre comercial, correo electrónico, teléfono, dirección física, horarios de atención y catálogo de servicios.</li>
              <li><strong>Datos de Reserva del Cliente:</strong> Nombre completo, correo, teléfono, fecha y hora elegida, servicio solicitado y notas adjuntas.</li>
              <li><strong>Información de Pago:</strong> Procesada directamente por Stripe (cumplimiento PCI-DSS Nivel 1). AirBook nunca almacena números de tarjeta completos ni códigos CVV.</li>
              <li><strong>Metadatos Técnicos:</strong> Tipo de navegador, sistema operativo, dirección IP y tokens de sesión para prevenir accesos no autorizados.</li>
            </ul>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Wir erheben nur die für den Betrieb des Buchungssystems unbedingt erforderlichen Daten:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Geschäftsinformationen:</strong> Unternehmensname, geschäftliche E-Mail, Telefonnummer, Adresse und Dienstleistungskatalog.</li>
              <li><strong>Kundendaten:</strong> Name, E-Mail-Adresse, Telefonnummer, Buchungszeitpunkt und Anmerkungen.</li>
              <li><strong>Zahlungsdaten:</strong> Vollständig durch Stripe verarbeitet (PCI-DSS Level 1). Wir speichern keine Kreditkartennummern.</li>
            </ul>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Nous ne collectons que le strict nécessaire au bon fonctionnement de vos prises de rendez-vous :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Données du Salon :</strong> Nom d&apos;établissement, email, téléphone, adresse, horaires et tarifs.</li>
              <li><strong>Données de Réservation :</strong> Nom, email, téléphone et détails du créneau réservé.</li>
              <li><strong>Paiements :</strong> Gérés directement par Stripe (certifié PCI-DSS Niveau 1).</li>
            </ul>
          </div>
        ),
      },
    },
    {
      id: 'passwords',
      title: {
        en: '3. 100% Zero-Password Identity Architecture',
        es: '3. Arquitectura de Identidad 100% Libre de Contraseñas',
        de: '3. Passwortlose Sicherheitsarchitektur',
        fr: '3. Architecture d’Identité 100% Sans Mot de Passe',
      },
      icon: Key24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Traditional passwords are the single largest source of database leaks and credential stuffing attacks. AirBook eliminates this vulnerability entirely:
            </p>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-2">
              <p className="font-extrabold flex items-center gap-2">
                <ShieldCheckmark24Regular className="w-5 h-5 text-emerald-600" />
                Zero Password Storage Guarantee
              </p>
              <p className="text-xs leading-relaxed">
                We store zero password hashes, salt hashes, or secret security questions in our database. If an attacker were to inspect our database, there are zero user passwords to steal. You authenticate seamlessly via Apple Face ID, Touch ID, Windows Hello, or cryptographic email magic tokens.
              </p>
            </div>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Las contraseñas tradicionales son la principal causa de filtraciones de datos y robo de credenciales. AirBook elimina esta vulnerabilidad por completo:
            </p>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-2">
              <p className="font-extrabold flex items-center gap-2">
                <ShieldCheckmark24Regular className="w-5 h-5 text-emerald-600" />
                Garantía de Cero Almacenamiento de Contraseñas
              </p>
              <p className="text-xs leading-relaxed">
                No almacenamos hashes de contraseñas ni preguntas secretas. Si un atacante inspeccionara nuestra base de datos, no encontraría ninguna contraseña para robar. La autenticación se realiza mediante Face ID, Touch ID, Windows Hello o tokens criptográficos por correo electrónico.
              </p>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook speichert keinerlei Passwörter oder Passworthashes. Der Login erfolgt ausschließlich über WebAuthn (Touch ID, Face ID, Windows Hello) oder sichere Einmallinks.
            </p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              AirBook ne stocke aucun mot de passe. L&apos;authentification est entièrement biométrique ou assurée par des jetons magiques cryptographiques sécurisés.
            </p>
          </div>
        ),
      },
    },
    {
      id: 'rights',
      title: {
        en: '4. Your Rights (GDPR, CCPA & Global Protections)',
        es: '4. Tus Derechos (GDPR, CCPA y Protección Global)',
        de: '4. Ihre Rechte (DSGVO & International)',
        fr: '4. Vos Droits (RGPD, CCPA & International)',
      },
      icon: Eye24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Under the European Union General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA/CPRA), and global privacy laws, you and your clients have the following inalienable rights:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <p className="text-xs font-extrabold text-[var(--text-primary)]">Right to Access &amp; Portability</p>
                <p className="text-xs">Download a full JSON/CSV copy of all records associated with your account.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <p className="text-xs font-extrabold text-[var(--text-primary)]">Right to Erasure (&quot;Right to be Forgotten&quot;)</p>
                <p className="text-xs">Permanently purge your studio or client profile with 1-click account deletion.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <p className="text-xs font-extrabold text-[var(--text-primary)]">Right to Rectification</p>
                <p className="text-xs">Update or correct any inaccurate customer notes or contact details at any time.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <p className="text-xs font-extrabold text-[var(--text-primary)]">Right to Restrict Processing</p>
                <p className="text-xs">Disable automated SMS/email reminders for specific clients with one toggle.</p>
              </div>
            </div>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Bajo el RGPD de la Unión Europea, la CCPA/CPRA de California y las leyes globales de privacidad, cuentas con los siguientes derechos garantizados:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <p className="text-xs font-extrabold text-[var(--text-primary)]">Derecho de Acceso y Portabilidad</p>
                <p className="text-xs">Descarga una copia completa en JSON/CSV de todos los registros vinculados a tu cuenta.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <p className="text-xs font-extrabold text-[var(--text-primary)]">Derecho al Olvido (Supresión)</p>
                <p className="text-xs">Elimina permanentemente tu estudio o perfil con un solo clic.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <p className="text-xs font-extrabold text-[var(--text-primary)]">Derecho de Rectificación</p>
                <p className="text-xs">Modifica o actualiza notas y datos de contacto en cualquier momento.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <p className="text-xs font-extrabold text-[var(--text-primary)]">Derecho de Oposición</p>
                <p className="text-xs">Desactiva los recordatorios automáticos por SMS/correo para cualquier cliente.</p>
              </div>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Gemäß der DSGVO stehen Ihnen alle Rechte auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit uneingeschränkt zu.</p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de portabilité et de suppression de vos données.</p>
          </div>
        ),
      },
    },
    {
      id: 'contact',
      title: {
        en: '5. Data Protection Officer & Contact',
        es: '5. Oficial de Protección de Datos y Contacto',
        de: '5. Datenschutzbeauftragter & Kontakt',
        fr: '5. Délégué à la Protection des Données & Contact',
      },
      icon: LockClosed24Regular,
      text: {
        en: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>If you have any questions regarding this Privacy Policy, your personal data, or data processing agreements (DPA), contact our security and legal team directly:</p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1 text-xs">
              <p className="font-extrabold text-[var(--text-primary)]">AirBook Legal &amp; Data Protection Office</p>
              <p>Email: <a href="mailto:privacy@getairbook.com" className="text-[#2BB5FF] font-bold">privacy@getairbook.com</a></p>
              <p>Security Team: <a href="mailto:security@getairbook.com" className="text-[#2BB5FF] font-bold">security@getairbook.com</a></p>
              <p className="text-[11px] text-[var(--text-muted)] pt-2">Requests for data deletion or exports are acknowledged within 24 business hours.</p>
            </div>
          </div>
        ),
        es: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Si tienes preguntas sobre esta Política de Privacidad o solicitudes de exportación/eliminación de datos, contacta a nuestro equipo legal:</p>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1 text-xs">
              <p className="font-extrabold text-[var(--text-primary)]">Oficina de Privacidad y Seguridad de AirBook</p>
              <p>Correo: <a href="mailto:privacy@getairbook.com" className="text-[#2BB5FF] font-bold">privacy@getairbook.com</a></p>
              <p>Equipo de Seguridad: <a href="mailto:security@getairbook.com" className="text-[#2BB5FF] font-bold">security@getairbook.com</a></p>
              <p className="text-[11px] text-[var(--text-muted)] pt-2">Las solicitudes de eliminación o exportación son atendidas en menos de 24 horas hábiles.</p>
            </div>
          </div>
        ),
        de: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Für Anfragen zum Datenschutz erreichen Sie uns unter: <a href="mailto:privacy@getairbook.com" className="text-[#2BB5FF] font-bold">privacy@getairbook.com</a></p>
          </div>
        ),
        fr: (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Pour toute question relative à vos données, contactez notre équipe : <a href="mailto:privacy@getairbook.com" className="text-[#2BB5FF] font-bold">privacy@getairbook.com</a></p>
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
                href="/data-protection"
                className="flex items-center justify-between text-xs font-extrabold text-[var(--text-primary)] hover:text-[#2BB5FF] transition-colors"
              >
                <span>Data Protection Architecture</span>
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
