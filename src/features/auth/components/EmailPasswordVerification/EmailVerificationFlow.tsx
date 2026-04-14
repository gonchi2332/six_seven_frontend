import { useState } from "react";
import EmailInputPopup from "./EmailInputPopup";
import VerificationPopup from "./CodeEmailPopup";
import ResetPasswordPopup from "./ChangePassword";

type Step = "email" | "verification" | "reset";
type Mode = "verify" | "recovery";

type Props = {
    initialMode?: Mode;
};

const VerificationFlow = ({ initialMode = "verify" }: Props) => {
    const [step, setStep] = useState<Step>("email");
    const [mode] = useState<Mode>(initialMode);
    const [username, setUsername] = useState("");

    const handleEmailSubmit = (submittedUsername: string) => {
        setUsername(submittedUsername);
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
                />
            )}
            {step === "verification" && (
                <VerificationPopup
                    username={username}
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
