import { create } from 'zustand';

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  color: string; // Tailored pastel accent
  category: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string; // Emoji / Avatar representation
  color: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientAvatar?: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  dateStr: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g., "14:00")
  durationMinutes: number;
  price: number;
  color: string;
  status: 'confirmed' | 'pending' | 'completed';
  notes?: string;
}

interface AirBookState {
  // Theme & Workspace
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  businessType: string;
  setBusinessType: (type: string) => void;

  // View & Date State
  selectedDateStr: string; // YYYY-MM-DD
  setSelectedDateStr: (date: string) => void;
  viewMode: 'day' | 'week' | 'list';
  setViewMode: (mode: 'day' | 'week' | 'list') => void;

  // Drawer & Command Palette Modals
  isBookingDrawerOpen: boolean;
  selectedSlotTime: string | null; // e.g. "14:00"
  openBookingDrawer: (slotTime?: string) => void;
  closeBookingDrawer: () => void;

  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // Data Collections
  services: Service[];
  staffMembers: Staff[];
  appointments: Appointment[];

  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  setAppointments: (appointments: Appointment[]) => void;
  deleteAppointment: (id: string) => void;
}

// Initial Sample Data (Reflecting the Amie.so aesthetics & SaaS booking domain)
const INITIAL_SERVICES: Service[] = [
  { id: 'srv-1', name: 'Haircut & Precision Styling', durationMinutes: 45, price: 75, color: '#FF4D8D', category: 'Hair' },
  { id: 'srv-2', name: 'Beard Sculpting & Hot Towel', durationMinutes: 30, price: 45, color: '#00C7BE', category: 'Barber' },
  { id: 'srv-3', name: 'HydraFacial Glow Treatment', durationMinutes: 60, price: 160, color: '#9D50BB', category: 'Spa' },
  { id: 'srv-4', name: 'Deep Tissue Body Therapy', durationMinutes: 60, price: 130, color: '#34C759', category: 'Wellness' },
  { id: 'srv-5', name: 'Botox & Aesthetic Consultation', durationMinutes: 30, price: 220, color: '#FF9500', category: 'Injectables' },
];

const INITIAL_STAFF: Staff[] = [
  { id: 'stf-1', name: 'Eduardo Moreno', role: 'Master Stylist & Owner', avatar: '👨🏻‍🎨', color: '#007AFF' },
  { id: 'stf-2', name: 'Dennis Müller', role: 'Senior Aesthetician', avatar: '🧑🏼‍⚕️', color: '#34C759' },
  { id: 'stf-3', name: 'Ivo Silva', role: 'Therapy Specialist', avatar: '🧔🏻‍♂️', color: '#FF9500' },
  { id: 'stf-4', name: 'Agnes K.', role: 'Spa Director', avatar: '👩🏼‍🦱', color: '#9D50BB' },
];

const getTodayDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TODAY_STR = getTodayDateStr(0);
const TOMORROW_STR = getTodayDateStr(1);
const YESTERDAY_STR = getTodayDateStr(-1);

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    clientName: 'Mikael from Amie',
    serviceId: 'srv-1',
    serviceName: 'Haircut & Precision Styling',
    staffId: 'stf-1',
    staffName: 'Eduardo Moreno',
    dateStr: TODAY_STR,
    startTime: '09:30',
    durationMinutes: 45,
    price: 75,
    color: '#007AFF',
    status: 'confirmed',
    notes: 'Likes low taper fade with texture on top.',
  },
  {
    id: 'apt-102',
    clientName: 'Agnes x Dennis',
    serviceId: 'srv-5',
    serviceName: 'Botox & Aesthetic Consultation',
    staffId: 'stf-2',
    staffName: 'Dennis Müller',
    dateStr: TODAY_STR,
    startTime: '11:00',
    durationMinutes: 60,
    price: 220,
    color: '#FF9500',
    status: 'confirmed',
    notes: 'First time consultation for wellness glow.',
  },
  {
    id: 'apt-103',
    clientName: 'Ivo Silva',
    serviceId: 'srv-3',
    serviceName: 'HydraFacial Glow Treatment',
    staffId: 'stf-4',
    staffName: 'Agnes K.',
    dateStr: TODAY_STR,
    startTime: '13:30',
    durationMinutes: 60,
    price: 160,
    color: '#AF52DE',
    status: 'confirmed',
    notes: 'Hydration focus before weekend event.',
  },
  {
    id: 'apt-104',
    clientName: 'Kim Nguyen',
    serviceId: 'srv-4',
    serviceName: 'Deep Tissue Body Therapy',
    staffId: 'stf-3',
    staffName: 'Ivo Silva',
    dateStr: TODAY_STR,
    startTime: '15:30',
    durationMinutes: 60,
    price: 130,
    color: '#34C759',
    status: 'pending',
    notes: 'Shoulder tension relief.',
  },
  {
    id: 'apt-105',
    clientName: 'Sarah Jenkins',
    serviceId: 'srv-1',
    serviceName: 'Haircut & Precision Styling',
    staffId: 'stf-1',
    staffName: 'Eduardo Moreno',
    dateStr: TOMORROW_STR,
    startTime: '10:00',
    durationMinutes: 45,
    price: 75,
    color: '#007AFF',
    status: 'confirmed',
    notes: 'Balayage touch up and trim.',
  },
  {
    id: 'apt-106',
    clientName: 'Carlos Rossi',
    serviceId: 'srv-2',
    serviceName: 'Beard Sculpting & Hot Towel',
    staffId: 'stf-3',
    staffName: 'Ivo Silva',
    dateStr: YESTERDAY_STR,
    startTime: '14:00',
    durationMinutes: 30,
    price: 45,
    color: '#FF2D55',
    status: 'completed',
    notes: 'Regular 2-week maintenance.',
  },
];

export const useAirBookStore = create<AirBookState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  workspaceName: "Eduardo Moreno's Workspace",
  setWorkspaceName: (name) => set({ workspaceName: name }),
  businessType: 'salon',
  setBusinessType: (type) => set({ businessType: type }),
  selectedDateStr: TODAY_STR,
  setSelectedDateStr: (dateStr) => set({ selectedDateStr: dateStr }),
  viewMode: 'week',
  setViewMode: (mode) => set({ viewMode: mode }),

  isBookingDrawerOpen: false,
  selectedSlotTime: null,
  openBookingDrawer: (slotTime) => set({ isBookingDrawerOpen: true, selectedSlotTime: slotTime || '10:00' }),
  closeBookingDrawer: () => set({ isBookingDrawerOpen: false, selectedSlotTime: null }),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  services: INITIAL_SERVICES,
  staffMembers: INITIAL_STAFF,
  appointments: INITIAL_APPOINTMENTS,

  addAppointment: (newApt) =>
    set((state) => ({
      appointments: [
        ...state.appointments,
        {
          ...newApt,
          id: `apt-${Date.now()}`,
        },
      ],
      isBookingDrawerOpen: false,
    })),

  setAppointments: (apts) => set({ appointments: apts }),

  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),
}));
