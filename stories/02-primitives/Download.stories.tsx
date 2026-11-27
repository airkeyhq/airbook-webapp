import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileDownload, DownloadButton } from '@/components/primitives/Download';

const meta: Meta<typeof FileDownload> = {
  title: 'Primitives/Download',
  component: FileDownload,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Download primitives (`FileDownload`, `DownloadButton`, and `triggerDownload`) with built-in loading spinner and saved confirmation states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['card', 'compact'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FileDownload>;

const sampleTextSource = () =>
  new Blob(['Ozone UI Export\nGenerated at: ' + new Date().toISOString()], {
    type: 'text/plain;charset=utf-8',
  });

export const Default: Story = {
  args: {
    fileName: 'April_Revenue_Report.pdf',
    fileSize: '2.4 MB',
    description: 'Monthly POS & booking summary',
    variant: 'card',
  },
  render: (args) => (
    <div className="w-[420px] max-w-full space-y-3">
      <FileDownload {...args} source={sampleTextSource} />
      <FileDownload
        fileName="Client_List_Export.csv"
        fileSize="480 KB"
        description="142 active studio clients"
        variant={args.variant}
        source={sampleTextSource}
      />
      <FileDownload
        fileName="Studio_QR_Poster.png"
        fileSize="1.1 MB"
        variant="compact"
        source={sampleTextSource}
      />
    </div>
  ),
};

export const Buttons: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-wrap items-center gap-3">
      <DownloadButton
        label="Export CSV"
        fileName="export.csv"
        variant="primary"
        source={sampleTextSource}
      />
      <DownloadButton
        label="Download Receipt"
        fileName="receipt.txt"
        variant="secondary"
        source={sampleTextSource}
      />
      <DownloadButton
        label="Save QR"
        fileName="qr.txt"
        variant="ghost"
        source={sampleTextSource}
      />
    </div>
  ),
};
