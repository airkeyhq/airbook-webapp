import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SparkleBurst,
  type SparkShape,
  type SparkParticleType,
  type SparkTone,
} from '@/components/primitives/SparkleBurst';

const meta: Meta<typeof SparkleBurst> = {
  title: 'Primitives/SparkleBurst',
  component: SparkleBurst,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    shape: {
      control: { type: 'radio' },
      options: ['circle', 'square-rounded', 'pill'],
      description: 'Burst geometry matching the host control.',
    },
    particle: {
      control: { type: 'radio' },
      options: ['dots', 'stars', 'mixed'],
      description: 'Sparkle particle style.',
    },
    tone: {
      control: { type: 'select' },
      options: ['electric', 'tier1', 'emerald', 'gold'],
      description: 'Registered color palette token.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SparkleBurst>;

export const Playground: Story = {
  args: {
    shape: 'pill',
    particle: 'mixed',
    tone: 'electric',
  },
  render: function PlaygroundStory(args) {
    const [burstKey, setBurstKey] = React.useState(0);
    const isTier1 = args.tone === 'tier1';

    return (
      <div
        className={`p-10 rounded-3xl border flex flex-col items-center gap-3 ${
          isTier1
            ? 'bg-gradient-to-b from-[#2BB5FF] to-[#1A8EFF] border-[#1A8EFF]'
            : 'bg-[var(--bg-primary)] border-[var(--border-subtle)]'
        }`}
      >
        <button
          type="button"
          onClick={() => setBurstKey((k) => k + 1)}
          className={`relative px-5 py-2.5 text-xs font-bold cursor-pointer transition-transform active:scale-95 ${
            args.shape === 'circle'
              ? 'w-12 h-12 rounded-full !p-0 flex items-center justify-center'
              : args.shape === 'square-rounded'
                ? 'rounded-xl'
                : 'rounded-full'
          } ${
            isTier1
              ? 'bg-white/20 text-white border border-white/30'
              : 'btn-primary'
          }`}
        >
          <span>{args.shape === 'circle' ? '★' : 'Click to Sparkle'}</span>
          <SparkleBurst
            burstKey={burstKey}
            shape={args.shape}
            particle={args.particle}
            tone={args.tone}
          />
        </button>
      </div>
    );
  },
};

export const Catalog: Story = {
  render: function CatalogStory() {
    const [keys, setKeys] = React.useState<Record<string, number>>({});
    const trigger = (id: string) =>
      setKeys((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

    const demos: {
      id: string;
      label: string;
      shape: SparkShape;
      particle: SparkParticleType;
      tone: SparkTone;
    }[] = [
      { id: 'c1', label: 'Circle · Mixed · Electric', shape: 'circle', particle: 'mixed', tone: 'electric' },
      { id: 's1', label: 'Square · Stars · Emerald', shape: 'square-rounded', particle: 'stars', tone: 'emerald' },
      { id: 'p1', label: 'Pill · Mixed · Tier 1', shape: 'pill', particle: 'mixed', tone: 'tier1' },
      { id: 'p2', label: 'Pill · Dots · Gold', shape: 'pill', particle: 'dots', tone: 'gold' },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        {demos.map((d) => {
          const isTier1 = d.tone === 'tier1';
          return (
            <div
              key={d.id}
              className={`p-6 rounded-3xl border flex flex-col items-center gap-3 ${
                isTier1
                  ? 'bg-gradient-to-b from-[#2BB5FF] to-[#1A8EFF] border-[#1A8EFF]'
                  : 'bg-[var(--bg-primary)] border-[var(--border-subtle)]'
              }`}
            >
              <button
                type="button"
                onClick={() => trigger(d.id)}
                className={`relative px-4 py-2 text-xs font-bold cursor-pointer active:scale-95 transition-transform ${
                  d.shape === 'circle'
                    ? 'w-11 h-11 rounded-full !p-0 flex items-center justify-center'
                    : d.shape === 'square-rounded'
                      ? 'rounded-xl'
                      : 'rounded-full'
                } ${
                  isTier1
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                <span>{d.shape === 'circle' ? '✦' : 'Trigger'}</span>
                <SparkleBurst
                  burstKey={keys[d.id] || 0}
                  shape={d.shape}
                  particle={d.particle}
                  tone={d.tone}
                />
              </button>
              <span
                className={`text-[11px] font-semibold ${
                  isTier1 ? 'text-white' : 'text-[var(--text-secondary)]'
                }`}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  },
};
