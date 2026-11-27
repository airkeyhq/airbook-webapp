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
  { name: 'SalonScissors', label: 'Hair Salons', regular: SalonScissorsRegular, filled: SalonScissorsFilled },
  { name: 'BarberRazor', label: 'Barbershops', regular: BarberRazorRegular, filled: BarberRazorFilled },
  { name: 'MedSpa', label: 'MedSpas', regular: MedSpaRegular, filled: MedSpaFilled },
  { name: 'NailAndLashes', label: 'Nails & Lashes', regular: NailAndLashesRegular, filled: NailAndLashesFilled },
  { name: 'TattooMachine', label: 'Tattoo Studios', regular: TattooMachineRegular, filled: TattooMachineFilled },
  { name: 'MassageZen', label: 'Massage & Zen', regular: MassageZenRegular, filled: MassageZenFilled },
  { name: 'PetGroomingPaw', label: 'Pet Grooming', regular: PetGroomingPawRegular, filled: PetGroomingPawFilled },
  { name: 'FitnessDumbbell', label: 'Fitness', regular: FitnessDumbbellRegular, filled: FitnessDumbbellFilled },
  { name: 'Colorists', label: 'Colorists', regular: ColoristsRegular, filled: ColoristsFilled },
  { name: 'Estheticians', label: 'Estheticians', regular: EstheticiansRegular, filled: EstheticiansFilled },
  { name: 'Wellness', label: 'Wellness', regular: WellnessRegular, filled: WellnessFilled },
  { name: 'BoothRenters', label: 'Booth Suites', regular: BoothRentersRegular, filled: BoothRentersFilled },
  { name: 'ClinicMedical', label: 'Medical Clinics', regular: ClinicMedicalRegular, filled: ClinicMedicalFilled },
  { name: 'Photography', label: 'Photography', regular: PhotographyRegular, filled: PhotographyFilled },
  { name: 'AutoDetailing', label: 'Auto Detailing', regular: AutoDetailingRegular, filled: AutoDetailingFilled },
  { name: 'MusicLessons', label: 'Music & Voice', regular: MusicLessonsRegular, filled: MusicLessonsFilled },
  { name: 'Consulting', label: 'Consulting', regular: ConsultingRegular, filled: ConsultingFilled },
  { name: 'Tutoring', label: 'Tutoring', regular: TutoringRegular, filled: TutoringFilled },
  { name: 'HomeServices', label: 'Home Services', regular: HomeServicesRegular, filled: HomeServicesFilled },
  { name: 'Optometry', label: 'Optometry', regular: OptometryRegular, filled: OptometryFilled },
];

export const CustomSpecialtySVGs: Story = {
  render: function CustomSpecialtyStory() {
    const [active, setActive] = useState(false);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-5 w-[620px] max-w-full">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Industry Specialty Icons (Regular &amp; Filled)
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Fluent <code>24Regular</code> (display) and <code>24Filled</code> (active/action) pairs using neutral surface tokens.
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
                <div className="w-9 h-9 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]">
                  <Icon regular={item.regular} filled={item.filled} active={active} size="lg" />
                </div>
                <div className="w-9 h-9 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
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
