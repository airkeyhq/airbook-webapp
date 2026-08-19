import { create } from 'zustand';

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  color: string;
  category: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
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
  startTime: string; // HH:mm
  durationMinutes: number;
  price: number;
  color: string;
  status: 'confirmed' | 'pending' | 'completed';
  notes?: string;
}

export interface AddOnSettings {
  hipaa: boolean;
  esign: boolean;
  kyc: boolean;
}

export interface StationItem {
  id: string;
  name: string;
  category?: string;
}

export interface AirBookState {
  // Theme & Workspace
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  workspaceSlug: string;
  setWorkspaceSlug: (slug: string) => void;
  businessType: string;
  setBusinessType: (type: string) => void;

  // Demo Mode
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  loadDemoData: () => void;
  clearAllData: () => void;

  // Sidebar Collapse State
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // View & Date & Staff Filter State
  selectedDateStr: string; // YYYY-MM-DD
  setSelectedDateStr: (date: string) => void;
  viewMode: 'day' | 'week' | 'list';
  setViewMode: (mode: 'day' | 'week' | 'list') => void;
  selectedStaffId: string | 'all';
  setSelectedStaffId: (id: string | 'all') => void;

  // Calendar Provider Color Settings (auto = system auto-balanced, custom = user selected)
  providerColorMode: 'auto' | 'custom';
  setProviderColorMode: (mode: 'auto' | 'custom') => void;

  // Time & Hour Format Setting ('12h' = 12-hour AM/PM, '24h' = 24-hour military)
  timeFormat: '12h' | '24h';
  setTimeFormat: (format: '12h' | '24h') => void;

  // Add-On Modules & Beta Program
  addons: AddOnSettings;
  setAddons: (addons: Partial<AddOnSettings>) => void;
  toggleAddon: (key: keyof AddOnSettings) => void;
  isBetaAccess: boolean;
  setBetaAccess: (enabled: boolean) => void;
  unlockBetaWithCode: (code: string) => boolean;

  // Drawer & Command Palette Modals
  isBookingDrawerOpen: boolean;
  selectedSlotTime: string | null;
  openBookingDrawer: (slotTime?: string) => void;
  closeBookingDrawer: () => void;

  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // Pricing Modal State
  isPricingModalOpen: boolean;
  openPricingModal: () => void;
  closePricingModal: () => void;

  // Data Collections
  services: Service[];
  staffMembers: Staff[];
  appointments: Appointment[];
  stations: StationItem[];

  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  setAppointments: (appointments: Appointment[]) => void;
  deleteAppointment: (id: string) => void;
  setServices: (services: Service[]) => void;
  setStaffMembers: (staff: Staff[]) => void;
  addStation: (station: Omit<StationItem, 'id'>) => void;
  updateStation: (id: string, name: string, category?: string) => void;
  deleteStation: (id: string) => void;
}

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

// Sample Demo Datasets (Strictly used when Demo Mode is ON or explicitly requested)
export const DEMO_SERVICES: Service[] = [
  { id: 'srv-1', name: 'Haircut & Precision Styling', durationMinutes: 45, price: 75, color: '#FF4D8D', category: 'Hair' },
  { id: 'srv-2', name: 'Beard Sculpting & Hot Towel', durationMinutes: 30, price: 45, color: '#00C7BE', category: 'Barber' },
  { id: 'srv-3', name: 'HydraFacial Glow Treatment', durationMinutes: 60, price: 160, color: '#9D50BB', category: 'Spa' },
  { id: 'srv-4', name: 'Deep Tissue Body Therapy', durationMinutes: 60, price: 130, color: '#34C759', category: 'Wellness' },
  { id: 'srv-5', name: 'Botox & Aesthetic Consultation', durationMinutes: 30, price: 220, color: '#FF9500', category: 'Injectables' },
];

export const DEMO_STAFF: Staff[] = [
  { id: 'stf-1', name: 'Eduardo Moreno', role: 'Master Stylist & Owner', avatar: '👨🏻‍🎨', color: '#007AFF' },
  { id: 'stf-2', name: 'Dennis Müller', role: 'Senior Aesthetician', avatar: '🧑🏼‍⚕️', color: '#34C759' },
  { id: 'stf-3', name: 'Ivo Silva', role: 'Therapy Specialist', avatar: '🧔🏻‍♂️', color: '#FF9500' },
  { id: 'stf-4', name: 'Agnes K.', role: 'Spa Director', avatar: '👩🏼‍🦱', color: '#9D50BB' },
];

export const DEMO_APPOINTMENTS: Appointment[] = [
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
    color: '#34C759',
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
    color: '#FF9500',
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
    color: '#FF9500',
    status: 'completed',
    notes: 'Regular 2-week maintenance.',
  },
];

export const useAirBookStore = create<AirBookState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  workspaceName: "AirBook Business Workspace",
  setWorkspaceName: (name) => set({ workspaceName: name }),
  workspaceSlug: '',
  setWorkspaceSlug: (slug) => set({ workspaceSlug: slug }),
  businessType: 'salon',
  setBusinessType: (type) => set({ businessType: type }),

  // Demo Mode (Defaults to FALSE in production so real DB data is shown!)
  isDemoMode: false,
  toggleDemoMode: () =>
    set((state) => {
      const nextDemo = !state.isDemoMode;
      return {
        isDemoMode: nextDemo,
        services: nextDemo ? DEMO_SERVICES : [],
        staffMembers: nextDemo ? DEMO_STAFF : [],
        appointments: nextDemo ? DEMO_APPOINTMENTS : [],
      };
    }),
  loadDemoData: () =>
    set({
      isDemoMode: true,
      services: DEMO_SERVICES,
      staffMembers: DEMO_STAFF,
      appointments: DEMO_APPOINTMENTS,
    }),
  clearAllData: () =>
    set({
      isDemoMode: false,
      services: [],
      staffMembers: [],
      appointments: [],
    }),

  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  selectedDateStr: TODAY_STR,
  setSelectedDateStr: (dateStr) => set({ selectedDateStr: dateStr }),
  viewMode: 'week',
  setViewMode: (mode) => set({ viewMode: mode }),
  selectedStaffId: 'all',
  setSelectedStaffId: (id) => set({ selectedStaffId: id }),

  providerColorMode: 'auto',
  setProviderColorMode: (mode) => set({ providerColorMode: mode }),

  timeFormat: '12h',
  setTimeFormat: (format) => set({ timeFormat: format }),

  addons: { hipaa: false, esign: true, kyc: false },
  setAddons: (newAddons) => set((state) => ({ addons: { ...state.addons, ...newAddons } })),
  toggleAddon: (key) => set((state) => ({ addons: { ...state.addons, [key]: !state.addons[key] } })),
  isBetaAccess: false,
  setBetaAccess: (enabled) => set({ isBetaAccess: enabled }),
  unlockBetaWithCode: (code) => {
    const validCodes = ['AIRBOOK-BETA-2026', 'BETA', 'EARLYACCESS', 'AIRBOOKVIP'];
    const isValid = validCodes.includes(code.trim().toUpperCase());
    if (isValid) {
      set({ isBetaAccess: true });
    }
    return isValid;
  },

  isBookingDrawerOpen: false,
  selectedSlotTime: null,
  openBookingDrawer: (slotTime) => set({ isBookingDrawerOpen: true, selectedSlotTime: slotTime || '10:00' }),
  closeBookingDrawer: () => set({ isBookingDrawerOpen: false, selectedSlotTime: null }),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  isPricingModalOpen: false,
  openPricingModal: () => set({ isPricingModalOpen: true }),
  closePricingModal: () => set({ isPricingModalOpen: false }),

  // Defaults to empty array so real DB data populates without hardcoded overrides!
  services: [],
  staffMembers: [],
  appointments: [],

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
  setServices: (srvs) => set({ services: srvs }),
  setStaffMembers: (stf) => set({ staffMembers: stf }),

  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),
  stations: [
    { id: 'stn-1', name: 'Station 1 (Hair & Styling)', category: 'Hair' },
    { id: 'stn-2', name: 'Station 2 (Color & Wash Bar)', category: 'Color' },
    { id: 'stn-3', name: 'Station 3 (Spa & Facial Suite)', category: 'Spa' },
    { id: 'stn-4', name: 'Station 4 (Nails & Pedicure)', category: 'Nails' },
  ],
  addStation: (station) =>
    set((state) => ({
      stations: [...state.stations, { ...station, id: `stn-${Date.now()}` }],
    })),
  updateStation: (id, name, category) =>
    set((state) => ({
      stations: state.stations.map((st) => (st.id === id ? { ...st, name, category } : st)),
    })),
  deleteStation: (id) =>
    set((state) => ({
      stations: state.stations.filter((st) => st.id !== id),
    })),
}));
