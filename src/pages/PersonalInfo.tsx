import { useState } from 'react';
import Button from "../components/Button";
import EditPersonalInfoCard from "../features/EditPersonalInfo/components";

const PersonalInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="align-start flex flex-col gap-6">
        <h1 className="text-4xl font-bold font-inter mb-4 text-surface">
          Información <br /> Personal
        </h1>
        <div>
          <Button
            onClick={() => setIsOpen(true)}
            variant="primary"
          >
            Editar Información
          </Button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <EditPersonalInfoCard onClose={() => setIsOpen(false)}/>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfo;