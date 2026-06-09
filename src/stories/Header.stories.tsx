import type { Meta, StoryObj } from '@storybook/react';
import Header from '../components/Header/Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = { args: { title: 'Experiencia Laboral' } };
export const InformacionPersonal: Story = { args: { title: 'Información Personal' } };
export const Educacion: Story = { args: { title: 'Educación' } };
export const TituloLargo: Story = { args: { title: 'Proyectos Personales y Experiencia Profesional' } };