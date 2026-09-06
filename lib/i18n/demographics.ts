/**
 * Demographic Persona & Avatar Localization System
 * 
 * Provides culturally relatable, diverse demographic profiles and avatars
 * tailored to each supported locale (EN, ES, DE, FR) for marketing simulators,
 * staff previews, and client profiles.
 */

export interface DemoSpecialist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  station: string;
}

export interface DemoClient {
  name: string;
  initials: string;
  avatar?: string;
  note: string;
}

export const LOCALIZED_SPECIALISTS: Record<'en' | 'es' | 'de' | 'fr', DemoSpecialist[]> = {
  en: [
    {
      id: 'sarah',
      name: 'Sarah M.',
      role: 'Lead Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      station: 'Master Suite 1',
    },
    {
      id: 'marcus',
      name: 'Marcus V.',
      role: 'Senior Associate',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      station: 'Chair 2 (Barber & Cut)',
    },
    {
      id: 'priya',
      name: 'Priya K.',
      role: 'Practitioner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      station: 'Suite 3 (Aesthetics)',
    },
  ],
  es: [
    {
      id: 'sofia',
      name: 'Sofía M.',
      role: 'Especialista Principal',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      station: 'Suite Principal 1',
    },
    {
      id: 'mateo',
      name: 'Mateo R.',
      role: 'Asociado Senior',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      station: 'Sillón 2 (Corte y Barba)',
    },
    {
      id: 'valeria',
      name: 'Valeria C.',
      role: 'Terapeuta y Estética',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
      station: 'Cabina 3 (Tratamientos)',
    },
  ],
  de: [
    {
      id: 'hannah',
      name: 'Hannah S.',
      role: 'Leitende Spezialistin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      station: 'Hauptplatz 1',
    },
    {
      id: 'lukas',
      name: 'Lukas W.',
      role: 'Senior Stylist',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      station: 'Stuhl 2 (Herren & Schnitt)',
    },
    {
      id: 'sophie',
      name: 'Sophie M.',
      role: 'Praktikerin & Ästhetik',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      station: 'Raum 3 (Kosmetik)',
    },
  ],
  fr: [
    {
      id: 'camille',
      name: 'Camille L.',
      role: 'Spécialiste Principale',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      station: 'Suite Principale 1',
    },
    {
      id: 'julien',
      name: 'Julien M.',
      role: 'Associé Senior',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&auto=format&fit=crop&q=80',
      station: 'Fauteuil 2 (Barbier & Coupe)',
    },
    {
      id: 'manon',
      name: 'Manon D.',
      role: 'Praticienne & Soins',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      station: 'Cabine 3 (Soins Visage)',
    },
  ],
};

export const LOCALIZED_CLIENTS: Record<'en' | 'es' | 'de' | 'fr', DemoClient> = {
  en: {
    name: 'Elena Rostova',
    initials: 'ER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    note: 'Auto SMS confirmed',
  },
  es: {
    name: 'Valeria Morales',
    initials: 'VM',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    note: 'SMS automático confirmado',
  },
  de: {
    name: 'Hannah Weber',
    initials: 'HW',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    note: 'SMS automatisch bestätigt',
  },
  fr: {
    name: 'Camille Moreau',
    initials: 'CM',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    note: 'SMS confirmé automatiquement',
  },
};

export function getDemoSpecialists(lang: string): DemoSpecialist[] {
  const normalized = (['en', 'es', 'de', 'fr'].includes(lang) ? lang : 'en') as 'en' | 'es' | 'de' | 'fr';
  return LOCALIZED_SPECIALISTS[normalized];
}

export function getDemoClient(lang: string): DemoClient {
  const normalized = (['en', 'es', 'de', 'fr'].includes(lang) ? lang : 'en') as 'en' | 'es' | 'de' | 'fr';
  return LOCALIZED_CLIENTS[normalized];
}
