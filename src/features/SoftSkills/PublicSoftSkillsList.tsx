import { useParams } from "react-router-dom";
import { usePublicSoftSkills } from "../../hooks/userSoftSkills";
import { PublicSoftSkillItem } from "./SoftSkillItem";

const STYLES = {
  // Cambiamos flex-wrap por flex-col para que los hijos se apilen verticalmente
  WRAPPER: "bg-background flex flex-col w-full",
  // Quitamos el max-w-md para que ocupe todo el ancho del Dashboard y ponemos w-full
  CONTENT: "w-full flex flex-col gap-3 mt-4", 
  EMPTY: "text-surface/50 text-center py-10 font-nunito",
  LOADING: "text-surface/50 text-center py-10 font-nunito",
};

const PublicSoftSkillsList = () => {
  const { username } = useParams<{ username: string }>();
  const { skills, isLoading, error } = usePublicSoftSkills(username);

  return (
    <div className={STYLES.WRAPPER}>
        <h2 className="text-2xl font-bold text-surface">Habilidades Blandas</h2>
        
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