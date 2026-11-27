import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '@/components/primitives/Combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Primitives/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: function ComboboxStory() {
    const [client, setClient] = React.useState('camille');
    return (
      <div className="min-h-[300px] w-80 pt-4">
        <Combobox
          label="Assign Client"
          value={client}
          onChange={setClient}
          searchPlaceholder="Type client name or email..."
          options={[
            { value: 'camille', label: 'Camille Moreau', sublabel: 'camille@example.com · VIP' },
            { value: 'valeria', label: 'Valeria Morales', sublabel: 'valeria@example.com' },
            { value: 'jessica', label: 'Jessica Taylor', sublabel: 'jessica@example.com' },
            { value: 'hannah', label: 'Hannah Weber', sublabel: 'hannah@example.com' },
            { value: 'elena', label: 'Elena Rostova', sublabel: 'elena@example.com' },
          ]}
        />
      </div>
    );
  },
};
