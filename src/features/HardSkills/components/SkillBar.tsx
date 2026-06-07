import type { Skill } from "../types/skill.types";

const TOTAL_BARS = 5;

const styles = {
  container: "flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl border border-accent/20 hover:border-accent/50 transition-all",
  left: "flex items-center gap-4 flex-1",
  name: "text-surface font-nunito text-lg w-28 shrink-0 truncate",
  barsWrapper: "flex gap-1 p-1 flex-1 bg-black/40 rounded-md",
  barActive: "h-3 flex-1 rounded-sm bg-[#90DDF0]",
  barInactive: "h-3 flex-1 rounded-sm bg-white/10",
  buttons: "flex gap-2 shrink-0",
};

interface Props {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

// Barra de habilidad con nombre, nivel visual y botones de acción
const SkillBar = ({ skill, onEdit, onDelete }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <span className={styles.name}>{skill.name}</span>
        <div className={styles.barsWrapper}>
          {Array.from({ length: TOTAL_BARS }).map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-300 ${i < skill.level ? styles.barActive : styles.barInactive}`}
            />
          ))}
        </div>
      </div>
      <div className={styles.buttons}>
        {/* Botón editar (lápiz) */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(skill); }}
          className="text-accent hover:text-accent/80 transition-colors p-1"
          title="Modificar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        {/* Botón eliminar (basurero) */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(skill); }}
          className="text-red-400 hover:text-red-300 transition-colors p-1"
          title="Eliminar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SkillBar;