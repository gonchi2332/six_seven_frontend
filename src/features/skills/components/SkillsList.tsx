import { useState } from "react";
import Button from "../../../components/Button";
import SkillBar from "./SkillBar";
import AddSkillPopup from "./AddSkillPopup";
import EditSkillPopup from "./EditSkillPopup";
import { useSkills } from "../hooks/useSkills";
import type { Skill } from "../types/skill.types";

const WRAPPER = "flex flex-col gap-3 w-full";
const HEADER = "flex items-center justify-between mb-1";
const TITLE = "font-inter font-bold text-2xl text-surface";
const LIST = "flex flex-col gap-3";
const EMPTY = "text-surface/50 font-nunito text-sm py-4";
const LOADING = "text-surface/50 font-nunito text-sm py-4 animate-pulse";
const ERROR_TEXT = "text-red-300 font-nunito text-sm py-4";

const SkillsList = () => {
  const { skills, isLoading, error, addSkill, editSkill } = useSkills();
  const [showAdd, setShowAdd] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  return (
    <div className={WRAPPER}>
      <div className={HEADER}>
        <h3 className={TITLE}>Habilidades Técnicas</h3>
        <Button variant="secondary" onClick={() => setShowAdd(true)}>
          Añadir
        </Button>
      </div>

      <div className={LIST}>
        {isLoading && <p className={LOADING}>Cargando habilidades...</p>}
        {!isLoading && error && <p className={ERROR_TEXT}>{error}</p>}
        {!isLoading && !error && skills.length === 0 && (
          <p className={EMPTY}>No hay habilidades registradas.</p>
        )}
        {!isLoading &&
          skills.map((skill) => (
            <SkillBar key={skill.id} skill={skill} onEdit={setEditingSkill} />
          ))}
      </div>

      {showAdd && (
        <AddSkillPopup
          onSubmit={(name, level) => addSkill(name, level)}
          onClose={() => setShowAdd(false)}
        />
      )}

      {editingSkill && (
        <EditSkillPopup
          skill={editingSkill}
          onSubmit={(id, name, level) => editSkill(id, name, level)}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </div>
  );
};

export default SkillsList;