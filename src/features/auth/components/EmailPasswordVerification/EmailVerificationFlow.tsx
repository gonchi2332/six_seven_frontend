import { useState } from "react";
import EmailInputPopup from "./EmailInputPopup";
import VerificationPopup from "./CodeEmailPopup";
import ResetPasswordPopup from "./ChangePassword";

type Step = "email" | "verification" | "reset";
type Mode = "verify" | "recovery";

type Props = {
  initialMode?: Mode;
  onClose?: () => void;
};

const VerificationFlow = ({ initialMode = "verify", onClose }: Props) => {
  const [step, setStep] = useState<Step>("email");
  const [mode] = useState<Mode>(initialMode);

  const handleEmailSubmit = () => {
    setStep("verification");
  };

  const handleCodeSuccess = () => {
    if (mode === "recovery") {
      setStep("reset");
    }
  };

  return (
    <>
      {step === "email" && (
        <EmailInputPopup
          mode={mode}
          onSubmit={handleEmailSubmit}
          onCancel={onClose}
        />
      )}

      {step === "verification" && (
        <VerificationPopup
          onSuccess={handleCodeSuccess}
        />
      )}

      {step === "reset" && (
        <ResetPasswordPopup />
      )}
    </>
  );
};

export default VerificationFlow;