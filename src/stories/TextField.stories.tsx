import type { Meta, StoryObj } from '@storybook/react';
import TextField from '../components/TextField/TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'password', 'email', 'number', 'date'] },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = { args: { label: 'Nombre', placeholder: 'Ingresa tu nombre', value: '' } };
export const ConValor: Story = { args: { label: 'Correo', type: 'email', value: 'usuario@ejemplo.com' } };
export const ConError: Story = { args: { label: 'Email', value: 'correo-invalido', error: 'Correo electrónico inválido' } };
export const Password: Story = { args: { label: 'Contraseña', type: 'password', placeholder: '********', value: '' } };
export const Fecha: Story = { args: { label: 'Fecha de inicio', type: 'date', value: '' } };
export const Deshabilitado: Story = { args: { label: 'Campo deshabilitado', value: 'No editable', disabled: true } };
export const SinLabel: Story = { args: { placeholder: 'Sin etiqueta', value: '' } };