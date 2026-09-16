// ============================================================================
// AIRBOOK CRM & SALES INTELLIGENCE (ATTIO-STYLE ARCHITECTURE)
// ============================================================================

export type DealStage =
  | "lead"
  | "contacted"
  | "demo_scheduled"
  | "trial_active"
  | "negotiation"
  | "closed_won"
  | "churn_risk";

export type IcpScore = "Tier 1 (High Priority)" | "Tier 2 (Strong Fit)" | "Tier 3 (Emerging)";

export type SalonSegment =
  | "Hair Studio"
  | "Barbershop"
  | "Aesthetic Medspa"
  | "Nail Bar"
  | "Multi-Chair Franchise";

export type CompetitorReplaced =
  | "Fresha (20% Fee Trap)"
  | "Vagaro (Add-on Creep)"
  | "Boulevard ($175+ Base)"
  | "Mindbody (Legacy Bloat)"
  | "Square Appointments"
  | "Booksy (Boost Tax)"
  | "Phorest";

export interface DealActivity {
  id: string;
  type: "call" | "sms" | "demo" | "passkey_auth" | "stripe_connect" | "note" | "deal_moved";
  author: string;
  timestamp: string;
  summary: string;
  details?: string;
}

export interface SalonDeal {
  id: string;
  salonName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  city: string;
  country: string;
  segment: SalonSegment;
  chairsCount: number;
  monthlyGmvEst: number;
  currentSoftware: CompetitorReplaced;
  calculatedAnnualSavings: number;
  stage: DealStage;
  targetTier: "solo_pro_29" | "team_79" | "scale_199";
  mrrValue: number;
  arrValue: number;
  icpScore: IcpScore;
  sourceChannel: "Viral Embed Badge" | "Direct Outbound" | "Competitor Comparison Page" | "Instagram DM" | "Word of Mouth";
  assignedRep: string;
  expectedCloseDate: string;
  notes: string;
  activities: DealActivity[];
}

export interface PipelineStageConfig {
  id: DealStage;
  label: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    id: "lead",
    label: "Inbound Lead",
    accentColor: "#94A3B8",
    badgeBg: "bg-slate-500/10",
    badgeBorder: "border-slate-500/20",
    badgeText: "text-slate-600 dark:text-slate-400",
  },
  {
    id: "contacted",
    label: "Contacted / Qualified",
    accentColor: "#3B82F6",
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/20",
    badgeText: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "demo_scheduled",
    label: "Demo Scheduled",
    accentColor: "#8B5CF6",
    badgeBg: "bg-purple-500/10",
    badgeBorder: "border-purple-500/20",
    badgeText: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "trial_active",
    label: "7-Day Pilot Active",
    accentColor: "#F59E0B",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/20",
    badgeText: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "negotiation",
    label: "Proposal & Migration",
    accentColor: "#EC4899",
    badgeBg: "bg-pink-500/10",
    badgeBorder: "border-pink-500/20",
    badgeText: "text-pink-600 dark:text-pink-400",
  },
  {
    id: "closed_won",
    label: "Closed Won (Live)",
    accentColor: "#10B981",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/20",
    badgeText: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "churn_risk",
    label: "At Risk / Churn Alert",
    accentColor: "#EF4444",
    badgeBg: "bg-red-500/10",
    badgeBorder: "border-red-500/20",
    badgeText: "text-red-600 dark:text-red-400",
  },
];

export const INITIAL_SALON_DEALS: SalonDeal[] = [
  {
    id: "deal-001",
    salonName: "Luxe Atelier Tribeca",
    ownerName: "Elena Rostova",
    ownerEmail: "elena@luxeateliertribeca.com",
    ownerPhone: "+1 (212) 555-0192",
    city: "New York, NY",
    country: "US",
    segment: "Hair Studio",
    chairsCount: 8,
    monthlyGmvEst: 48000,
    currentSoftware: "Fresha (20% Fee Trap)",
    calculatedAnnualSavings: 9480,
    stage: "negotiation",
    targetTier: "team_79",
    mrrValue: 79,
    arrValue: 948,
    icpScore: "Tier 1 (High Priority)",
    sourceChannel: "Competitor Comparison Page",
    assignedRep: "Eduardo G.",
    expectedCloseDate: "2026-09-20",
    notes: "Elena pays Fresha over $800/mo in marketplace penalties. Wants white-label CNAME (book.luxeateliertribeca.com) and instant Stripe payouts.",
    activities: [
      {
        id: "act-1",
        type: "demo",
        author: "Eduardo G.",
        timestamp: "2026-09-10T14:30:00Z",
        summary: "Presented 60fps booking drawer and Stripe Terminal WisePad 3.",
        details: "She was blown away by 0% client acquisition tax and instant Apple Pay checkout speed.",
      },
      {
        id: "act-2",
        type: "call",
        author: "Eduardo G.",
        timestamp: "2026-09-11T16:00:00Z",
        summary: "Reviewed client list CSV import from Fresha.",
        details: "1,420 client records formatted with formula color notes.",
      },
    ],
  },
  {
    id: "deal-002",
    salonName: "The Heritage Barber Club",
    ownerName: "Marcus Vance",
    ownerEmail: "marcus@heritagebarber.co.uk",
    ownerPhone: "+44 20 7946 0912",
    city: "London, Mayfair",
    country: "UK",
    segment: "Barbershop",
    chairsCount: 6,
    monthlyGmvEst: 32000,
    currentSoftware: "Booksy (Boost Tax)",
    calculatedAnnualSavings: 6840,
    stage: "trial_active",
    targetTier: "team_79",
    mrrValue: 79,
    arrValue: 948,
    icpScore: "Tier 1 (High Priority)",
    sourceChannel: "Viral Embed Badge",
    assignedRep: "Sarah K.",
    expectedCloseDate: "2026-09-18",
    notes: "Marcus saw AirBook badge on Soho salon website. Active in 7-day pilot with 4 barbers on floor.",
    activities: [
      {
        id: "act-3",
        type: "passkey_auth",
        author: "System",
        timestamp: "2026-09-08T09:12:00Z",
        summary: "Marcus registered owner account with Touch ID Passkey.",
      },
      {
        id: "act-4",
        type: "stripe_connect",
        author: "System",
        timestamp: "2026-09-09T11:45:00Z",
        summary: "Connected Stripe UK bank account with instant GBP daily cashout enabled.",
      },
    ],
  },
  {
    id: "deal-003",
    salonName: "Aura Aesthetics & Laser Spa",
    ownerName: "Dr. Sophia Lindqvist",
    ownerEmail: "sophia@auramedspa.de",
    ownerPhone: "+49 30 2233 4455",
    city: "Berlin, Mitte",
    country: "DE",
    segment: "Aesthetic Medspa",
    chairsCount: 12,
    monthlyGmvEst: 85000,
    currentSoftware: "Boulevard ($175+ Base)",
    calculatedAnnualSavings: 4200,
    stage: "demo_scheduled",
    targetTier: "scale_199",
    mrrValue: 199,
    arrValue: 2388,
    icpScore: "Tier 1 (High Priority)",
    sourceChannel: "Direct Outbound",
    assignedRep: "Eduardo G.",
    expectedCloseDate: "2026-09-25",
    notes: "Boulevard costs them $655/mo with seat surcharges. Sophia needs German i18n consent waivers and treatment photo histories.",
    activities: [
      {
        id: "act-5",
        type: "call",
        author: "Eduardo G.",
        timestamp: "2026-09-07T10:00:00Z",
        summary: "Intro discovery call with Clinic Operations Manager.",
        details: "Confirmed high willingness to pay for HIPAA/GDPR audit logs and multi-room management.",
      },
    ],
  },
  {
    id: "deal-004",
    salonName: "Maison de Beauté Paris",
    ownerName: "Camille Dubois",
    ownerEmail: "camille@maisonbeaute.fr",
    ownerPhone: "+33 1 42 68 55 00",
    city: "Paris, 8th Arr.",
    country: "FR",
    segment: "Multi-Chair Franchise",
    chairsCount: 24,
    monthlyGmvEst: 160000,
    currentSoftware: "Phorest",
    calculatedAnnualSavings: 11200,
    stage: "contacted",
    targetTier: "scale_199",
    mrrValue: 199,
    arrValue: 2388,
    icpScore: "Tier 1 (High Priority)",
    sourceChannel: "Word of Mouth",
    assignedRep: "Sarah K.",
    expectedCloseDate: "2026-10-05",
    notes: "3 locations in Paris and Lyon. Exploring multi-branch consolidated reporting and unified staff permission matrix.",
    activities: [
      {
        id: "act-6",
        type: "sms",
        author: "Sarah K.",
        timestamp: "2026-09-06T15:20:00Z",
        summary: "Sent French product deck and live demo link.",
      },
    ],
  },
  {
    id: "deal-005",
    salonName: "Solaris Nail Lounge",
    ownerName: "Jessica Tran",
    ownerEmail: "jessica@solarisnail.com",
    ownerPhone: "+1 (310) 555-0873",
    city: "Los Angeles, CA",
    country: "US",
    segment: "Nail Bar",
    chairsCount: 10,
    monthlyGmvEst: 55000,
    currentSoftware: "Vagaro (Add-on Creep)",
    calculatedAnnualSavings: 2850,
    stage: "closed_won",
    targetTier: "team_79",
    mrrValue: 79,
    arrValue: 948,
    icpScore: "Tier 2 (Strong Fit)",
    sourceChannel: "Instagram DM",
    assignedRep: "Eduardo G.",
    expectedCloseDate: "2026-09-02",
    notes: "Migrated from Vagaro. Replaced $145/mo in add-ons with AirBook Team $79 flat. Live processing on Stripe Terminal.",
    activities: [
      {
        id: "act-7",
        type: "deal_moved",
        author: "System",
        timestamp: "2026-09-02T18:00:00Z",
        summary: "Deal closed won. Custom domain book.solarisnail.com verified with SSL.",
      },
      {
        id: "act-8",
        type: "stripe_connect",
        author: "System",
        timestamp: "2026-09-03T12:00:00Z",
        summary: "Processed $3,450 first day GMV with zero processing issues.",
      },
    ],
  },
  {
    id: "deal-006",
    salonName: "Bleu Studio Solo Suite",
    ownerName: "Antoine Laurent",
    ownerEmail: "antoine@bleustudio.es",
    ownerPhone: "+34 93 456 7890",
    city: "Barcelona, Eixample",
    country: "ES",
    segment: "Hair Studio",
    chairsCount: 1,
    monthlyGmvEst: 7500,
    currentSoftware: "Square Appointments",
    calculatedAnnualSavings: 540,
    stage: "closed_won",
    targetTier: "solo_pro_29",
    mrrValue: 29,
    arrValue: 348,
    icpScore: "Tier 2 (Strong Fit)",
    sourceChannel: "Competitor Comparison Page",
    assignedRep: "Eduardo G.",
    expectedCloseDate: "2026-09-05",
    notes: "Solo balayage master. Loves mobile drawer UX and Spanish localization.",
    activities: [
      {
        id: "act-9",
        type: "deal_moved",
        author: "System",
        timestamp: "2026-09-05T10:00:00Z",
        summary: "Subscribed to Solo Pro plan ($29/mo).",
      },
    ],
  },
  {
    id: "deal-007",
    salonName: "Sovereign Blades",
    ownerName: "Darius Thorne",
    ownerEmail: "darius@sovereignblades.com",
    ownerPhone: "+1 (773) 555-0341",
    city: "Chicago, IL",
    country: "US",
    segment: "Barbershop",
    chairsCount: 5,
    monthlyGmvEst: 28000,
    currentSoftware: "Booksy (Boost Tax)",
    calculatedAnnualSavings: 5800,
    stage: "lead",
    targetTier: "team_79",
    mrrValue: 79,
    arrValue: 948,
    icpScore: "Tier 2 (Strong Fit)",
    sourceChannel: "Viral Embed Badge",
    assignedRep: "Sarah K.",
    expectedCloseDate: "2026-10-10",
    notes: "Inbound lead via marketing website. Frustrated by Booksy charging 50% commission on repeat clients.",
    activities: [
      {
        id: "act-10",
        type: "note",
        author: "Sarah K.",
        timestamp: "2026-09-12T11:00:00Z",
        summary: "Sent automated introductory email with TCO calculator link.",
      },
    ],
  },
];
