import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from '@/components/primitives/Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Primitives/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    spark: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const BOOKING_STEPS = [
  { id: 'service', label: 'Service', description: 'Balayage & Gloss' },
  { id: 'specialist', label: 'Specialist', description: 'Camille Moreau' },
  { id: 'time', label: 'Date & Time', description: 'Tomorrow, 10:30 AM' },
  { id: 'confirm', label: 'Confirm', description: 'Deposit & receipt' },
];

export const HorizontalFlow: Story = {
  args: {
    orientation: 'horizontal',
    spark: true,
  },
  render: function HorizontalStory(args) {
    const [step, setStep] = React.useState(1);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-6 w-[540px] max-w-full">
        <Stepper
          {...args}
          steps={BOOKING_STEPS}
          currentStep={step}
          onStepClick={setStep}
        />
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <button
            type="button"
            disabled={step <= 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="btn-secondary !h-9 text-xs disabled:opacity-40"
          >
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="btn-tertiary !h-9 text-xs"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(BOOKING_STEPS.length, s + 1))}
              className="btn-primary !h-9 text-xs"
            >
              {step >= BOOKING_STEPS.length ? 'Completed' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    );
  },
};

export const VerticalTimeline: Story = {
  render: function VerticalStory() {
    const [step, setStep] = React.useState(2);

    const timeline = [
      { id: 'booked', label: 'Appointment Reserved', description: 'Confirmed online with $40 deposit.', meta: '9:14 AM' },
      { id: 'reminder', label: 'SMS Reminder Delivered', description: 'Client replied YES to confirm.', meta: 'Yesterday' },
      { id: 'checked-in', label: 'Client Checked In', description: 'Assigned to chair #2 with Camille.', meta: '10:28 AM' },
      { id: 'checkout', label: 'POS Checkout & Receipt', description: 'Awaiting service completion.', meta: 'Pending' },
    ];

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-5 w-96">
        <Stepper
          orientation="vertical"
          spark
          steps={timeline}
          currentStep={step}
          onStepClick={setStep}
        />
        <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => (s >= timeline.length ? 0 : s + 1))}
            className="btn-primary !h-9 text-xs"
          >
            {step >= timeline.length ? 'Restart Timeline' : 'Advance Timeline'}
          </button>
        </div>
      </div>
    );
  },
};
