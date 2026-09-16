'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useSession } from '@/lib/auth-client';
import { getDemoSpecialists } from '@/lib/i18n/demographics';
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
  Chat24Regular,
} from '@fluentui/react-icons';

type LocaleDict = { en: string; es: string; de: string; fr: string };

interface IndustryConfig {
  slug: string;
  badge: LocaleDict;
  heroPhoto: string;
  heroPhotoTag: LocaleDict;
  heroPhotoCaption: LocaleDict;
  heroHeadline1: LocaleDict;
  heroHeadline2: LocaleDict;
  heroSubtitle: LocaleDict;
  accentGradient: string;
  statsPills: { label: LocaleDict; value: string }[];
  testimonial: {
    quote: LocaleDict;
    author: string;
    role: LocaleDict;
    avatar: string;
    location: string;
  };
  workflowSteps: {
    step: string;
    title: LocaleDict;
    desc: LocaleDict;
  }[];
  pillar1: { title: LocaleDict; desc: LocaleDict };
  pillar2: { title: LocaleDict; desc: LocaleDict };
  pillar3: { title: LocaleDict; desc: LocaleDict };
  simulator: {
    serviceName: LocaleDict;
    servicePrice: number;
    serviceDuration: number;
    specialistName: string;
    specialistRole: LocaleDict;
    avatar: string;
    stationTitle: LocaleDict;
    stationDesc: LocaleDict;
    specTitle: LocaleDict;
    specLines: { en: string[]; es: string[]; de: string[]; fr: string[] };
  };
  keyFeatures: { title: LocaleDict; desc: LocaleDict }[];
}

const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  salons: {
    slug: 'salons',
    badge: {
      en: 'AirBook for Hair Salons & Colorists',
      es: 'AirBook para Salones de Peluquería y Coloristas',
      de: 'AirBook für Friseursalons & Coloristen',
      fr: 'AirBook pour Salons de Coiffure & Coloristes',
    },
    heroPhoto: '/brand/photos/candid/hair-salon.jpg',
    heroPhotoTag: {
      en: 'Live Color Studio Floor',
      es: 'Estudio de Color en Vivo',
      de: 'Live-Color-Studio',
      fr: 'Studio Coloration en Direct',
    },
    heroPhotoCaption: {
      en: 'Colorist in vintage denim jacket reviewing fresh dimensional balayage in studio mirror.',
      es: 'Colorista profesional revisando un balayage dimensional en el espejo del salón.',
      de: 'Coloristin im Vintage-Denim-Look bei der Begutachtung eines frischen Balayage-Ergebnisses.',
      fr: 'Coloriste en veste en jean examinant un balayage lumineux dans le miroir du salon.',
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
      en: 'The modern salon booking platform built for independent hair stylists, colorists, and busy salon teams. Manage timed color processing gaps and zero app downloads for clients.',
      es: 'La plataforma moderna de reservas diseñada para estilistas, coloristas y equipos de salón. Administra pausas de exposición de tinte sin descargas de apps para tus clientes.',
      de: 'Die moderne Buchungsplattform für Friseure, Coloristen und Salonteams mit Einwirkzeit-Puffern und 0% Buchungsgebühren.',
      fr: 'La plateforme moderne conçue pour les coiffeurs, coloristes et équipes de salon. Gestion des temps de pose et zéro application à télécharger pour vos clients.',
    },
    accentGradient: 'from-[#2BB5FF] via-[#AF52DE] to-[#FF2D55]',
    statsPills: [
      {
        value: '+38%',
        label: {
          en: 'Rebooking Rate',
          es: 'Reagendamiento',
          de: 'Wiederbuchungsrate',
          fr: 'Taux de fidélisation',
        },
      },
      {
        value: '0%',
        label: {
          en: 'Booking Fee',
          es: 'Comisión de Reserva',
          de: 'Buchungsgebühr',
          fr: 'Commission de réservation',
        },
      },
      {
        value: '100%',
        label: {
          en: 'Deposit Protection',
          es: 'Depósitos Seguros',
          de: 'Anzahlungsschutz',
          fr: 'Acomptes Sécurisés',
        },
      },
    ],
    testimonial: {
      quote: {
        en: 'AirBook’s automatic color processing timers freed up 6 extra hours in my week. My clients love booking directly from Instagram with zero friction.',
        es: 'Los tiempos de pausa para tinte automáticos me liberaron 6 horas extra por semana. Mis clientas adoran agendar desde Instagram sin descargar apps.',
        de: 'Die automatischen Einwirkzeit-Puffer schenken mir wöchentlich 6 freie Stunden. Meine Kunden buchen begeistert direkt über Social Media.',
        fr: 'Les temps de pose automatiques m’ont libéré 6 heures par semaine. Mes clientes adorent réserver directement depuis Instagram sans friction.',
      },
      author: 'Roxanne V.',
      role: {
        en: 'Master Colorist & Studio Owner',
        es: 'Colorista Máster y Dueña de Estudio',
        de: 'Master-Coloristin & Studioinhaberin',
        fr: 'Coloriste Experte & Fondatrice de Salon',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'Austin, TX',
    },
    workflowSteps: [
      {
        step: '01',
        title: {
          en: 'Clients Self-Book from Social Bio',
          es: 'Tus Clientes Reservan desde tu Bio',
          de: 'Direktbuchung über Social Media',
          fr: 'Réservation Directe depuis votre Bio',
        },
        desc: {
          en: 'Share your custom booking link on Instagram and Google Maps. Card deposits lock high-ticket balayage sessions.',
          es: 'Comparte tu enlace en Instagram y Google Maps. Los depósitos aseguran sesiones largas de balayage.',
          de: 'Buchungslink auf Instagram und Google teilen. Kreditkarten-Anzahlungen sichern aufwändige Farbservices.',
          fr: 'Partagez votre lien sur Instagram et Google. Les acomptes par carte sécurisent les séances de balayage.',
        },
      },
      {
        step: '02',
        title: {
          en: 'Automatic Processing Timers & Formula Logs',
          es: 'Pausas de Color e Historial de Fórmulas',
          de: 'Einwirkzeit-Puffer & Rezeptur-Historie',
          fr: 'Temps de Pose & Fiches Techniques',
        },
        desc: {
          en: 'Schedule double-booking gaps during color processing and save exact toner shades, developers, and timing in client notes.',
          es: 'Aprovecha huecos dobles mientras actúa el tinte y guarda tonos exactos, volúmenes y tiempos por cliente.',
          de: 'Zusätzliche Termine während der Einwirkzeit einplanen und Rezepturen exakt im Kundenprofil speichern.',
          fr: 'Optimisez votre planning pendant la pose du produit et enregistrez les mélanges précis sur chaque fiche.',
        },
      },
      {
        step: '03',
        title: {
          en: '5-Second Tap to Pay & Daily Payouts',
          es: 'Cobros Rápidos Tap to Pay y Abonos Diarios',
          de: 'Blitzschnelles Tap to Pay & Direktausrechnung',
          fr: 'Paiement Sans Contact en 5s & Virements Quotidiens',
        },
        desc: {
          en: 'Check out clients instantly on iPhone with automatic tips, and receive daily earnings directly into your bank card.',
          es: 'Cobra en segundos desde tu iPhone con propinas automáticas y recibe transferencias diarias a tu tarjeta.',
          de: 'Direkt über das iPhone mit Trinkgeld-Option kassieren und Einnahmen täglich auf das Bankkonto erhalten.',
          fr: 'Encaissez directement sur smartphone avec pourboire suggéré et recevez vos gains chaque jour.',
        },
      },
    ],
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
      serviceName: {
        en: 'Balayage, Gloss & Blowout',
        es: 'Balayage Completo, Matiz y Brushing',
        de: 'Balayage Komplett, Glossing & Föhnen',
        fr: 'Balayage Complet, Gloss & Brushing',
      },
      servicePrice: 185,
      serviceDuration: 120,
      specialistName: 'Roxanne V.',
      specialistRole: {
        en: 'Master Colorist',
        es: 'Colorista Principal',
        de: 'Master-Coloristin',
        fr: 'Coloriste Experte',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      stationTitle: {
        en: 'STATION #1 (COLOR BAR)',
        es: 'TOCADOR #1 (BARRA DE COLOR)',
        de: 'PLATZ #1 (FARBBAR)',
        fr: 'POSTE #1 (ESPACE COULEUR)',
      },
      stationDesc: {
        en: 'Balayage Full + Toning Gloss · 120m',
        es: 'Balayage Completo + Matiz · 120 min',
        de: 'Balayage Full + Toning Gloss · 120 Min',
        fr: 'Balayage Full + Gloss Nuanceur · 120 min',
      },
      specTitle: {
        en: 'Color Formulation Record #1042',
        es: 'Ficha de Formulación Técnica #1042',
        de: 'Farbrezeptur-Protokoll #1042',
        fr: 'Fiche Technique de Coloration #1042',
      },
      specLines: {
        en: ['Roots: 6N + 20vol (35m processing)', 'Gloss: 9GI + 9GB (15m tone)', 'Patch test signed & saved'],
        es: ['Raíces: 6N + 20vol (35 min de exposición)', 'Matiz: 9GI + 9GB (15 min de tono)', 'Prueba de alergia firmada y guardada'],
        de: ['Ansatz: 6N + 20vol (35 Min Einwirkzeit)', 'Gloss: 9GI + 9GB (15 Min Tönung)', 'Allergietest digital unterzeichnet'],
        fr: ['Racines : 6N + 20vol (35 min de pose)', 'Gloss : 9GI + 9GB (15 min de nuance)', 'Test d’allergie signé et enregistré'],
      },
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
      en: 'AirBook for Barbershops & Grooming',
      es: 'AirBook para Barberías y Cuidado Masculino',
      de: 'AirBook für Barbershops & Herrensalons',
      fr: 'AirBook pour Barbiers & Salons Masculins',
    },
    heroPhoto: '/brand/photos/candid/barbershop.jpg',
    heroPhotoTag: {
      en: 'Live Barbershop Floor',
      es: 'Barbería en Vivo',
      de: 'Live-Barbershop',
      fr: 'Ambiance Barbier en Direct',
    },
    heroPhotoCaption: {
      en: 'Master barber in craft apron sharing a genuine laugh with client in vintage leather chair.',
      es: 'Barbero profesional en delantal de cuero compartiendo un momento con su cliente en el sillón clásico.',
      de: 'Barbier in Schürze im Gespräch mit Kunden im klassischen Ledersessel.',
      fr: 'Barbier en tablier échangeant chaleureusement avec son client dans un fauteuil vintage.',
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
      en: 'The ultimate barbershop booking app. Manage appointments, iPad walk-in kiosk queues, guard sizing notes, and fast Tap-to-Pay checkouts in one tap.',
      es: 'El software definitivo para barberías. Administra citas, lista de espera walk-in en iPad, notas de corte y cobros rápidos Tap to Pay en un toque.',
      de: 'Die ultimative Barbershop-Software für Termine, iPad-Walk-in-Warteschlangen, Schnittnotizen und blitzschnelles Kassieren.',
      fr: 'L’application idéale pour barbiers. Gérez vos rendez-vous, file d’attente sur iPad, fiches de coupe et encaissements sans contact rapides.',
    },
    accentGradient: 'from-[#F59E0B] via-[#EF4444] to-[#8B5CF6]',
    statsPills: [
      {
        value: '< 5s',
        label: {
          en: 'Tap-to-Pay POS',
          es: 'Cobro Tap to Pay',
          de: 'Blitz-Kasse',
          fr: 'Paiement sans contact',
        },
      },
      {
        value: '0',
        label: {
          en: 'No-Shows',
          es: 'Ausencias',
          de: 'Terminausfälle',
          fr: 'Rendez-vous manqués',
        },
      },
      {
        value: 'Live',
        label: {
          en: 'Walk-In Kiosk',
          es: 'Kiosco Walk-In',
          de: 'Digitale Warteliste',
          fr: 'File d’attente iPad',
        },
      },
    ],
    testimonial: {
      quote: {
        en: 'No more answering phone calls mid-fade. The iPad walk-in kiosk and Tap-to-Pay cut our desk time to zero and our chair turnover skyrocketed.',
        es: 'Se acabaron las llamadas mientras haces un degradado. El kiosco en iPad y Tap to Pay redujeron el tiempo en caja a cero y aumentaron nuestra rotación.',
        de: 'Keine Telefonate mehr während des Haarschnitts. Das iPad-Kiosk und Tap to Pay machen die Kasse überflüssig und füllen den Salon.',
        fr: 'Plus d’appels en pleine coupe. La borne iPad et le paiement sans contact ont supprimé l’attente en caisse et rempli nos fauteuils.',
      },
      author: 'Alex R.',
      role: {
        en: 'Master Barber & Shop Founder',
        es: 'Barbero Principal y Fundador',
        de: 'Master-Barbier & Inhaber',
        fr: 'Maître Barbier & Fondateur',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Brooklyn, NY',
    },
    workflowSteps: [
      {
        step: '01',
        title: {
          en: 'Seamless Appointments & iPad Walk-In Queue',
          es: 'Citas Online y Fila Walk-In en iPad',
          de: 'Online-Termine & iPad-Warteschlange',
          fr: 'Rendez-vous en Ligne & File d’Attente iPad',
        },
        desc: {
          en: 'Clients reserve in advance or join the live digital queue at your reception kiosk with automatic SMS wait updates.',
          es: 'Tus clientes agendan con antelación o se anotan en el kiosco con aviso de tiempo restante por SMS.',
          de: 'Kunden buchen vorab oder tragen sich am iPad ein mit automatischem SMS-Wartezeit-Status.',
          fr: 'Vos clients réservent en ligne ou s’inscrivent sur la borne avec estimation du temps par SMS.',
        },
      },
      {
        step: '02',
        title: {
          en: 'Guard Sizes & Beard Preferences Saved',
          es: 'Fichas de Corte y Forma de Barba',
          de: 'Schnittnotizen & Aufsatzgrößen im Profil',
          fr: 'Historique des Lames & Finitions de Barbe',
        },
        desc: {
          en: 'Save exact clipper guard numbers, taper transitions, and beard styles on the client profile for 100% consistency every visit.',
          es: 'Guarda números de máquina, degradados y estilos de barba en el perfil del cliente para resultados perfectos siempre.',
          de: 'Aufsatzstufen, Taper-Übergänge und Bartkonturen direkt pro Kunde hinterlegen.',
          fr: 'Enregistrez les hauteurs de coupe, dégradés et contours de barbe pour une fidélité absolue.',
        },
      },
      {
        step: '03',
        title: {
          en: 'Instant Tap-to-Pay with Tipping & Chair Splits',
          es: 'Cobro en 5s con Propinas y Renta de Sillón',
          de: '5-Sekunden-Kasse mit Trinkgeld & Stuhlmiete',
          fr: 'Paiement en 5s avec Pourboire & Partage Fauteuil',
        },
        desc: {
          en: 'Tap a credit card or Apple Pay directly against your iPhone, calculate barber chair commissions, and pay out instantly.',
          es: 'Cobra con tarjeta o Apple Pay directo en tu iPhone, calcula comisiones de sillón y liquida al instante.',
          de: 'Kartenzahlung direkt über das iPhone abwickeln, Stuhlmieten verrechnen und sofort auszahlen.',
          fr: 'Encaissez par carte ou Apple Pay sur votre smartphone, gérez les loyers de fauteuil et recevez vos fonds.',
        },
      },
    ],
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
      serviceName: {
        en: 'Skin Fade + Hot Towel Beard',
        es: 'Degradado Skin Fade + Barba con Toalla Caliente',
        de: 'Skin Fade + Heißtuch-Rasur & Bart',
        fr: 'Dégradé à Blanc + Soin Barbe Serviette Chaude',
      },
      servicePrice: 55,
      serviceDuration: 45,
      specialistName: 'Alex R.',
      specialistRole: {
        en: 'Master Barber',
        es: 'Barbero Máster',
        de: 'Master-Barbier',
        fr: 'Maître Barbier',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      stationTitle: {
        en: 'CHAIR #2 (FRONT WINDOW)',
        es: 'SILLÓN #2 (VENTANAL PRINCIPAL)',
        de: 'STUHL #2 (FENSTERFRONT)',
        fr: 'FAUTEUIL #2 (VITRINE)',
      },
      stationDesc: {
        en: 'Skin Fade + Beard Lineup · 45m',
        es: 'Degradado a Piel + Perfilado de Barba · 45 min',
        de: 'Skin Fade + Bartkontur · 45 Min',
        fr: 'Dégradé à blanc + Tracé de barbe · 45 min',
      },
      specTitle: {
        en: 'Client Guard Preferences #208',
        es: 'Ficha de Corte del Cliente #208',
        de: 'Kunden-Schnittprofil #208',
        fr: 'Fiche Préférences de Coupe #208',
      },
      specLines: {
        en: ['Sides: 0.5 to 1.5 taper fade', 'Beard: #2 guard with razor edge', 'Product: Matte clay paste'],
        es: ['Laterales: 0.5 a 1.5 degradado cónico', 'Barba: Peine #2 con navaja de afeitar', 'Producto: Arcilla mate'],
        de: ['Seiten: 0.5 bis 1.5 Taper Fade', 'Bart: Aufsatz #2 mit Rasiermesser-Finish', 'Styling: Matte Clay Paste'],
        fr: ['Côtés : dégradé progressif de 0.5 à 1.5', 'Barbe : sabot #2 et rasoir traditionnel', 'Finition : cire mate'],
      },
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
      en: 'AirBook for MedSpas & Estheticians',
      es: 'AirBook para Clínicas de Estética y Spas',
      de: 'AirBook für MedSpas & Kosmetikinstitute',
      fr: 'AirBook pour MedSpas & Esthéticiennes',
    },
    heroPhoto: '/brand/photos/candid/medspa-esthetician.jpg',
    heroPhotoTag: {
      en: 'Aesthetics & Skincare Sanctuary',
      es: 'Clínica Estética y Cuidado Facial',
      de: 'Ästhetik- & Hautpflegepraxis',
      fr: 'Cabinet d’Esthétique & Soins de la Peau',
    },
    heroPhotoCaption: {
      en: 'Radiant esthetician in cozy sage fleece consulting client with glowing bare skin over tea.',
      es: 'Esteticista profesional en consulta personalizada para el cuidado y rejuvenecimiento facial.',
      de: 'Kosmetikerin im persönlichen Beratungsgespräch für eine strahlende Hautbehandlung.',
      fr: 'Esthéticienne en consultation personnalisée pour un soin du visage éclatant.',
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
      en: 'Elevate your day spa and clinical esthetics practice with digital health intake waivers, automated treatment room reset buffers, and upfront card deposits.',
      es: 'Eleva tu clínica estética con fichas de salud digitales, tiempos de pausa automáticos entre cabinas y depósitos seguros sin fricción.',
      de: 'Verwalten Sie Ihr Institut mit digitalen Gesundheitsbögen, automatischen Kabinenpuffern und sicheren Anzahlungen.',
      fr: 'Sublimez votre institut avec fiches santé numériques, temps de pause entre cabines et acomptes sécurisés.',
    },
    accentGradient: 'from-[#8B5CF6] via-[#EC4899] to-[#3B82F6]',
    statsPills: [
      {
        value: '100%',
        label: {
          en: 'Paperless Waivers',
          es: 'Fichas Digitales',
          de: 'Digitale Bögen',
          fr: 'Fiches 100% numériques',
        },
      },
      {
        value: '15m',
        label: {
          en: 'Auto Room Buffers',
          es: 'Pausas de Cabina',
          de: 'Kabinen-Puffer',
          fr: 'Pauses sanitaires',
        },
      },
      {
        value: '0%',
        label: {
          en: 'Platform Commission',
          es: 'Comisiones de Reserva',
          de: 'Plattformgebühr',
          fr: 'Commission plateforme',
        },
      },
    ],
    testimonial: {
      quote: {
        en: 'The digital intake waivers and automated room buffers keep our spa completely zen. Clients sign forms on their phone before arriving, saving 15 minutes per session.',
        es: 'Los consentimientos digitales y las pausas entre cabinas mantienen nuestro spa en calma total. Los clientes firman en el móvil antes de llegar.',
        de: 'Digitale Anamnesebögen und automatische Pufferzeiten sorgen für absolute Ruhe. Kunden füllen alles vorab auf dem Smartphone aus.',
        fr: 'Les décharges numériques et les pauses entre cabines assurent une sérénité absolue. Les clients signent sur mobile avant leur arrivée.',
      },
      author: 'Elena P.',
      role: {
        en: 'Licensed Esthetician & Spa Director',
        es: 'Esteticista Licenciada y Directora de Spa',
        de: 'Staatlich geprüfte Kosmetikerin & Spa-Leitung',
        fr: 'Esthéticienne Diplômée & Directrice de Spa',
      },
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      location: 'Scottsdale, AZ',
    },
    workflowSteps: [
      {
        step: '01',
        title: {
          en: 'Paperless Digital Health & Consent Forms',
          es: 'Consentimientos de Salud en el Móvil',
          de: 'Papierlose Gesundheitsfragebögen',
          fr: 'Décharges Médicales sur Smartphone',
        },
        desc: {
          en: 'Send digital intake waivers automatically upon booking for clients to sign on mobile before they step into the treatment room.',
          es: 'Envía consentimientos digitales al agendar para que los firmen en el móvil antes de entrar a cabina.',
          de: 'Digitale Anamnesebögen werden bei der Buchung versendet und bequem auf dem Smartphone unterschrieben.',
          fr: 'Envoi automatique des bilans de santé signés sur mobile avant d’entrer en cabine.',
        },
      },
      {
        step: '02',
        title: {
          en: 'Automated 15-Minute Treatment Room Reset',
          es: 'Ventanas de Pausa para Higienización',
          de: '15-Minuten-Puffer für Vorbereitung & Hygiene',
          fr: 'Créneaux de Battement pour Désinfection',
        },
        desc: {
          en: 'AirBook automatically blocks 15 minutes between clients for linen turnover, sanitation, and therapist mental reset.',
          es: 'AirBook bloquea 15 minutos automáticamente entre citas para cambio de sábanas, desinfección y descanso.',
          de: 'Automatische 15-Minuten-Puffer für frische Handtücher, Desinfektion und Erholung.',
          fr: 'AirBook bloque automatiquement 15 min entre chaque soin pour aérer, désinfecter et se préparer.',
        },
      },
      {
        step: '03',
        title: {
          en: 'Multi-Session Treatment Packages & Passes',
          es: 'Paquetes Multisesión y Pases de Spa',
          de: 'Mehrfachkarten & Behandlungspakete',
          fr: 'Carnets de Soins & Forfaits Récurrents',
        },
        desc: {
          en: 'Sell high-value multi-session skincare series and hydrafacial passes with automatic balance deduction on booking.',
          es: 'Vende bonos multisesión de tratamientos faciales y corporales con descuento automático de saldo al reservar.',
          de: 'Hochwertige Behandlungskuren und Hydrafacial-Abos verkaufen mit automatischer Guthaben-Abbuchung.',
          fr: 'Vendez des forfaits de soins visage et cures bien-être avec décompte automatique des séances.',
        },
      },
    ],
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
      serviceName: {
        en: 'Hydra-Glow Facial + LED Light Therapy',
        es: 'Facial Hydra-Glow + Terapia de Luz LED',
        de: 'Hydra-Glow Gesichtsbehandlung + LED-Licht',
        fr: 'Soin du Visage Hydra-Glow + Luminothérapie LED',
      },
      servicePrice: 165,
      serviceDuration: 75,
      specialistName: 'Elena P.',
      specialistRole: {
        en: 'Licensed Esthetician',
        es: 'Esteticista Licenciada',
        de: 'Kosmetikerin & Hautexpertin',
        fr: 'Esthéticienne Diplômée',
      },
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      stationTitle: {
        en: 'CABIN #3 (ZEN SUITE)',
        es: 'CABINA #3 (SUITE ZEN)',
        de: 'KABINE #3 (ZEN-SUITE)',
        fr: 'CABINE #3 (SUITE ZEN)',
      },
      stationDesc: {
        en: 'Hydra-Glow (75m) + 15m Buffer',
        es: 'Hydra-Glow (75 min) + 15 min de Pausa',
        de: 'Hydra-Glow (75 Min) + 15 Min Puffer',
        fr: 'Hydra-Glow (75 min) + 15 min de pause',
      },
      specTitle: {
        en: 'Guest Health & Skincare Profile #904',
        es: 'Ficha de Salud y Piel del Paciente #904',
        de: 'Haut- & Anamneseprofil #904',
        fr: 'Bilan de Santé & Diagnostic de Peau #904',
      },
      specLines: {
        en: ['Skin Type: Fitzpatrick II (Sensitive / Dry)', 'Serum: Hyaluronic + Niacinamide blend', 'Digital health waiver signed & verified'],
        es: ['Tipo de piel: Fitzpatrick II (Sensible / Seca)', 'Sérum: Ácido Hialurónico + Niacinamida', 'Consentimiento digital firmado y verificado'],
        de: ['Hauttyp: Fitzpatrick II (Sensibel / Trocken)', 'Wirkstoff: Hyaluron & Niacinamid-Serum', 'Anamnesebogen digital unterzeichnet'],
        fr: ['Type de peau : Fitzpatrick II (Sensible / Sèche)', 'Sérum : Acide Hyaluronique & Niacinamide', 'Décharge numérique signée et validée'],
      },
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
      en: 'AirBook for Nail Studios & Lash Artists',
      es: 'AirBook para Estudios de Uñas y Pestañas',
      de: 'AirBook für Nagelstudios & Lash-Artists',
      fr: 'AirBook pour Bars à Ongles & Cils',
    },
    heroPhoto: '/brand/photos/candid/nail-studio.jpg',
    heroPhotoTag: {
      en: '3D Chrome & Custom Nail Art Bar',
      es: 'Barra de Manicura y Nail Art 3D',
      de: 'Nail-Art- & Maniküre-Studio',
      fr: 'Bar à Ongles & Nail Art Chromé',
    },
    heroPhotoCaption: {
      en: 'Nail artist in denim & stacked rings showing off bespoke 3D chrome metallic manicure.',
      es: 'Manicurista profesional mostrando un set personalizado de nail art cromado 3D.',
      de: 'Nail-Designerin präsentiert individuelles 3D-Chrome-Nail-Design.',
      fr: 'Prothésiste ongulaire dévoilant une pose sur mesure en nail art chromé 3D.',
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
      en: 'The purpose-built booking software for nail technicians, lash artists, and brow specialists. Capture deposits on high-ticket custom art and let clients attach inspiration photos.',
      es: 'El software de reservas diseñado para manicuristas, lashistas y especialistas de cejas. Asegura depósitos en sets personalizados y recibe fotos de inspiración al agendar.',
      de: 'Die perfekte Buchungssoftware für Nail-Artists, Wimpern- und Brauen-Profis mit Anzahlungsschutz und Bild-Upload für Nagel-Designs.',
      fr: 'Le logiciel de réservation pensé pour prothésistes ongulaires et artistes du regard. Acomptes sur poses sur mesure et modèles en photo.',
    },
    accentGradient: 'from-[#EC4899] via-[#F43F5E] to-[#8B5CF6]',
    statsPills: [
      {
        value: 'Tiered',
        label: {
          en: 'Art Add-Ons',
          es: 'Adicionales de Arte',
          de: 'Art-Zusatzoptionen',
          fr: 'Niveaux de Nail Art',
        },
      },
      {
        value: 'Inspo',
        label: {
          en: 'Photo Uploads',
          es: 'Fotos de Referencia',
          de: 'Inspirationsfotos',
          fr: 'Photos de Référence',
        },
      },
      {
        value: '100%',
        label: {
          en: 'Deposit Protection',
          es: 'Depósitos Seguros',
          de: 'Anzahlungsschutz',
          fr: 'Acomptes Sécurisés',
        },
      },
    ],
    testimonial: {
      quote: {
        en: 'Clients attach their reference photos during booking so I know exactly what to prepare. Deposits stopped the 2-hour art ghosting completely.',
        es: 'Las clientas suben sus fotos de referencia al agendar para que prepare el material con tiempo. Los depósitos eliminaron las ausencias en sets de 2 horas.',
        de: 'Kunden laden Referenzbilder direkt hoch, sodass ich mich perfekt vorbereiten kann. Anzahlungen schützen meine 2-Stunden-Kreativtermine.',
        fr: 'Les clientes joignent leurs photos dès la réservation pour que je prépare mes teintes. Les acomptes ont totalement éliminé les annulations.',
      },
      author: 'Chloe M.',
      role: {
        en: 'Master Nail Artist & Studio Owner',
        es: 'Manicurista Máster y Dueña de Estudio',
        de: 'Master Nail-Artist & Studioinhaberin',
        fr: 'Prothésiste Ongulaire Experte & Formatrice',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'Miami, FL',
    },
    workflowSteps: [
      {
        step: '01',
        title: {
          en: 'Multi-Tier Add-Ons & Reference Photos',
          es: 'Adicionales de Nail Art y Fotos de Inspiración',
          de: 'Design-Zusatzoptionen & Bild-Upload',
          fr: 'Niveaux de Nail Art & Photos d’Inspiration',
        },
        desc: {
          en: 'Clients easily add chrome powder, 3D charms, French tips, or acrylic removals, attaching reference designs at checkout.',
          es: 'Tus clientas eligen polvos cromados, pedrería 3D, francesita o retiro de acrílico, adjuntando sus modelos.',
          de: 'Kunden wählen Chrome, 3D-Charms, French Nails oder Altmodellage-Entfernung und laden Entwürfe hoch.',
          fr: 'Les clientes ajoutent effet chrome, décors 3D, french ou dépose en joignant leur photo d’inspiration.',
        },
      },
      {
        step: '02',
        title: {
          en: 'Automated 25% Deposit Lock',
          es: 'Depósito Automático del 25% con Tarjeta',
          de: 'Automatische 25% Anzahlung via Stripe',
          fr: 'Acompte Sécurisé de 25% par Carte',
        },
        desc: {
          en: 'Protect your valuable 90-to-120 minute custom art time blocks against last-minute cancellations or ghosting.',
          es: 'Asegura tus turnos de 90 a 120 minutos de arte personalizado contra cancelaciones de última hora.',
          de: 'Schützen Sie 90 bis 120 Minuten dauernde Kreativtermine zuverlässig vor kurzfristigen Ausfällen.',
          fr: 'Sécurisez vos créneaux de 90 à 120 min de nail art complexe contre les désistements imprévus.',
        },
      },
      {
        step: '03',
        title: {
          en: 'Automated 3-Week Refill & Maintenance SMS',
          es: 'Recordatorios de Retoque a 3 Semanas por SMS',
          de: 'Automatische 3-Wochen-Auffüll-Erinnerung',
          fr: 'Relances Automatiques de Remplissage à 3 Semaines',
        },
        desc: {
          en: 'AirBook texts clients right when their nail growth or lash fill is due, keeping your calendar fully booked on autopilot.',
          es: 'Avisos amables por SMS justo cuando toca rellenar acrílico o pestañas para mantener tu agenda llena.',
          de: 'Automatische SMS genau zum idealen Auffülltermin für volle Buchungskalender ohne Nachfassen.',
          fr: 'Envoi d’un SMS bienveillant au moment optimal pour le remplissage et l’entretien des ongles et cils.',
        },
      },
    ],
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
      serviceName: {
        en: 'Apres Gel-X + Tier 3 Custom Art',
        es: 'Extensiones Apres Gel-X + Nail Art Nivel 3',
        de: 'Apres Gel-X Verlängerung + 3D Nail Art',
        fr: 'Extensions Apres Gel-X + Nail Art Niveau 3',
      },
      servicePrice: 110,
      serviceDuration: 90,
      specialistName: 'Chloe M.',
      specialistRole: {
        en: 'Master Nail Artist',
        es: 'Manicurista Principal',
        de: 'Nail-Artist & Expertin',
        fr: 'Prothésiste Ongulaire Experte',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      stationTitle: {
        en: 'MANICURE TABLE #4',
        es: 'MESA DE MANICURA #4',
        de: 'MANIKÜRE-TISCH #4',
        fr: 'TABLE DE MANUCURE #4',
      },
      stationDesc: {
        en: 'Gel-X Extension + 3D Chrome Art · 90m',
        es: 'Gel-X + Nail Art Cromado 3D · 90 min',
        de: 'Gel-X + 3D Chrome Art · 90 Min',
        fr: 'Gel-X + Nail Art Chromé 3D · 90 min',
      },
      specTitle: {
        en: 'Client Sizing & Preferences #512',
        es: 'Ficha de Medidas y Preferencias #512',
        de: 'Kunden-Größenprofil #512',
        fr: 'Fiche Tailles & Modèle #512',
      },
      specLines: {
        en: ['Tips: Medium Almond (Sizes 1, 5, 4, 6, 8)', 'Cuticle care: Dry Russian prep', 'Inspo photo attached to appointment'],
        es: ['Tips: Almendra Mediana (Tallas 1, 5, 4, 6, 8)', 'Cutículas: Manicura rusa en seco', 'Foto de inspiración adjunta a la cita'],
        de: ['Tips: Medium Mandel (Größen 1, 5, 4, 6, 8)', 'Nagelhaut: Trockene Maniküre', 'Inspirationsfoto zum Termin hinterlegt'],
        fr: ['Capsules : Amande Moyenne (Tailles 1, 5, 4, 6, 8)', 'Cuticules : Manucure russe à sec', 'Photo de modèle enregistrée sur le rendez-vous'],
      },
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
      es: 'AirBook para Estudios de Tatuaje y Body Art',
      de: 'AirBook für Tattoo- & Body-Art-Studios',
      fr: 'AirBook pour Tatoueurs & Studios de Tatouage',
    },
    heroPhoto: '/brand/photos/candid/tattoo-artist.jpg',
    heroPhotoTag: {
      en: 'Fine-Line Tattoo Atelier',
      es: 'Estudio de Tatuaje Fine-Line',
      de: 'Fine-Line-Tattoo-Atelier',
      fr: 'Atelier de Tatouage Fine-Line',
    },
    heroPhotoCaption: {
      en: 'Fine-line tattoo artist in beanie reviewing custom botanical stencil on iPad with smiling client.',
      es: 'Tatuador de trazo fino revisando un diseño botánico personalizado en iPad con el cliente.',
      de: 'Tätowierer bespricht ein individuelles botanisches Design auf dem Tablet.',
      fr: 'Tatoueur fine-line vérifiant le pochoir d’un motif botanique sur tablette.',
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
      en: 'Designed for independent tattoo artists, piercers, and private studio collectives. Automate consultation deposits, stencil uploads, and paperless consent forms.',
      es: 'Diseñado para tatuadores independientes, piercers y estudios privados. Automatiza depósitos de consulta, subida de referencias y consentimientos digitales.',
      de: 'Für Tattoo-Artists, Piercer und Studios. Automatische Anzahlungen, Stencil-Uploads und digitale Einverständniserklärungen.',
      fr: 'Conçu pour tatoueurs et perceurs indépendants. Automatisez vos acomptes de consultation, envoi de modèles et décharges numériques.',
    },
    accentGradient: 'from-[#6366F1] via-[#A855F7] to-[#EC4899]',
    statsPills: [
      {
        value: 'Day Rate',
        label: {
          en: 'Session Blocks',
          es: 'Bloques de Día',
          de: 'Ganztags-Blöcke',
          fr: 'Séances Journée',
        },
      },
      {
        value: '100%',
        label: {
          en: 'Digital Waivers',
          es: 'Consentimientos ID',
          de: 'Digitale Einverständnisse',
          fr: 'Décharges Numériques',
        },
      },
      {
        value: 'Direct',
        label: {
          en: 'Artist Payouts',
          es: 'Abonos a Artistas',
          de: 'Künstler-Auszahlung',
          fr: 'Virements Artistes',
        },
      },
    ],
    testimonial: {
      quote: {
        en: 'Securing non-refundable deposits for full-day pieces without back-and-forth DMs changed my life. Clients upload ideas, sign waivers on mobile, and show up ready.',
        es: 'Cobrar depósitos no reembolsables para sesiones de día entero sin cruzar decenas de mensajes me cambió la vida. Mis clientes suben referencias y firman en el móvil.',
        de: 'Feste Anzahlungen für Tagessitzungen ohne zeitraubende DMs sparen mir enorm viel Zeit. Kunden laden Entwürfe hoch und unterschreiben digital.',
        fr: 'Sécuriser des acomptes sur des séances complètes sans échanges infinis de messages a transformé mon quotidien. Tout est cadré en ligne.',
      },
      author: 'Marcus K.',
      role: {
        en: 'Resident Tattoo Artist & Studio Owner',
        es: 'Tatuador Residente y Dueño de Estudio',
        de: 'Resident Tattoo-Artist & Inhaber',
        fr: 'Tatoueur Résident & Fondateur d’Atelier',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Portland, OR',
    },
    workflowSteps: [
      {
        step: '01',
        title: {
          en: 'Consultation & Day Block Scheduling',
          es: 'Consultas Previas y Bloques de Día Completo',
          de: 'Beratungstermine & Tagessitzungen',
          fr: 'Consultations & Réservations à la Journée',
        },
        desc: {
          en: 'Allow clients to book 30-min design consultations or full-day 6-hour sessions with automated non-refundable deposits.',
          es: 'Permite agendar consultas de 30 min o sesiones de 6 horas con depósitos no reembolsables cobrados con tarjeta.',
          de: 'Kunden buchen 30-Minuten-Beratungen oder 6-Stunden-Sitzungen mit verbindlicher Anzahlung.',
          fr: 'Proposez des créneaux de consultation de 30 min ou des séances de 6 heures avec acompte sécurisé.',
        },
      },
      {
        step: '02',
        title: {
          en: 'Digital Consent, Medical Health & ID Upload',
          es: 'Consentimiento con Firma Digital y DNI',
          de: 'Einverständniserklärung & Ausweis-Check',
          fr: 'Décharge avec Signature & Pièce d’Identité',
        },
        desc: {
          en: 'Clients complete health questionnaires, verify photo IDs, and sign legal waivers on their phone before sitting in the station.',
          es: 'Tus clientes responden el cuestionario de salud, verifican su documento y firman la autorización en su teléfono.',
          de: 'Kunden bestätigen Gesundheitsangaben, laden ihren Ausweis hoch und unterschreiben rechtssicher am Smartphone.',
          fr: 'Les clients remplissent le bilan médical, joignent leur pièce d’identité et signent la décharge sur leur mobile.',
        },
      },
      {
        step: '03',
        title: {
          en: 'Automated Healing & Aftercare SMS Triggers',
          es: 'Instrucciones de Curación y Retoque por SMS',
          de: 'Automatische Pflegeanleitung per SMS',
          fr: 'Conseils de Soin & Cicatrisation par SMS',
        },
        desc: {
          en: 'Send day-1, day-3, and 4-week healing guidelines and touch-up reminders automatically to keep tattoos looking immaculate.',
          es: 'Envía guías de cuidado a los días 1, 3 y 4 semanas con aviso para agendar retoques si fuera necesario.',
          de: 'Automatische Pflegehinweise nach 1 Tag, 3 Tagen und 4 Wochen für optimale Abheilung und Nachstechen.',
          fr: 'Envoi automatique des consignes de soin aux jours 1, 3 et 4 semaines pour une cicatrisation parfaite.',
        },
      },
    ],
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
      serviceName: {
        en: 'Full Day Custom Piece (6 Hours)',
        es: 'Sesión de Día Completo (6 Horas)',
        de: 'Ganztagessitzung Tattoo (6 Stunden)',
        fr: 'Séance Complète sur Mesure (6 Heures)',
      },
      servicePrice: 750,
      serviceDuration: 360,
      specialistName: 'Marcus K.',
      specialistRole: {
        en: 'Resident Tattoo Artist',
        es: 'Tatuador Residente',
        de: 'Resident Tattoo-Artist',
        fr: 'Tatoueur Résident',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      stationTitle: {
        en: 'STATION #2 (PRIVATE SUITE)',
        es: 'ZONA #2 (ESTUDIO PRIVADO)',
        de: 'ARBEITSPLATZ #2 (PRIVATE SUITE)',
        fr: 'POSTE #2 (ESPACE PRIVÉ)',
      },
      stationDesc: {
        en: 'Full Day Black & Grey Session · 6h',
        es: 'Sesión Completa Black & Grey · 6 horas',
        de: 'Ganztags-Session Black & Grey · 6 Std',
        fr: 'Séance Black & Grey Journée · 6h',
      },
      specTitle: {
        en: 'Client Project Spec & Waiver #774',
        es: 'Ficha de Proyecto y Consentimiento #774',
        de: 'Tattoo-Projekt & Einverständnis #774',
        fr: 'Fiche Projet & Décharge Numérique #774',
      },
      specLines: {
        en: ['Placement: Left forearm / sleeve start', 'Health check: No blood thinners confirmed', 'Waiver & photo ID verified'],
        es: ['Zona: Antebrazo izquierdo / inicio de manga', 'Salud: Sin anticoagulantes confirmado', 'Consentimiento y documento verificados'],
        de: ['Körperstelle: Unterarm links / Sleeve-Beginn', 'Gesundheit: Keine Blutverdünner bestätigt', 'Einverständnis & Ausweis verifiziert'],
        fr: ['Emplacement : Avant-bras gauche / début de manchette', 'Santé : Absence d’anticoagulants confirmée', 'Décharge et pièce d’identité validées'],
      },
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
      en: 'AirBook for Massage & Holistic Wellness',
      es: 'AirBook para Terapeutas de Masaje y Bienestar',
      de: 'AirBook für Masseure & Körpertherapeuten',
      fr: 'AirBook pour Massothérapeutes & Bien-Être',
    },
    heroPhoto: '/brand/photos/candid/massage-wellness.jpg',
    heroPhotoTag: {
      en: 'Holistic Bodywork Sanctuary',
      es: 'Santuario de Masaje y Bienestar',
      de: 'Ganzheitliche Massagepraxis',
      fr: 'Sanctuaire de Massothérapie',
    },
    heroPhotoCaption: {
      en: 'Holistic therapist in organic linen setting heated basalt stones and aromatherapy in bamboo suite.',
      es: 'Terapeuta corporal en lino orgánico preparando piedras volcánicas calientes y aromaterapia.',
      de: 'Ganzheitlicher Masseur bereitet Heißstein- und Aromatherapie im Behandlungsraum vor.',
      fr: 'Massothérapeute préparant des pierres chaudes volcaniques et des huiles essentielles.',
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
      en: 'Built for independent massage therapists and bodywork clinics. Streamline health intake notes, automatic rest buffer times, and recurring multi-session wellness passes.',
      es: 'Creado para masoterapeutas independientes y clínicas corporales. Digitaliza fichas de salud, pausas de descanso automáticas y bonos de sesiones prepagadas.',
      de: 'Für selbstständige Masseure und Praxen. Digitale Anamnesebögen, automatische Erholungspausen und Mehrfachkarten-Verwaltung.',
      fr: 'Conçu pour massothérapeutes indépendants et cabinets. Fiches bilan santé, pauses de récupération automatiques et forfaits de séances multiples.',
    },
    accentGradient: 'from-[#10B981] via-[#06B6D4] to-[#3B82F6]',
    statsPills: [
      {
        value: 'Auto',
        label: {
          en: 'Recovery Buffers',
          es: 'Pausas de Descanso',
          de: 'Erholungspausen',
          fr: 'Pauses Récupération',
        },
      },
      {
        value: 'SOAP',
        label: {
          en: 'Digital Notes',
          es: 'Fichas de Salud',
          de: 'Behandlungsprotokoll',
          fr: 'Fiches Thérapeutiques',
        },
      },
      {
        value: '100%',
        label: {
          en: 'Direct Income',
          es: 'Ingresos Directos',
          de: 'Direkteinnahmen',
          fr: 'Revenus Directs',
        },
      },
    ],
    testimonial: {
      quote: {
        en: 'The automatic 15-minute recovery buffers ensure I never burn out between deep tissue sessions. My recurring clients buy 5-packs and book their own slots seamlessly.',
        es: 'Las pausas automáticas de 15 minutos aseguran que nunca termine agotado entre masajes profundos. Mis clientes compran bonos de 5 sesiones y se agendan solos.',
        de: 'Die automatischen 15-Minuten-Erholungspausen verhindern Erschöpfung. Stammkunden kaufen 5er-Karten und buchen ihre Termine selbstständig.',
        fr: 'Les 15 minutes de battement automatiques me permettent de recharger mon énergie. Mes clients réguliers achètent des carnets de 5 séances en toute autonomie.',
      },
      author: 'David S.',
      role: {
        en: 'Licensed Bodywork Therapist',
        es: 'Terapeuta Corporal Licenciado',
        de: 'Staatlich anerkannter Masseur & Therapeut',
        fr: 'Massothérapeute Diplômé d’État',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Boulder, CO',
    },
    workflowSteps: [
      {
        step: '01',
        title: {
          en: 'Automated Recovery & Sanitization Buffers',
          es: 'Pausas de Recuperación y Desinfección',
          de: 'Pufferzeiten für Erholung & Vorbereitung',
          fr: 'Pauses Automatiques de Récupération & Aération',
        },
        desc: {
          en: 'AirBook automatically adds 15 to 30 minutes after each appointment so you can stretch, clean stones, and reset the suite.',
          es: 'AirBook añade de 15 a 30 minutos tras cada cita para estirar, desinfectar piedras y preparar la cabina.',
          de: 'Automatische 15 bis 30 Minuten Pufferzeit für Entspannung, Steinreinigung und Raumlüftung.',
          fr: 'AirBook insère 15 à 30 min après chaque soin pour vous étirer, nettoyer les pierres et préparer la salle.',
        },
      },
      {
        step: '02',
        title: {
          en: 'Digital SOAP Health Notes & Contraindications',
          es: 'Fichas de Salud y Puntos de Tensión',
          de: 'Digitale Behandlungsprotokolle & Notizen',
          fr: 'Fiches Thérapeutiques & Zones de Tension',
        },
        desc: {
          en: 'Log client pressure preferences, trigger points, and allergies securely on their profile with fingertip updates.',
          es: 'Registra nivel de presión, puntos de dolor y contraindicaciones de forma segura en el perfil del cliente.',
          de: 'Druckstärke, Schmerzpunkte und Vorerkrankungen sicher im Kundenprofil festhalten.',
          fr: 'Notez le niveau de pression souhaité, zones de tension et contre-indications sur la fiche client.',
        },
      },
      {
        step: '03',
        title: {
          en: '5-Pack & 10-Pack Prepaid Wellness Passes',
          es: 'Bonos de 5 y 10 Sesiones Prepagadas',
          de: '5er- & 10er-Karten Guthabenverwaltung',
          fr: 'Carnets de 5 ou 10 Séances Prépayées',
        },
        desc: {
          en: 'Sell bundled session credits upfront. When clients book online, credits automatically deduct without manual bookkeeping.',
          es: 'Vende paquetes de sesiones por adelantado. Al agendar en la web, el saldo se descuenta solo sin líos de cuentas.',
          de: 'Mehrfachkarten verkaufen. Bei Online-Buchung wird das Guthaben automatisch abgezogen.',
          fr: 'Vendez des forfaits prépayés. Lors de la réservation en ligne, la séance est décomptée sans calcul.',
        },
      },
    ],
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
      serviceName: {
        en: '60-Min Therapeutic Deep Tissue + Hot Stones',
        es: 'Masaje Descontracturante 60 min + Piedras Calientes',
        de: '60-Min Tiefengewebe-Massage + Hot Stone',
        fr: 'Massage Thérapeutique 60 min + Pierres Chaudes',
      },
      servicePrice: 110,
      serviceDuration: 60,
      specialistName: 'David S.',
      specialistRole: {
        en: 'Licensed Bodywork Therapist',
        es: 'Terapeuta Corporal',
        de: 'Staatlicher Masseur',
        fr: 'Massothérapeute',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      stationTitle: {
        en: 'TREATMENT ROOM #1',
        es: 'CABINA DE TERAPIA #1',
        de: 'BEHANDLUNGSRAUM #1',
        fr: 'CABINE DE SOIN #1',
      },
      stationDesc: {
        en: 'Deep Tissue (60m) + 15m Buffer',
        es: 'Masaje Profundo (60 min) + 15 min de Pausa',
        de: 'Tiefengewebe (60 Min) + 15 Min Puffer',
        fr: 'Massage Profond (60 min) + 15 min de pause',
      },
      specTitle: {
        en: 'Client Therapy Record #410',
        es: 'Ficha Terapéutica del Paciente #410',
        de: 'Behandlungsprotokoll #410',
        fr: 'Fiche de Suivi Thérapeutique #410',
      },
      specLines: {
        en: ['Focus area: Upper shoulders & lumbar', 'Pressure level: Firm (7/10)', 'Digital health consent verified'],
        es: ['Zona prioritaria: Hombros y zona lumbar', 'Nivel de presión: Firme (7/10)', 'Consentimiento de salud verificado'],
        de: ['Schwerpunkt: Schultergürtel & Lendenwirbelsäule', 'Druckstärke: Kräftig (7/10)', 'Gesundheitsabfrage digital bestätigt'],
        fr: ['Zone ciblée : Épaules et lombaires', 'Niveau de pression : Ferme (7/10)', 'Décharge de santé validée'],
      },
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
      en: 'AirBook for Pet Grooming Salons & Dog Spas',
      es: 'AirBook para Peluquerías Caninas y Spas de Mascotas',
      de: 'AirBook für Hundesalons & Tierpflege',
      fr: 'AirBook pour Salons de Toilettage & Spas Canins',
    },
    heroPhoto: '/brand/photos/candid/pet-grooming.jpg',
    heroPhotoTag: {
      en: 'Canine Styling & Pet Spa',
      es: 'Peluquería Canina y Spa',
      de: 'Hundesalon & Tierpflege',
      fr: 'Salon de Toilettage pour Animaux',
    },
    heroPhotoCaption: {
      en: 'Friendly stylist gently grooming fluffy golden doodle on stainless steel table with mint tiles.',
      es: 'Peluquera canina cepillando cariñosamente a un golden doodle en mesa de acero inoxidable.',
      de: 'Tierpflegerin bei der schonenden Fellpflege eines Golden Doodles.',
      fr: 'Toiletteuse brossant délicatement un golden doodle sur table de toilettage.',
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
      en: 'The purpose-built booking software for pet groomers and dog spas. Manage breed weight tiers, rabies vaccine records, and 1-click automated "Pet is ready for pickup" SMS.',
      es: 'El software de reservas diseñado para peluqueros de mascotas. Administra tarifas por tamaño, vacunas y avisos automáticos de recogida en un toque.',
      de: 'Die Buchungssoftware für Hundesalons mit Gewichtsklassen, Impfpass-Check und automatischer 1-Klick Abhol-SMS.',
      fr: 'La solution de réservation pensée pour toiletteurs. Gérez les tarifs par gabarit, vaccins et SMS « Votre animal est prêt » en 1 clic.',
    },
    accentGradient: 'from-[#0284C7] via-[#06B6D4] to-[#10B981]',
    statsPills: [
      {
        value: 'Tiers',
        label: {
          en: 'Breed & Weight Sizing',
          es: 'Tarifas por Raza y Peso',
          de: 'Rassen- & Gewichtstarife',
          fr: 'Tarifs par Gabarit',
        },
      },
      {
        value: '1-Tap',
        label: {
          en: 'Ready for Pickup SMS',
          es: 'Aviso SMS de Recogida',
          de: '1-Klick Abhol-SMS',
          fr: 'SMS Animal Prêt',
        },
      },
      {
        value: '100%',
        label: {
          en: 'Vaccine Verification',
          es: 'Registro de Vacunas',
          de: 'Impfpass-Check',
          fr: 'Contrôle Vaccinal',
        },
      },
    ],
    testimonial: {
      quote: {
        en: 'Pet parents love receiving the automatic text the second their doodle is finished. Setting prices by weight tiers solved all our phone pricing arguments completely.',
        es: 'A los dueños les encanta recibir el SMS en cuanto su perro está listo. Configurar precios por tamaño y peso resolvió todas las discusiones de tarifas.',
        de: 'Tierhalter sind begeistert von der automatischen SMS zur Abholung. Die Staffelung nach Gewichtsklassen verhindert jede Preisdiskussion.',
        fr: 'Les propriétaires adorent recevoir le SMS dès que leur animal est prêt. Les tarifs par gabarit ont réglé tous les soucis de prix au téléphone.',
      },
      author: 'Jessica T.',
      role: {
        en: 'Certified Master Pet Stylist & Salon Owner',
        es: 'Estilista Canina Certificada y Dueña de Salón',
        de: 'Zertifizierte Tierpflegerin & Saloninhaberin',
        fr: 'Toiletteuse Canin Diplômée & Fondatrice',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'Denver, CO',
    },
    workflowSteps: [
      {
        step: '01',
        title: {
          en: 'Breed, Weight & Coat Selection',
          es: 'Selección de Raza, Peso y Tipo de Manto',
          de: 'Rassen-, Gewichts- & Fell-Auswahl',
          fr: 'Choix de la Race, du Gabarit et du Poil',
        },
        desc: {
          en: 'Pet parents select their dog breed (Toy, Medium, Large, Giant) with automated pricing and duration allocated instantly.',
          es: 'Los dueños eligen la raza y tamaño de su mascota, asignando el precio y duración correctos sin errores.',
          de: 'Tierhalter wählen Rasse und Größe (Klein, Mittel, Groß) mit automatischer Preiskalkulation.',
          fr: 'Les maîtres sélectionnent race et taille avec tarification et durée ajustées automatiquement.',
        },
      },
      {
        step: '02',
        title: {
          en: 'Vaccine & Rabies Certificate Upload',
          es: 'Subida de Carnet de Vacunas y Rabia',
          de: 'Impfpass- & Tollwutnachweis-Upload',
          fr: 'Téléversement du Carnet de Santé & Vaccins',
        },
        desc: {
          en: 'Clients upload digital photos of rabies vaccination records during booking, ensuring salon safety and compliance.',
          es: 'Los clientes adjuntan fotos de la cartilla de vacunación al solicitar cita, garantizando la seguridad en el salón.',
          de: 'Kunden laden den Impfpass direkt bei der Online-Buchung hoch für maximale Salonsicherheit.',
          fr: 'Les clients transmettent l’attestation de vaccination dès la réservation pour une sécurité totale.',
        },
      },
      {
        step: '03',
        title: {
          en: '1-Click "Pet is Ready" SMS Notification',
          es: 'Aviso "Mascota Lista" en 1 Toque por SMS',
          de: '1-Klick SMS "Ihr Tier ist abholbereit"',
          fr: 'Envoi en 1 Clic du SMS "Votre animal est prêt"',
        },
        desc: {
          en: 'Tap one button on your phone or tablet when grooming is done to text the owner with their pickup window and total.',
          es: 'Toca un botón en tu móvil al terminar para enviar un SMS al dueño indicando que ya puede recoger a su mascota.',
          de: 'Ein Klick auf dem Smartphone benachrichtigt den Halter per SMS über die fertige Pflege und Abholung.',
          fr: 'Appuyez sur un bouton dès la fin du toilettage pour prévenir le maître avec instructions de récupération.',
        },
      },
    ],
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
      serviceName: {
        en: 'Full Groom + De-shedding (Medium Dog)',
        es: 'Baño Completo + Deslanado (Perro Mediano)',
        de: 'Komplettpflege + Entfilzung (Mittelgroßer Hund)',
        fr: 'Toilettage Complet + Débourrage (Chien Moyen)',
      },
      servicePrice: 85,
      serviceDuration: 75,
      specialistName: 'Jessica T.',
      specialistRole: {
        en: 'Certified Master Groomer',
        es: 'Peluquera Canina Certificada',
        de: 'Zertifizierte Groomerin',
        fr: 'Toiletteuse Certifiée',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      stationTitle: {
        en: 'GROOMING TUB #2',
        es: 'BAÑERA DE PELUQUERÍA #2',
        de: 'WASCHPLATZ #2',
        fr: 'BAC DE TOILETTAGE #2',
      },
      stationDesc: {
        en: 'Golden Doodle (38 lbs) · Full Groom',
        es: 'Golden Doodle (17 kg) · Baño y Corte',
        de: 'Golden Doodle (17 kg) · Komplettpflege',
        fr: 'Golden Doodle (17 kg) · Soin Complet',
      },
      specTitle: {
        en: 'Pet Behavior & Coat Profile #320',
        es: 'Ficha de Comportamiento y Manto #320',
        de: 'Tier- & Fellprofil #320',
        fr: 'Fiche Comportement & Pelage #320',
      },
      specLines: {
        en: ['Pet: Milo (Golden Doodle · 38 lbs)', 'Coat: Teddy bear head, #4 body clip', 'Rabies vaccine valid through 2027'],
        es: ['Mascota: Milo (Golden Doodle · 17 kg)', 'Corte: Cabeza estilo osito, cuerpo cuchilla #4', 'Vacuna de rabia vigente hasta 2027'],
        de: ['Tier: Milo (Golden Doodle · 17 kg)', 'Schnitt: Teddybär-Kopf, Körper Aufsatz #4', 'Tollwutimpfung gültig bis 2027'],
        fr: ['Animal : Milo (Golden Doodle · 17 kg)', 'Coupe : Tête nounours, corps lame #4', 'Vaccin antirabique valide jusqu’en 2027'],
      },
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
      en: 'AirBook for Personal Trainers & Fitness Coaches',
      es: 'AirBook para Entrenadores Personales y Coaches',
      de: 'AirBook für Personal Trainer & Fitness-Coaches',
      fr: 'AirBook pour Coachs Sportifs & Fitness',
    },
    heroPhoto: '/brand/photos/candid/fitness-trainer.jpg',
    heroPhotoTag: {
      en: 'Private Athletic Training Bay',
      es: 'Zona de Entrenamiento Personal',
      de: 'Personal-Training-Studio',
      fr: 'Espace de Coaching Sportif Privé',
    },
    heroPhotoCaption: {
      en: 'Charismatic trainer in slate athletic tee coaching dynamic kettlebell movement in private gym.',
      es: 'Entrenador personal guiando un movimiento dinámico con pesa rusa en gimnasio privado.',
      de: 'Personal Trainer bei der individuellen Betreuung von Kraftübungen.',
      fr: 'Coach sportif accompagnant un mouvement dynamique en salle de sport privée.',
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
      en: 'The all-in-one booking platform for private trainers, strength coaches, and boutique fitness studios. Enforce 24h cancellation rules and track session credits automatically.',
      es: 'La plataforma todo en uno para entrenadores personales y estudios fitness. Aplica políticas de cancelación de 24h y gestiona bonos de sesiones en automático.',
      de: 'Die Buchungssoftware für Personal Trainer und Studios. 24h-Stornoregeln durchsetzen und Trainingsguthaben verwalten.',
      fr: 'La plateforme complète pour coachs personnels et studios de fitness. Gestion des forfaits de séances et respect des préavis d’annulation.',
    },
    accentGradient: 'from-[#4F46E5] via-[#7C3AED] to-[#06B6D4]',
    statsPills: [
      {
        value: 'Passes',
        label: {
          en: 'Session Credit Packs',
          es: 'Bonos de Sesiones',
          de: '10er-Karten-Packs',
          fr: 'Carnets de Séances',
        },
      },
      {
        value: '24h',
        label: {
          en: 'Cancellation Guard',
          es: 'Política de Cancelación',
          de: 'Stornofrist-Schutz',
          fr: 'Préavis Annulation',
        },
      },
      {
        value: 'PRs',
        label: {
          en: 'Benchmark Tracking',
          es: 'Registro de Marcas',
          de: 'Leistungs-Tracking',
          fr: 'Suivi Performances',
        },
      },
    ],
    testimonial: {
      quote: {
        en: 'Punch cards deduct automatically on booking, and the 24h cancellation enforcement protects my income completely. My clients book their weekly slots in seconds.',
        es: 'Los bonos se descuentan solos al agendar y la política de 24h protege mis ingresos. Mis alumnos eligen sus horas en segundos sin cruzar mensajes.',
        de: '10er-Karten buchen sich automatisch ab und die 24h-Stornoregel sichert mein Einkommen ab. Kunden reservieren ihre Stunden in Sekundenschnelle.',
        fr: 'Les forfaits se décomptent automatiquement et la règle des 24h sécurise mes revenus. Mes clients réservent leurs créneaux en quelques secondes.',
      },
      author: 'Jordan M.',
      role: {
        en: 'CSCS Strength & Conditioning Coach',
        es: 'Entrenador de Fuerza y Acondicionamiento CSCS',
        de: 'Zertifizierter Kraft- & Konditionstrainer',
        fr: 'Préparateur Physique & Coach Sportif CSCS',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Chicago, IL',
    },
    workflowSteps: [
      {
        step: '01',
        title: {
          en: 'Self-Service Slot Booking from Bio Link',
          es: 'Reserva Directa de Horas desde tu Enlace',
          de: 'Direktbuchung der Trainingszeiten',
          fr: 'Réservation Directe des Créneaux en Ligne',
        },
        desc: {
          en: 'Clients view your real-time training bay availability and book their private sessions without endless text messaging.',
          es: 'Tus alumnos ven tu disponibilidad en tiempo real y reservan sus sesiones privadas sin cruzar llamadas ni mensajes.',
          de: 'Kunden sehen freie Trainingszeiten in Echtzeit und buchen direkt ohne langes Hin- und Herschreiben.',
          fr: 'Vos clients consultent vos disponibilités en temps réel et réservent leurs séances sans échange de SMS.',
        },
      },
      {
        step: '02',
        title: {
          en: 'Automated 10-Pack Session Punch Deductions',
          es: 'Descuento Automático de Bonos de 10 Sesiones',
          de: 'Automatischer Abzug von 10er-Karten-Guthaben',
          fr: 'Décompte Automatique des Forfaits de 10 Séances',
        },
        desc: {
          en: 'Clients purchase multi-session training packs that deduct one credit every time an appointment is scheduled.',
          es: 'Vende bonos de sesiones que descuentan un crédito cada vez que el alumno agenda una clase.',
          de: 'Kunden erwerben Trainingspakete, bei denen jede Buchung automatisch eine Einheit abbucht.',
          fr: 'Vendez des packs d’entraînement dont chaque séance est décomptée lors de la réservation.',
        },
      },
      {
        step: '03',
        title: {
          en: 'Strict 24h Cancellation Rule & Automated Waitlists',
          es: 'Política Estricta de 24h y Lista de Espera',
          de: 'Feste 24h-Stornofrist & Automatische Warteliste',
          fr: 'Préavis de 24h & Liste d’Attente Automatique',
        },
        desc: {
          en: 'Late cancellations deduct credits automatically, and freed-up spots are instantly offered to clients on your digital waitlist.',
          es: 'Cancelaciones tardías descuentan la sesión y el hueco libre se ofrece de inmediato a la lista de espera.',
          de: 'Kurzfristige Absagen werden berechnet und freie Plätze sofort an die Warteliste vergeben.',
          fr: 'Toute annulation tardive décompte la séance et le créneau libéré est proposé aux personnes en attente.',
        },
      },
    ],
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
      serviceName: {
        en: '1-on-1 Strength & Conditioning Session',
        es: 'Sesión Privada 1 a 1 de Fuerza y Acondicionamiento',
        de: '1-zu-1 Personal Training Kraft & Kondition',
        fr: 'Séance Individuelle de Renforcement & Cardio',
      },
      servicePrice: 90,
      serviceDuration: 60,
      specialistName: 'Jordan M.',
      specialistRole: {
        en: 'CSCS Strength Coach',
        es: 'Entrenador de Fuerza CSCS',
        de: 'Kraft- & Athletiktrainer',
        fr: 'Préparateur Physique CSCS',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      stationTitle: {
        en: 'TRAINING BAY #1',
        es: 'ZONA DE ENTRENAMIENTO #1',
        de: 'TRAININGSBEREICH #1',
        fr: 'ESPACE ENTRAÎNEMENT #1',
      },
      stationDesc: {
        en: '1-on-1 Session (60m) · Active Pass',
        es: 'Sesión 1 a 1 (60 min) · Pase Activo',
        de: '1-zu-1 Session (60 Min) · Aktives Abo',
        fr: 'Séance 1:1 (60 min) · Forfait Actif',
      },
      specTitle: {
        en: 'Client Training Pass #5012',
        es: 'Ficha de Pase de Entrenamiento #5012',
        de: 'Kunden-Trainingspass #5012',
        fr: 'Fiche d’Entraînement #5012',
      },
      specLines: {
        en: ['Client: Sarah K. (8/10 sessions remaining)', 'Focus: Lower body squat & hip hinge', '24h cancellation policy active'],
        es: ['Alumno: Sarah K. (8/10 sesiones restantes)', 'Enfoque: Sentadilla y bisagra de cadera', 'Política de cancelación 24h activa'],
        de: ['Kunde: Sarah K. (8/10 Einheiten verbleibend)', 'Fokus: Kniebeuge & Kreuzheben Technik', '24h-Stornoregelung aktiv'],
        fr: ['Client : Sarah K. (8/10 séances restantes)', 'Cible : Squat et mobilité de hanche', 'Règle d’annulation 24h active'],
      },
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
  const { t, language } = useTranslation();
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const config = INDUSTRY_CONFIGS[slug];

  if (!config) {
    notFound();
  }

  const currentLang = (['en', 'es', 'de', 'fr'].includes(language) ? language : 'en') as 'en' | 'es' | 'de' | 'fr';
  const { data: session } = useSession();
  const leadSpecialist = getDemoSpecialists(language)[0];

  const [demoSlot, setDemoSlot] = useState('11:30 AM');
  const [isDemoBooked, setIsDemoBooked] = useState(false);

  const DEMO_SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white relative overflow-x-hidden font-sans">
      {/* ─── STICKY MASTER HEADER NAVIGATION ─── */}
      <MarketingHeader />

      {/* ─── HERO STAGE (WITH CORRELATED CANDID HERO PHOTOGRAPHY) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-10 lg:p-12 rounded-[36px] sm:rounded-[48px] bg-[#F5F5F7] dark:bg-[#141720]/70 border border-slate-200/80 dark:border-[var(--border-subtle)] shadow-sm space-y-10"
        >
          {/* Main 2-Column Hero: Left Text & Value Props + Right Full-Height Correlated Candid Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Craft Badge, Headline, Subtitle, Metric Pills, CTAs */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between space-y-6 text-left py-1">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--border-subtle)] text-xs font-bold text-[#2BB5FF] shadow-xs">
                  <Sparkle24Regular className="w-3.5 h-3.5" />
                  <span>{config.badge[currentLang]}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.08]">
                  {config.heroHeadline1[currentLang]} <br />
                  <span className={`bg-gradient-to-r ${config.accentGradient} bg-clip-text text-transparent`}>
                    {config.heroHeadline2[currentLang]}
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed font-medium">
                  {config.heroSubtitle[currentLang]}
                </p>
              </div>

              {/* 3 Metric Value Pills */}
              <div className="grid grid-cols-3 gap-2.5 max-w-lg">
                {config.statsPills.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xs space-y-0.5"
                  >
                    <p className="text-base sm:text-lg font-black font-mono text-[#2BB5FF] leading-tight">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-extrabold text-[var(--text-secondary)] leading-tight">
                      {stat.label[currentLang]}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Action Pair */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {session?.user ? (
                  <Link
                    href="/dashboard"
                    className="btn-primary px-7 py-3.5 text-xs flex items-center gap-2"
                  >
                    <span>{t('goToDashboard')}</span>
                    <ArrowRight24Filled className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href={`/onboarding?industry=${encodeURIComponent(config.slug)}`}
                    className="btn-primary px-7 py-3.5 text-xs flex items-center gap-2"
                  >
                    <span>{t('startFreeTrialBtn')}</span>
                    <ArrowRight24Filled className="w-3.5 h-3.5" />
                  </Link>
                )}
                <Link
                  href={session?.user ? '/book/eduardos-lounge' : `/onboarding?redirect=${encodeURIComponent('/book/eduardos-lounge')}&reason=demo_storefront`}
                  className="btn-secondary px-5 py-3.5 text-xs flex items-center gap-2"
                >
                  <Globe24Regular className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>{t('seeLiveDemo')}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Full-Height Candid Photo Showcase Card */}
            <div className="lg:col-span-6 xl:col-span-5 relative w-full flex flex-col">
              <div className="relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] rounded-[32px] sm:rounded-[36px] overflow-hidden bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] shadow-2xl group flex flex-col justify-between">
                <img
                  src={config.heroPhoto}
                  alt={config.badge[currentLang]}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
                />

                {/* Subtle Ambient Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

                {/* Top Floating Tag Pill with Live Pulse Dot */}
                <div className="relative z-10 m-4 sm:m-5 self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{config.heroPhotoTag[currentLang]}</span>
                </div>

                {/* Bottom Candid Context Caption */}
                <div className="relative z-10 m-4 sm:m-5 p-4 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 text-left shadow-lg">
                  <p className="text-xs text-white/95 font-medium leading-relaxed">
                    {config.heroPhotoCaption[currentLang]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── INTERACTIVE HERO SPECIALTY SIMULATOR ─── */}
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)] tracking-tight">
                  {t('demoInteractiveTitle')}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  Experience how your clients book and pay deposits seamlessly in under 30 seconds.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Live Client Experience</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Interactive Booking Simulator Box */}
              <div className="lg:col-span-7 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] p-6 shadow-xl space-y-4 text-left">
                {/* Service Details Card */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-[var(--text-primary)]">
                      {config.simulator.serviceName[currentLang]}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {config.simulator.serviceDuration} mins · Fast confirmation
                    </p>
                  </div>
                  <span className="text-sm font-mono font-black text-[#2BB5FF]">
                    ${config.simulator.servicePrice}
                  </span>
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
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {config.simulator.specialistRole[currentLang]}
                    </p>
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

              {/* Right: Operator Workstation Status & Technical Record Card */}
              <div className="lg:col-span-5 space-y-4 text-left">
                {/* Card 1: Station Status */}
                <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] p-5 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                      {config.simulator.stationTitle[currentLang]}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-[var(--text-primary)]">
                    {config.simulator.stationDesc[currentLang]}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                    Specialist: {leadSpecialist.name}
                  </p>
                </div>

                {/* Card 2: Technical Record */}
                <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] p-5 shadow-lg space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between font-sans">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                      {config.simulator.specTitle[currentLang]}
                    </span>
                  </div>
                  {config.simulator.specLines[currentLang].map((line, idx) => (
                    <p key={idx} className="text-[var(--text-secondary)]">
                      • {line}
                    </p>
                  ))}
                  <p className="text-emerald-500 font-bold font-sans text-[10px] pt-1">
                    Logged automatically upon checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 3 CRAFT VALUE PILLARS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-center flex flex-col items-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center mb-1">
              <Sparkle24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{config.pillar1.title[currentLang]}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{config.pillar1.desc[currentLang]}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-center flex flex-col items-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1">
              <ShieldCheckmark24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{config.pillar2.title[currentLang]}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{config.pillar2.desc[currentLang]}</p>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-center flex flex-col items-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center mb-1">
              <Clock24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{config.pillar3.title[currentLang]}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{config.pillar3.desc[currentLang]}</p>
          </div>
        </div>
      </section>

      {/* ─── 3-STEP SEAMLESS WORKFLOW BREAKDOWN ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10 w-full">
        <div className="p-8 sm:p-12 rounded-[36px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-8 shadow-sm">
          <div className="max-w-2xl space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2BB5FF]/10 text-[#2BB5FF] text-xs font-bold">
              <Sparkle24Regular className="w-3.5 h-3.5" />
              <span>Tailored Daily Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              How {config.badge[currentLang].replace(/^AirBook for /i, '')} Pros Run on AirBook
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
              From first Instagram tap to evening card payout — automated end-to-end with zero commission fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.workflowSteps.map((stepItem, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 text-left shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <span className="text-xs font-black text-[#2BB5FF] bg-[#2BB5FF]/10 px-2.5 py-1 rounded-xl inline-block font-mono">
                    {stepItem.step}
                  </span>
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)] leading-snug">
                    {stepItem.title[currentLang]}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {stepItem.desc[currentLang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRACTITIONER TESTIMONIAL / SOCIAL PROOF ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10 w-full">
        <div className="p-6 sm:p-10 rounded-[32px] bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 border border-blue-500/20 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-3 max-w-3xl">
            <p className="text-sm sm:text-base font-semibold text-[var(--text-primary)] italic leading-relaxed">
              “{config.testimonial.quote[currentLang]}”
            </p>
            <div className="flex items-center gap-3">
              <img
                src={config.testimonial.avatar}
                alt={config.testimonial.author}
                className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)]"
              />
              <div>
                <p className="text-xs font-extrabold text-[var(--text-primary)]">
                  {config.testimonial.author}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {config.testimonial.role[currentLang]} · {config.testimonial.location}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 self-end sm:self-center">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star24Regular key={i} className="w-4 h-4 text-amber-500" />
              ))}
            </div>
            <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1 text-right">
              Verified 5.0 Star Operator
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4 FEATURE CARDS STAGE ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10 w-full">
        <div className="p-6 sm:p-12 rounded-[36px] bg-gradient-to-br from-[#F6F3FF] via-[#FAF8FF] to-[#EFF6FF] dark:from-purple-950/20 dark:via-purple-900/10 dark:to-sky-950/20 border border-purple-100/80 dark:border-purple-900/30 shadow-xl space-y-8">
          <div className="max-w-xl space-y-2 text-left">
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
                className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm text-left"
              >
                <span className="text-xs font-black text-[#2BB5FF] bg-[#2BB5FF]/10 px-2.5 py-1 rounded-xl inline-block font-mono">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10 w-full">
        <div className="p-8 sm:p-14 rounded-[36px] sm:rounded-[48px] bg-[#F5F5F7] dark:bg-[#141720]/70 border border-slate-200/80 dark:border-[var(--border-subtle)] text-center space-y-6 shadow-sm">
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight max-w-2xl mx-auto">
            {config.badge[currentLang]}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto font-medium">
            {t('ctaBannerSubtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="btn-primary px-8 py-3.5 text-xs flex items-center gap-2"
              >
                <span>{t('goToDashboard')}</span>
                <ArrowRight24Filled className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href={`/onboarding?industry=${encodeURIComponent(config.slug)}`}
                className="btn-primary px-8 py-3.5 text-xs flex items-center gap-2"
              >
                <span>{t('startFreeTrialBtn')}</span>
                <ArrowRight24Filled className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── MASTER FOOTER ─── */}
      <MarketingFooter />
    </div>
  );
}
