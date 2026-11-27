import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CustomSelect } from '@/components/CustomSelect';

const meta: Meta = {
  title: 'Primitives/CustomSelect',
  component: CustomSelect,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [service, setService] = useState('balayage');
    return (
      <div className="w-80 p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Service Category</h3>
        <CustomSelect
          label="Category"
          value={service}
          onChange={(val) => setService(val)}
          options={[
            { value: 'haircut', label: 'Signature Haircut & Styling' },
            { value: 'balayage', label: 'French Balayage & Gloss' },
            { value: 'spa', label: 'Botanical Hair & Scalp Spa' },
            { value: 'nail', label: 'Gel Couture Manicure' },
          ]}
        />
        <div className="text-[11px] text-[var(--text-muted)]">
          Selected: <span className="font-semibold text-[var(--text-primary)]">{service}</span>
        </div>
      </div>
    );
  },
};
