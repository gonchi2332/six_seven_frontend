import { useState }  from 'react';
import Button from "../../components/Button";
import TextField from "../../components/TextField";

interface Props {
  onSuccess: (username: string) => void;
  onClose: () => void;
  initialValue?: string;
}

const STYLES = {
  CONTAINER: "p-10 flex flex-col items-center gap-6 bg-primary rounded-2xl shadow-xl font-nunito",
}

function LinkedInCard({ onSuccess, onClose, initialValue = '' }: Props) {
  const [input, setInput] = useState(initialValue);

  const handleAccept = () => {
    const trimmedInput = input.trim();
    if (trimmedInput.length > 0) {
      const cleanUser = trimmedInput.split('/').filter(Boolean).pop() || "";
      onSuccess(cleanUser);
    }
  };

  return (
    <div className={STYLES.CONTAINER}>
      <TextField 
        label="Nombre de Usuario de LinkedIn"
        placeholder="Ej: anahisu"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className='flex gap-4 w-full'>
        <Button onClick={handleAccept}>
          {initialValue ? 'Actualizar' : 'Vincular'}
        </Button>
        <Button variant='secondary' onClick={onClose} >
          Cancelar
        </Button>
      </div>
    </div>
  );
}

export default LinkedInCard;