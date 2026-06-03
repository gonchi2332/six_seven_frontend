import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";

interface Props {
    name: string;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 py-4 z-50",
    content: "px-4 sm:px-6 pb-5 pt-0 flex flex-col gap-4 sm:gap-5",
    field: "flex flex-col gap-1",
    label: "text-accent text-xs uppercase tracking-wide font-bold mb-1",
    value: "text-surface font-nunito text-sm sm:text-base",
    buttonContainer: "flex gap-3 px-4 sm:px-6 pb-6",
};

const ViewSoftSkillPopup = ({ name, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm my-4 max-h-[90vh] overflow-y-auto">
                <PopUpCard title="Habilidad Blanda">
                    <div className={styles.content}>
                        <div className={styles.field}>
                            <p className={styles.label}>Nombre</p>
                            <p className={styles.value}>{name}</p>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth>Atrás</Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewSoftSkillPopup;
