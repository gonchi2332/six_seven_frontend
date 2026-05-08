interface SoftSkillItemProps {
    skillName: string;
    onDelete: (name: string) => void;
}

const styles = {
    container: "flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl border border-accent/20 hover:border-accent/50 transition-all",
    name: "text-surface font-nunito text-lg",
    buttons: "flex gap-2",
};

export const SoftSkillItem = ({ skillName, onDelete }: SoftSkillItemProps) => {
    return (
        <div className={styles.container}>
            <span className={styles.name}>{skillName}</span>
            <div className={styles.buttons}>
                <button
                    type="button"
                    onClick={() => onDelete(skillName)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                    title="Eliminar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export const PublicSoftSkillItem = ({ skillName }: { skillName: string }) => (
    <div className={styles.container}>
        <span className={styles.name}>{skillName}</span>
    </div>
);