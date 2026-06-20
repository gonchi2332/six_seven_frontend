import type { Meta, StoryObj } from '@storybook/react';
import ShareProfileModal from '../components/PublicProfileLink/PublicProfileLink';

const meta: Meta<typeof ShareProfileModal> = {
  title: 'Components/PublicProfileLink',
  component: ShareProfileModal,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof ShareProfileModal>;

export const Default: Story = { args: { username: 'juanperez' } };
export const NombreUsuarioLargo: Story = { args: { username: 'nombre.usuario.largo.ejemplo' } };