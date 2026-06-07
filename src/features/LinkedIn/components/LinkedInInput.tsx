import { useState } from 'react';
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";

/*
  Props del componente LinkedInCard:
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
  -Input modal para vincular o actualizar cuenta de LinkedIn
  -Campo de texto para ingresar nombre de usuario de LinkedIn
  -Limpia la URL para extraer solo el nombre (ej: "https://linkedin.com/in/anahisu" -> "anahisu")
  -No tiene validación de campo vacío (permite enviar vacío)
  -Botón Cancelar: cierra el modal
  -Botón: cambia texto según si hay initialValue ("Actualizar" o "Vincular")

  @ Ejemplo modo vinculación:
  <LinkedInCard
    onSuccess={(username) => saveLinkedInProfile(username)}
    onClose={() => setShowModal(false)}
  />

  @ Ejemplo modo edición:
  <LinkedInCard
    onSuccess={(username) => updateLinkedInProfile(username)}
    onClose={() => setShowModal(false)}
    initialValue="anahisu"
  />
*/
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
            <div className='flex gap-4 w-full justify-center'>
                <Button variant='secondary' onClick={onClose} >
                    Cancelar
                </Button>
                <Button onClick={handleAccept}>
                    {initialValue ? 'Actualizar' : 'Vincular'}
                </Button>

            </div>
        </div>
    );
}

export default LinkedInCard;

