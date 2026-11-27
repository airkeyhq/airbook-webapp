import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MetricsDashboard } from '@/components/MetricsDashboard';

const meta: Meta<typeof MetricsDashboard> = {
  title: 'Composites/MetricsDashboard',
  component: MetricsDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Mosaic-style segmented KPI metric cards paired with an interactive stacked bar chart and hover breakdown.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetricsDashboard>;

export const StudioCohorts: Story = {
  render: () => {
    const [selectedMetricId, setSelectedMetricId] = useState('bookings');

    return (
      <div className="max-w-4xl mx-auto">
        <MetricsDashboard
          selectedMetricId={selectedMetricId}
          onSelectMetric={setSelectedMetricId}
          metrics={[
            {
              id: 'bookings',
              label: 'Weekly Bookings',
              value: 148,
              period: 'Nov 18 – Nov 24',
              tooltip: 'Confirmed studio appointments',
              series: [
                { key: 'new', label: 'New', color: '#7DD3FC' },
                { key: 'reactivated', label: 'Reactivated', color: '#38BDF8' },
                { key: 'retained', label: 'Retained', color: '#2BB5FF' },
                { key: 'churned', label: 'Cancelled', color: '#64748B' },
              ],
              chartData: [
                { date: 'Mon', new: 6, reactivated: 4, retained: 14, churned: 2 },
                { date: 'Tue', new: 8, reactivated: 5, retained: 18, churned: 1 },
                { date: 'Wed', new: 5, reactivated: 6, retained: 16, churned: 2 },
                { date: 'Thu', new: 9, reactivated: 4, retained: 21, churned: 1 },
                { date: 'Fri', new: 11, reactivated: 7, retained: 25, churned: 2 },
                { date: 'Sat', new: 14, reactivated: 8, retained: 29, churned: 3 },
                { date: 'Sun', new: 7, reactivated: 3, retained: 15, churned: 1 },
              ],
            },
            {
              id: 'retention',
              label: 'Retained Clients',
              value: '86%',
              period: '30-day repeat rate',
              series: [
                { key: 'vip', label: 'VIP Members', color: '#10B981' },
                { key: 'repeat', label: 'Repeat Visits', color: '#34D399' },
                { key: 'atRisk', label: 'At Risk', color: '#F59E0B' },
              ],
              chartData: [
                { date: 'Mon', vip: 12, repeat: 18, atRisk: 3 },
                { date: 'Tue', vip: 15, repeat: 20, atRisk: 2 },
                { date: 'Wed', vip: 14, repeat: 19, atRisk: 4 },
                { date: 'Thu', vip: 18, repeat: 24, atRisk: 2 },
                { date: 'Fri', vip: 22, repeat: 27, atRisk: 3 },
                { date: 'Sat', vip: 26, repeat: 31, atRisk: 4 },
                { date: 'Sun', vip: 13, repeat: 17, atRisk: 2 },
              ],
            },
            {
              id: 'new',
              label: 'New Clients',
              value: 34,
              period: '+18% vs last week',
              series: [
                { key: 'online', label: 'Online Booking', color: '#8B5CF6' },
                { key: 'walkIn', label: 'Walk-In Kiosk', color: '#C084FC' },
                { key: 'referral', label: 'Referral', color: '#2BB5FF' },
              ],
              chartData: [
                { date: 'Mon', online: 3, walkIn: 1, referral: 2 },
                { date: 'Tue', online: 4, walkIn: 2, referral: 1 },
                { date: 'Wed', online: 2, walkIn: 2, referral: 1 },
                { date: 'Thu', online: 5, walkIn: 1, referral: 2 },
                { date: 'Fri', online: 6, walkIn: 3, referral: 2 },
                { date: 'Sat', online: 8, walkIn: 4, referral: 3 },
                { date: 'Sun', online: 3, walkIn: 2, referral: 1 },
              ],
            },
            {
              id: 'revenue',
              label: 'Gross Revenue',
              value: '$14.2k',
              period: 'POS + Online deposits',
              series: [
                { key: 'services', label: 'Services ($)', color: '#2BB5FF' },
                { key: 'retail', label: 'Retail ($)', color: '#F59E0B' },
                { key: 'tips', label: 'Tips ($)', color: '#10B981' },
              ],
              chartData: [
                { date: 'Mon', services: 1200, retail: 260, tips: 190 },
                { date: 'Tue', services: 1550, retail: 340, tips: 240 },
                { date: 'Wed', services: 1400, retail: 290, tips: 210 },
                { date: 'Thu', services: 1850, retail: 410, tips: 290 },
                { date: 'Fri', services: 2300, retail: 520, tips: 360 },
                { date: 'Sat', services: 2950, retail: 680, tips: 470 },
                { date: 'Sun', services: 1350, retail: 250, tips: 200 },
              ],
            },
          ]}
          chartData={[]}
        />
      </div>
    );
  },
};
