import Button from "../../components/Button";
import PopUpCard from "../../components/PopUpCard";

interface Props {
    name: string;
    onClose: () => void;
}

const styles = {
    overlay: "fixed inset-0 bg-black/60 flex items-center justify-center px-4 sm:px-6 z-50",
    body: "flex flex-col gap-4 px-6 sm:px-8 pb-2",
    field: "flex flex-col gap-1",
    label: "text-[13px] font-nunito text-white/50",
    value: "text-[15px] font-nunito text-white font-semibold",
    buttonsWrapper: "flex justify-center mt-2 px-6 sm:px-8 pb-6",
};

const ViewSoftSkillPopup = ({ name, onClose }: Props) => {
    return (
        <div className={styles.overlay}>
            <div className="w-full max-w-xs sm:max-w-sm">
                <PopUpCard title="Habilidad Blanda">
                    <div className={styles.body}>
                        <div className={styles.field}>
                            <span className={styles.label}>Nombre</span>
                            <span className={styles.value}>{name}</span>
                        </div>
                    </div>
                    <div className={styles.buttonsWrapper}>
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                            Cerrar
                        </Button>
                    </div>
                </PopUpCard>
            </div>
        </div>
    );
};

export default ViewSoftSkillPopup;