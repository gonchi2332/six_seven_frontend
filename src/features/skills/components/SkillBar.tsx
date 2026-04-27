import type { Skill } from "../types/skill.types";

const TOTAL_BARS = 5;

const ROW = "flex items-center gap-3 w-full max-w-sm";

const CARD =
  "flex items-center gap-4 flex-1 bg-[#07393C]/40 px-3 py-2 rounded-lg";

const NAME =
  "font-nunito font-medium text-[18px] text-[#F0EDEE] w-28 shrink-0 truncate";

const BARS_WRAPPER =
  "flex gap-1 p-1 flex-1 bg-black/40 rounded-md";

const BAR_ACTIVE =
  "h-3 flex-1 rounded-sm bg-[#90DDF0]";

const BAR_INACTIVE =
  "h-3 flex-1 rounded-sm bg-white/10";

const EDIT_BUTTON =
  "text-[#F0EDEE]/50 hover:text-white transition-colors duration-150 cursor-pointer text-[20px]";

interface Props {
  skill: Skill;
  onEdit: (skill: Skill) => void;
}

const SkillBar = ({ skill, onEdit }: Props) => {
  return (
    <div className={ROW}>
      <div className={CARD}>
        <span className={NAME}>{skill.name}</span>

        <div className={BARS_WRAPPER}>
          {Array.from({ length: TOTAL_BARS }).map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-300 ${
                i < skill.level ? BAR_ACTIVE : BAR_INACTIVE
              }`}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onEdit(skill)}
        className={EDIT_BUTTON}
      >
        <i className="fa-regular fa-pen-to-square" />
      </button>
    </div>
  );
};

export default SkillBar;