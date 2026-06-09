import type { Meta, StoryObj } from '@storybook/react';
import ConfirmDeletePopup from '../components/ConfirmDeletePopup';

const meta: Meta<typeof ConfirmDeletePopup> = {
  title: 'Components/ConfirmDeletePopup',
  component: ConfirmDeletePopup,
  tags: ['autodocs'],
  argTypes: {
    onConfirm: { action: 'confirmed' },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDeletePopup>;

export const Default: Story = { args: { isOpen: true, skillName: 'JavaScript', isLoading: false } };
export const Cargando: Story = { args: { isOpen: true, skillName: 'React', isLoading: true } };
export const NombreLargo: Story = { args: { isOpen: true, skillName: 'Desarrollo de Aplicaciones Web con React y TypeScript', isLoading: false } };