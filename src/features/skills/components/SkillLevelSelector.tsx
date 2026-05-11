interface SkillLevelSelectorProps {
    value: number;
    onChange: (level: number) => void;
}

const LEVELS = [
    { value: 1, label: "Básico" },
    { value: 2, label: "Elemental" },
    { value: 3, label: "Intermedio" },
    { value: 4, label: "Avanzado" },
    { value: 5, label: "Experto" },
];

const styles = {
    wrapper: "flex gap-3 mt-3",
    button: "flex flex-col items-center gap-2 flex-1 group",
    indicator: (active: boolean) => `w-full h-10 rounded-xl border-2 flex items-center justify-center font-inter font-bold text-[14px] transition-all duration-200 ${active ? "bg-white border-white text-primary shadow-md scale-105" : "bg-transparent border-white text-white/70 group-hover:text-white group-hover:border-white"}`,
    label: (active: boolean) => `text-[12px] font-nunito leading-tight text-center transition-all duration-200 ${active ? "text-white font-semibold" : "text-white/60 group-hover:text-white"}`,
};

const SkillLevelSelector = ({ value, onChange }: SkillLevelSelectorProps) => {
    return (
        <div className={styles.wrapper}>
            {LEVELS.map((lvl) => {
                const isActive = value === lvl.value;
                return (
                    <button
                        key={lvl.value}
                        type="button"
                        onClick={() => onChange(lvl.value)}
                        title={lvl.label}
                        className={styles.button}
                    >
                        <span className={styles.indicator(isActive)}>
                            {lvl.value}
                        </span>
                        <span className={styles.label(isActive)}>
                            {lvl.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default SkillLevelSelector;