
import AdditionalInfoModal from "../features/AddOptionalInfo/components/AdditionalInfoModal";


const AdditionalInfoPage = () => {

    const MODAL_SIZE = "fixed inset-0 flex items-center justify-center bg-black/40 z-50";
    return (
        <div className={MODAL_SIZE}>
            <AdditionalInfoModal />
        </div>
    );
}

export default AdditionalInfoPage;
