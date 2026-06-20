import type { Meta, StoryObj } from '@storybook/react';
import SkillPagination from '../components/SkillPagination/SkillPagination';

const meta: Meta<typeof SkillPagination> = {
  title: 'Components/SkillPagination',
  component: SkillPagination,
  tags: ['autodocs'],
  argTypes: {
    onPrev: { action: 'prev clicked' },
    onNext: { action: 'next clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof SkillPagination>;

export const PrimeraPagina: Story = { args: { currentPage: 1, totalPages: 5 } };
export const UltimaPagina: Story = { args: { currentPage: 5, totalPages: 5 } };
export const PaginaIntermedia: Story = { args: { currentPage: 3, totalPages: 5 } };
export const PaginaUnica: Story = { args: { currentPage: 1, totalPages: 1 } };