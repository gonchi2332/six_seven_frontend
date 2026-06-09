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

const SkillPagination = ({ currentPage, totalPages, onPrev, onNext }: SkillPaginationProps) => {
    // No renderiza si solo hay una página
    if (totalPages <= 1) return null;
    
    return (
        <div className={styles.wrapper}>
            <button type="button" onClick={onPrev} disabled={currentPage === 1} className={styles.btn}>‹</button>
            <button type="button" onClick={onNext} disabled={currentPage === totalPages} className={styles.btn}>›</button>
        </div>
    );
};

export default SkillPagination;