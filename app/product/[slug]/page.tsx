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
} from '@fluentui/react-icons';

interface ProductConfig {
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

const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  scheduling: {
    slug: 'scheduling',
    badge: {
      en: 'AirBook Online Booking',
      es: 'Reservas Online con AirBook',
      de: 'AirBook Online-Buchung',
      fr: 'Réservation en Ligne AirBook',
    },
    heroHeadline1: {
      en: '24/7 self-scheduling,',
      es: 'Agendamiento 24/7,',
      de: '24/7 Terminbuchung,',
      fr: 'Réservation 24h/24,',
    },
    heroHeadline2: {
      en: 'zero phone tag or DM chaos.',
      es: 'sin llamadas ni mensajes perdidos.',
      de: 'ohne zeitraubende Nachrichten.',
      fr: 'sans messages interminables.',
    },
    heroSubtitle: {
      en: 'Let your clients book confirmed appointments in 3 taps from your Instagram, TikTok, WhatsApp, or website. No app downloads or account creation required.',
      es: 'Permite que tus clientes agenden citas confirmadas en 3 toques desde Instagram, TikTok, WhatsApp o tu web. Sin descargar apps ni crear cuentas.',
      de: 'Lassen Sie Kunden Termine in 3 Klicks über Instagram, TikTok, WhatsApp oder Ihre Website buchen. Ganz ohne App-Download.',
      fr: 'Permettez à vos clients de réserver en 3 clics depuis Instagram, TikTok, WhatsApp ou votre site. Sans application à installer.',
    },
    accentColor: '#0284C7',
    bgPastel: 'rgba(2, 132, 199, 0.08)',
    pillar1: {
      title: {
        en: 'Instant 3-Tap Booking',
        es: 'Reserva en 3 Toques',
        de: '3-Klick Buchung',
        fr: 'Réservation en 3 Clics',
      },
      desc: {
        en: 'Frictionless flow designed for high conversion. Clients select service, time, and confirm in 20 seconds.',
        es: 'Flujo sin fricción pensado para máxima conversión. El cliente elige servicio, hora y confirma en 20 segundos.',
        de: 'Mühelose Buchung für maximale Buchungsraten. In 20 Sekunden bestätigt.',
        fr: 'Expérience fluide conçue pour convertir. Choix de prestation et confirmation en 20 secondes.',
      },
    },
    pillar2: {
      title: {
        en: 'Smart Buffer & Gap Protection',
        es: 'Pausas y Protección entre Citas',
        de: 'Automatische Pufferzeiten',
        fr: 'Temps de Pause Automatiques',
      },
      desc: {
        en: 'Automatic prep and clean-up buffers prevent overlapping appointments and ensure you never feel rushed.',
        es: 'Tiempos de preparación y limpieza entre citas para que nunca tengas solapamientos ni prisas.',
        de: 'Automatische Reinigungs- und Rüstzeiten verhindern Terminstress.',
        fr: 'Temps de préparation et de nettoyage pour travailler en toute sérénité.',
      },
    },
    pillar3: {
      title: {
        en: 'Multi-Timezone & Real-Time Sync',
        es: 'Sincronización en Tiempo Real',
        de: 'Echtzeit-Synchronisation',
        fr: 'Synchronisation en Temps Réel',
      },
      desc: {
        en: 'Live calendar sync across Apple Calendar, Google Calendar, and your AirBook business dashboard.',
        es: 'Sincronización bidireccional inmediata con Apple Calendar, Google Calendar y tu panel de AirBook.',
        de: 'Direkte Synchronisation mit Google Calendar und Apple Kalender.',
        fr: 'Synchronisation instantanée avec Google Calendar et Apple Calendrier.',
      },
    },
    keyFeatures: [
      {
        title: { en: 'Personal Booking Link', es: 'Enlace Personalizado de Reserva', de: 'Persönlicher Buchungslink', fr: 'Lien de Réservation Dédié' },
        desc: { en: 'A sleek custom URL (getairbook.com/book/your-brand) that looks stunning on every smartphone.', es: 'URL limpia y elegante para tu bio de redes sociales.', de: 'Elegante Kurz-URL für alle Social-Media-Profile.', fr: 'Une URL élégante et moderne pour tous vos réseaux.' },
      },
      {
        title: { en: 'Custom Questions & Intake Forms', es: 'Formularios y Preguntas Previas', de: 'Individuelle Fragebögen', fr: 'Formulaires et Questions Préalables' },
        desc: { en: 'Collect medical allergies, patch test info, and reference photos during booking.', es: 'Recopila alergias, fotos de referencia y notas de consulta.', de: 'Fragebögen und Allergieabfragen vorab erfassen.', fr: 'Collectez allergies, photos d’inspiration et antécédents.' },
      },
      {
        title: { en: 'Add-On Upsells in 1 Tap', es: 'Servicios Adicionales en 1 Toque', de: '1-Klick Zusatzleistungen', fr: 'Prestations Complémentaires' },
        desc: { en: 'Suggest treatments, deep conditioners, and upgrades while clients pick their service.', es: 'Ofrece tratamientos adicionales y mejoras automáticamente.', de: 'Empfehlen Sie Zusatzbehandlungen beim Buchen.', fr: 'Proposez des soins complémentaires lors de la réservation.' },
      },
    ],
  },

  'team-schedules': {
    slug: 'team-schedules',
    badge: {
      en: 'AirBook Team & Stations',
      es: 'Turnos y Estaciones con AirBook',
      de: 'AirBook Team & Dienstpläne',
      fr: 'Équipe & Postes AirBook',
    },
    heroHeadline1: {
      en: 'Team schedules and booths,',
      es: 'Turnos de equipo y cabinas,',
      de: 'Dienstpläne und Arbeitsplätze,',
      fr: 'Plannings d’équipe et cabines,',
    },
    heroHeadline2: {
      en: 'perfectly aligned in harmony.',
      es: 'perfectamente sincronizados.',
      de: 'perfekt im Einklang.',
      fr: 'parfaitement synchronisés.',
    },
    heroSubtitle: {
      en: 'Manage multiple specialists, station assignments, shift rotations, and individual staff commissions in one fast, visual calendar view.',
      es: 'Administra múltiples especialistas, asignación de cabinas, rotación de turnos y comisiones individuales en una sola vista visual y ágil.',
      de: 'Verwalten Sie Spezialisten, Arbeitsplätze, Schichten und individuelle Provisionen in einer übersichtlichen Ansicht.',
      fr: 'Gérez spécialistes, attribution des postes, rotations de planning et commissions dans une interface claire et fluide.',
    },
    accentColor: '#9333EA',
    bgPastel: 'rgba(147, 51, 234, 0.08)',
    pillar1: {
      title: {
        en: 'Station & Room Buffer Management',
        es: 'Gestión de Cabinas y Recursos',
        de: 'Raum- & Arbeitsplatzverwaltung',
        fr: 'Gestion des Cabines et Équipements',
      },
      desc: {
        en: 'Ensure specialists never double-book the same laser room, wash basin, or styling station.',
        es: 'Evita que dos especialistas agenden la misma cabina o estación técnica al mismo tiempo.',
        de: 'Verhindern Sie Doppelbelegungen von Behandlungsräumen und Geräten.',
        fr: 'Évitez les conflits de réservation sur les mêmes cabines ou appareils.'
      },
    },
    pillar2: {
      title: {
        en: 'Individual Staff Permissions',
        es: 'Permisos Granulares por Colaborador',
        de: 'Individuelle Mitarbeiterrechte',
        fr: 'Droits d’Accès Personnalisés',
      },
      desc: {
        en: 'Let staff manage their own calendar while protecting master financial records and salon client lists.',
        es: 'Permite a cada estilista ver solo su agenda protegiendo las finanzas y la base de datos maestra.',
        de: 'Mitarbeiter sehen ihren Kalender, sensible Finanzdaten bleiben geschützt.',
        fr: 'Chaque collaborateur accède à son planning sans exposer les données financières.'
      },
    },
    pillar3: {
      title: {
        en: 'Automated Commission Splits',
        es: 'Cálculo Automático de Comisiones',
        de: 'Automatische Provisionsabrechnung',
        fr: 'Calcul Automatique des Commissions',
      },
      desc: {
        en: 'Flexible splits per service, product sales bonuses, and instant booth rental accounting.',
        es: 'Porcentajes por servicio, comisiones por productos y gestión de renta de silla sin cálculos manuales.',
        de: 'Flexible Provisionssätze nach Dienstleistung und Verkauf automatisieren.',
        fr: 'Commissions modulables par prestation et gestion des loyers de fauteuil sans calculs manuels.'
      },
    },
    keyFeatures: [
      {
        title: { en: 'Multi-Staff Side-by-Side View', es: 'Vista Paralela del Equipo', de: 'Team-Tagesansicht', fr: 'Vue Parallèle de l’Équipe' },
        desc: { en: 'See every specialist column on desktop or tablet with quick drag-and-drop rescheduling.', es: 'Visualiza a todo tu equipo en columnas con reprogramación táctil.', de: 'Alle Mitarbeiter nebeneinander auf Tablet oder Desktop.', fr: 'Visualisez tous vos collaborateurs avec déplacement fluide des rendez-vous.' },
      },
      {
        title: { en: 'Custom Working Hours & Breaks', es: 'Horarios Personalizados y Descansos', de: 'Individuelle Arbeitszeiten', fr: 'Horaires Modulables et Pauses' },
        desc: { en: 'Set recurring shifts, vacations, and lunch breaks per team member.', es: 'Configura turnos rotativos, vacaciones y descansos con facilidad.', de: 'Wiederkehrende Schichten, Urlaub und Pausen pro Mitarbeiter.', fr: 'Définissez horaires hebdomadaires, congés et temps de repos.' },
      },
      {
        title: { en: 'Independent Staff Logins', es: 'Accesos Independientes sin Contraseña', de: 'Passwortloser Team-Login', fr: 'Connexion d’Équipe sans Mot de Passe' },
        desc: { en: 'Passwordless passkey logins for every staff member on their personal mobile device.', es: 'Acceso seguro con Touch ID / Face ID para cada colaborador.', de: 'Sicherer Passkey-Zugang per Touch ID / Face ID.', fr: 'Accès sécurisé par Touch ID / Face ID pour chaque membre de l’équipe.' },
      },
    ],
  },

  'client-notes': {
    slug: 'client-notes',
    badge: {
      en: 'AirBook Client Notes & CRM',
      es: 'Fichas y CRM con AirBook',
      de: 'AirBook Kundennotizen & CRM',
      fr: 'Fiches Clients & CRM AirBook',
    },
    heroHeadline1: {
      en: 'Every formula and preference,',
      es: 'Cada fórmula y preferencia,',
      de: 'Jedes Rezept und jede Vorliebe,',
      fr: 'Chaque formule et préférence,',
    },
    heroHeadline2: {
      en: 'remembered like magic.',
      es: 'al alcance de tu mano.',
      de: 'immer griffbereit.',
      fr: 'à portée de main.',
    },
    heroSubtitle: {
      en: 'Deliver an unforgettable personalized client experience. Save technical color formulas, patch tests, reference photos, and visit history right inside client profile cards.',
      es: 'Ofrece una experiencia personalizada inolvidable. Guarda fórmulas de tinte, pruebas de alergia, fotos del antes/después e historial en un solo lugar.',
      de: 'Bieten Sie ein persönliches Kundenerlebnis. Speichern Sie Farbrezepturen, Allergietests, Fotos und Besuche direkt im Kundenprofil.',
      fr: 'Offrez un accueil personnalisé mémorable. Conservez formules de coloration, tests d’allergie, photos et historique dans la fiche client.',
    },
    accentColor: '#E11D48',
    bgPastel: 'rgba(225, 29, 72, 0.08)',
    pillar1: {
      title: {
        en: 'Technical Formulation Cards',
        es: 'Fichas Técnicas de Fórmulas',
        de: 'Technische Rezeptur-Karten',
        fr: 'Fiches Techniques et Formules',
      },
      desc: {
        en: 'Log exact shade mixes, developers, bowl measurements, and processing times per visit.',
        es: 'Registra mezclas exactas de tonos, volúmenes y tiempos de pose en cada cita.',
        de: 'Exakte Mischverhältnisse, Entwickler und Einwirkzeiten pro Besuch erfassen.',
        fr: 'Enregistrez les dosages précis, oxydants et temps de pose à chaque rendez-vous.'
      },
    },
    pillar2: {
      title: {
        en: 'Photo Attachments & Before/After',
        es: 'Fotos del Antes y Después',
        de: 'Vorher-Nachher Fotogalerie',
        fr: 'Galerie Photos Avant/Après',
      },
      desc: {
        en: 'Snap reference photos directly from your phone and attach them securely to the client record.',
        es: 'Toma fotos de referencia con tu móvil y guárdalas directamente en la ficha del cliente.',
        de: 'Fotos direkt mit dem Smartphone aufnehmen und sicher im Profil ablegen.',
        fr: 'Prenez des photos de référence et associez-les directement au dossier client.'
      },
    },
    pillar3: {
      title: {
        en: 'Digital Consent & Medical Intake',
        es: 'Consentimientos y Pruebas Médicas',
        de: 'Digitale Einverständniserklärungen',
        fr: 'Consentements Numériques & Santé',
      },
      desc: {
        en: 'Store signed liability waivers, patch test approvals, and skin sensitivity history.',
        es: 'Almacena firmas de consentimiento, pruebas de parche y alergias cutáneas.',
        de: 'Unterschriebene Formulare und Allergiehistorie rechtssicher aufbewahren.',
        fr: 'Conservez signatures, accords préalables et sensibilités cutanées.'
      },
    },
    keyFeatures: [
      {
        title: { en: 'Client Visit Timeline', es: 'Línea de Tiempo de Visitas', de: 'Chronologische Kundenhistorie', fr: 'Historique Chronologique des Visites' },
        desc: { en: 'Instantly recall previous dates, assigned specialists, amounts spent, and services rendered.', es: 'Revisa fechas pasadas, servicios realizados y gasto total en 1 segundo.', de: 'Frühere Termine, Spezialisten und Ausgaben auf einen Blick.', fr: 'Retrouvez prestations passées, praticiens et dépenses en un clin d’œil.' },
      },
      {
        title: { en: 'Loyalty & Rebooking Prompts', es: 'Recordatorios de Reagendamiento', de: 'Automatische Wiederbuchung', fr: 'Relances de Fidélisation' },
        desc: { en: 'Identify clients who haven\'t booked in 6 weeks and send gentle personalized invitations.', es: 'Detecta clientes inactivos y reactiva su agenda con mensajes amables.', de: 'Inaktive Kunden erkennen und zur Wiederbuchung einladen.', fr: 'Identifiez les clients absents depuis 6 semaines et invitez-les à revenir.' },
      },
      {
        title: { en: 'Private Staff-Only Notes', es: 'Notas Privadas para el Equipo', de: 'Interne Team-Notizen', fr: 'Notes Internes Réservées à l’Équipe' },
        desc: { en: 'Leave quiet notes about preferred beverage, temperature, or styling quirks.', es: 'Apunta detalles como café favorito o preferencias de peinado.', de: 'Notizen zu Lieblingsgetränk oder Vorlieben hinterlegen.', fr: 'Notez boissons préférées et habitudes spécifiques en toute discrétion.' },
      },
    ],
  },

  payments: {
    slug: 'payments',
    badge: {
      en: 'AirBook Tap to Pay & POS',
      es: 'Cobros y Tap to Pay con AirBook',
      de: 'AirBook Tap to Pay & Kasse',
      fr: 'Caisse & Tap to Pay AirBook',
    },
    heroHeadline1: {
      en: 'Tap to pay on iPhone,',
      es: 'Cobra sin contacto en iPhone,',
      de: 'Kontaktlos kassieren per iPhone,',
      fr: 'Encaissez sans contact sur iPhone,',
    },
    heroHeadline2: {
      en: 'instant payouts to your card.',
      es: 'transferencias directas a tu cuenta.',
      de: 'sofortige Auszahlungen auf Ihr Konto.',
      fr: 'versements directs sur votre compte.',
    },
    heroSubtitle: {
      en: 'Accept contactless Apple Pay, Google Pay, and credit cards directly on your phone with zero bulky hardware rentals. Automatic deposit protection stops no-shows cold.',
      es: 'Acepta Apple Pay, Google Pay y tarjetas directamente en tu teléfono sin terminales aparatosos. Depósitos automáticos para blindar tu agenda.',
      de: 'Akzeptieren Sie Apple Pay, Google Pay und Kreditkarten direkt auf dem Smartphone. Ohne teure Kartenterminals.',
      fr: 'Acceptez Apple Pay, Google Pay et cartes bancaires directement sur votre téléphone. Sans louer de terminal encombrant.',
    },
    accentColor: '#10B981',
    bgPastel: 'rgba(16, 185, 129, 0.08)',
    pillar1: {
      title: {
        en: 'Zero POS Hardware Required',
        es: 'Cero Datáfonos ni Terminales Físicos',
        de: 'Keine teuren Kartengeräte',
        fr: 'Aucun Terminal Bancaire à Louer',
      },
      desc: {
        en: 'Turn your iPhone or Android into a high-speed payment terminal using built-in NFC technology.',
        es: 'Transforma tu móvil en un datáfono de cobro rápido con tecnología NFC integrada.',
        de: 'Verwandeln Sie Ihr Smartphone in ein schnelles Kartenterminal per NFC.',
        fr: 'Transformez votre smartphone en terminal de paiement rapide grâce au NFC.'
      },
    },
    pillar2: {
      title: {
        en: 'Automatic Deposit Protection',
        es: 'Protección Automática con Depósitos',
        de: 'Automatischer Anzahlungsschutz',
        fr: 'Acomptes Sécurisés Automatiques',
      },
      desc: {
        en: 'Require an upfront card hold or non-refundable deposit to eliminate last-minute cancellations.',
        es: 'Exige una tarjeta en garantía o anticipo para erradicar las cancelaciones de última hora.',
        de: 'Verbindliche Anzahlungen oder Kartenvormerkungen stoppen Terminausfälle.',
        fr: 'Exigez une empreinte bancaire ou un acompte pour supprimer les désistements.'
      },
    },
    pillar3: {
      title: {
        en: 'Daily Instant Stripe Payouts',
        es: 'Transferencias Diarias Inmediatas',
        de: 'Tägliche Sofortauszahlungen',
        fr: 'Virements Quotidiens Instantanés',
      },
      desc: {
        en: 'Your earnings are deposited straight into your bank account with complete transparent reporting.',
        es: 'Tus ingresos se transfieren directamente a tu banco con reportes claros y sin comisiones ocultas.',
        de: 'Ihre Einnahmen landen direkt auf Ihrem Bankkonto mit transparenten Berichten.',
        fr: 'Vos recettes sont versées directement sur votre compte bancaire en toute transparence.'
      },
    },
    keyFeatures: [
      {
        title: { en: 'Card-on-File 1-Tap Checkout', es: 'Cobro en 1 Toque con Tarjeta Guardada', de: '1-Klick Checkout mit hinterlegter Karte', fr: 'Encaissement 1 Clic par Carte Enregistrée' },
        desc: { en: 'Clients never have to pull out their wallet at the desk; charge the card on file seamlessly.', es: 'Cobra al instante sin que el cliente tenga que sacar la cartera.', de: 'Kassieren ohne Geldbörse direkt über die gespeicherte Karte.', fr: 'Encaissez sans que le client ait besoin de sortir son portefeuille.' },
      },
      {
        title: { en: 'Custom Tip Prompts (15%, 20%, 25%)', es: 'Sugerencias de Propinas Táctiles', de: 'Elegante Trinkgeld-Auswahl', fr: 'Suggestions de Pourboires Élégantes' },
        desc: { en: 'A polite, discreet tip screen that boosts team gratuities on average by 32%.', es: 'Pantalla elegante de propinas que incrementa las ganancias del equipo.', de: 'Dezente Trinkgeld-Abfrage steigert Teameinnahmen spürbar.', fr: 'Un écran de pourboire discret qui valorise le travail de l’équipe.' },
      },
      {
        title: { en: 'Automated Digital Receipts via SMS', es: 'Recibos Digitales por SMS', de: 'Digitale Belege per SMS & E-Mail', fr: 'Reçus Numériques par SMS & E-mail' },
        desc: { en: 'Send beautiful itemized PDF receipts straight to the client\'s phone in seconds.', es: 'Envía tickets detallados en PDF directo al WhatsApp o SMS del cliente.', de: 'Umweltfreundliche digitale Rechnungen direkt aufs Smartphone.', fr: 'Envoyez des reçus détaillés directement par SMS ou e-mail.' },
      },
    ],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'scheduling';
  const config = PRODUCT_CONFIGS[slug];

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
