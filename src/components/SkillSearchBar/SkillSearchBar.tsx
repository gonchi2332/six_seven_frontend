import { Search } from "lucide-react";

interface SkillSearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onAdd: () => void;
    placeholder?: string;
    addLabel?: string;
    isPublic?: boolean;
}

const styles = {
    wrapper: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
    searchInputWrapper: "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 bg-black/30 focus-within:border-[#90DDF0] transition-colors",
    searchIcon: "text-white shrink-0",
    searchInput: "bg-transparent outline-none text-white font-nunito text-[14px] sm:text-[15px] placeholder:text-white/40 w-full sm:w-56",
    buttonsRow: "flex gap-2",
    searchBtn: "flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#2C666E] text-white font-nunito text-sm font-semibold transition-all hover:brightness-110 active:scale-95",
    addBtn: "flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#90DDF0] text-[#07393C] font-nunito text-sm font-semibold transition-all hover:brightness-110 active:scale-95",
};

const SkillSearchBar = ({
    value, onChange, onSearch, onKeyDown, onAdd,
    placeholder = "Buscar...", addLabel = "Agregar",
    isPublic = false
}: SkillSearchBarProps) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.searchInputWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.buttonsRow}>
                <button type="button" onClick={onSearch} className={styles.searchBtn}>
                    Buscar
                </button>
                {!isPublic && (
                    <button type="button" onClick={onAdd} className={styles.addBtn}>
                        {addLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SkillSearchBar;