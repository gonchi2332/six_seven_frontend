import React, { useRef } from "react";

interface Props {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  error?: boolean;
}

const VerificationCodeInput = ({
  length = 7,
  value,
  onChange,
  error = false,
}: Props) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const handleChange = (val: string, index: number) => {
    if (!/^[0-9]?$/.test(val)) return; //Parser de digitos
    const newValue = [...value];
    newValue[index] = val;
    onChange(newValue);
    if (val && index < length - 1) { //Pasar al siguiente input
      inputsRef.current[index + 1]?.focus();
    }
  };

return (
  <div className="flex justify-center mt-4">
    <div className="flex bg-black rounded-xl overflow-hidden">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e.target.value, i)}
          className={`w-8 h-12 text-center
            text-[20px] font-nunito 
            bg-transparent text-white caret-white
            outline-none
            ${error ? "text-red-400" : ""}
          `}
        />
      ))}
    </div>
  </div>
)};

export default VerificationCodeInput;