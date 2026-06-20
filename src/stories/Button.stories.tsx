import type { Meta, StoryObj } from '@storybook/react';
import Button from '../components/Button/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'quaternary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: 'Guardar', variant: 'primary', size: 'md' } };
export const Secondary: Story = { args: { children: 'Cancelar', variant: 'secondary', size: 'md' } };
export const Tertiary: Story = { args: { children: 'Editar', variant: 'tertiary', size: 'md' } };
export const Quaternary: Story = { args: { children: 'Ver más', variant: 'quaternary', size: 'md' } };
export const Small: Story = { args: { children: 'Pequeño', size: 'sm' } };
export const Large: Story = { args: { children: 'Grande', size: 'lg' } };
export const FullWidth: Story = { args: { children: 'Ancho completo', fullWidth: true } };
export const Disabled: Story = { args: { children: 'Deshabilitado', disabled: true } };