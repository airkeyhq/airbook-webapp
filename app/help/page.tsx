'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Sparkle24Regular,
  Search24Regular,
  Calendar24Regular,
  Payment24Regular,
  PeopleCommunity24Regular,
  ShieldCheckmark24Regular,
  ChatHelp24Regular,
  ChevronDown24Filled,
  ArrowRight24Filled,
  CheckmarkCircle24Filled,
  Key24Regular,
  Dismiss24Filled,
  ThumbLike24Regular,
  ThumbDislike24Regular,
  Open24Filled,
  Share24Regular,
  Clock24Regular,
  Tag24Regular,
  Globe24Regular,
  Phone24Regular,
  DocumentBulletList24Regular,
} from '@fluentui/react-icons';

interface HelpArticle {
  id: string;
  categoryId: string;
  categoryName: { en: string; es: string; de: string; fr: string };
  title: { en: string; es: string; de: string; fr: string };
  summary: { en: string; es: string; de: string; fr: string };
  readTime: string;
  steps: {
    title: { en: string; es: string; de: string; fr: string };
    body: { en: string; es: string; de: string; fr: string };
  }[];
  proTip?: { en: string; es: string; de: string; fr: string };
  actionLink?: {
    label: { en: string; es: string; de: string; fr: string };
    href: string;
  };
}

export default function HelpCenterPage() {
  const { language } = useTranslation();
  const lang = (['en', 'es', 'de', 'fr'].includes(language) ? language : 'en') as 'en' | 'es' | 'de' | 'fr';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<HelpArticle | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  const content = {
    badge: {
      en: 'Help Center & Knowledge Base',
      es: 'Centro de Ayuda y Guías Oficiales',
      de: 'Hilfe-Center & Wissensdatenbank',
      fr: 'Centre d’Aide & Documentation',
    },
    title: {
      en: 'How can we help you today?',
      es: '¿Cómo podemos ayudarte hoy?',
      de: 'Wie können wir Ihnen heute helfen?',
      fr: 'Comment pouvons-nous vous aider ?',
    },
    searchPlaceholder: {
      en: 'Search guides, tutorials, Stripe setups, and FAQs…',
      es: 'Busca guías, tutoriales, configuración de Stripe y preguntas…',
      de: 'Suchen Sie nach Anleitungen, Stripe-Einrichtung und FAQs…',
      fr: 'Rechercher des guides, tutoriels, configuration Stripe et FAQ…',
    },
    allTopics: {
      en: 'All Topics',
      es: 'Todos los Temas',
      de: 'Alle Themen',
      fr: 'Tous les Sujets',
    },
    categoriesHeader: {
      en: 'Browse by Topic',
      es: 'Explorar por Tema',
      de: 'Nach Themen durchsuchen',
      fr: 'Parcourir par Thème',
    },
    faqsHeader: {
      en: 'Frequently Asked Questions',
      es: 'Preguntas Frecuentes',
      de: 'Häufig gestellte Fragen',
      fr: 'Foire Aux Questions',
    },
    conciergeTitle: {
      en: 'Still need help? Talk to our concierge team',
      es: '¿Aún necesitas ayuda? Habla con nuestro equipo concierge',
      de: 'Benötigen Sie weitere Hilfe? Unser Team ist für Sie da',
      fr: 'Besoin d’aide supplémentaire ? Contactez notre équipe',
    },
    conciergeSubtitle: {
      en: 'Our onboarding specialists are available 7 days a week to help migrate your calendar from Fresha, Vagaro, or Boulevard free of charge.',
      es: 'Nuestros especialistas están disponibles los 7 días de la semana para ayudarte a migrar tu agenda desde Fresha, Vagaro o Boulevard sin costo.',
      de: 'Unsere Spezialisten helfen Ihnen gerne beim kostenlosen Umzug Ihrer Termine von anderen Plattformen wie Fresha oder Treatwell.',
      fr: 'Nos spécialistes sont disponibles 7j/7 pour vous aider gratuitement à migrer vos plannings depuis d’autres plateformes.',
    },
    contactSupportBtn: {
      en: 'Email Support Concierge',
      es: 'Contactar a Soporte Concierge',
      de: 'Support-Team kontaktieren',
      fr: 'Contacter le Support',
    },
    wasHelpful: {
      en: 'Was this article helpful?',
      es: '¿Te resultó útil este artículo?',
      de: 'War dieser Artikel hilfreich?',
      fr: 'Cet article vous a-t-il été utile ?',
    },
    thankYouFeedback: {
      en: 'Thank you for your feedback!',
      es: '¡Muchas gracias por tus comentarios!',
      de: 'Vielen Dank für Ihr Feedback!',
      fr: 'Merci pour votre retour !',
    },
    proTipLabel: {
      en: 'Pro Tip',
      es: 'Consejo Pro',
      de: 'Profi-Tipp',
      fr: 'Astuce Pro',
    },
    closeArticle: {
      en: 'Close Guide',
      es: 'Cerrar Guía',
      de: 'Schließen',
      fr: 'Fermer',
    },
  };

  const ARTICLES: HelpArticle[] = [
    {
      id: 'claim-custom-link',
      categoryId: 'setup',
      categoryName: { en: 'Getting Started', es: 'Primeros Pasos', de: 'Erste Schritte', fr: 'Premiers Pas' },
      title: {
        en: 'How to claim and customize your public booking link',
        es: 'Cómo reclamar y personalizar tu enlace público de reservas',
        de: 'So richten Sie Ihren individuellen Buchungslink ein',
        fr: 'Comment personnaliser votre lien public de réservation',
      },
      summary: {
        en: 'Learn how to set up your unique salon URL (e.g., getairbook.com/book/your-studio), add your logo, cover banner, and Instagram links.',
        es: 'Aprende a configurar la URL de tu salón (ej. getairbook.com/book/tu-estudio), subir tu logo, portada y redes sociales.',
        de: 'Erfahren Sie, wie Sie Ihre persönliche Salon-URL konfigurieren, Logos hochladen und Social Media verknüpfen.',
        fr: 'Découvrez comment configurer l’URL de votre établissement, ajouter votre logo, bannière et réseaux sociaux.',
      },
      readTime: '2 min guide',
      steps: [
        {
          title: { en: '1. Open Brand Studio Settings', es: '1. Abre el Estudio de Marca', de: '1. Marken-Studio öffnen', fr: '1. Ouvrir le Studio de Marque' },
          body: {
            en: 'In your AirBook dashboard navigation bar, click on "Settings" and select the "Online Booking Studio" tab.',
            es: 'En el menú de tu panel de AirBook, haz clic en "Ajustes" y selecciona la pestaña "Estudio de Reservas Online".',
            de: 'Klicken Sie in der Navigation auf "Einstellungen" und wählen Sie den Reiter "Online-Buchung".',
            fr: 'Dans votre tableau de bord, cliquez sur "Paramètres" puis sur l’onglet "Studio de Réservation".',
          },
        },
        {
          title: { en: '2. Set Your Studio Slug & Handle', es: '2. Elige el nombre de tu enlace', de: '2. Salon-Namen und Link wählen', fr: '2. Définir votre identifiant de lien' },
          body: {
            en: 'Enter your desired business handle (e.g. "eduardos-lounge"). AirBook will verify real-time availability and lock your unique URL.',
            es: 'Ingresa el nombre deseado (ej. "eduardos-lounge"). AirBook verificará la disponibilidad en tiempo real para asignarte tu enlace único.',
            de: 'Geben Sie Ihren Wunschnamen ein (z.B. "salon-berlin"). AirBook prüft sofort die Verfügbarkeit.',
            fr: 'Saisissez le nom souhaité (ex. "salon-paris"). AirBook vérifie la disponibilité instantanément.',
          },
        },
        {
          title: { en: '3. Add Logo & Brand Colors', es: '3. Agrega tu logo y color de marca', de: '3. Logo und Markenfarbe anpassen', fr: '3. Ajouter votre logo et couleur' },
          body: {
            en: 'Pick your signature brand color palette and upload your salon logo so clients enjoy a 100% white-labeled booking experience.',
            es: 'Selecciona tu color de acento y sube tu logo para que tus clientes disfruten de una experiencia con tu identidad visual.',
            de: 'Wählen Sie Ihre Akzentfarbe und laden Sie Ihr Logo für einen professionellen Auftritt hoch.',
            fr: 'Choisissez votre couleur d’accent et ajoutez votre logo pour une expérience personnalisée.',
          },
        },
      ],
      proTip: {
        en: 'Add this link directly to your Instagram and TikTok bio buttons ("Book Now") to convert followers into scheduled clients 24/7.',
        es: 'Agrega este enlace en el botón de "Reservar" de tu biografía de Instagram y TikTok para recibir citas 24/7.',
        de: 'Fügen Sie den Link in Ihre Instagram-Bio ein, um Follower rund um die Uhr in zahlende Kunden zu verwandeln.',
        fr: 'Ajoutez ce lien directement dans votre bio Instagram et TikTok pour recevoir des réservations 24h/24.',
      },
      actionLink: {
        label: { en: 'Open Online Booking Studio', es: 'Abrir Estudio de Reservas', de: 'Buchungsstudio öffnen', fr: 'Ouvrir le Studio de Réservation' },
        href: '/dashboard',
      },
    },
    {
      id: 'buffer-times',
      categoryId: 'setup',
      categoryName: { en: 'Getting Started', es: 'Primeros Pasos', de: 'Erste Schritte', fr: 'Premiers Pas' },
      title: {
        en: 'Configuring buffer times and minimum notice windows',
        es: 'Configurar tiempos de descanso y aviso mínimo de cita',
        de: 'Pufferzeiten und Mindestvorlaufzeiten einstellen',
        fr: 'Configurer les temps de pause et délais de prévenance',
      },
      summary: {
        en: 'Protect your daily schedule from burnout by automating 10-15 minute cleanup buffers and preventing last-minute walk-in collisions.',
        es: 'Evita la sobrecarga de trabajo programando pausas automáticas de 10-15 min para limpieza y desinfección entre clientes.',
        de: 'Verhindern Sie Stress durch automatische 10-15 minütige Pausen zwischen Behandlungen.',
        fr: 'Évitez le surmenage en configurant des temps de pause automatiques entre chaque prestation.',
      },
      readTime: '2 min guide',
      steps: [
        {
          title: { en: '1. Navigate to Booking Rules', es: '1. Ve a Reglas de Reserva', de: '1. Zu den Buchungsregeln navigieren', fr: '1. Aller aux Règles de Réservation' },
          body: {
            en: 'In Settings &gt; Online Booking Studio, switch to the "Rules & Policies" tab.',
            es: 'En Ajustes &gt; Estudio de Reservas, ve a la pestaña "Reglas y Políticas".',
            de: 'In den Einstellungen &gt; Online-Buchung den Reiter "Regeln & Richtlinien" wählen.',
            fr: 'Dans Paramètres &gt; Studio de Réservation, sélectionnez "Règles & Politiques".',
          },
        },
        {
          title: { en: '2. Set Buffer Duration', es: '2. Define la duración del descanso', de: '2. Pufferzeit festlegen', fr: '2. Définir le temps de pause' },
          body: {
            en: 'Choose 5, 10, 15, or 30 minutes of automatic buffer time. AirBook will block this gap on your calendar without charging the client extra.',
            es: 'Selecciona 5, 10, 15 o 30 minutos. AirBook bloqueará automáticamente ese tiempo en tu agenda para preparar tu estación.',
            de: 'Wählen Sie 5 bis 30 Minuten. AirBook blockiert diesen Zeitraum automatisch für Vorbereitungen.',
            fr: 'Choisissez entre 5 et 30 minutes. AirBook bloque automatiquement cet intervalle dans votre planning.',
          },
        },
      ],
      proTip: {
        en: 'We recommend setting a "Minimum Advance Notice" of at least 2 hours so clients cannot book surprise appointments while you are mid-service.',
        es: 'Recomendamos fijar un "Aviso Mínimo de Anticipación" de al menos 2 horas para evitar citas sorpresa mientras estás trabajando.',
        de: 'Stellen Sie eine Mindestvorlaufzeit von 2 Stunden ein, um unvorhergesehene Spontanbuchungen zu vermeiden.',
        fr: 'Nous conseillons un délai de prévenance de 2 heures minimum pour éviter les réservations de dernière minute.',
      },
      actionLink: {
        label: { en: 'Adjust Scheduling Rules', es: 'Ajustar Reglas de Agenda', de: 'Regeln anpassen', fr: 'Ajuster les Règles' },
        href: '/dashboard',
      },
    },
    {
      id: 'connect-stripe-express',
      categoryId: 'payments',
      categoryName: { en: 'Payments & Payouts', es: 'Pagos y Cobros', de: 'Zahlungen & Auszahlungen', fr: 'Paiements & Versements' },
      title: {
        en: 'How to connect your bank account via Stripe Express',
        es: 'Cómo conectar tu cuenta bancaria con Stripe Express',
        de: 'Bankkonto mit Stripe Express verbinden',
        fr: 'Connecter votre compte bancaire avec Stripe Express'
      },
      summary: {
        en: 'Step-by-step guide to onboarding your business bank account for automated daily payouts and customer deposit handling.',
        es: 'Guía paso a paso para vincular tu cuenta bancaria y recibir transferencias diarias automáticas de tus anticipos.',
        de: 'Schritt-für-Schritt-Anleitung zur Verknüpfung Ihres Bankkontos für tägliche automatische Auszahlungen.',
        fr: 'Guide étape par étape pour connecter votre compte bancaire et recevoir vos versements automatiques quotidiens.',
      },
      readTime: '3 min guide',
      steps: [
        {
          title: { en: '1. Open Payments Module', es: '1. Abre el Módulo de Pagos', de: '1. Zahlungsbereich öffnen', fr: '1. Ouvrir l’Espace Paiements' },
          body: {
            en: 'From your main dashboard, navigate to the "Payments / POS" section or click "Connect Bank" in Settings.',
            es: 'Desde tu panel principal, ve a la sección "Pagos / POS" o haz clic en "Conectar Banco" en Ajustes.',
            de: 'Navigieren Sie im Dashboard zu "Zahlungen / Kasse" und klicken Sie auf "Bankkonto verbinden".',
            fr: 'Dans votre tableau de bord, accédez à la section "Paiements" et cliquez sur "Connecter ma banque".',
          },
        },
        {
          title: { en: '2. Complete 1-Minute Stripe Express KYC', es: '2. Completa la verificación de Stripe en 1 minuto', de: '2. Schnelle Stripe-Verifizierung', fr: '2. Vérification d’identité en 1 minute' },
          body: {
            en: 'Enter your business legal name, bank account routing/IBAN number, and tax ID. Stripe validates credentials in seconds.',
            es: 'Ingresa el nombre de tu negocio, CLABE/IBAN bancario y RFC/DNI. Stripe validará tu información en segundos.',
            de: 'Geben Sie IBAN und Firmendaten ein. Stripe schaltet Ihr Konto binnen Minuten frei.',
            fr: 'Renseignez votre IBAN et informations professionnelles. Stripe valide votre compte immédiatement.',
          },
        },
        {
          title: { en: '3. Receive Daily Automatic Payouts', es: '3. Recibe depósitos diarios automáticos', de: '3. Tägliche automatische Auszahlungen', fr: '3. Versements automatiques quotidiens' },
          body: {
            en: 'All client card deposits and Tap-to-Pay checkout totals will transfer directly to your bank account with zero intermediate delays.',
            es: 'Todos los anticipos de reservas y cobros en mostrador se depositarán directamente en tu cuenta bancaria.',
            de: 'Alle Einnahmen und Anzahlungen werden direkt auf Ihr Girokonto überwiesen.',
            fr: 'L’ensemble de vos acomptes et encaissements sont versés directement sur votre compte bancaire.',
          },
        },
      ],
      proTip: {
        en: 'Stripe Express allows individual booth renters and practitioners in your studio to connect their own independent bank accounts for automatic split payouts.',
        es: 'Stripe Express permite que cada estilista o arrendatario de sillón en tu estudio conecte su propia cuenta bancaria para recibir sus comisiones directas.',
        de: 'Stuhlmieter können eigene Bankkonten anbinden, sodass Umsätze direkt getrennt abgerechnet werden.',
        fr: 'Chaque collaborateur ou locataire de fauteuil peut connecter son propre compte pour des versements séparés.',
      },
      actionLink: {
        label: { en: 'Connect Stripe Account', es: 'Conectar Cuenta de Stripe', de: 'Stripe verbinden', fr: 'Connecter Stripe' },
        href: '/dashboard',
      },
    },
    {
      id: 'deposit-card-lock',
      categoryId: 'payments',
      categoryName: { en: 'Payments & Payouts', es: 'Pagos y Cobros', de: 'Zahlungen & Auszahlungen', fr: 'Paiements & Versements' },
      title: {
        en: 'Enforcing card-lock deposit guarantees to stop no-shows',
        es: 'Activar retención de tarjeta y anticipos contra cancelaciones',
        de: 'Anzahlungspflicht zur Vermeidung von No-Shows aktivieren',
        fr: 'Activer la garantie d’acompte pour éliminer les rendez-vous non honorés',
      },
      summary: {
        en: 'How to require 20-50% deposits or card pre-authorizations to eliminate 95% of client no-shows.',
        es: 'Cómo requerir anticipos del 20-50% o pre-autorización de tarjeta para eliminar el 95% de las inasistencias.',
        de: 'Verlangen Sie 20-50% Anzahlung bei Online-Buchungen zur Reduzierung von Terminausfällen um 95%.',
        fr: 'Exigez 20 à 50% d’acompte pour réduire de 95% les absences imprévues.',
      },
      readTime: '2 min guide',
      steps: [
        {
          title: { en: '1. Choose Deposit Percentage', es: '1. Elige el porcentaje de anticipo', de: '1. Anzahlungshöhe wählen', fr: '1. Choisir le pourcentage d’acompte' },
          body: {
            en: 'In Settings &gt; Online Booking Studio &gt; Rules & Policies, toggle on "Require Card Deposit" and set your preferred percentage (e.g., 25% or 50%).',
            es: 'En Ajustes &gt; Estudio de Reservas &gt; Reglas y Políticas, activa "Requerir Anticipo con Tarjeta" y fija tu porcentaje (ej. 25% o 50%).',
            de: 'In den Buchungsregeln die Option "Anzahlung verlangen" aktivieren und Prozentsatz (z.B. 25% oder 50%) eintragen.',
            fr: 'Dans Paramètres &gt; Règles de Réservation, activez l’option "Exiger un acompte" et définissez votre taux.',
          },
        },
        {
          title: { en: '2. Set Cancellation Notice Window', es: '2. Define el plazo de cancelación', de: '2. Stornierungsfrist festlegen', fr: '2. Définir le délai d’annulation' },
          body: {
            en: 'Specify the minimum cancellation notice (e.g. 24 or 48 hours). Cancellations after this window automatically forfeit the deposit to your studio.',
            es: 'Indica el plazo mínimo de cancelación (ej. 24 o 48 hrs). Cancelaciones fuera de plazo transfieren el anticipo a tu estudio.',
            de: 'Legen Sie eine Frist fest (z.B. 24 Std). Bei kurzfristigen Absagen verbleibt die Anzahlung bei Ihnen.',
            fr: 'Précisez le délai minimum (ex. 24h). En cas d’annulation tardive, l’acompte est conservé par votre salon.',
          },
        },
      ],
      proTip: {
        en: 'Clients appreciate fairness: AirBook clearly displays your cancellation guarantee policy on the final booking step so there are never surprises.',
        es: 'Tus clientes lo valoran: AirBook muestra claramente tu política de cancelación en el paso final de confirmación para total transparencia.',
        de: 'Volle Transparenz: Die Stornierungsbedingungen werden dem Kunden vor Abschluss der Buchung übersichtlich angezeigt.',
        fr: 'Transparence totale : Les conditions d’annulation sont clairement affichées au client avant validation.',
      },
      actionLink: {
        label: { en: 'Configure Deposit Protection', es: 'Configurar Protección de Depósitos', de: 'Anzahlungen einrichten', fr: 'Configurer les Acomptes' },
        href: '/dashboard',
      },
    },
    {
      id: 'invite-staff-passkeys',
      categoryId: 'team',
      categoryName: { en: 'Team & Shifts', es: 'Equipo y Turnos', de: 'Team & Pläne', fr: 'Équipe & Plannings' },
      title: {
        en: 'Inviting team members with passwordless biometric access',
        es: 'Invitar estilistas y colaboradores con acceso biométrico seguro',
        de: 'Mitarbeiter mit passwortlosem Zugang einladen',
        fr: 'Inviter vos collaborateurs avec un accès biométrique sans mot de passe',
      },
      summary: {
        en: 'Add stylists, colorists, and receptionists with granular permission controls and instant Passkey (Face ID/Touch ID) logins.',
        es: 'Agrega colaboradores con permisos personalizados e inicio de sesión biométrico instantáneo (Touch ID/Face ID).',
        de: 'Fügen Sie Mitarbeiter mit individuellen Rechten und sicherem Passkey-Login hinzu.',
        fr: 'Ajoutez des collaborateurs avec des droits d’accès sur mesure et une connexion biométrique instantanée.',
      },
      readTime: '2 min guide',
      steps: [
        {
          title: { en: '1. Open Team & Staff Module', es: '1. Abre el Módulo de Equipo', de: '1. Mitarbeiterbereich aufrufen', fr: '1. Ouvrir l’Espace Équipe' },
          body: {
            en: 'From the dashboard, click on the "Team & Specialists" section and tap "+ Add Specialist".',
            es: 'En el panel, ve a "Equipo y Especialistas" y haz clic en "+ Agregar Especialista".',
            de: 'Klicken Sie auf "Team & Mitarbeiter" und wählen Sie "+ Mitarbeiter hinzufügen".',
            fr: 'Cliquez sur "Équipe & Spécialistes" puis sur "+ Ajouter un collaborateur".',
          },
        },
        {
          title: { en: '2. Select Permissions & Working Shifts', es: '2. Asigna horarios y permisos', de: '2. Arbeitszeiten und Rechte zuweisen', fr: '2. Définir les horaires et autorisations' },
          body: {
            en: 'Assign specific stations, services they perform, weekly working hours, and their commission rate.',
            es: 'Asigna su estación de trabajo, catálogo de servicios que realiza, horarios semanales y porcentaje de comisión.',
            de: 'Weisen Sie Stationen, Dienstleistungen, Arbeitszeiten und Provisionssätze zu.',
            fr: 'Attribuez les postes de travail, les prestations réalisées, les horaires et les taux de commission.',
          },
        },
      ],
      proTip: {
        en: 'Staff members can view their own schedule on their mobile phone without seeing private studio financial ledgers unless granted Admin access.',
        es: 'Los colaboradores pueden consultar su agenda desde su teléfono móvil sin ver la contabilidad general del estudio a menos que les des rol de Administrador.',
        de: 'Mitarbeiter sehen ihre eigenen Termine auf dem Smartphone, haben aber keinen Einblick in sensible Gesamtzahlen des Salons.',
        fr: 'Vos collaborateurs consultent leur planning sur leur smartphone sans avoir accès aux données financières globales.',
      },
      actionLink: {
        label: { en: 'Manage Team & Shifts', es: 'Gestionar Equipo y Horarios', de: 'Team verwalten', fr: 'Gérer l’Équipe' },
        href: '/dashboard',
      },
    },
    {
      id: 'export-data-json-csv',
      categoryId: 'security',
      categoryName: { en: 'Security & Data', es: 'Seguridad y Datos', de: 'Sicherheit & Daten', fr: 'Sécurité & Données' },
      title: {
        en: 'How to export 100% of your client and booking data (JSON/CSV)',
        es: 'Cómo exportar el 100% de tus clientes y citas en JSON/CSV',
        de: 'Vollständigen Datenexport als CSV/JSON herunterladen',
        fr: 'Comment exporter 100% de vos données clients et plannings (JSON/CSV)',
      },
      summary: {
        en: 'Zero lock-in guarantee: download full records of client notes, formulas, contact details, and transaction history at any time.',
        es: 'Garantía de cero ataduras: descarga el historial completo de clientes, fórmulas, notas y citas en un solo clic.',
        de: 'Kein Lock-in: Exportieren Sie Ihre Kundendaten, Rezepturen und Terminhistorien jederzeit mit einem Klick.',
        fr: 'Aucun verrouillage : téléchargez l’intégralité de vos fiches clients, formules et historiques en un clic.',
      },
      readTime: '1 min guide',
      steps: [
        {
          title: { en: '1. Open Settings &gt; Data & Privacy', es: '1. Ve a Ajustes &gt; Datos y Privacidad', de: '1. Einstellungen &gt; Datenschutz', fr: '1. Paramètres &gt; Données & Confidentialité' },
          body: {
            en: 'In your dashboard Settings menu, scroll down to the "Data Portability & Export" section.',
            es: 'En el menú de Ajustes de tu panel, desplázate hasta la sección "Portabilidad y Exportación de Datos".',
            de: 'In den Einstellungen nach unten zum Bereich "Datenexport" scrollen.',
            fr: 'Dans les Paramètres, descendez jusqu’à la section "Portabilité des Données".',
          },
        },
        {
          title: { en: '2. Click "Export All Records"', es: '2. Haz clic en "Exportar Todos los Registros"', de: '2. "Gesamtdaten exportieren" anklicken', fr: '2. Cliquer sur "Exporter toutes les données"' },
          body: {
            en: 'Choose CSV (for Excel / Google Sheets) or JSON (for developer tools). Your file will generate and download immediately.',
            es: 'Elige formato CSV (para Excel / Google Sheets) o JSON. Tu archivo se descargará de inmediato.',
            de: 'Wählen Sie CSV (für Excel) oder JSON. Die Datei wird sofort heruntergeladen.',
            fr: 'Choisissez le format CSV (pour Excel) ou JSON. Le téléchargement démarre immédiatement.',
          },
        },
      ],
      proTip: {
        en: 'AirBook will never hold your client data hostage or charge export fees. You maintain 100% ownership of your business records.',
        es: 'AirBook nunca retendrá tus datos ni cobrará tarifas de exportación. Eres el dueño absoluto de la información de tu negocio.',
        de: 'Ihre Daten gehören Ihnen. Wir erheben niemals Exportgebühren und blockieren keine Übertragungen.',
        fr: 'Vos données vous appartiennent. Aucun frais d’exportation n’est jamais appliqué.',
      },
      actionLink: {
        label: { en: 'Export Studio Data', es: 'Exportar Datos del Estudio', de: 'Daten exportieren', fr: 'Exporter les Données' },
        href: '/dashboard',
      },
    },
    {
      id: 'ai-mcp-integration',
      categoryId: 'ai',
      categoryName: { en: 'AI & Agentic MCP', es: 'IA y Agentes MCP', de: 'KI & Agenten MCP', fr: 'IA & Agents MCP' },
      title: {
        en: 'How to connect AI Agents & MCP to AirBook',
        es: 'Cómo conectar Agentes de IA y MCP a AirBook',
        de: 'So verbinden Sie KI-Agenten & MCP mit AirBook',
        fr: 'Comment connecter des Agents IA et MCP à AirBook',
      },
      summary: {
        en: 'Generate secret API keys and connect Claude Desktop, Cursor, ChatGPT, and AI Voice Receptionists to manage salon bookings, check real-time availability, and dispatch SMS alerts via Model Context Protocol.',
        es: 'Genera claves secretas de API y conecta Claude Desktop, Cursor, ChatGPT y recepcionistas de voz con IA para gestionar citas, verificar disponibilidad en tiempo real y enviar alertas por SMS mediante Model Context Protocol.',
        de: 'Generieren Sie geheime API-Schlüssel und verbinden Sie Claude Desktop, Cursor, ChatGPT und telefonische KI-Empfangsdienste, um Termine zu verwalten und SMS-Benachrichtigungen über das Model Context Protocol zu senden.',
        fr: 'Générez des clés secrètes d’API et connectez Claude Desktop, Cursor, ChatGPT et des réceptionnistes vocaux IA pour gérer vos réservations et envoyer des SMS via le Model Context Protocol.',
      },
      readTime: '4 min guide',
      steps: [
        {
          title: {
            en: '1. Generate your AirBook Secret API Key',
            es: '1. Genera tu Clave Secreta de API en AirBook',
            de: '1. Generieren Sie Ihren geheimen AirBook API-Schlüssel',
            fr: '1. Générez votre clé secrète d’API AirBook',
          },
          body: {
            en: 'Go to Settings → AI & MCP in your AirBook Dashboard. Click "+ Create Secret API Key", assign a name (e.g. "Front-Desk AI Phone"), and copy your unique ab_live_... secret key. For security, keys are hashed and shown only once upon creation.',
            es: 'Ve a Configuración → IA y MCP en tu Panel de AirBook. Haz clic en "+ Crear Clave Secreta API", asigna un nombre (ej. "Recepcionista Telefónica IA") y copia tu clave secreta ab_live_... Por seguridad, las claves están cifradas y solo se muestran una vez.',
            de: 'Navigieren Sie in Ihrem AirBook-Dashboard zu Einstellungen → KI & MCP. Klicken Sie auf "+ Geheimen API-Schlüssel erstellen", vergeben Sie einen Namen und kopieren Sie Ihren Schlüssel (ab_live_...). Aus Sicherheitsgründen wird dieser nur einmal angezeigt.',
            fr: 'Accédez à Paramètres → IA & MCP dans votre tableau de bord AirBook. Cliquez sur "+ Créer une clé secrète API", nommez-la et copiez votre clé ab_live_... Pour des raisons de sécurité, la clé n’est affichée qu’une seule fois.',
          },
        },
        {
          title: {
            en: '2. Copy your 1-Click MCP Client Configuration',
            es: '2. Copia la Configuración de tu Cliente MCP en 1 Clic',
            de: '2. Kopieren Sie die 1-Klick MCP-Client-Konfiguration',
            fr: '2. Copiez la configuration client MCP en 1 clic',
          },
          body: {
            en: 'In Settings → AI & MCP, select your platform tab (Claude Desktop, Cursor IDE, or AI Voice Receptionist) to copy the pre-built configuration JSON. Your endpoint is https://getairbook.com/api/mcp with header "Authorization: Bearer ab_live_...".',
            es: 'En Configuración → IA y MCP, selecciona la pestaña de tu plataforma (Claude Desktop, Cursor IDE o Recepcionista de Voz) para copiar el JSON preconfigurado. Tu endpoint es https://getairbook.com/api/mcp con el encabezado "Authorization: Bearer ab_live_...".',
            de: 'Wählen Sie unter Einstellungen → KI & MCP Ihren Client (Claude Desktop, Cursor IDE oder Sprachassistent), um das vorbereitete JSON zu kopieren. Ihr Endpunkt lautet https://getairbook.com/api/mcp mit Header "Authorization: Bearer ab_live_...".',
            fr: 'Dans Paramètres → IA & MCP, sélectionnez votre plateforme (Claude Desktop, Cursor ou Réceptionniste vocal) pour copier la configuration JSON pré-remplie avec le point de terminaison https://getairbook.com/api/mcp et l’en-tête Authorization.',
          },
        },
        {
          title: {
            en: '3. Execute 12 Autonomous Salon & Spa Operations',
            es: '3. Ejecuta 12 Operaciones Autónomas de Salón y Spa',
            de: '3. Nutzen Sie 12 autonome Salon- und Spa-Funktionen',
            fr: '3. Exécutez les 12 opérations autonomes de salon et spa',
          },
          body: {
            en: 'Your AI agent can immediately check specialist availability (airbook_check_availability), book appointments (airbook_create_booking), reschedule, lookup client hair formulas, manage walk-in waitlists, inspect stock, and dispatch automated SMS alerts.',
            es: 'Tu agente de IA puede consultar disponibilidad en vivo (airbook_check_availability), agendar citas (airbook_create_booking), reagendar, consultar fórmulas de clientes, gestionar la lista de espera, revisar inventario y enviar alertas por SMS.',
            de: 'Ihr KI-Agent kann sofort Termine buchen, freie Zeiten abfragen, Rezepturen nachschlagen, Wartelisten verwalten, Lagerbestände prüfen und automatische SMS-Benachrichtigungen versenden.',
            fr: 'Votre agent IA peut instantanément vérifier les disponibilités, planifier des rendez-vous, consulter les fiches techniques, gérer les files d’attente et envoyer des alertes SMS automatiques.',
          },
        },
      ],
      proTip: {
        en: 'You can test your live MCP connection anytime directly inside Settings → AI & MCP using the "Ping AirBook MCP" button.',
        es: 'Puedes probar la conexión de tu servidor MCP en cualquier momento desde Configuración → IA y MCP con el botón "Hacer Ping a AirBook MCP".',
        de: 'Sie können Ihre MCP-Verbindung jederzeit direkt unter Einstellungen → KI & MCP mit dem Button "AirBook MCP anpingen" testen.',
        fr: 'Vous pouvez tester votre connexion MCP en direct à tout moment dans Paramètres → IA & MCP grâce au bouton de test ping.',
      },
      actionLink: {
        label: { en: 'Open AI & MCP Settings', es: 'Abrir Configuración de IA y MCP', de: 'KI & MCP-Einstellungen öffnen', fr: 'Ouvrir les Paramètres IA & MCP' },
        href: '/dashboard?tab=settings',
      },
    },
  ];

  const FAQS = [
    {
      q: {
        en: 'Can AI agents (like Claude or ChatGPT) manage my salon schedule?',
        es: '¿Pueden los agentes de IA (como Claude o ChatGPT) gestionar la agenda de mi salón?',
        de: 'Können KI-Agenten (wie Claude oder ChatGPT) meinen Salonplan verwalten?',
        fr: 'Les agents IA (comme Claude ou ChatGPT) peuvent-ils gérer le planning de mon salon ?',
      },
      a: {
        en: 'Yes! AirBook includes a native Model Context Protocol (MCP) server at /api/mcp. You can connect Claude, Cursor, ChatGPT, or AI phone receptionists to check real-time availability, book clients, reschedule appointments, manage walk-in queues, and send SMS reminders automatically.',
        es: '¡Sí! AirBook cuenta con un servidor nativo de Model Context Protocol (MCP) en /api/mcp. Puedes conectar Claude, Cursor, ChatGPT o recepcionistas de voz con IA para consultar disponibilidad, agendar citas, gestionar la lista de espera y enviar recordatorios por SMS de forma 100% autónoma.',
        de: 'Ja! AirBook verfügt über einen nativen Model Context Protocol (MCP) Server unter /api/mcp. Sie können Claude, Cursor, ChatGPT oder telefonische KI-Empfangsdienste anbinden, um Verfügbarkeiten abzufragen, Buchungen vorzunehmen und SMS-Erinnerungen automatisch zu versenden.',
        fr: 'Oui ! AirBook intègre un serveur natif Model Context Protocol (MCP) sur /api/mcp. Vous pouvez connecter Claude, Cursor, ChatGPT ou des assistants vocaux pour vérifier les créneaux, réserver des prestations et envoyer des rappels SMS automatiquement.',
      },
    },
    {
      q: {
        en: 'How quickly can I get my booking link live?',
        es: '¿Qué tan rápido puedo tener mi enlace listo para recibir citas?',
        de: 'Wie schnell kann ich meinen Buchungslink freischalten?',
        fr: 'En combien de temps puis-je commencer à recevoir des réservations ?',
      },
      a: {
        en: 'In less than 3 minutes. As soon as you sign up with your email or Google account, AirBook automatically provisions your personalized public booking page (e.g., getairbook.com/book/your-studio). You can add services, set working hours, and start sharing immediately.',
        es: 'En menos de 3 minutos. Al registrarte con tu correo o cuenta de Google, AirBook genera automáticamente tu página pública de reservas (ej. getairbook.com/book/tu-estudio). Solo agregas tus servicios, configuras tus horarios y comienzas a compartirla.',
        de: 'In weniger als 3 Minuten. Direkt nach der Anmeldung wird Ihre persönliche Buchungsseite generiert. Sie tragen Ihre Dienstleistungen ein und können den Link sofort auf Social Media teilen.',
        fr: 'En moins de 3 minutes. Dès votre inscription, AirBook génère votre page de réservation personnalisée. Ajoutez vos prestations, vos horaires et partagez votre lien immédiatement.',
      },
    },
    {
      q: {
        en: 'Do my clients need to create an account or download an app?',
        es: '¿Mis clientes necesitan crear una cuenta o descargar una aplicación?',
        de: 'Müssen meine Kunden ein Konto erstellen oder eine App herunterladen?',
        fr: 'Mes clients doivent-ils créer un compte ou installer une application ?',
      },
      a: {
        en: 'No! One of AirBook’s biggest advantages is zero client friction. Clients do not need to download an app or remember any passwords. They tap your link, pick an available slot in 3 taps, confirm their phone number, and receive instant SMS confirmations.',
        es: '¡No! Una de las mayores ventajas de AirBook es la total ausencia de fricción. Tus clientes no tienen que descargar aplicaciones ni recordar contraseñas. Tocan tu enlace, eligen su horario en 3 toques, confirman su número y reciben su SMS de confirmación al instante.',
        de: 'Nein! Kunden müssen keine App herunterladen und keine Passwörter merken. Die Buchung erfolgt in wenigen Klicks direkt im Browser mit sofortiger SMS-Bestätigung.',
        fr: 'Non ! Vos clients n’ont aucune application à télécharger ni aucun mot de passe à retenir. Ils choisissent leur créneau en 3 clics et reçoivent immédiatement leur confirmation par SMS.',
      },
    },
    {
      q: {
        en: 'How does deposit protection protect against no-shows?',
        es: '¿Cómo funciona la protección de depósitos contra cancelaciones de último momento?',
        de: 'Wie schützt mich die Anzahlungsfunktion vor Terminausfällen?',
        fr: 'Comment la garantie d’acompte protège-t-elle contre les rendez-vous manqués ?',
      },
      a: {
        en: 'You can choose to require a custom deposit percentage (e.g. 20% or 50%) or hold a credit card pre-authorization when clients book online. If a client fails to show up or cancels past your minimum notice window, the deposit is retained and transferred directly to your bank account via Stripe.',
        es: 'Puedes requerir un porcentaje de anticipo (ej. 20% o 50%) o una pre-autorización de tarjeta al momento de agendar. Si un cliente no se presenta o cancela fuera del plazo mínimo, el depósito se transfiere directamente a tu cuenta bancaria a través de Stripe.',
        de: 'Sie können frei festlegen, ob bei der Online-Buchung eine Anzahlung (z.B. 20% oder 50%) fällig wird. Bei Nichterscheinen wird der Betrag automatisch über Stripe auf Ihr Bankkonto überwiesen.',
        fr: 'Vous pouvez exiger un acompte (par exemple 20% ou 50%) lors de la réservation. En cas d’absence non justifiée, l’acompte vous est automatiquement versé sur votre compte bancaire via Stripe.',
      },
    },
    {
      q: {
        en: 'Can I import my client history from Vagaro, Fresha, or Boulevard?',
        es: '¿Puedo importar mi lista de clientes desde Vagaro, Fresha o Boulevard?',
        de: 'Kann ich Kundendaten aus Fresha, Treatwell oder anderen Programmen importieren?',
        fr: 'Puis-je importer mes données clients depuis Fresha ou Planity ?',
      },
      a: {
        en: 'Yes! You can upload a standard CSV export of your clients directly in the Clients module, or message our concierge support team to handle the full migration for you at zero charge.',
        es: '¡Sí! Puedes importar un archivo CSV con tus clientes directamente en el módulo de Clientes, o escribir a nuestro equipo de soporte para que realicemos la migración por ti sin ningún costo.',
        de: 'Ja! Sie können Kundenlisten einfach als CSV-Datei hochladen oder unser kostenloses Support-Team mit dem Umzug beauftragen.',
        fr: 'Oui ! Vous pouvez importer votre fichier client en format CSV directement, ou contacter notre support gratuit pour réaliser la migration à votre place.',
      },
    },
  ];

  const categories = [
    { id: 'all', label: content.allTopics[lang], icon: DocumentBulletList24Regular },
    { id: 'setup', label: { en: 'Getting Started', es: 'Primeros Pasos', de: 'Erste Schritte', fr: 'Premiers Pas' }[lang], icon: Calendar24Regular },
    { id: 'ai', label: { en: 'AI & Agentic MCP', es: 'IA y Agentes MCP', de: 'KI & Agenten MCP', fr: 'IA & Agents MCP' }[lang], icon: Sparkle24Regular },
    { id: 'payments', label: { en: 'Payments & Stripe', es: 'Pagos y Stripe', de: 'Zahlungen & Stripe', fr: 'Paiements & Stripe' }[lang], icon: Payment24Regular },
    { id: 'team', label: { en: 'Team & Shifts', es: 'Equipo y Turnos', de: 'Team & Pläne', fr: 'Équipe & Plannings' }[lang], icon: PeopleCommunity24Regular },
    { id: 'security', label: { en: 'Security & Passkeys', es: 'Seguridad y Passkeys', de: 'Sicherheit & Passkeys', fr: 'Sécurité & Passkeys' }[lang], icon: Key24Regular },
  ];

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((art) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all' && art.categoryId !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title[lang].toLowerCase().includes(q);
      const matchSummary = art.summary[lang].toLowerCase().includes(q);
      const matchSteps = art.steps.some(
        (s) => s.title[lang].toLowerCase().includes(q) || s.body[lang].toLowerCase().includes(q)
      );
      return matchTitle || matchSummary || matchSteps;
    });
  }, [selectedCategory, searchQuery, lang]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white font-sans">
      <MarketingHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full space-y-14">
        {/* Top Hero with Live Search Bar */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2BB5FF]/10 text-[#0284C7] dark:text-[#2BB5FF] text-xs font-black uppercase tracking-wider">
            <ChatHelp24Regular className="w-4 h-4" />
            <span>{content.badge[lang]}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-primary)]">
            {content.title[lang]}
          </h1>

          {/* Interactive Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search24Regular className="absolute left-4 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={content.searchPlaceholder[lang]}
                className="w-full h-14 pl-12 pr-12 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#2BB5FF] focus:ring-4 focus:ring-[#2BB5FF]/15 text-sm font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all outline-hidden shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = (selectedCategory === cat.id) || (!selectedCategory && cat.id === 'all');
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id === 'all' ? null : cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Knowledge Base Articles List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
              {content.categoriesHeader[lang]}
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-medium">
              {filteredArticles.length} guides available
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
              <Search24Regular className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
              <p className="text-sm font-extrabold text-[var(--text-primary)]">No matching guides found</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Try searching for &quot;Stripe&quot;, &quot;booking link&quot;, &quot;deposits&quot;, or &quot;passkeys&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    setActiveArticle(art);
                    setFeedbackGiven(null);
                  }}
                  className="p-6 rounded-3xl bg-[var(--bg-secondary)]/70 border border-[var(--border-subtle)] hover:border-[#2BB5FF]/50 hover:bg-[var(--bg-secondary)] transition-all flex flex-col justify-between space-y-4 text-left cursor-pointer group shadow-xs hover:shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#2BB5FF]/15 text-[#0284C7] dark:text-[#2BB5FF] text-[10px] font-black uppercase tracking-wider">
                        {art.categoryName[lang]}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                        <Clock24Regular className="w-3 h-3" />
                        {art.readTime}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-[var(--text-primary)] group-hover:text-[#2BB5FF] transition-colors leading-snug">
                      {art.title[lang]}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {art.summary[lang]}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-black text-[#2BB5FF] pt-2 border-t border-[var(--border-subtle)]/70">
                    <span>Read Guide</span>
                    <ArrowRight24Filled className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto space-y-6 text-left">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)] text-center">
            {content.faqsHeader[lang]}
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-sm font-extrabold text-[var(--text-primary)]">
                      {faq.q[lang]}
                    </span>
                    <ChevronDown24Filled
                      className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-[#2BB5FF]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)]/60 pt-3"
                      >
                        {faq.a[lang]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Concierge Support CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#FFF0F5]/80 via-[#FDF2F8]/50 to-[#EFF6FF]/80 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-sky-950/20 border border-pink-100/80 dark:border-pink-900/30 text-center space-y-4 max-w-4xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#2BB5FF]/15 text-[#0284C7] dark:text-[#2BB5FF] flex items-center justify-center mx-auto">
            <ChatHelp24Regular className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
            {content.conciergeTitle[lang]}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            {content.conciergeSubtitle[lang]}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:support@getairbook.com"
              className="btn-primary h-12 px-6 rounded-2xl text-xs font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
            >
              <span>{content.contactSupportBtn[lang]}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/onboarding"
              className="h-12 px-6 rounded-2xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] inline-flex items-center justify-center w-full sm:w-auto transition-all bg-[var(--bg-primary)]/70"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </main>

      {/* ─── INTERACTIVE STEP-BY-STEP ARTICLE DRAWER MODAL ─── */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-[250] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal / Bottom Sheet Drawer Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full md:max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--bg-primary)] rounded-t-[32px] md:rounded-3xl border-t md:border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-8 space-y-6 z-10 text-left"
            >
              {/* Top Drag Handle for Mobile */}
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto md:hidden" />

              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2BB5FF]/15 text-[#0284C7] dark:text-[#2BB5FF] text-[10px] font-black uppercase tracking-wider">
                      {activeArticle.categoryName[lang]}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      {activeArticle.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                    {activeArticle.title[lang]}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer flex-shrink-0"
                  aria-label="Close Guide"
                >
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                {activeArticle.summary[lang]}
              </p>

              {/* Step by Step Walkthrough */}
              <div className="space-y-4 pt-1">
                {activeArticle.steps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2"
                  >
                    <h4 className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
                      {step.title[lang]}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {step.body[lang]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pro Tip Box */}
              {activeArticle.proTip && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 space-y-1 text-xs leading-relaxed">
                  <p className="font-extrabold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Sparkle24Regular className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{content.proTipLabel[lang]}</span>
                  </p>
                  <p>{activeArticle.proTip[lang]}</p>
                </div>
              )}

              {/* Live Action CTA */}
              {activeArticle.actionLink && (
                <div className="pt-2">
                  <Link
                    href={activeArticle.actionLink.href}
                    className="btn-primary w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-xs font-extrabold shadow-md"
                  >
                    <span>{activeArticle.actionLink.label[lang]}</span>
                    <Open24Filled className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Article Feedback Section */}
              <div className="border-t border-[var(--border-subtle)] pt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
                {feedbackGiven ? (
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckmarkCircle24Filled className="w-4 h-4" />
                    <span>{content.thankYouFeedback[lang]}</span>
                  </p>
                ) : (
                  <>
                    <span className="font-semibold">{content.wasHelpful[lang]}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFeedbackGiven('yes')}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[#2BB5FF]/15 hover:text-[#0284C7] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <ThumbLike24Regular className="w-3.5 h-3.5" />
                        <span>Yes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedbackGiven('no')}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-rose-500/15 hover:text-rose-600 font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <ThumbDislike24Regular className="w-3.5 h-3.5" />
                        <span>No</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MarketingFooter />
    </div>
  );
}
