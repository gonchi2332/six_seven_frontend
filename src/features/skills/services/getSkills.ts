import type { Skill } from "../types/skill.types";

const MOCK_SKILLS: Skill[] = [
  { id: "1", name: "HTML/CSS", level: 5 },
  { id: "2", name: "React", level: 4 },
  { id: "3", name: "TypeScript", level: 3 },
];

export const getSkills = async (): Promise<Skill[]> => {
  // TODO: reemplazar con llamada real al backend
  // return await fetch("/api/skills").then((res) => res.json());
  return Promise.resolve(MOCK_SKILLS);
};