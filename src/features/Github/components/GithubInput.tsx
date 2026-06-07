import { useState } from 'react';
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";

/*
  Props del componente GithubInput:
  -onSuccess: Función ejecutada al aceptar y validar el nombre de usuario, recibe el username limpio
  -onClose: Función ejecutada al cancelar o cerrar el modal
  -initialValue: Valor inicial del input (útil para modo edición)
*/
interface Props {
    onSuccess: (username: string) => void;
    onClose: () => void;
    initialValue?: string;
}

const STYLES = {
    CONTAINER: "p-10 flex flex-col items-center gap-6 bg-primary rounded-2xl shadow-xl font-nunito",
}

/*
  Características:
  -Input modal para vincular o actualizar cuenta de GitHub
  -Campo de texto para ingresar nombre de usuario de GitHub
  -Limpia la URL para extraer solo el nombre (ej: "https://github.com/octocat" -> "octocat")
  -Validación: campo no puede estar vacío
  -Muestra error solo si el campo ha sido tocado (touched) y está vacío
  -Botón Cancelar: cierra el modal
  -Botón: cambia texto según si hay initialValue ("Actualizar" o "Vincular")
  -Deshabilita botón si el campo está vacío

  @ Ejemplo modo vinculación:
  <GithubInput
    onSuccess={(username) => saveGithubProfile(username)}
    onClose={() => setShowModal(false)}
  />

  @ Ejemplo modo edición:
  <GithubInput
    onSuccess={(username) => updateGithubProfile(username)}
    onClose={() => setShowModal(false)}
    initialValue="octocat"
  />
*/
function GithubInput({ onSuccess, onClose, initialValue = '' }: Props) {
    const [input, setInput] = useState(initialValue);
    const [touched, setTouched] = useState(false);

    const isEmpty = input.trim().length === 0;
    const isValid = !isEmpty;
    const showError = touched && isEmpty;

    const handleAccept = () => {
        if (!isValid) return;

        const trimmedInput = input.trim();
        const cleanUser = trimmedInput.split('/').filter(Boolean).pop() || "";
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
                <Button
                    onClick={handleAccept}
                    disabled={!isValid}
                >
                    {initialValue ? 'Actualizar' : 'Vincular'}
                </Button>
            </div>
        </div>
    );
}

export default GithubInput;

