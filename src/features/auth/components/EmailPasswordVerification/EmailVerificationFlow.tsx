import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailInputPopup from "./EmailInputPopup";
import VerificationPopup from "./CodeEmailPopup";
import ResetPasswordPopup from "./ChangePassword";

type Step = "email" | "verification" | "reset";
type Mode = "verify" | "recovery";

type Props = {
    initialMode?: Mode;
    initialStep?: Step;
    initialUsername?: string;
    onClose?: () => void;
};

const VerificationFlow = ({
    initialMode = "verify",
    initialStep = "email",
    initialUsername = "",
    onClose
}: Props) => {
    const [step, setStep] = useState<Step>(initialStep);
    const [mode] = useState<Mode>(initialMode);
    const [username, setUsername] = useState(initialUsername);
    const [verifiedCode, setVerifiedCode] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate("/login");
        }
    };

    const handleEmailSubmit = (submittedUsername: string, recoveryEmail: string) => {
        console.log("EMAIL EN FLOW:", recoveryEmail);
        setUsername(submittedUsername);
        setEmail(recoveryEmail);
        setStep("verification");
    };

    const handleCodeSuccess = (codeString?: string) => {
        if (codeString) {
            setVerifiedCode(codeString);
        }
        if (mode === "recovery") {
            setStep("reset");
        } else if (mode === "verify") {
            handleClose();
        }
    };

    const handleBack = () => {
        if (mode === "recovery") {
            setStep("email");
        }
    };

    return (
        <>
            {step === "email" && (
                <EmailInputPopup
                    onSubmit={handleEmailSubmit}
                    onCancel={handleClose}
                />
            )}
            {step === "verification" && (
                <VerificationPopup
                    username={username}
                    email={email}
                    mode={mode}
                    onSuccess={handleCodeSuccess}
                    onClose={handleClose}
                    onBack={mode === "recovery" ? handleBack : undefined}
                />
            )}
            {step === "reset" && (
                <ResetPasswordPopup
                    username={username}
                    code={verifiedCode}
                    email={email}
                    onClose={handleClose}
                />
            )}
        </>
    );
};

export default VerificationFlow;