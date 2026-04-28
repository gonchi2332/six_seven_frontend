import { useParams } from "react-router-dom";
import { usePublicSoftSkills } from "../../hooks/userSoftSkills";
import { PublicSoftSkillItem } from "./SoftSkillItem";

const STYLES = {
  WRAPPER: "bg-background flex flex-col w-full",
  TITLE: "text-2xl font-bold text-surface font-inter mb-6", // Igualamos el margen del título
  CONTENT: "w-full flex flex-col gap-3", // Quitamos el mt-4 y confiamos en el gap
  EMPTY: "text-surface text-center py-10 font-nunito",
  LOADING: "text-surface/50 text-center py-10 font-nunito",
};

const PublicSoftSkillsList = () => {
  const { username } = useParams<{ username: string }>();
  const { skills, isLoading, error } = usePublicSoftSkills(username);

  return (
    <div className={STYLES.WRAPPER}>
        <h2 className={STYLES.TITLE}>Habilidades Blandas</h2> {/* Usamos la clase TITLE */}
        <div className={STYLES.CONTENT}>
            {isLoading && <p className={STYLES.LOADING}>Cargando habilidades...</p>}
            
            {error && <p className="text-red-400 text-center">{error}</p>}

            {!isLoading && skills.length === 0 && (
                <p className={STYLES.EMPTY}>Este usuario aún no ha agregado habilidades.</p>
            )}

            {!isLoading && skills.map((skill, index) => (
                <PublicSoftSkillItem key={index} skillName={skill.name} />
            ))}
        </div>
    </div>
  );
};

export default PublicSoftSkillsList;