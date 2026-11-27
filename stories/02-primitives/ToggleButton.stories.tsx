import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton } from '@/components/primitives/ToggleButton';
import { Icon } from '@/components/primitives/Icon';
import { Heart24Filled, Heart24Regular, Pin24Filled, Pin24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof ToggleButton> = {
  title: 'Primitives/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  render: function ToggleBtnStory() {
    const [fav, setFav] = React.useState(false);
    const [pinned, setPinned] = React.useState(true);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex items-center gap-3">
        <ToggleButton
          pressed={fav}
          onChange={setFav}
          spark
          icon={<Icon regular={Heart24Regular} filled={Heart24Filled} active={fav} />}
        >
          VIP Favorite
        </ToggleButton>
        <ToggleButton
          pressed={pinned}
          onChange={setPinned}
          icon={<Icon regular={Pin24Regular} filled={Pin24Filled} active={pinned} />}
        >
          Pinned
        </ToggleButton>
      </div>
    );
  },
};
