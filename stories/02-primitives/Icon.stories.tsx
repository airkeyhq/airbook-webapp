import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@/components/primitives/Icon';
import {
  Alert24Regular,
  Alert24Filled,
  Heart24Regular,
  Heart24Filled,
  Calendar24Regular,
  Delete24Filled,
  Sparkle24Regular,
  Sparkle24Filled,
} from '@fluentui/react-icons';
import {
  SalonScissorsRegular,
  SalonScissorsFilled,
  BarberRazorRegular,
  BarberRazorFilled,
  MedSpaRegular,
  MedSpaFilled,
  NailAndLashesRegular,
  NailAndLashesFilled,
  TattooMachineRegular,
  TattooMachineFilled,
  MassageZenRegular,
  MassageZenFilled,
  PetGroomingPawRegular,
  PetGroomingPawFilled,
  FitnessDumbbellRegular,
  FitnessDumbbellFilled,
  ColoristsRegular,
  ColoristsFilled,
  EstheticiansRegular,
  EstheticiansFilled,
  WellnessRegular,
  WellnessFilled,
  BoothRentersRegular,
  BoothRentersFilled,
  ClinicMedicalRegular,
  ClinicMedicalFilled,
  PhotographyRegular,
  PhotographyFilled,
  AutoDetailingRegular,
  AutoDetailingFilled,
  MusicLessonsRegular,
  MusicLessonsFilled,
  ConsultingRegular,
  ConsultingFilled,
  TutoringRegular,
  TutoringFilled,
  HomeServicesRegular,
  HomeServicesFilled,
  OptometryRegular,
  OptometryFilled,
} from '@/components/icons/SpecialtyIcons';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tree-shakeable `Icon` primitive with standardized size/tone tokens and `regular` (display) vs `filled` (action/active) switching.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    tone: {
      control: { type: 'select' },
      options: ['inherit', 'primary', 'secondary', 'muted', 'accent', 'success', 'warning', 'danger'],
    },
    active: { control: 'boolean' },
    spin: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  render: () => {
    const [liked, setLiked] = useState(false);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-5 max-w-md">
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Display (Outline / Regular)
          </div>
          <div className="flex items-center gap-4">
            <Icon regular={Calendar24Regular} size="md" tone="secondary" />
            <Icon regular={Alert24Regular} size="lg" tone="accent" />
            <Icon regular={Sparkle24Regular} size="xl" tone="muted" />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Action &amp; Interactive Toggle (Filled)
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLiked((v) => !v)}
              className="btn-secondary !h-9 !px-3 text-xs"
            >
              <Icon
                regular={Heart24Regular}
                filled={Heart24Filled}
                active={liked}
                tone={liked ? 'danger' : 'secondary'}
              />
              <span>{liked ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button type="button" className="btn-primary !h-9 !px-3 text-xs">
              <Icon filled={Sparkle24Filled} size="sm" />
              <span>Create</span>
            </button>

            <button type="button" className="btn-secondary !h-9 !px-3 text-xs text-rose-500">
              <Icon filled={Delete24Filled} size="sm" tone="danger" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  },
};

const SPECIALTY_SVGS = [
  { name: 'SalonScissors', label: 'Hair Salons', regular: SalonScissorsRegular, filled: SalonScissorsFilled, color: '#E11D48', bg: 'bg-rose-500/15' },
  { name: 'BarberRazor', label: 'Barbershops', regular: BarberRazorRegular, filled: BarberRazorFilled, color: '#D97706', bg: 'bg-amber-500/15' },
  { name: 'MedSpa', label: 'MedSpas', regular: MedSpaRegular, filled: MedSpaFilled, color: '#9333EA', bg: 'bg-purple-500/15' },
  { name: 'NailAndLashes', label: 'Nails & Lashes', regular: NailAndLashesRegular, filled: NailAndLashesFilled, color: '#DB2777', bg: 'bg-pink-500/15' },
  { name: 'TattooMachine', label: 'Tattoo Studios', regular: TattooMachineRegular, filled: TattooMachineFilled, color: '#475569', bg: 'bg-slate-500/15' },
  { name: 'MassageZen', label: 'Massage & Zen', regular: MassageZenRegular, filled: MassageZenFilled, color: '#059669', bg: 'bg-emerald-500/15' },
  { name: 'PetGroomingPaw', label: 'Pet Grooming', regular: PetGroomingPawRegular, filled: PetGroomingPawFilled, color: '#0284C7', bg: 'bg-sky-500/15' },
  { name: 'FitnessDumbbell', label: 'Fitness', regular: FitnessDumbbellRegular, filled: FitnessDumbbellFilled, color: '#4F46E5', bg: 'bg-indigo-500/15' },
  { name: 'Colorists', label: 'Colorists', regular: ColoristsRegular, filled: ColoristsFilled, color: '#EC4899', bg: 'bg-pink-500/15' },
  { name: 'Estheticians', label: 'Estheticians', regular: EstheticiansRegular, filled: EstheticiansFilled, color: '#8B5CF6', bg: 'bg-violet-500/15' },
  { name: 'Wellness', label: 'Wellness', regular: WellnessRegular, filled: WellnessFilled, color: '#10B981', bg: 'bg-emerald-500/15' },
  { name: 'BoothRenters', label: 'Booth Suites', regular: BoothRentersRegular, filled: BoothRentersFilled, color: '#0EA5E9', bg: 'bg-sky-500/15' },
  { name: 'ClinicMedical', label: 'Medical Clinics', regular: ClinicMedicalRegular, filled: ClinicMedicalFilled, color: '#EF4444', bg: 'bg-red-500/15' },
  { name: 'Photography', label: 'Photography', regular: PhotographyRegular, filled: PhotographyFilled, color: '#6366F1', bg: 'bg-indigo-500/15' },
  { name: 'AutoDetailing', label: 'Auto Detailing', regular: AutoDetailingRegular, filled: AutoDetailingFilled, color: '#2563EB', bg: 'bg-blue-500/15' },
  { name: 'MusicLessons', label: 'Music & Voice', regular: MusicLessonsRegular, filled: MusicLessonsFilled, color: '#D946EF', bg: 'bg-fuchsia-500/15' },
  { name: 'Consulting', label: 'Consulting', regular: ConsultingRegular, filled: ConsultingFilled, color: '#64748B', bg: 'bg-slate-500/15' },
  { name: 'Tutoring', label: 'Tutoring', regular: TutoringRegular, filled: TutoringFilled, color: '#F59E0B', bg: 'bg-amber-500/15' },
  { name: 'HomeServices', label: 'Home Services', regular: HomeServicesRegular, filled: HomeServicesFilled, color: '#F97316', bg: 'bg-orange-500/15' },
  { name: 'Optometry', label: 'Optometry', regular: OptometryRegular, filled: OptometryFilled, color: '#14B8A6', bg: 'bg-teal-500/15' },
];

export const CustomSpecialtySVGs: Story = {
  render: function CustomSpecialtyStory() {
    const [active, setActive] = useState(false);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-5 w-[620px] max-w-full">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Custom Specialty SVG Icons (Regular &amp; Filled)
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              24×24 Fluent optical grid with <code>regular</code> (1.5px outline) and <code>filled</code> pairs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActive((v) => !v)}
            className="btn-secondary !h-8 !px-3 text-xs flex-shrink-0"
          >
            {active ? 'Showing: Filled' : 'Showing: Regular'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SPECIALTY_SVGS.map((item) => (
            <div
              key={item.name}
              className="p-3.5 rounded-2xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] flex flex-col items-center text-center gap-2.5"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}
                  style={{ color: item.color }}
                >
                  <Icon regular={item.regular} filled={item.filled} active={active} size="lg" />
                </div>
                <div
                  className="w-9 h-9 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]"
                >
                  <Icon regular={item.regular} filled={item.filled} active={!active} size="lg" />
                </div>
              </div>
              <div className="space-y-0.5 min-w-0 w-full">
                <div className="text-xs font-bold text-[var(--text-primary)] truncate">{item.label}</div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] truncate">{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
