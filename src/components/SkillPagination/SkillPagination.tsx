/*
  Propiedades del componente SkillPagination:
  -currentPage: Página actual en la que se encuentra el usuario
  -totalPages: Número total de páginas disponibles
  -onPrev: Función que se ejecuta al hacer clic en el botón anterior
  -onNext: Función que se ejecuta al hacer clic en el botón siguiente
*/
interface SkillPaginationProps {
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
}

const styles = {
    wrapper: "flex items-center justify-center gap-4 pt-2",
    btn: "w-10 h-10 rounded-xl border border-white/20 text-white text-lg hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center",
};

/*
  Caracteristicas:
  -Muestra dos botones: anterior (‹) y siguiente (›).
  -Si totalPages es 1 o menos, el componente no se renderiza (retorna null).
  -El botón anterior se deshabilita cuando currentPage es 1.
  -El botón siguiente se deshabilita cuando currentPage es igual a totalPages.

  Ejemplo de uso:
  <SkillPagination 
    currentPage={page} 
    totalPages={10} 
    onPrev={() => setPage(page - 1)} 
    onNext={() => setPage(page + 1)} 
  />
*/
const SkillPagination = ({ currentPage, totalPages, onPrev, onNext }: SkillPaginationProps) => {
    if (totalPages <= 1) return null;
    
    return (
        <div className={styles.wrapper}>
            <button type="button" onClick={onPrev} disabled={currentPage === 1} className={styles.btn}>‹</button>
            <button type="button" onClick={onNext} disabled={currentPage === totalPages} className={styles.btn}>›</button>
        </div>
    );
};

export default SkillPagination;