import type { Meta, StoryObj } from '@storybook/react';
import PopUpCard from '../components/PopUpCard/PopUpCard';

const meta: Meta<typeof PopUpCard> = {
  title: 'Components/PopUpCard',
  component: PopUpCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PopUpCard>;

export const Default: Story = {
  args: {
    title: 'Registrar Certificado',
    children: <p style={{ color: 'white', textAlign: 'center' }}>Contenido del popup</p>,
  },
};

export const SinContenido: Story = {
  args: { title: 'Título del Popup' },
};

export const TituloLargo: Story = {
  args: {
    title: 'Confirmación de eliminación de elemento',
    children: <p style={{ color: 'white', textAlign: 'center' }}>¿Estás seguro?</p>,
  },
};