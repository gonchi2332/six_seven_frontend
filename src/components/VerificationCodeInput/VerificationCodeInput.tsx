import { useVerificationCode } from "../../hooks/useVerificationCode";

interface Props {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  error?: boolean;
}

const VerificationCodeInput = ({ length = 7, value, onChange, error = false }: Props) => {
  const { inputsRef, handleChange } = useVerificationCode(length, value, onChange);

  return (
    <div className="flex justify-center mt-4">
      <div className="flex bg-black rounded-xl overflow-hidden">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleChange(e.target.value, i)}
            className={`w-8 h-12 text-center text-[20px] font-nunito bg-transparent text-white caret-white outline-none ${error ? "text-red-400" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VerificationCodeInput;