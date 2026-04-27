const LEVEL_OPTIONS = [1, 2, 3, 4, 5];

const WRAPPER = "flex gap-3 mt-1";
const LEVEL_BUTTON_BASE =
  "w-9 h-9 rounded-full border-2 font-inter font-bold text-[15px] transition-all duration-200 cursor-pointer";
const LEVEL_BUTTON_ACTIVE = "bg-accent border-accent text-primary";
const LEVEL_BUTTON_INACTIVE = "bg-transparent border-surface text-surface";

interface Props {
  value: number;
  onChange: (level: number) => void;
}

const SkillLevelSelector = ({ value, onChange }: Props) => {
  return (
    <div className={WRAPPER}>
      {LEVEL_OPTIONS.map((lvl) => (
        <button
          key={lvl}
          type="button"
          onClick={() => onChange(lvl)}
          className={`${LEVEL_BUTTON_BASE} ${
            value === lvl ? LEVEL_BUTTON_ACTIVE : LEVEL_BUTTON_INACTIVE
          }`}
        >
          {lvl}
        </button>
      ))}
    </div>
  );
};

export default SkillLevelSelector;