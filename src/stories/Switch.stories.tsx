import type { Meta, StoryObj } from '@storybook/react';
import VisibilitySwitch from '../components/Switch/Switch';

const meta: Meta<typeof VisibilitySwitch> = {
  title: 'Components/VisibilitySwitch',
  component: VisibilitySwitch,
  tags: ['autodocs'],
  argTypes: {
    initialState: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof VisibilitySwitch>;

export const Publico: Story = { args: { id: 'experiencia', initialState: true } };
export const Oculto: Story = { args: { id: 'certificados', initialState: false } };
export const SinCallback: Story = { args: { id: 'educacion', initialState: true } };