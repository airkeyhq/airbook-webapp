import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FloatingInput } from '@/components/FloatingInput';
import { PhoneInput } from '@/components/primitives/PhoneInput';
import { CurrencyInput } from '@/components/primitives/CurrencyInput';
import { DatePicker } from '@/components/primitives/DatePicker';
import { Combobox } from '@/components/primitives/Combobox';
import { CustomSelect } from '@/components/CustomSelect';
import { FloatingTextarea } from '@/components/primitives/FloatingTextarea';
import { Icon } from '@/components/primitives/Icon';
import { Mail24Regular, Person24Regular, Call24Regular } from '@fluentui/react-icons';

const meta: Meta = {
  title: 'Primitives/FloatingInput',
  component: FloatingInput,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [name, setName] = useState('');
    return (
      <div className="w-80 p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Client Identity</h3>
        <FloatingInput
          label="First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<Icon regular={Person24Regular} />}
        />
        <div className="text-[11px] text-[var(--text-muted)]">
          Current value: <span className="font-semibold text-[var(--text-primary)]">{name || 'Empty'}</span>
        </div>
      </div>
    );
  },
};

export const ContactFormGrid: StoryObj = {
  render: () => {
    const [firstName, setFirstName] = useState('Valeria');
    const [lastName, setLastName] = useState('Morales');
    const [email, setEmail] = useState('valeria@example.com');
    const [phone, setPhone] = useState('+1 (555) 234-5678');

    return (
      <div className="w-[460px] p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Client Profile Information</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Active VIP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FloatingInput
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            icon={<Icon regular={Person24Regular} />}
          />
          <FloatingInput
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <FloatingInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Icon regular={Mail24Regular} />}
        />

        <FloatingInput
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<Icon regular={Call24Regular} />}
        />
      </div>
    );
  },
};

export const UnifiedFloatingFormGrid: StoryObj = {
  render: function UnifiedFormStory() {
    const [name, setName] = useState('Camille Moreau');
    const [phone, setPhone] = useState('(415) 890-4321');
    const [service, setService] = useState('balayage');
    const [specialist, setSpecialist] = useState('valeria');
    const [date, setDate] = useState(new Date());
    const [price, setPrice] = useState('240.00');

    return (
      <div className="w-[560px] max-w-full p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div>
          <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
            Unified 52px Floating Form Grid
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Every input type shares the exact 52px height, 16px radius, and inside overline label.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FloatingInput
            label="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<Icon regular={Person24Regular} />}
          />
          <PhoneInput
            floating
            label="Mobile Number"
            value={phone}
            onChange={setPhone}
          />
          <Combobox
            floating
            label="Service"
            value={service}
            onChange={setService}
            options={[
              { value: 'balayage', label: 'Full Balayage' },
              { value: 'gloss', label: 'Gloss & Blowout' },
              { value: 'keratin', label: 'Keratin Silk' },
            ]}
          />
          <CustomSelect
            label="Specialist"
            value={specialist}
            onChange={setSpecialist}
            options={[
              { value: 'valeria', label: 'Valeria Morales' },
              { value: 'hannah', label: 'Hannah Weber' },
            ]}
          />
          <DatePicker
            floating
            label="Appointment Date"
            value={date}
            onChange={setDate}
          />
          <CurrencyInput
            floating
            label="Deposit Amount"
            value={price}
            onChange={setPrice}
          />
        </div>

        <FloatingTextarea
          label="Formula & Styling Notes"
          maxLength={160}
        />
      </div>
    );
  },
};
