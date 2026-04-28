import { useParams } from "react-router-dom";
import { usePublicSoftSkills } from "../../hooks/userSoftSkills";
import { PublicSoftSkillItem } from "./SoftSkillItem";

const STYLES = {
  WRAPPER: "bg-background flex flex-col w-full",
  TITLE: "text-2xl font-bold text-surface font-inter mb-6",
  CONTENT: "w-full flex flex-col gap-3",
  LOADING: "text-surface/50 text-center py-10 font-nunito",
};

const PublicSoftSkillsList = () => {
  const { username } = useParams<{ username: string }>();
  const { skills, isLoading, error } = usePublicSoftSkills(username);
  if (isLoading) return <p className={STYLES.LOADING}>Cargando habilidades...</p>;
  if (error) return null;
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <div className={STYLES.WRAPPER}>
        <h2 className={STYLES.TITLE}>Habilidades Blandas</h2>
        <div className={STYLES.CONTENT}>
            {skills.map((skill, index) => (
                <PublicSoftSkillItem key={index} skillName={skill.name} />
            ))}
        </div>
    </div>
  );
};

export default PublicSoftSkillsList;