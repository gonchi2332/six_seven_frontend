import { useRef } from "react";

/*
  Características:
  -Hook personalizado para manejar un input de código de verificación dividido en múltiples campos
  -Solo permite entrada de dígitos (0-9), filtra cualquier otro carácter
  -Auto-focus: al llenar un campo, avanza automáticamente al siguiente input
  -Mantiene referencias a cada input para controlar el foco programáticamente

  @ Parámetros:
  -length: Número de campos/caracteres del código
  -value: Array con los valores actuales de cada campo
  -onChange: Función llamada cuando cambia algún campo, recibe el array actualizado

  @ Retorna:
  -inputsRef: Referencia a un array de elementos input para controlar foco
  -handleChange: Función que procesa el cambio en un campo específico

  @ Ejemplo:
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const { inputsRef, handleChange } = useVerificationCode(6, code, setCode);
  
  return (
    <div>
      {code.map((digit, idx) => (
        <input
          key={idx}
          ref={el => inputsRef.current[idx] = el}
          value={digit}
          onChange={(e) => handleChange(e.target.value, idx)}
          maxLength={1}
        />
      ))}
    </div>
  )
*/
export const useVerificationCode = (length: number, value: string[], onChange: (val: string[]) => void) => {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (val: string, index: number) => {
        if (!/^[0-9]?$/.test(val)) return;

        const newValue = [...value];
        newValue[index] = val;
        onChange(newValue);

        if (val && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    return { inputsRef, handleChange };
};