interface SkillLevelSelectorProps {
    value: number;
    onChange: (level: number) => void;
}

// Opciones de nivel (1-5 con etiquetas descriptivas)
const LEVELS = [
    { value: 1, label: "Básico" },
    { value: 2, label: "Elemental" },
    { value: 3, label: "Intermedio" },
    { value: 4, label: "Avanzado" },
    { value: 5, label: "Experto" },
];

const styles = {
    wrapper: "flex gap-2 sm:gap-3 mt-3",
    button: "flex flex-col items-center gap-1.5 sm:gap-2 flex-1 group min-w-0",
    indicator: (active: boolean) =>
        `w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 flex items-center justify-center font-inter font-bold text-[13px] sm:text-[14px] transition-all duration-200 shrink-0 ${
            active
                ? "bg-white border-white text-primary shadow-md scale-105"
                : "bg-transparent border-white text-white/70 group-hover:text-white group-hover:border-white"
        }`,
    label: (active: boolean) =>
        `text-[10px] sm:text-[12px] font-nunito leading-tight text-center transition-all duration-200 ${
            active ? "text-white font-semibold" : "text-white/60 group-hover:text-white"
        }`,
};

// Selector visual de nivel (botones con número y etiqueta)
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