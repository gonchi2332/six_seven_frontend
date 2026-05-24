import { useState } from "react";

interface VisibilitySwitchProps {
    id: number | string;
    initialState?: boolean;
    onChange?: (id: number | string, isChecked: boolean) => void;
}

const styles = {
    switchLabel: "inline-flex items-center cursor-pointer select-none shrink-0",
    switchBg: "w-14 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-8 rtl:peer-checked:after:-translate-x-8 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#90DDF0]",
    switchText: "hidden sm:inline-block mr-3 text-sm font-nunito font-bold text-white/50 peer-checked:text-[#90DDF0] transition-colors"
};

const VisibilitySwitch = ({ id, initialState = true, onChange }: VisibilitySwitchProps) => {
    const [isVisible, setIsVisible] = useState(initialState);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsVisible(newValue);
        if (onChange) {
            onChange(id, newValue);
        }
    };

    return (
        <label className={styles.switchLabel} onClick={(e) => e.stopPropagation()}>
            <input
                type="checkbox"
                checked={isVisible}
                onChange={handleToggle}
                className="sr-only peer"
            />
            <span className={styles.switchText}>
                {isVisible ? "Público" : "Oculto"}
            </span>
            <div className={`relative ${styles.switchBg}`}></div>
        </label>
    );
};

export default VisibilitySwitch;
