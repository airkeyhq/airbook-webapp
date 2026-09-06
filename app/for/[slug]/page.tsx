'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getDemoSpecialists } from '@/lib/i18n/demographics';
import Logo from '@/components/Logo';
import {
  ArrowRight24Filled,
  Calendar24Filled,
  CheckmarkCircle24Filled,
  CheckmarkCircle24Regular,
  Clock24Regular,
  Globe24Regular,
  Heart24Regular,
  Payment24Regular,
  Person24Regular,
  ShieldCheckmark24Regular,
  Sparkle24Regular,
  Star24Regular,
  Tag24Regular,
  LockClosed24Regular,
} from '@fluentui/react-icons';

interface IndustryConfig {
  slug: string;
  badge: { en: string; es: string; de: string; fr: string };
  heroHeadline1: { en: string; es: string; de: string; fr: string };
  heroHeadline2: { en: string; es: string; de: string; fr: string };
  heroSubtitle: { en: string; es: string; de: string; fr: string };
  pillar1: { title: { en: string; es: string; de: string; fr: string }; desc: { en: string; es: string; de: string; fr: string } };
  pillar2: { title: { en: string; es: string; de: string; fr: string }; desc: { en: string; es: string; de: string; fr: string } };
  pillar3: { title: { en: string; es: string; de: string; fr: string }; desc: { en: string; es: string; de: string; fr: string } };
  simulator: {
    serviceName: string;
    servicePrice: number;
    serviceDuration: number;
    specialistName: string;
    specialistRole: string;
    avatar: string;
    stationTitle: string;
    stationDesc: string;
    specTitle: string;
    specLines: string[];
  };
  keyFeatures: { title: { en: string; es: string; de: string; fr: string }; desc: { en: string; es: string; de: string; fr: string } }[];
}

const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  salons: {
    slug: 'salons',
    badge: {
      en: 'AirBook for Hair Salons',
      es: 'AirBook para Salones de Peluquería',
      de: 'AirBook für Friseursalons',
      fr: 'AirBook pour Salons de Coiffure',
    },
    heroHeadline1: {
      en: 'Fill every chair.',
      es: 'Llena cada sillón.',
      de: 'Jeden Stuhl besetzen.',
      fr: 'Remplissez chaque fauteuil.',
    },
    heroHeadline2: {
      en: 'Protect color formulas & deposits.',
      es: 'Protege fórmulas de tinte y depósitos.',
      de: 'Farbrezepte & Anzahlungen sichern.',
      fr: 'Sécurisez vos formules & acomptes.',
    },
    heroSubtitle: {
      en: 'The modern salon booking platform built for independent hair stylists, colorists, and busy salon teams. Zero app downloads for clients.',
      es: 'La plataforma moderna de reservas diseñada para estilistas, coloristas y equipos de salón. Sin descargas de apps para tus clientes.',
      de: 'Die moderne Buchungsplattform für Friseure, Coloristen und Salonteams. Ohne App-Download für Ihre Kunden.',
      fr: 'La plateforme moderne conçue pour les coiffeurs, coloristes et équipes de salon. Aucune application à télécharger pour vos clients.',
    },
    pillar1: {
      title: { en: 'Color Processing Timers', es: 'Tiempos de Pausa de Color', de: 'Einwirkzeit-Puffer', fr: 'Temps de Pose Coloration' },
      desc: { en: 'Automatically schedule double-booking gaps during color processing.', es: 'Agenda huecos dobles automáticamente durante la exposición del tinte.', de: 'Lücken während der Einwirkzeit automatisch für weitere Kunden nutzen.', fr: 'Optimisez votre agenda pendant les temps de pose de coloration.' },
    },
    pillar2: {
      title: { en: 'Technical Formula History', es: 'Historial Técnico de Fórmulas', de: 'Rezeptur-Historie', fr: 'Historique des Formules' },
      desc: { en: 'Store exact shade mixes, developers, and processing times per client.', es: 'Guarda mezclas exactas de tonos, volúmenes y tiempos por cliente.', de: 'Mischverhältnisse, Entwickler und Einwirkzeiten pro Kunde speichern.', fr: 'Enregistrez les mélanges précis, oxydants et temps de pose par client.' },
    },
    pillar3: {
      title: { en: 'Chair Rental & Team Payouts', es: 'Renta de Sillas y Comisiones', de: 'Stuhlmiete & Abrechnungen', fr: 'Location de Fauteuil & Équipe' },
      desc: { en: 'Seamless booth rental splits and instant direct card payouts.', es: 'División automática de alquiler de sillón y transferencias instantáneas.', de: 'Automatische Aufteilung der Stuhlmiete und Sofortauszahlung.', fr: 'Répartition automatique des loyers de fauteuil et virements instantanés.' },
    },
    simulator: {
      serviceName: 'Balayage, Gloss & Blowout',
      servicePrice: 185,
      serviceDuration: 120,
      specialistName: 'Roxanne V.',
      specialistRole: 'Master Colorist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      stationTitle: 'STATION #1 (COLOR BAR)',
      stationDesc: 'Balayage Full + Toning Gloss · 120m',
      specTitle: 'Color Formulation Record #1042',
      specLines: ['Roots: 6N + 20vol (35m processing)', 'Gloss: 9GI + 9GB (15m tone)', 'Patch test signed & saved'],
    },
    keyFeatures: [
      { title: { en: 'Automated 24/7 Booking', es: 'Reservas Automáticas 24/7', de: 'Automatische 24/7 Buchung', fr: 'Réservations 24/7' }, desc: { en: 'Clients book from Instagram, TikTok, or your website without phone tags.', es: 'Los clientes reservan desde Instagram, TikTok o tu web sin llamadas.', de: 'Direkte Buchung über Social Media und Website ohne Rückrufe.', fr: 'Réservation directe depuis Instagram ou votre site sans appel.' } },
      { title: { en: '100% Upfront Deposit Lock', es: 'Depósitos 100% Asegurados', de: '100% Anzahlungsschutz', fr: 'Acomptes Sécurisés à 100%' }, desc: { en: 'Stripe card guarantees stop no-shows on high-ticket coloring sessions.', es: 'La garantía de tarjeta con Stripe elimina ausencias en servicios largos.', de: 'Kreditkarten-Sicherung verhindert Ausfälle bei aufwändigen Farbterminen.', fr: 'Stoppez les rendez-vous manqués sur les prestations longues.' } },
      { title: { en: 'Automated 3-Week SMS Retention', es: 'Retención SMS a 3 Semanas', de: '3-Wochen-SMS Wiederbuchung', fr: 'Relance SMS à 3 Semaines' }, desc: { en: 'Smart text triggers invite clients back when roots are due.', es: 'Avisos inteligentes que invitan al cliente a retocar raíces a tiempo.', de: 'Automatische Terminvorschläge für den nächsten Ansatztermin.', fr: 'Relances automatiques au moment idéal pour l’entretien des racines.' } },
      { title: { en: 'Fast Contactless POS', es: 'Cobros Tap to Pay Rápidos', de: 'Kontaktlose Kasse', fr: 'Encaissement Tap to Pay' }, desc: { en: 'Accept Apple Pay, Google Pay, and cards directly on your iPhone.', es: 'Acepta Apple Pay, Google Pay y tarjetas directamente en tu iPhone.', de: 'Apple Pay und Kartenzahlung direkt über das Smartphone abwickeln.', fr: 'Acceptez Apple Pay et cartes bancaires directement sur smartphone.' } },
    ],
  },
  barbers: {
    slug: 'barbers',
    badge: {
      en: 'AirBook for Barbershops',
      es: 'AirBook para Barberías',
      de: 'AirBook für Barbershops',
      fr: 'AirBook pour Barbiers',
    },
    heroHeadline1: {
      en: 'Faster chair turnover.',
      es: 'Mayor rotación en tus sillas.',
      de: 'Schnellere Stuhlbelegung.',
      fr: 'Rotation optimale au fauteuil.',
    },
    heroHeadline2: {
      en: 'Zero phone calls or no-shows.',
      es: 'Cero llamadas o ausencias.',
      de: 'Keine Anrufe oder Ausfälle.',
      fr: 'Zéro appel ni absence.',
    },
    heroSubtitle: {
      en: 'The ultimate barbershop booking app. Manage appointments, iPad walk-in kiosk queues, and fast Tap-to-Pay checkouts in one tap.',
      es: 'El software definitivo para barberías. Administra citas, lista de espera walk-in en iPad y cobros rápidos Tap to Pay en un toque.',
      de: 'Die ultimative Barbershop-Software für Termine, iPad-Walk-in-Warteschlangen und schnelles Kassieren.',
      fr: 'L’application idéale pour barbiers. Gérez vos rendez-vous, file d’attente sur iPad et encaissements rapides.',
    },
    pillar1: {
      title: { en: 'Walk-In Kiosk Queue', es: 'Kiosco Walk-In en iPad', de: 'Walk-In Kiosk-Modus', fr: 'Borne Sans Rendez-vous' },
      desc: { en: 'Let walk-ins join the digital waitlist with live SMS wait times.', es: 'Permite a clientes sin cita unirse a la cola con aviso de tiempo por SMS.', de: 'Kunden ohne Termin tragen sich digital ein und erhalten SMS-Updates.', fr: 'Permettez aux clients sans rendez-vous de rejoindre la file d’attente.' },
    },
    pillar2: {
      title: { en: 'Guard & Taper Specs', es: 'Fichas de Corte y Degradado', de: 'Schnitt- & Rasurnotizen', fr: 'Fiches de Coupe & Dégradé' },
      desc: { en: 'Save guard sizes, beard length, and neckline preferences per guest.', es: 'Guarda números de máquina, largo de barba y forma de cuello por cliente.', de: 'Aufsatzzahlen, Bartlängen und Kundenwünsche genau festhalten.', fr: 'Enregistrez les hauteurs de coupe, taille de barbe et finitions.' },
    },
    pillar3: {
      title: { en: 'Fast Tap-to-Pay Checkout', es: 'Cobros Rápidos Tap to Pay', de: 'Blitzschnelles Tap to Pay', fr: 'Paiement Sans Contact Immédiat' },
      desc: { en: 'Checkout clients in under 5 seconds with automatic tips.', es: 'Cobra en menos de 5 segundos con cálculo automático de propinas.', de: 'Bezahlung in unter 5 Sekunden mit automatischer Trinkgeld-Auswahl.', fr: 'Encaissez en moins de 5 secondes avec suggestions de pourboires.' },
    },
    simulator: {
      serviceName: 'Skin Fade + Hot Towel Beard',
      servicePrice: 55,
      serviceDuration: 45,
      specialistName: 'Alex R.',
      specialistRole: 'Master Barber',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      stationTitle: 'CHAIR #2 (FRONT WINDOW)',
      stationDesc: 'Skin Fade + Beard Lineup · 45m',
      specTitle: 'Client Guard Preferences #208',
      specLines: ['Sides: 0.5 to 1.5 taper fade', 'Beard: #2 guard with razor edge', 'Product: Matte clay paste'],
    },
    keyFeatures: [
      { title: { en: 'Self-Booking Link', es: 'Enlace de Autoreserva', de: 'Eigener Buchungslink', fr: 'Lien de Réservation Direct' }, desc: { en: 'Put your link on Instagram bio and Google Maps to capture appointments 24/7.', es: 'Pon tu enlace en Instagram y Google Maps para agendar clientes 24/7.', de: '24/7 Termine über Instagram und Google Maps generieren.', fr: 'Partagez votre lien sur Google et Instagram pour réserver 24h/24.' } },
      { title: { en: 'Automated 2-Week SMS Reminders', es: 'Recordatorios a 2 Semanas', de: '2-Wochen SMS-Erinnerung', fr: 'Rappels Automatiques 2 Semaines' }, desc: { en: 'Text clients before their fade loses shape to secure regular rebooking.', es: 'Envía un SMS antes de que el degradado pierda forma para asegurar la vuelta.', de: 'Kunden automatisch an den nächsten Frische-Schnitt erinnern.', fr: 'Rappelez à vos clients de rafraîchir leur dégradé au bon moment.' } },
      { title: { en: 'Booth Rent Tracking', es: 'Control de Renta de Sillón', de: 'Stuhlmieten-Übersicht', fr: 'Gestion des Fauteuils' }, desc: { en: 'Track weekly booth rent collected from every barber in the shop.', es: 'Controla el cobro semanal de renta de sillón de cada barbero.', de: 'Wöchentliche Stuhlmieten für jeden Barber im Shop im Überblick.', fr: 'Suivi transparent des loyers hebdomadaires par barbier.' } },
      { title: { en: 'Instant Card Payouts', es: 'Abonos Diarios a tu Tarjeta', de: 'Tägliche Direktausrechnung', fr: 'Versements Immédiats' }, desc: { en: 'Receive daily earnings directly onto your debit card with Stripe.', es: 'Recibe tus ingresos diarios directamente en tu tarjeta con Stripe.', de: 'Einnahmen täglich direkt auf die Debitkarte erhalten.', fr: 'Recevez vos gains directement sur votre carte bancaire chaque jour.' } },
    ],
  },
  spas: {
    slug: 'spas',
    badge: {
      en: 'AirBook for Day Spas & Wellness',
      es: 'AirBook para Spas y Bienestar',
      de: 'AirBook für Spas & Wellness',
      fr: 'AirBook pour Spas & Bien-Être',
    },
    heroHeadline1: {
      en: 'Serene appointments.',
      es: 'Citas en total armonía.',
      de: 'Entspannte Buchungen.',
      fr: 'Des rendez-vous en toute sérénité.',
    },
    heroHeadline2: {
      en: 'Zero front-desk friction.',
      es: 'Cero fricciones en recepción.',
      de: 'Ohne Hektik am Empfang.',
      fr: 'Zéro stress à l’accueil.',
    },
    heroSubtitle: {
      en: 'Elevate your day spa with digital health intake waivers, automated treatment room buffers, and upfront deposits.',
      es: 'Eleva tu spa con fichas de salud digitales, tiempos de pausa automáticos entre cabinas y depósitos seguros.',
      de: 'Verwalten Sie Ihr Spa mit digitalen Gesundheitsbögen, automatischen Kabinenpuffern und sicheren Anzahlungen.',
      fr: 'Sublimez votre spa avec fiches santé numériques, temps de pause entre cabines et acomptes sécurisés.',
    },
    pillar1: {
      title: { en: 'Treatment Room Buffers', es: 'Pausas entre Cabinas', de: 'Kabinen-Pufferzeiten', fr: 'Temps de Pause Cabines' },
      desc: { en: 'Automatic 15-minute turnover windows for linen resets and sanitizing.', es: 'Ventanas automáticas de 15 minutos para cambio de sábanas y desinfección.', de: 'Automatische 15-Minuten-Puffer für Reinigung und Vorbereitung.', fr: 'Créneaux automatiques de 15 min pour nettoyage et préparation.' },
    },
    pillar2: {
      title: { en: 'Digital Health Waivers', es: 'Consentimientos Digitales', de: 'Digitale Gesundheitsbögen', fr: 'Décharges Médicales Numériques' },
      desc: { en: 'Paperless intake forms with digital signatures completed on mobile.', es: 'Formularios sin papel firmados directamente en el móvil del cliente.', de: 'Papierlose Fragebögen mit digitaler Unterschrift vor der Behandlung.', fr: 'Formulaires dématérialisés avec signature sur smartphone.' },
    },
    pillar3: {
      title: { en: 'Wellness Packages & Passes', es: 'Paquetes y Pases de Spa', de: 'Wellness-Pakete & Abos', fr: 'Forfaits & Abonnements' },
      desc: { en: 'Sell and track multi-session treatment packages effortlessly.', es: 'Vende y administra paquetes multisesión de masajes y tratamientos faciales.', de: 'Mehrfachkarten und Behandlungspakete unkompliziert verwalten.', fr: 'Vendez et suivez facilement vos forfaits de soins récurrents.' },
    },
    simulator: {
      serviceName: 'Deep Tissue Massage + Aromatherapy',
      servicePrice: 145,
      serviceDuration: 75,
      specialistName: 'Elena P.',
      specialistRole: 'Licensed Massage Therapist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      stationTitle: 'ROOM #3 (ZEN SUITE)',
      stationDesc: 'Deep Tissue (75m) + 15m Buffer',
      specTitle: 'Guest Health & Intake Profile #904',
      specLines: ['Pressure preference: Firm / Deep', 'Aromatherapy: Lavender & Eucalyptus', 'Waiver signed via digital link'],
    },
    keyFeatures: [
      { title: { en: 'Simultaneous Multi-Guest Booking', es: 'Reservas Grupales Simultáneas', de: 'Gruppen- & Paar-Buchung', fr: 'Réservations de Groupe & Duo' }, desc: { en: 'Allow couples and groups to book adjacent rooms at the same time.', es: 'Permite a parejas y grupos reservar cabinas simultáneas con facilidad.', de: 'Paare und Gruppen können zeitgleiche Termine buchen.', fr: 'Permettez aux couples et groupes de réserver simultanément.' } },
      { title: { en: 'Deposit Protection', es: 'Depósitos Protegidos', de: 'Anzahlungsschutz', fr: 'Protection des Acomptes' }, desc: { en: 'Eliminate weekend no-shows with card pre-authorizations.', es: 'Elimina las cancelaciones de última hora con tarjeta en garantía.', de: 'Verhindern Sie Terminausfälle am Wochenende durch Anzahlungen.', fr: 'Évitez les absences de dernière minute grâce aux acomptes.' } },
      { title: { en: 'Automated Review Collection', es: 'Captura de Reseñas en Google', de: 'Google-Bewertungsanfragen', fr: 'Collecte d’Avis Google' }, desc: { en: 'Send a warm follow-up SMS post-session to build 5-star Google ratings.', es: 'Envía un SMS automático tras la sesión para sumar reseñas 5 estrellas.', de: 'Automatische SMS nach dem Termin für 5-Sterne-Bewertungen.', fr: 'Envoi d’un SMS après le soin pour recueillir des avis 5 étoiles.' } },
      { title: { en: 'Multi-Room Resource Sync', es: 'Sincronización de Cabinas', de: 'Ressourcen- & Raumplan', fr: 'Gestion Multi-Cabines' }, desc: { en: 'Prevent double-booking specialized equipment and private suites.', es: 'Evita conflictos de horarios en equipos y cabinas privadas.', de: 'Keine Doppelbelegung von Räumen und Spezialgeräten.', fr: 'Évitez tout conflit de créneaux sur vos salles et appareils.' } },
    ],
  },
  nails: {
    slug: 'nails',
    badge: {
      en: 'AirBook for Nail & Lash Studios',
      es: 'AirBook para Estudios de Uñas y Pestañas',
      de: 'AirBook für Nagel- & Wimpernstudios',
      fr: 'AirBook pour Bars à Ongles & Cils',
    },
    heroHeadline1: {
      en: 'Book custom nail sets.',
      es: 'Agenda sets de uñas personalizados.',
      de: 'Individuelle Nagelsets buchen.',
      fr: 'Réservez vos poses & nail art.',
    },
    heroHeadline2: {
      en: 'Add-ons and deposits on autopilot.',
      es: 'Adicionales y depósitos en automático.',
      de: 'Zusatzleistungen & Anzahlungen.',
      fr: 'Suppléments & acomptes simplifiés.',
    },
    heroSubtitle: {
      en: 'The purpose-built booking software for nail technicians, lash artists, and brow specialists. Capture deposits on high-ticket custom art.',
      es: 'El software de reservas diseñado para manicuristas, lashistas y especialistas de cejas. Asegura depósitos en sets personalizados.',
      de: 'Die perfekte Buchungssoftware für Nail-Artists, Wimpern- und Brauen-Profis mit Anzahlungsschutz.',
      fr: 'Le logiciel de réservation pensé pour prothésistes ongulaires et artistes du regard. Acomptes sur poses sur mesure.',
    },
    pillar1: {
      title: { en: 'Multi-Service Add-Ons', es: 'Adicionales Dinámicos', de: 'Flexible Zusatzleistungen', fr: 'Suppléments Personnalisés' },
      desc: { en: 'Clients easily add nail art tiers, gel removal, and length extensions.', es: 'Tus clientes eligen niveles de nail art, retiro de acrílico y largo deseado.', de: 'Kunden wählen Nail Art Tiers, Gel-Entfernung und Verlängerungen.', fr: 'Choix simple des niveaux de nail art, déposes et extensions.' },
    },
    pillar2: {
      title: { en: 'Art Deposit Lock', es: 'Depósito para Sets de Arte', de: 'Anzahlungen für Nail Art', fr: 'Acompte Sécurisé Nail Art' },
      desc: { en: 'Hold deposits automatically so you never get ghosted on 2-hour slots.', es: 'Asegura tu tiempo en turnos de 2 horas con depósitos por tarjeta.', de: '2-Stunden-Termine durch automatische Anzahlungen absichern.', fr: 'Sécurisez vos créneaux de 2h grâce aux acomptes automatiques.' },
    },
    pillar3: {
      title: { en: 'Inspiration Photo Uploads', es: 'Subida de Fotos de Inspiración', de: 'Inspirationsfotos hochladen', fr: 'Envoi de Photos d’Inspiration' },
      desc: { en: 'Guests attach reference photos during booking so you can prep ahead.', es: 'Las clientas suben fotos de referencia al agendar para preparar el material.', de: 'Kunden laden Referenzbilder direkt bei der Terminbuchung hoch.', fr: 'Les clientes joignent leurs modèles lors de la réservation en ligne.' },
    },
    simulator: {
      serviceName: 'Apres Gel-X + Tier 3 Custom Art',
      servicePrice: 110,
      serviceDuration: 90,
      specialistName: 'Chloe M.',
      specialistRole: 'Nail Artist & Educator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      stationTitle: 'MANICURE TABLE #4',
      stationDesc: 'Gel-X Extension + 3D Chrome Art · 90m',
      specTitle: 'Client Sizing & Preferences #512',
      specLines: ['Tips: Medium Almond (Sizes 1, 5, 4, 6, 8)', 'Cuticle care: Dry Russian prep', 'Inspo photo attached to appointment'],
    },
    keyFeatures: [
      { title: { en: '24/7 Instagram Booking', es: 'Reservas desde Instagram 24/7', de: 'Instagram-Buchung 24/7', fr: 'Réservations Instagram 24/7' }, desc: { en: 'Convert followers into paying appointments directly from your DMs & bio.', es: 'Convierte seguidoras en citas confirmadas desde tu biografía.', de: 'Follower direkt aus der Bio in zahlende Kunden umwandeln.', fr: 'Transformez vos abonnées en clientes directement depuis votre bio.' } },
      { title: { en: 'Automated Fill-in Reminders', es: 'Recordatorios de Retoque', de: 'Erinnerung zum Nachfüllen', fr: 'Rappels de Remplissage' }, desc: { en: 'Smart 3-week text messages invite clients to schedule their refill.', es: 'Mensajes a las 3 semanas para agendar el mantenimiento a tiempo.', de: 'Automatische SMS nach 3 Wochen für den nächsten Auffülltermin.', fr: 'Relances automatiques à 3 semaines pour planifier le remplissage.' } },
      { title: { en: 'Contactless Tap to Pay', es: 'Cobros Tap to Pay', de: 'Kontaktlos kassieren', fr: 'Paiement Tap to Pay' }, desc: { en: 'Fast iPhone checkouts with tipping prompts for 15%, 20%, or 25%.', es: 'Cobro rápido en iPhone con sugerencias de propinas.', de: 'Schnelle Bezahlung mit Trinkgeld-Vorschlägen auf dem iPhone.', fr: 'Encaissement rapide sur smartphone avec pourboires suggérés.' } },
      { title: { en: 'Group Booking & Bridal Sets', es: 'Citas Grupales y Novias', de: 'Gruppen- & Braut-Termine', fr: 'Prestations de Groupe & Mariage' }, desc: { en: 'Coordinate multi-person appointments for bridal parties with ease.', es: 'Coordina citas para grupos y novias sin complicaciones.', de: 'Mehre Personen für Hochzeiten und Events zeitgleich einbuchen.', fr: 'Organisez les rendez-vous pour groupes et mariages facilement.' } },
    ],
  },
  tattoo: {
    slug: 'tattoo',
    badge: {
      en: 'AirBook for Tattoo & Body Art Studios',
      es: 'AirBook para Estudios de Tatuajes',
      de: 'AirBook für Tattoo & Body Art Studios',
      fr: 'AirBook pour Tatoueurs & Studios de Tatouage',
    },
    heroHeadline1: {
      en: 'Multi-hour session booking.',
      es: 'Gestión de sesiones de varias horas.',
      de: 'Mehrmonatige Terminsitzungen.',
      fr: 'Gestion des séances longues.',
    },
    heroHeadline2: {
      en: 'Custom waivers and consultation deposits.',
      es: 'Consentimientos digitales y depósitos.',
      de: 'Digitale Einverständnisse & Anzahlungen.',
      fr: 'Décharges numériques et acomptes.',
    },
    heroSubtitle: {
      en: 'Designed for independent tattoo artists, piercers, and private studio collectives. Automate consultation deposits and digital consent forms.',
      es: 'Diseñado para tatuadores independientes, piercers y estudios privados. Automatiza depósitos de consulta y consentimientos digitales.',
      de: 'Für Tattoo-Artists, Piercer und Studios. Automatische Anzahlungen und digitale Einverständniserklärungen.',
      fr: 'Conçu pour tatoueurs et perceurs indépendants. Automatisez vos acomptes de consultation et décharges numériques.',
    },
    pillar1: {
      title: { en: 'Consultation & Day Rates', es: 'Consultas y Tarifas por Día', de: 'Beratung & Tagessätze', fr: 'Consultations & Tarifs Journée' },
      desc: { en: 'Schedule 30-min consultations or full day multi-hour blocks seamlessly.', es: 'Agenda consultas de 30 min o bloques completos de día entero con facilidad.', de: '30-Minuten-Beratungen oder ganztägige Sitzungen buchen.', fr: 'Planifiez des consultations ou des journées complètes sans effort.' },
    },
    pillar2: {
      title: { en: 'Digital Consent Waivers', es: 'Consentimientos Digitales con Firma', de: 'Digitale Einverständniserklärungen', fr: 'Décharges Numériques avec Signature' },
      desc: { en: 'ID verification, health questionnaires, and signatures signed on phone.', es: 'Verificación de documento, cuestionario de salud y firma digital en móvil.', de: 'Ausweis-Check, Gesundheitsfragen und Unterschrift auf dem Smartphone.', fr: 'Vérification d’identité, bilan de santé et signature sur mobile.' },
    },
    pillar3: {
      title: { en: 'Non-Refundable Deposit Lock', es: 'Depósitos No Reembolsables', de: 'Fester Anzahlungsschutz', fr: 'Acomptes Non Remboursables' },
      desc: { en: 'Eliminate session cancellations with automated card deposit charges.', es: 'Elimina cancelaciones de última hora cobrando el depósito al agendar.', de: 'Ausfälle bei langen Sitzungen durch automatische Anzahlungen stoppen.', fr: 'Sécurisez vos séances longues avec un acompte prélevé à la réservation.' },
    },
    simulator: {
      serviceName: 'Full Day Custom Piece (6 Hours)',
      servicePrice: 750,
      serviceDuration: 360,
      specialistName: 'Marcus K.',
      specialistRole: 'Resident Tattoo Artist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      stationTitle: 'STATION #2 (PRIVATE SUITE)',
      stationDesc: 'Full Day Black & Grey Session · 6h',
      specTitle: 'Client Project Spec & Waiver #774',
      specLines: ['Placement: Left forearm / sleeve start', 'Health check: No blood thinners confirmed', 'Waiver & photo ID verified'],
    },
    keyFeatures: [
      { title: { en: 'Project Reference Uploads', es: 'Subida de Referencias de Diseño', de: 'Referenzbilder hochladen', fr: 'Envoi des Références de Projet' }, desc: { en: 'Clients send placement ideas and reference images during booking.', es: 'Los clientes envían fotos de la zona e ideas de diseño al reservar.', de: 'Kunden laden Entwürfe und Körperstellen direkt hoch.', fr: 'Les clients transmettent leurs idées et emplacements souhaités.' } },
      { title: { en: 'Automated Aftercare SMS', es: 'Instrucciones de Cuidado por SMS', de: 'Pflegehinweise per SMS', fr: 'Conseils de Soin par SMS' }, desc: { en: 'Send post-session healing guidelines and touch-up prompts automatically.', es: 'Envía instrucciones de curación y recordatorios de retoque por SMS.', de: 'Automatische Pflegeanleitung und Nachstech-Erinnerung per SMS.', fr: 'Envoi automatique des conseils de cicatrisation et de retouche.' } },
      { title: { en: 'Studio Commission Splits', es: 'Comisiones de Estudio y Artistas', de: 'Studio- & Artist-Splits', fr: 'Partage des Commissions Studio' }, desc: { en: 'Split earnings between shop owner and guest artists transparently.', es: 'Divide ingresos entre el estudio y los artistas invitados con claridad.', de: 'Transparente Abrechnung zwischen Studio und Gastkünstlern.', fr: 'Gestion claire des commissions entre le studio et les artistes.' } },
      { title: { en: 'Daily Stripe Payouts', es: 'Abonos Diarios a tu Cuenta', de: 'Tägliche Auszahlung', fr: 'Virements Quotidiens' }, desc: { en: 'Keep cash flow moving with instant daily transfers to your bank card.', es: 'Mantén tu flujo de dinero con transferencias diarias a tu tarjeta.', de: 'Direkte tägliche Überweisung auf das Bankkonto.', fr: 'Vos fonds sont versés quotidiennement sur votre compte bancaire.' } },
    ],
  },
  massage: {
    slug: 'massage',
    badge: {
      en: 'AirBook for Massage Therapists',
      es: 'AirBook para Terapeutas de Masaje',
      de: 'AirBook für Masseure & Körpertherapeuten',
      fr: 'AirBook pour Massothérapeutes',
    },
    heroHeadline1: {
      en: 'Fill your therapy schedule.',
      es: 'Llena tu agenda de masajes.',
      de: 'Massagepraxis voll auslasten.',
      fr: 'Remplissez votre planning de soins.',
    },
    heroHeadline2: {
      en: 'Rest between sessions with auto-buffers.',
      es: 'Descansa entre sesiones con pausas automáticas.',
      de: 'Erholungszeiten mit Auto-Puffern.',
      fr: 'Préservez votre énergie avec des pauses automatiques.',
    },
    heroSubtitle: {
      en: 'Built for independent massage therapists and bodywork clinics. Streamline health intake notes, protect deposits, and automate recurring clients.',
      es: 'Creado para masoterapeutas independientes y clínicas corporales. Digitaliza fichas de salud, asegura depósitos y automatiza clientes frecuentes.',
      de: 'Für selbstständige Masseure und Praxen. Digitale Anamnesebögen, Anzahlungen und automatische Wiederbuchung.',
      fr: 'Conçu pour massothérapeutes indépendants et cabinets. Fiches bilan santé, acomptes et fidélisation simplifiée.',
    },
    pillar1: {
      title: { en: 'Automatic Recovery Buffers', es: 'Pausas de Descanso Automáticas', de: 'Automatische Erholungspausen', fr: 'Pauses Automatiques de Récupération' },
      desc: { en: 'Add 15 to 30 min buffer times between clients for sanitization and rest.', es: 'Añade pausas de 15 a 30 min entre sesiones para sanitizar y descansar.', de: '15 bis 30 Minuten Pufferzeit für Desinfektion und Erholung einplanen.', fr: '15 à 30 min de battement pour aérer, désinfecter et vous reposer.' },
    },
    pillar2: {
      title: { en: 'Digital SOAP Health Notes', es: 'Fichas de Salud y Preferencias', de: 'Digitale Behandlungsprotokolle', fr: 'Fiches Santé & Suivi des Tensions' },
      desc: { en: 'Log pressure preferences, trigger points, and contraindications securely.', es: 'Registra puntos de dolor, nivel de presión y contraindicaciones de forma segura.', de: 'Druckstärken, Schmerzpunkte und Besonderheiten sicher erfassen.', fr: 'Notez le niveau de pression, zones de tension et antécédents.' },
    },
    pillar3: {
      title: { en: 'Multi-Session Wellness Packages', es: 'Paquetes de Sesiones Recurrentes', de: 'Mehrfachkarten & Pakete', fr: 'Forfaits Multi-Séances' },
      desc: { en: 'Sell and track 5-pack or 10-pack prepaid massage credits seamlessly.', es: 'Vende y administra bonos de 5 o 10 sesiones prepagadas fácilmente.', de: '5er- und 10er-Karten unkompliziert verkaufen und einlösen.', fr: 'Vendez et suivez facilement des carnets de 5 ou 10 séances.' },
    },
    simulator: {
      serviceName: '60-Min Therapeutic Deep Tissue',
      servicePrice: 110,
      serviceDuration: 60,
      specialistName: 'David S.',
      specialistRole: 'Licensed Bodywork Therapist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      stationTitle: 'TREATMENT ROOM #1',
      stationDesc: 'Deep Tissue (60m) + 15m Buffer',
      specTitle: 'Client Therapy Record #410',
      specLines: ['Focus area: Upper shoulders & lumbar', 'Pressure level: Firm (7/10)', 'Digital health consent verified'],
    },
    keyFeatures: [
      { title: { en: 'Mobile Booking Link', es: 'Enlace de Reserva Móvil', de: 'Mobiler Buchungslink', fr: 'Lien de Réservation Mobile' }, desc: { en: 'Add your link to Google Business, WhatsApp, or Instagram bio.', es: 'Pon tu enlace en Google Maps, WhatsApp o Instagram para agendar sin llamadas.', de: 'Link in Google Business und WhatsApp teilen für direkte Buchungen.', fr: 'Partagez votre lien sur Google Maps et WhatsApp pour réserver 24/7.' } },
      { title: { en: 'Deposit Protection', es: 'Depósitos Seguros con Stripe', de: 'Anzahlungen via Stripe', fr: 'Acomptes Sécurisés Stripe' }, desc: { en: 'Stripe card guarantees protect your schedule against last-minute cancellations.', es: 'Asegura tus ingresos contra cancelaciones de última hora con tarjeta.', de: 'Kreditkarten-Garantie gegen kurzfristige Absagen.', fr: 'Sécurisez vos revenus contre les annulations de dernière minute.' } },
      { title: { en: 'Automated 4-Week Rebooking', es: 'Reagendamiento a 4 Semanas', de: '4-Wochen-Erinnerung', fr: 'Relance Automatique 4 Semaines' }, desc: { en: 'Gentle SMS reminders keep your regular clients on a monthly cadence.', es: 'Avisos amables por SMS para que tus clientes mantengan su sesión mensual.', de: 'Freundliche SMS-Erinnerung für regelmäßige monatliche Behandlungen.', fr: 'Rappels SMS bienveillants pour fidéliser vos clients chaque mois.' } },
      { title: { en: 'Instant Daily Payouts', es: 'Abonos Inmediatos a tu Tarjeta', de: 'Tägliche Auszahlung', fr: 'Paiements Instantanés' }, desc: { en: 'Get paid instantly to your debit card after completing each session.', es: 'Recibe tus ingresos en tu tarjeta al terminar cada sesión de masaje.', de: 'Geldeingang direkt nach der Behandlung auf der Karte.', fr: 'Recevez votre rémunération sur votre carte dès la séance terminée.' } },
    ],
  },
  'pet-groomers': {
    slug: 'pet-groomers',
    badge: {
      en: 'AirBook for Pet Grooming Salons',
      es: 'AirBook para Peluquerías Caninas',
      de: 'AirBook für Hundesalons & Tierpflege',
      fr: 'AirBook pour Salons de Toilettage',
    },
    heroHeadline1: {
      en: 'Hassle-free pet appointments.',
      es: 'Citas de peluquería canina sin líos.',
      de: 'Entspannte Termine für Hund & Katze.',
      fr: 'Le toilettage sans stress.',
    },
    heroHeadline2: {
      en: 'Breed tiers and pickup SMS on autopilot.',
      es: 'Tarifas por raza y avisos de recogida por SMS.',
      de: 'Preise nach Rasse & SMS bei Abholung.',
      fr: 'Tarifs selon la race et SMS de fin de soin.',
    },
    heroSubtitle: {
      en: 'The purpose-built booking software for pet groomers and dog spas. Manage breed weight tiers, vaccine records, and automated "Pet is ready" SMS.',
      es: 'El software de reservas diseñado para peluqueros de mascotas. Administra tarifas por tamaño, vacunas y avisos automáticos de recogida.',
      de: 'Die Buchungssoftware für Hundesalons mit Gewichtsklassen, Impfpass-Check und automatischer Abhol-SMS.',
      fr: 'La solution de réservation pensée pour toiletteurs. Gérez les tarifs par gabarit, vaccins et SMS « Votre animal est prêt ».',
    },
    pillar1: {
      title: { en: 'Breed & Weight Service Tiers', es: 'Tarifas por Raza y Peso', de: 'Preise nach Rasse & Gewicht', fr: 'Tarification par Race & Gabarit' },
      desc: { en: 'Set pricing and duration by dog size (Toy, Medium, Large, Giant).', es: 'Configura precios y tiempos según el tamaño del perro (Pequeño, Mediano, Grande).', de: 'Preise und Dauer nach Hundegröße (Klein, Mittel, Groß) anpassen.', fr: 'Ajustez prix et durée selon la taille (Petit, Moyen, Grand).' },
    },
    pillar2: {
      title: { en: 'Automated "Ready for Pickup" SMS', es: 'Aviso SMS "Listo para Recoger"', de: 'Automatische Abhol-SMS', fr: 'SMS Automatique de Récupération' },
      desc: { en: 'Click one button when the groom is done to notify pet parents instantly.', es: 'Presiona un botón al terminar para avisar al dueño al instante por SMS.', de: 'Mit einem Klick den Tierhalter per SMS benachrichtigen.', fr: 'Prévenez les propriétaires en un clic dès que le soin est terminé.' },
    },
    pillar3: {
      title: { en: 'Rabies & Vaccine Tracker', es: 'Registro de Vacunas y Rabia', de: 'Impfpass- & Tollwut-Check', fr: 'Suivi des Vaccins & Carnet' },
      desc: { en: 'Clients upload vaccination certificates before booking is approved.', es: 'Los dueños adjuntan el certificado de vacunación al solicitar cita.', de: 'Kunden laden den Impfpass direkt bei der Buchung hoch.', fr: 'Les propriétaires transmettent les attestations de vaccination en ligne.' },
    },
    simulator: {
      serviceName: 'Full Groom + De-shedding (Medium Dog)',
      servicePrice: 85,
      serviceDuration: 75,
      specialistName: 'Jessica T.',
      specialistRole: 'Certified Master Groomer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      stationTitle: 'GROOMING TUB #2',
      stationDesc: 'Golden Doodle (38 lbs) · Full Groom',
      specTitle: 'Pet Behavior & Coat Profile #320',
      specLines: ['Pet: Milo (Golden Doodle · 38 lbs)', 'Coat: Teddy bear head, #4 body clip', 'Rabies vaccine valid through 2027'],
    },
    keyFeatures: [
      { title: { en: '24/7 Online Pet Booking', es: 'Reservas Online 24/7', de: 'Online-Buchung 24/7', fr: 'Réservations en Ligne 24/7' }, desc: { en: 'Pet parents select their breed, size, and add-ons anytime.', es: 'Los dueños eligen la raza, tamaño y extras en cualquier momento.', de: 'Hundebesitzer wählen Rasse, Größe und Extras rund um die Uhr.', fr: 'Les maîtres sélectionnent race, taille et options en toute autonomie.' } },
      { title: { en: 'Deposit Protection', es: 'Depósitos Seguros', de: 'Anzahlungen sichern', fr: 'Acomptes Sécurisés' }, desc: { en: 'Stop costly weekend appointment ghosting with upfront card locks.', es: 'Evita ausencias en fines de semana cobrando un depósito con tarjeta.', de: 'Keine unangekündigten Ausfälle am Samstag dank Anzahlung.', fr: 'Évitez les rendez-vous non honorés grâce aux acomptes bancaires.' } },
      { title: { en: 'Automated 6-Week Rebooking', es: 'Avisos de Mantenimiento a 6 Semanas', de: '6-Wochen Pflege-Erinnerung', fr: 'Relances d’Entretien à 6 Semaines' }, desc: { en: 'Keep coats mat-free with scheduled maintenance reminder texts.', es: 'Envía recordatorios por SMS para mantener el pelaje sin nudos.', de: 'Automatische SMS für den nächsten regelmäßigen Pflegetermin.', fr: 'SMS automatiques pour planifier le prochain toilettage d’entretien.' } },
      { title: { en: 'Tap-to-Pay POS', es: 'Cobros Rápidos en Recepción', de: 'Kontaktlos kassieren', fr: 'Caisse Rapide Tap to Pay' }, desc: { en: 'Fast contactless checkout with simple tip suggestions.', es: 'Cobro rápido sin contacto con sugerencias de propinas en pantalla.', de: 'Schnelle Kartenzahlung mit Trinkgeld-Option auf dem Smartphone.', fr: 'Encaissement sans contact ultra rapide avec pourboires au choix.' } },
    ],
  },
  trainers: {
    slug: 'trainers',
    badge: {
      en: 'AirBook for Personal Trainers & Fitness',
      es: 'AirBook para Entrenadores Personales',
      de: 'AirBook für Personal Trainer & Fitness',
      fr: 'AirBook pour Coachs Sportifs & Fitness',
    },
    heroHeadline1: {
      en: 'Fill every training slot.',
      es: 'Llena tus horas de entrenamiento.',
      de: 'Trainingsstunden optimal auslasten.',
      fr: 'Remplissez vos créneaux de coaching.',
    },
    heroHeadline2: {
      en: 'Session punch cards & strict cancellation rules.',
      es: 'Bonos de sesiones y políticas de cancelación claras.',
      de: '10er-Karten & feste Stornofristen.',
      fr: 'Forfaits de séances et règles d’annulation fermes.',
    },
    heroSubtitle: {
      en: 'The all-in-one booking platform for private trainers, strength coaches, and boutique fitness studios. Enforce 24h cancellation rules and track session credits.',
      es: 'La plataforma todo en uno para entrenadores personales y estudios fitness. Aplica políticas de cancelación de 24h y gestiona bonos de sesiones.',
      de: 'Die Buchungssoftware für Personal Trainer und Studios. 24h-Stornoregeln durchsetzen und Trainingsguthaben verwalten.',
      fr: 'La plateforme complète pour coachs personnels et studios de fitness. Gestion des forfaits de séances et respect des préavis d’annulation.',
    },
    pillar1: {
      title: { en: 'Session Credit Punch Cards', es: 'Bonos de Sesiones de Entrenamiento', de: '10er-Karten Guthabenverwaltung', fr: 'Carnets & Forfaits de Séances' },
      desc: { en: 'Sell 10-session packs that deduct automatically when clients book.', es: 'Vende paquetes de 10 sesiones que se descuentan solos al agendar.', de: '10er-Pakete verkaufen, die bei Terminbuchung automatisch abbuchen.', fr: 'Vendez des packs de 10 séances décomptés automatiquement.' },
    },
    pillar2: {
      title: { en: '24h Cancellation Enforcement', es: 'Política de Cancelación de 24h', de: '24h-Stornofrist durchsetzen', fr: 'Respect du Préavis de 24h' },
      desc: { en: 'Protect your time with automatic cutoff rules and fee enforcement.', es: 'Protege tu tiempo con cobro automático si cancelan con menos de 24h.', de: 'Ausfälle verhindern durch automatisches Einbehalten der Stunde.', fr: 'Sécurisez vos créneaux grâce au décompte en cas d’annulation tardive.' },
    },
    pillar3: {
      title: { en: 'Client Goal & PR Tracking', es: 'Seguimiento de Metas y Marcas', de: 'Trainingsziele & Bestleistungen', fr: 'Suivi des Objectifs & Performances' },
      desc: { en: 'Log weight benchmarks, PRs, and notes directly on each client profile.', es: 'Guarda marcas personales, pesos y notas en el perfil de cada alumno.', de: 'Bestleistungen, Gewicht und Notizen pro Kunde festhalten.', fr: 'Enregistrez records, charges et observations sur chaque fiche client.' },
    },
    simulator: {
      serviceName: '1-on-1 Strength & Conditioning Session',
      servicePrice: 90,
      serviceDuration: 60,
      specialistName: 'Jordan M.',
      specialistRole: 'CSCS Strength Coach',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      stationTitle: 'TRAINING BAY #1',
      stationDesc: '1-on-1 Session (60m) · Active Pass',
      specTitle: 'Client Training Pass #5012',
      specLines: ['Client: Sarah K. (8/10 sessions remaining)', 'Focus: Lower body squat & hip hinge', '24h cancellation policy active'],
    },
    keyFeatures: [
      { title: { en: 'Self-Booking Link', es: 'Enlace Directo de Reserva', de: 'Direkter Buchungslink', fr: 'Lien de Réservation Direct' }, desc: { en: 'Clients reserve their weekly slots from your custom link without texting back and forth.', es: 'Tus alumnos reservan sus horas desde tu enlace sin cruzar mensajes.', de: 'Kunden buchen ihre Wochenstunden direkt ohne langes Hin- und Herschreiben.', fr: 'Vos clients réservent leurs créneaux en direct sans échange de SMS.' } },
      { title: { en: 'Automatic SMS Reminders', es: 'Recordatorios por SMS', de: 'SMS-Erinnerungen', fr: 'Rappels Automatiques par SMS' }, desc: { en: 'Keep clients accountable with automated session alerts 24h before training.', es: 'Mantén el compromiso enviando alertas por SMS 24h antes de entrenar.', de: 'Automatische SMS 24h vor dem Training für maximale Zuverlässigkeit.', fr: 'Envoyez un rappel automatique 24h avant chaque séance d’entraînement.' } },
      { title: { en: 'Instant Card Deposits', es: 'Depósitos con Tarjeta Stripe', de: 'Sofortige Kartenzahlungen', fr: 'Encaissement par Carte Immédiat' }, desc: { en: 'Direct daily deposits straight to your debit card with zero friction.', es: 'Abonos directos diarios a tu tarjeta sin esperas.', de: 'Tägliche Direktausrechnung der Einnahmen auf die Debitkarte.', fr: 'Versement quotidien de vos revenus directement sur votre carte.' } },
      { title: { en: 'Waitlist Automation', es: 'Lista de Espera Automática', de: 'Automatische Warteliste', fr: 'Gestion de Liste d’Attente' }, desc: { en: 'If someone cancels, their slot is immediately offered to waitlisted clients.', es: 'Si alguien cancela, el hueco se ofrece solo al siguiente en lista de espera.', de: 'Wird ein Platz frei, wird er automatisch an die Warteliste vergeben.', fr: 'Si un créneau se libère, il est proposé automatiquement aux personnes en attente.' } },
    ],
  },
};

// Aliases for the remaining footer links
INDUSTRY_CONFIGS['colorists'] = {
  ...INDUSTRY_CONFIGS['salons'],
  slug: 'colorists',
  badge: {
    en: 'AirBook for Hair Colorists & Balayage Specialists',
    es: 'AirBook para Coloristas y Especialistas en Balayage',
    de: 'AirBook für Coloristen & Balayage-Spezialisten',
    fr: 'AirBook pour Coloristes & Spécialistes Balayage',
  },
};

INDUSTRY_CONFIGS['estheticians'] = {
  ...INDUSTRY_CONFIGS['spas'],
  slug: 'estheticians',
  badge: {
    en: 'AirBook for Estheticians & Skincare Specialists',
    es: 'AirBook para Esteticistas y Cuidado de la Piel',
    de: 'AirBook für Kosmetikerinnen & Hautpflege-Profis',
    fr: 'AirBook pour Esthéticiennes & Soins de la Peau',
  },
};

INDUSTRY_CONFIGS['wellness'] = {
  ...INDUSTRY_CONFIGS['massage'],
  slug: 'wellness',
  badge: {
    en: 'AirBook for Holistic Wellness & Bodywork Studios',
    es: 'AirBook para Centros de Bienestar y Salud Holística',
    de: 'AirBook für Wellnesszentren & Ganzheitliche Praxen',
    fr: 'AirBook pour Centres de Bien-Être & Soins Holistiques',
  },
};

INDUSTRY_CONFIGS['booth-renters'] = {
  ...INDUSTRY_CONFIGS['barbers'],
  slug: 'booth-renters',
  badge: {
    en: 'AirBook for Solo Suite Pros & Booth Renters',
    es: 'AirBook para Profesionales en Suites y Renta de Sillón',
    de: 'AirBook für Stuhlmieter & Solo-Spezialisten',
    fr: 'AirBook pour Indépendants en Suite & Fauteuil',
  },
};

export default function IndustryFunnelPage() {
  const { t, language, availableLanguages } = useTranslation();
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const config = INDUSTRY_CONFIGS[slug];

  if (!config) {
    notFound();
  }

  const currentLang = (['en', 'es', 'de', 'fr'].includes(language) ? language : 'en') as 'en' | 'es' | 'de' | 'fr';
  const leadSpecialist = getDemoSpecialists(language)[0];

  const [demoSlot, setDemoSlot] = useState('11:30 AM');
  const [isDemoBooked, setIsDemoBooked] = useState(false);

  const DEMO_SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white relative overflow-x-hidden font-sans">
      {/* ─── STICKY MASTER HEADER NAVIGATION ─── */}
      <MarketingHeader />

      {/* ─── HERO STAGE (PASTEL FRAMED CANVAS) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-12 lg:p-14 rounded-[36px] sm:rounded-[48px] bg-gradient-to-br from-[#FFF0F5] via-[#FDF2F8] to-[#EFF6FF] dark:from-pink-950/20 dark:via-purple-950/20 dark:to-sky-950/20 border border-pink-100/80 dark:border-pink-900/30 shadow-xl space-y-10"
        >
          {/* Top Hero Text */}
          <div className="max-w-3xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-primary)]/80 border border-[var(--border-subtle)] text-xs font-bold text-[#2BB5FF] shadow-xs">
              <Sparkle24Regular className="w-3.5 h-3.5" />
              <span>{config.badge[currentLang]}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.08]">
              {config.heroHeadline1[currentLang]} <br />
              <span className="bg-gradient-to-r from-[#2BB5FF] via-[#AF52DE] to-[#FF2D55] bg-clip-text text-transparent">
                {config.heroHeadline2[currentLang]}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed font-medium">
              {config.heroSubtitle[currentLang]}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/onboarding?industry=${encodeURIComponent(config.slug)}`}
                className="btn-primary px-7 py-3.5 text-xs flex items-center gap-2"
              >
                <span>{t('startFreeTrialBtn')}</span>
                <ArrowRight24Filled className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/book/eduardos-lounge"
                className="px-5 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-extrabold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2 shadow-xs"
              >
                <Globe24Regular className="w-4 h-4 text-[var(--text-muted)]" />
                <span>{t('seeLiveDemo')}</span>
              </Link>
            </div>
          </div>

          {/* Interactive Hero Booking Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
            {/* Left: Interactive Booking Simulator Box */}
            <div className="lg:col-span-7 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] p-6 shadow-xl space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                  {t('demoInteractiveTitle')}
                </span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Live Client Flow
                </span>
              </div>

              {/* Service Details Card */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-[var(--text-primary)]">{config.simulator.serviceName}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{config.simulator.serviceDuration} mins · Fast confirmation</p>
                </div>
                <span className="text-sm font-mono font-black text-[#2BB5FF]">${config.simulator.servicePrice}</span>
              </div>

              {/* Specialist Profile Card */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-3">
                <img
                  src={leadSpecialist.avatar}
                  alt={leadSpecialist.name}
                  className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)]"
                />
                <div>
                  <p className="text-xs font-extrabold text-[var(--text-primary)]">{leadSpecialist.name}</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">{leadSpecialist.role}</p>
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {t('demoAvailableTimes')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {DEMO_SLOTS.map((slot) => {
                    const isSelected = demoSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setDemoSlot(slot);
                          setIsDemoBooked(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xs'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA Booking Button */}
              <div className="pt-2">
                {isDemoBooked ? (
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5"
                  >
                    <CheckmarkCircle24Filled className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-extrabold leading-tight">{t('demoBookingSuccess')}</p>
                  </motion.div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsDemoBooked(true)}
                    className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2"
                  >
                    <Calendar24Filled className="w-4 h-4" />
                    <span>
                      {t('demoSimulateBook')} (${(config.simulator.servicePrice * 0.25).toFixed(2)} Deposit)
                    </span>
                  </button>
                )}
                <p className="text-[10px] text-center text-[var(--text-muted)] font-semibold mt-2 flex items-center justify-center gap-1">
                  <LockClosed24Regular className="w-3 h-3 text-[var(--text-muted)]" />
                  <span>{t('demoDepositProtected')} • Apple Pay &amp; Google Pay</span>
                </p>
              </div>
            </div>

            {/* Right: Operator Floor & Spec Card */}
            <div className="lg:col-span-5 space-y-4 text-left">
              {/* Card 1: Station Status */}
              <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                    {config.simulator.stationTitle}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs font-extrabold text-[var(--text-primary)]">{config.simulator.stationDesc}</p>
                <p className="text-[10px] text-[var(--text-secondary)] font-mono">Specialist: {leadSpecialist.name}</p>
              </div>

              {/* Card 2: Technical Record */}
              <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] p-5 shadow-lg space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between font-sans">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                    {config.simulator.specTitle}
                  </span>
                </div>
                {config.simulator.specLines.map((line, idx) => (
                  <p key={idx} className="text-[var(--text-secondary)]">
                    • {line}
                  </p>
                ))}
                <p className="text-emerald-500 font-bold font-sans text-[10px]">
                  Logged automatically upon checkout
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 3 VALUE PILLARS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center mb-1">
              <Sparkle24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{config.pillar1.title[currentLang]}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{config.pillar1.desc[currentLang]}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1">
              <ShieldCheckmark24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{config.pillar2.title[currentLang]}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{config.pillar2.desc[currentLang]}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center mb-1">
              <Clock24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{config.pillar3.title[currentLang]}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{config.pillar3.desc[currentLang]}</p>
          </div>
        </div>
      </section>

      {/* ─── 4 FEATURE CARDS STAGE ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="p-6 sm:p-12 rounded-[36px] bg-gradient-to-br from-[#F6F3FF] via-[#FAF8FF] to-[#EFF6FF] dark:from-purple-950/20 dark:via-purple-900/10 dark:to-sky-950/20 border border-purple-100/80 dark:border-purple-900/30 shadow-xl space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
              {t('basicsTitle')}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {config.badge[currentLang]} — everything configured for your specific workflow out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {config.keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm"
              >
                <span className="text-xs font-black text-[#2BB5FF] bg-[#2BB5FF]/10 px-2.5 py-1 rounded-xl">
                  0{idx + 1}
                </span>
                <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{feat.title[currentLang]}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{feat.desc[currentLang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM HIGH IMPACT CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="p-8 sm:p-14 rounded-[36px] sm:rounded-[48px] bg-gradient-to-br from-[#FFF0F5] via-[#FDF2F8] to-[#EFF6FF] dark:from-pink-950/20 dark:via-purple-950/20 dark:to-sky-950/20 border border-pink-100/80 dark:border-pink-900/30 text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight max-w-2xl mx-auto">
            {config.badge[currentLang]}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto font-medium">
            {t('ctaBannerSubtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`/onboarding?industry=${encodeURIComponent(config.slug)}`}
              className="btn-primary px-8 py-3.5 text-xs flex items-center gap-2"
            >
              <span>{t('startFreeTrialBtn')}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MASTER FOOTER ─── */}
      <MarketingFooter />
    </div>
  );
}
