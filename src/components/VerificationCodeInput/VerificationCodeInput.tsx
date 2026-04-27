interface Props {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const VerificationCodeInput = ({ length = 8, value, onChange, error = false }: Props) => {

  const inputBaseStyles = "w-full h-12 text-center text-[24px] tracking-[0.5em] font-nunito bg-black text-white caret-white outline-none rounded-xl";
  const inputNormalStyles = "focus:ring-1 focus:ring-blue-500 border border-white/10";
  const inputErrorStyles = "border border-red-500 text-red-400";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, length);
    onChange(val);
  };

  return (
    <div className="flex justify-center mt-4 w-full">
      <div className="w-[260px]">
        <input
          type="text"
          maxLength={length}
          value={value}
          onChange={handleChange}
          className={`${inputBaseStyles} ${error ? inputErrorStyles : inputNormalStyles}`}
          placeholder="00000000"
        />
      </div>
    </div>
  );
};

export default VerificationCodeInput;