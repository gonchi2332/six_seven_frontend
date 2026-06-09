import type { Meta, StoryObj } from '@storybook/react';
import TextAreaField from '../components/TextAreaField/TextAreaField';

const meta: Meta<typeof TextAreaField> = {
  title: 'Components/TextAreaField',
  component: TextAreaField,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof TextAreaField>;

export const Default: Story = { args: { label: 'Descripción', placeholder: 'Escribe tu descripción...', value: '' } };
export const ConValor: Story = { args: { label: 'Biografía', value: 'Soy un desarrollador con experiencia en React y Node.js.' } };
export const ConError: Story = { args: { label: 'Descripción', value: '', error: 'La descripción es obligatoria' } };
export const ConLimite: Story = { args: { label: 'Comentario', value: '', maxLength: 200, placeholder: 'Máximo 200 caracteres' } };
export const Deshabilitado: Story = { args: { label: 'Campo deshabilitado', value: 'No editable', disabled: true } };
export const MasFilas: Story = { args: { label: 'Descripción amplia', value: '', rows: 8 } };