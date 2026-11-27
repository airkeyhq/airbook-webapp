import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileDropzone } from '@/components/primitives/FileDropzone';

const meta: Meta<typeof FileDropzone> = {
  title: 'Primitives/FileDropzone',
  component: FileDropzone,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FileDropzone>;

export const Default: Story = {
  render: () => (
    <div className="w-[420px] max-w-full p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
      <FileDropzone />
    </div>
  ),
};
