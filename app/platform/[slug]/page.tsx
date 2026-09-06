'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Logo from '@/components/Logo';
import {
  ArrowRight24Filled,
  Calendar24Filled,
  Calendar24Regular,
  CheckmarkCircle24Filled,
  CheckmarkCircle24Regular,
  Clock24Regular,
  ChevronDown24Filled,
  Globe24Regular,
  Heart24Regular,
  Payment24Regular,
  PeopleCommunity24Regular,
  ShieldCheckmark24Regular,
  Sparkle24Regular,
  Sparkle24Filled,
  Star24Regular,
  Tag24Regular,
  LockClosed24Regular,
  Phone24Regular,
  Code24Regular,
  Mail24Regular,
  Shield24Regular,
} from '@fluentui/react-icons';

interface PlatformConfig {
  slug: string;
  badge: { en: string; es: string; de: string; fr: string };
  heroHeadline1: { en: string; es: string; de: string; fr: string };
  heroHeadline2: { en: string; es: string; de: string; fr: string };
  heroSubtitle: { en: string; es: string; de: string; fr: string };
  accentColor: string;
  bgPastel: string;
  pillar1: {
    title: { en: string; es: string; de: string; fr: string };
    desc: { en: string; es: string; de: string; fr: string };
  };
  pillar2: {
    title: { en: string; es: string; de: string; fr: string };
    desc: { en: string; es: string; de: string; fr: string };
  };
  pillar3: {
    title: { en: string; es: string; de: string; fr: string };
    desc: { en: string; es: string; de: string; fr: string };
  };
  keyFeatures: {
    title: { en: string; es: string; de: string; fr: string };
    desc: { en: string; es: string; de: string; fr: string };
  }[];
}

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  integrations: {
    slug: 'integrations',
    badge: {
      en: 'AirBook Website Widget & Embeds',
      es: 'Widget para Tu Web y Enlaces',
      de: 'AirBook Website-Widget & Einbettung',
      fr: 'Widget & Intégration Web AirBook',
    },
    heroHeadline1: {
      en: 'Embed frictionless booking,',
      es: 'Incrusta reservas sin fricción,',
      de: 'Buchung nahtlos einbetten,',
      fr: 'Intégrez vos réservations,',
    },
    heroHeadline2: {
      en: 'directly onto your website.',
      es: 'directamente en tu propia web.',
      de: 'direkt auf Ihrer Website.',
      fr: 'directement sur votre site.',
    },
    heroSubtitle: {
      en: 'Add an interactive booking modal or inline scheduler to WordPress, Squarespace, Wix, Shopify, or Webflow with a single line of copy-paste code.',
      es: 'Añade una ventana de reserva interactiva a WordPress, Squarespace, Wix, Shopify o Webflow con una sola línea de código.',
      de: 'Fügen Sie ein interaktives Buchungs-Widget in WordPress, Squarespace, Wix oder Shopify mit einer einzigen Codezeile ein.',
      fr: 'Ajoutez un module de réservation interactif sur WordPress, Squarespace, Wix ou Shopify en copiant une simple ligne de code.',
    },
    accentColor: '#0284C7',
    bgPastel: 'rgba(2, 132, 199, 0.08)',
    pillar1: {
      title: {
        en: '1-Line Embed Snippet',
        es: 'Incrustación en 1 Línea',
        de: '1-Zeilen Einbettung',
        fr: 'Intégration en 1 Ligne',
      },
      desc: {
        en: 'Copy and paste our lightweight, high-speed script tag. No developer or IT support required.',
        es: 'Copia y pega nuestro script ultrarrápido y ligero sin necesidad de programadores.',
        de: 'Leichtgewichtiges Script einfach einfügen. Ganz ohne Programmieraufwand.',
        fr: 'Copiez-collez notre script ultra rapide sans aucune connaissance technique.',
      },
    },
    pillar2: {
      title: {
        en: 'Floating Booking Badge Button',
        es: 'Botón Flotante de Reserva',
        de: 'Schwebender Buchungs-Button',
        fr: 'Bouton Flottant de Réservation',
      },
      desc: {
        en: 'A sleek, customizable floating trigger button in your brand colors that sits quietly on your site.',
        es: 'Un botón flotante elegante con los colores de tu marca para captar clientes en cada página.',
        de: 'Ein dezenter schwebender Button in Ihren Markenfarben für jede Unterseite.',
        fr: 'Un bouton discret aux couleurs de votre marque présent sur toutes vos pages.',
      },
    },
    pillar3: {
      title: {
        en: 'Zero Redirect Friction',
        es: 'Cero Redirecciones Externas',
        de: 'Ohne Weiterleitung',
        fr: 'Aucune Redirection Externe',
      },
      desc: {
        en: 'Clients book and confirm right on your website without ever being redirected away to third-party portals.',
        es: 'Tus clientes reservan directamente en tu web sin salir de tu dominio a portales externos.',
        de: 'Kunden buchen direkt auf Ihrer Website, ohne auf fremde Portale weitergeleitet zu werden.',
        fr: 'Vos clients réservent sur votre site sans jamais être redirigés vers un portail tiers.',
      },
    },
    keyFeatures: [
      {
        title: { en: 'Squarespace & Wix Native', es: 'Compatible con Wix y Squarespace', de: 'Squarespace & Wix kompatibel', fr: 'Compatible Squarespace & Wix' },
        desc: { en: 'Flawless iframe and modal responsiveness across every major web builder.', es: 'Adaptación perfecta en pantallas móviles y tablets.', de: 'Optimale Darstellung auf allen Endgeräten.', fr: 'Affichage parfait sur mobile et tablette.' },
      },
      {
        title: { en: 'Instagram & TikTok Link-in-Bio', es: 'Enlace para Instagram y TikTok', de: 'Instagram & TikTok Bio-Link', fr: 'Lien Optimisé pour Réseaux Sociaux' },
        desc: { en: 'Lightning-fast mobile booking landing page optimized for social media bio links.', es: 'Página ultra veloz diseñada para convertir visitas de redes en clientes.', de: 'Blitzschnelle mobile Seite für maximale Social-Media-Buchungen.', fr: 'Page mobile ultra rapide pensée pour convertir vos abonnés.' },
      },
      {
        title: { en: 'Google Maps Book Button Sync', es: 'Botón Reservar en Google Maps', de: 'Google Maps Buchungs-Button', fr: 'Bouton de Réservation Google Maps' },
        desc: { en: 'Let local searchers book directly from your Google Business profile.', es: 'Permite que clientes locales reserven directamente desde tu perfil de Google.', de: 'Lokale Kunden buchen direkt über Ihr Google Unternehmensprofil.', fr: 'Permettez aux clients locaux de réserver directement depuis Google.' },
      },
    ],
  },

  reminders: {
    slug: 'reminders',
    badge: {
      en: 'AirBook Automated Reminders',
      es: 'Recordatorios Automatizados',
      de: 'AirBook Automatische Erinnerungen',
      fr: 'Rappels Automatisés AirBook',
    },
    heroHeadline1: {
      en: 'Friendly automated reminders,',
      es: 'Recordatorios amables y automáticos,',
      de: 'Freundliche automatische Erinnerungen,',
      fr: 'Des rappels bienveillants et automatiques,',
    },
    heroHeadline2: {
      en: 'zero no-shows on your calendar.',
      es: 'cero ausencias en tu agenda.',
      de: 'keine Terminausfälle mehr.',
      fr: 'zéro rendez-vous manqué.',
    },
    heroSubtitle: {
      en: 'Automated SMS and email notifications send warm reminders 24 hours and 2 hours before appointments. Clients confirm or reschedule with a single tap.',
      es: 'Mensajes automáticos por SMS y correo enviados 24h y 2h antes de la cita. Tus clientes confirman o reprograman en un solo toque.',
      de: 'Automatische SMS- und E-Mail-Erinnerungen 24 Stunden und 2 Stunden vor dem Termin. Kunden bestätigen mit einem Klick.',
      fr: 'Notifications automatiques par SMS et e-mail 24h et 2h avant le rendez-vous. Vos clients confirment en 1 clic.',
    },
    accentColor: '#9333EA',
    bgPastel: 'rgba(147, 51, 234, 0.08)',
    pillar1: {
      title: {
        en: '2-Way SMS Confirmations',
        es: 'Confirmaciones SMS Bidireccionales',
        de: '2-Wege SMS-Bestätigung',
        fr: 'Confirmation SMS Bidirectionnelle',
      },
      desc: {
        en: 'Clients reply "C" to confirm or click a link to reschedule, automatically updating your live calendar.',
        es: 'El cliente responde "C" para confirmar o toca el enlace para reagendar automáticamente.',
        de: 'Kunden bestätigen per SMS oder wählen selbstständig einen neuen Ausweichtermin.',
        fr: 'Le client confirme ou choisit un nouveau créneau directement par message.',
      },
    },
    pillar2: {
      title: {
        en: 'Smart 24h & 2h Cadence',
        es: 'Cadencia Inteligente 24h y 2h',
        de: 'Perfektes 24h & 2h Timing',
        fr: 'Timing Parfait 24h & 2h',
      },
      desc: {
        en: 'Proven timing intervals reduce forgotten appointments and no-shows by up to 88%.',
        es: 'Intervalos probados que reducen los olvidos y citas perdidas hasta un 88%.',
        de: 'Nachweislich bis zu 88 % weniger vergessene Termine durch optimales Timing.',
        fr: 'Des rappels aux moments clés qui réduisent les absences jusqu’à 88 %.',
      },
    },
    pillar3: {
      title: {
        en: 'Warm, On-Brand Tone',
        es: 'Tono Cálido y Personalizado',
        de: 'Persönlicher Markenton',
        fr: 'Ton Chaleureux et Personnalisé',
      },
      desc: {
        en: 'Customize reminder templates with your salon\'s address, parking tips, and arrival instructions.',
        es: 'Personaliza los textos con la dirección exacta, consejos de aparcamiento y bienvenida.',
        de: 'Nachrichten mit Parkhinweisen, Adresse und persönlichem Gruß anpassen.',
        fr: 'Personnalisez les messages avec adresse, accès parking et consignes d’arrivée.',
      },
    },
    keyFeatures: [
      {
        title: { en: 'Location & Map Link Included', es: 'Enlace Directo a Google Maps', de: 'Maps-Routenlink integriert', fr: 'Lien Direct vers l’Itinéraire' },
        desc: { en: 'Clients tap directly into Apple Maps or Google Maps for effortless turn-by-turn directions.', es: 'El cliente abre la ruta con un toque en Google Maps o Waze.', de: 'Einfache Navigation für Neukunden mit einem Klick.', fr: 'Guidage GPS instantané en un clic pour les nouveaux clients.' },
      },
      {
        title: { en: 'Post-Visit Review Prompts', es: 'Petición de Reseñas Post-Cita', de: 'Automatische Bewertungsanfragen', fr: 'Demande d’Avis Post-Visite' },
        desc: { en: 'Automatically invite delighted clients to leave a 5-star Google review 2 hours after checkout.', es: 'Invita a clientes felices a dejar 5 estrellas en Google 2 horas después del servicio.', de: 'Automatische Google-Bewertungsanfragen für mehr 5-Sterne-Rezensionen.', fr: 'Invitez les clients satisfaits à déposer un avis 5 étoiles sur Google.' },
      },
      {
        title: { en: 'Zero Spam / Privacy Compliant', es: '100% Respetuoso y sin Spam', de: 'DSGVO-konform & werbefrei', fr: 'Conforme RGPD & Zéro Spam' },
        desc: { en: 'Strict opt-in compliance with immediate opt-out keywords (STOP) respected automatically.', es: 'Totalmente conforme con leyes de privacidad y bajas automáticas.', de: 'Strikte Einhaltung aller Datenschutzrichtlinien.', fr: 'Respect strict de la confidentialité et gestion des désinscriptions.' },
      },
    ],
  },

  'deposit-protection': {
    slug: 'deposit-protection',
    badge: {
      en: 'AirBook Deposit Protection & Card Lock',
      es: 'Protección de Depósitos y Tarjeta en Garantía',
      de: 'AirBook Anzahlungsschutz & Kartengarantie',
      fr: 'Acomptes Sécurisés & Empreinte Bancaire',
    },
    heroHeadline1: {
      en: 'Protect your time,',
      es: 'Protege tu tiempo,',
      de: 'Schützen Sie Ihre Zeit,',
      fr: 'Protégez votre temps,',
    },
    heroHeadline2: {
      en: 'get paid for late cancellations.',
      es: 'cobra si cancelan a última hora.',
      de: 'Vergütung bei kurzfristigen Absagen.',
      fr: 'soyez dédommagé en cas d’imprévu.',
    },
    heroSubtitle: {
      en: 'Eliminate ghosting and last-minute cancellations with customizable non-refundable deposit policies and card-on-file guarantees powered by Stripe.',
      es: 'Erradica las cancelaciones imprevistas con políticas de anticipo no reembolsable y tarjetas en garantía respaldadas por Stripe.',
      de: 'Stoppen Sie Terminausfälle mit verbindlichen Anzahlungen und Kartenvormerkungen über Stripe.',
      fr: 'Éliminez les désistements de dernière minute avec des acomptes personnalisés et des empreintes bancaires sécurisées par Stripe.',
    },
    accentColor: '#10B981',
    bgPastel: 'rgba(16, 185, 129, 0.08)',
    pillar1: {
      title: {
        en: 'Flexible Deposit Rules',
        es: 'Reglas Flexibles de Anticipo',
        de: 'Flexible Anzahlungsregeln',
        fr: 'Règles d’Acompte Modulables',
      },
      desc: {
        en: 'Require fixed deposits ($25, $50) or percentage holds (20%, 50%) on high-ticket technical services.',
        es: 'Configura depósitos fijos o porcentajes en servicios técnicos de larga duración.',
        de: 'Feste Beträge oder Prozentwerte für aufwendige Behandlungen festlegen.',
        fr: 'Définissez des montants fixes ou des pourcentages sur les prestations longues.',
      },
    },
    pillar2: {
      title: {
        en: 'Credit Card on File Guarantee',
        es: 'Tarjeta en Garantía sin Cargo Previo',
        de: 'Kreditkarten-Sicherheitsgarantie',
        fr: 'Empreinte Bancaire sans Débit Immédiat',
      },
      desc: {
        en: 'Hold a card securely without charging upfront; only charge if the client fails to arrive or cancels late.',
        es: 'Guarda la tarjeta de forma segura y cobra únicamente en caso de inasistencia.',
        de: 'Karte sicher hinterlegen; Belastung erfolgt nur bei unentschuldigtem Fehlen.',
        fr: 'Conservez l’empreinte en toute sécurité et ne débitez qu’en cas de non-présentation.',
      },
    },
    pillar3: {
      title: {
        en: 'Transparent Cancellation Policy',
        es: 'Política de Cancelación Clara',
        de: 'Transparente Stornierungsbedingungen',
        fr: 'Politique d’Annulation Transparente',
      },
      desc: {
        en: 'Clients accept your 24h/48h cancellation terms in 1 tap during booking with zero legal ambiguity.',
        es: 'Tus clientes aceptan tus términos de 24h/48h en 1 toque antes de confirmar la cita.',
        de: 'Kunden bestätigen Stornierungsfristen transparent vor der Terminbuchung.',
        fr: 'Vos clients valident vos conditions d’annulation en 1 clic avant de réserver.',
      },
    },
    keyFeatures: [
      {
        title: { en: 'Stripe 256-bit Encryption', es: 'Encriptación Bancaria Stripe', de: 'Stripe Bankenstandard', fr: 'Cryptage Sécurisé Stripe' },
        desc: { en: 'PCI-DSS Level 1 compliant card storage. Your business never sees raw card numbers.', es: 'Cumplimiento PCI-DSS de máximo nivel. Jamás almacenas números de tarjeta.', de: 'Höchste Sicherheitsstandards. Keine Speicherung sensibler Kartendaten.', fr: 'Conformité PCI-DSS maximale. Vos données bancaires restent ultra protégées.' },
      },
      {
        title: { en: '1-Click Dispute Defense Logs', es: 'Registro de Evidencia en 1 Clic', de: 'Nachweisbare Buchungsprotokolle', fr: 'Preuves et Historique de Réservation' },
        desc: { en: 'Full digital audit trail of booking timestamp, SMS confirmation, and policy acceptance.', es: 'Historial digital completo con hora de reserva, SMS y aceptación de términos.', de: 'Vollständiger digitaler Nachweis zur Abwehr unberechtigter Rückbuchungen.', fr: 'Traçabilité complète avec date de réservation et accord signé.' },
      },
      {
        title: { en: 'Direct Deposit Balance Credit', es: 'Abono Automático a la Cuenta', de: 'Direkte Verrechnung beim Bezahlen', fr: 'Déduction Automatique à l’Encaissement' },
        desc: { en: 'Deposits automatically apply toward the final bill at checkout with instant balance calculation.', es: 'El anticipo se descuenta automáticamente del total al cobrar en caja.', de: 'Geleistete Anzahlung wird beim Kassieren automatisch verrechnet.', fr: 'L’acompte versé est automatiquement déduit lors du règlement final.' },
      },
    ],
  },
};

export default function PlatformDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'integrations';
  const config = PLATFORM_CONFIGS[slug];

  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  if (!config) {
    notFound();
  }

  const lang = (language as 'en' | 'es' | 'de' | 'fr') || 'en';
  const currentLangObj = availableLanguages.find((l) => l.id === language) || availableLanguages[0];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white relative overflow-x-hidden font-sans">
      {/* ─── STICKY MASTER HEADER NAVIGATION ─── */}
      <MarketingHeader />

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-12 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
            <Sparkle24Regular className="w-3.5 h-3.5 text-[#2BB5FF]" />
            <span>{config.badge[lang]}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-[var(--text-primary)]">
            {config.heroHeadline1[lang]}{' '}
            <span
              style={{ color: config.accentColor }}
              className="inline-block"
            >
              {config.heroHeadline2[lang]}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl mx-auto">
            {config.heroSubtitle[lang]}
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/onboarding"
              className="btn-primary h-12 px-6 rounded-2xl text-sm font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
            >
              <span>{t('tryAirBookFree')}</span>
              <ArrowRight24Filled className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="h-12 px-6 rounded-2xl text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] inline-flex items-center justify-center w-full sm:w-auto transition-all"
            >
              {t('seeLiveDemo')}
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-bold text-[var(--text-muted)] pt-3">
            <span className="flex items-center gap-1.5">
              <CheckmarkCircle24Filled className="w-3.5 h-3.5 text-emerald-500" />
              {t('freeForeverPlan')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckmarkCircle24Filled className="w-3.5 h-3.5 text-emerald-500" />
              {t('noCreditCard')}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkle24Filled className="w-3.5 h-3.5 text-[#2BB5FF]" />
              {t('passwordlessGuarantee')}
            </span>
          </div>
        </div>
      </section>

      {/* ─── 3 VALUE PILLARS ─── */}
      <section className="py-16 px-4 sm:px-6 bg-[var(--bg-secondary)]/40 border-y border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[config.pillar1, config.pillar2, config.pillar3].map((pillar, i) => (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm space-y-3"
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: config.bgPastel, color: config.accentColor }}
                >
                  <CheckmarkCircle24Regular className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-[var(--text-primary)] tracking-tight">
                  {pillar.title[lang]}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {pillar.desc[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE GRID BREAKDOWN ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#2BB5FF]">
              {t('builtForCraftTitle')}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              {t('basicsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] space-y-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-black flex items-center justify-center shadow-xs">
                  <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                </div>
                <h4 className="text-sm font-extrabold text-[var(--text-primary)]">
                  {feat.title[lang]}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {feat.desc[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─── */}
      <section className="py-16 px-4 sm:px-6 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            {t('launchFastTitle')}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            {t('launchFastSubtitle')}
          </p>
          <Link
            href="/onboarding"
            className="btn-primary h-12 px-8 rounded-2xl text-sm font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg"
          >
            <span>{t('tryAirBookFree')}</span>
            <ArrowRight24Filled className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── MASTER FOOTER ─── */}
      <MarketingFooter />
    </div>
  );
}
