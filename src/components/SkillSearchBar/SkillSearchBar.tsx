import { Search } from "lucide-react";
import Button from "../Button";

/*
  Propiedades del componente SkillSearchBar:
  -value: Valor actual del campo de búsqueda
  -onChange: Función que se ejecuta al cambiar el texto del input
  -onSearch: Función que se ejecuta al hacer clic en el botón Buscar
  -onKeyDown: Función que se ejecuta al presionar una tecla (útil para detectar Enter)
  -onAdd: Función que se ejecuta al hacer clic en el botón Registrar
  -placeholder: Texto de ayuda dentro del input (por defecto "Buscar...")
  -addLabel: Etiqueta opcional para el botón Registrar (no utilizado actualmente)
  -isPublic: Si es true, oculta el botón Registrar (modo público)
*/
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

/*
  Caracteristicas:
  -Barra de búsqueda y registro de habilidades.
  -Incluye un campo de texto con ícono de lupa para escribir el término de búsqueda, un botón "Buscar" y un botón "Registrar" (visible solo en modo privado).
  -Es responsive: en dispositivos móviles los botones ocupan todo el ancho, mientras que en desktop tienen un tamaño fijo.

  Ejemplo de uso en modo edición:
  <SkillSearchBar 
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onSearch={handleSearch}
    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    onAdd={() => openAddModal()}
  />

  Ejemplo de uso en modo público:
  <SkillSearchBar 
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onSearch={handleSearch}
    onKeyDown={handleKeyDown}
    onAdd={() => {}}
    isPublic={true}
  />
*/
const SkillSearchBar = ({
    value, onChange, onSearch, onKeyDown, onAdd,
    placeholder = "Buscar...",
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

            <Button
                variant="secondary"
                onClick={onSearch}
                fullWidth
            >
                Buscar
            </Button>
        {!isPublic && (<Button
                variant="quaternary"
                onClick={onAdd}
                fullWidth
            >
                Registrar
            </Button>)}


        </div>
    );
};

export default SkillSearchBar;