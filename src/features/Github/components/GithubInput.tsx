import { useState } from 'react';
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";

interface Props {
    onSuccess: (username: string) => void;
    onClose: () => void;
    initialValue?: string;
}

const STYLES = {
    CONTAINER: "p-10 flex flex-col items-center gap-6 bg-primary rounded-2xl shadow-xl font-nunito",
};

function GithubInput({ onSuccess, onClose, initialValue = '' }: Props) {
    const [input, setInput] = useState(initialValue);
    const [touched, setTouched] = useState(false);

    const isEmpty = input.trim().length === 0;
    const isValid = !isEmpty;
    const showError = touched && isEmpty;

    const handleAccept = () => {
        if (!isValid) return;
        // Extrae solo el username si se pegó una URL completa
        const cleanUser = input.trim().split('/').filter(Boolean).pop() || "";
        onSuccess(cleanUser);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setTouched(true);
    };

    return (
        <div className={STYLES.CONTAINER}>
            <TextField
                label="Nombre de Usuario de GitHub"
                placeholder="Ej: octocat"
                value={input}
                onChange={handleChange}
                error={showError ? "El nombre de usuario es obligatorio" : ""}
            />
            <div className='flex gap-4 w-full justify-center'>
                <Button variant='secondary' onClick={onClose}>
                    Cancelar
                </Button>
                <Button onClick={handleAccept} disabled={!isValid}>
                    {initialValue ? 'Actualizar' : 'Vincular'}
                </Button>
            </div>
        </div>
    );
}

export default GithubInput;