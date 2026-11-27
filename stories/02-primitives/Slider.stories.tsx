import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@/components/primitives/Slider';

const meta: Meta<typeof Slider> = {
  title: 'Primitives/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: function SliderStory() {
    const [tip, setTip] = React.useState<number | [number, number]>(20);
    const [priceRange, setPriceRange] = React.useState<number | [number, number]>([65, 240]);
    const [radius, setRadius] = React.useState<number | [number, number]>(35);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-6 w-80">
        <Slider
          label="Default Tip Percentage"
          value={tip}
          onChange={setTip}
          min={0}
          max={40}
          step={5}
          suffix="%"
        />
        <Slider
          label="Service Price Filter"
          value={priceRange}
          onChange={setPriceRange}
          min={20}
          max={400}
          step={5}
          prefix="$"
        />
        <Slider
          variant="pill"
          label="Geofence Check-In Radius"
          value={radius}
          onChange={setRadius}
          min={10}
          max={100}
          step={5}
          suffix="m"
        />
      </div>
    );
  },
};
