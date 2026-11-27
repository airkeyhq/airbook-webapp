import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '@/components/DataTable';
import { Avatar } from '@/components/primitives/Avatar';
import { Badge } from '@/components/primitives/Badge';
import { getThumbsAvatarUrl } from '@/lib/avatars';

const meta: Meta<typeof DataTable> = {
  title: 'Composites/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

interface BookingRow {
  id: string;
  client: string;
  service: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
  time: string;
}

const ROWS: BookingRow[] = [
  { id: '1', client: 'Camille Moreau', service: 'Full Balayage', status: 'confirmed', amount: 240, time: '10:30 AM' },
  { id: '2', client: 'Valeria Morales', service: 'Keratin Silk', status: 'confirmed', amount: 185, time: '11:45 AM' },
  { id: '3', client: 'Jessica Taylor', service: 'Gloss & Blowout', status: 'pending', amount: 85, time: '1:15 PM' },
  { id: '4', client: 'Hannah Weber', service: 'Scalp Spa Ritual', status: 'confirmed', amount: 150, time: '2:30 PM' },
  { id: '5', client: 'Elena Rostova', service: 'Root Smudge', status: 'cancelled', amount: 110, time: '4:00 PM' },
  { id: '6', client: 'Sophia Chen', service: 'Precision Cut', status: 'confirmed', amount: 95, time: '5:15 PM' },
];

export const WithFilterBar: Story = {
  render: () => (
    <div className="w-full max-w-3xl mx-auto min-w-0">
      <DataTable
        data={ROWS}
        getRowKey={(r) => r.id}
        pageSize={4}
        searchPlaceholder="Search client or service..."
        columnVisibility
        views={['table', 'cards', 'kanban', 'timeline', 'gantt']}
        kanbanGroups={[
          { id: 'pending', title: 'Pending', accent: 'amber' },
          { id: 'confirmed', title: 'Confirmed', accent: 'emerald' },
          { id: 'cancelled', title: 'Cancelled', accent: 'subtle' },
        ]}
        filters={[
          { id: 'client', label: 'Client', type: 'text' },
          { id: 'service', label: 'Service', type: 'text' },
          { id: 'status', label: 'Status', type: 'select', options: ['confirmed', 'pending', 'cancelled'] },
          { id: 'time', label: 'Date', type: 'date' },
        ]}
        initialFilters={[
          { id: 'status', label: 'Status', type: 'select', value: 'confirmed' },
        ]}
        columns={[
          {
            key: 'client',
            header: 'Client',
            required: true,
            sortable: true,
            sortValue: (r) => r.client,
            render: (r) => (
              <div className="flex items-center gap-2.5">
                <Avatar size="xs" src={getThumbsAvatarUrl(r.client, '#2BB5FF')} fallback={r.client.slice(0, 2)} />
                <span className="font-bold">{r.client}</span>
              </div>
            ),
          },
          {
            key: 'service',
            header: 'Service',
            sortable: true,
            sortValue: (r) => r.service,
            render: (r) => <span className="text-[var(--text-secondary)]">{r.service}</span>,
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <Badge
                size="xs"
                dot
                variant={r.status === 'confirmed' ? 'success' : r.status === 'pending' ? 'warning' : 'danger'}
              >
                {r.status}
              </Badge>
            ),
          },
          {
            key: 'amount',
            header: 'Total',
            align: 'right',
            sortable: true,
            sortValue: (r) => r.amount,
            render: (r) => <span className="font-mono font-bold">${r.amount}</span>,
          },
          {
            key: 'time',
            header: 'Time',
            defaultHidden: true,
            render: (r) => <span className="font-mono text-[var(--text-muted)]">{r.time}</span>,
          },
        ]}
      />
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-3xl mx-auto min-w-0">
      <DataTable
        data={ROWS}
        getRowKey={(r) => r.id}
        pageSize={4}
        searchPlaceholder="Search client or service..."
        columns={[
          {
            key: 'client',
            header: 'Client',
            required: true,
            sortable: true,
            sortValue: (r) => r.client,
            render: (r) => (
              <div className="flex items-center gap-2.5">
                <Avatar size="xs" src={getThumbsAvatarUrl(r.client, '#2BB5FF')} fallback={r.client.slice(0, 2)} />
                <span className="font-bold">{r.client}</span>
              </div>
            ),
          },
          {
            key: 'service',
            header: 'Service',
            sortable: true,
            sortValue: (r) => r.service,
            render: (r) => <span className="text-[var(--text-secondary)]">{r.service}</span>,
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <Badge
                size="xs"
                dot
                variant={r.status === 'confirmed' ? 'success' : r.status === 'pending' ? 'warning' : 'danger'}
              >
                {r.status}
              </Badge>
            ),
          },
          {
            key: 'amount',
            header: 'Total',
            align: 'right',
            sortable: true,
            sortValue: (r) => r.amount,
            render: (r) => <span className="font-mono font-bold">${r.amount}</span>,
          },
          {
            key: 'time',
            header: 'Time',
            defaultHidden: true,
            render: (r) => <span className="font-mono text-[var(--text-muted)]">{r.time}</span>,
          },
        ]}
      />
    </div>
  ),
};
