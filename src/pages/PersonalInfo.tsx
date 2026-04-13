import { useState } from 'react';
import Button from "../components/Button";
import EditPersonalInfoCard from "../features/EditPersonalInfo/components";

const STYLES = {
  CONTAINER: "align-start flex flex-col gap-6",
  TITLE: "text-4xl font-bold font-inter mb-4 text-surface",
  OVERLAY: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
};

const PersonalInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={STYLES.CONTAINER}>
        <h1 className={STYLES.TITLE}>
          Información <br /> Personal
        </h1>
        <div>
          <Button onClick={() => setIsOpen(true)} variant="primary">
            Editar Información
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className={STYLES.OVERLAY} onClick={() => setIsOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <EditPersonalInfoCard onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfo;