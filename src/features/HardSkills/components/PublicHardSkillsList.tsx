import { useParams } from "react-router-dom";
import { usePublicHardSkills } from "../hooks/usePublicHardSkills";

const TOTAL_BARS = 5;

const styles = {
    container: "flex flex-col w-full",
    title: "text-2xl font-bold text-white font-inter mb-6",
    itemWrapper: "flex items-center w-full py-3 px-4 bg-white/5 rounded-xl border border-accent/20 mb-3",
    left: "flex items-center gap-6 w-full",
    name: "text-surface font-nunito text-lg min-w-[120px] truncate",
    barsWrapper: "flex gap-2 p-1 flex-1 bg-black/40 rounded-md h-5",
    barActive: "h-full flex-1 rounded-sm bg-[#90DDF0] transition-all duration-500",
    barInactive: "h-full flex-1 rounded-sm bg-white/10",
};

// Lista pública de habilidades técnicas (portafolio visible)
const PublicHardSkillsList = () => {
    const { username } = useParams<{ username: string }>();
    const { skills, isLoading } = usePublicHardSkills(username);

    if (isLoading) return <p className="text-white/50 italic font-nunito">Cargando habilidades...</p>;
    if (!skills || skills.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Habilidades Técnicas</h2>

            <div className="flex flex-col w-full">
                {skills.map((skill) => (
                    <div key={skill.skill_id} className={styles.itemWrapper}>
                        <div className={styles.left}>
                            <span className={styles.name}>{skill.name}</span>

                            <div className={styles.barsWrapper}>
                                {Array.from({ length: TOTAL_BARS }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`${i < skill.level ? styles.barActive : styles.barInactive}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicHardSkillsList;