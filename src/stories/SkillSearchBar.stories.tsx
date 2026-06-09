import type { Meta, StoryObj } from '@storybook/react';
import SkillSearchBar from '../components/SkillSearchBar/SkillSearchBar';

const meta: Meta<typeof SkillSearchBar> = {
  title: 'Components/SkillSearchBar',
  component: SkillSearchBar,
  tags: ['autodocs'],
  argTypes: {
    isPublic: { control: 'boolean' },
    onChange: { action: 'changed' },
    onSearch: { action: 'search clicked' },
    onKeyDown: { action: 'key down' },
    onAdd: { action: 'add clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof SkillSearchBar>;

export const ModoEdicion: Story = { args: { value: '', placeholder: 'Buscar habilidad...', isPublic: false } };
export const ModoPublico: Story = { args: { value: '', placeholder: 'Buscar habilidad...', isPublic: true } };
export const ConValor: Story = { args: { value: 'React', placeholder: 'Buscar...', isPublic: false } };