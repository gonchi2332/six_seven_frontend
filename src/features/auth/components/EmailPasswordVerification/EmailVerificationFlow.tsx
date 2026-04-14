import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [verifiedCode, setVerifiedCode] = useState("");
    const navigate = useNavigate();

    const handleEmailSubmit = (submittedUsername: string, submittedEmail: string) => {
        setUsername(submittedUsername);
        setEmail(submittedEmail);
        setStep("verification");
    };

    const handleCodeSuccess = (codeString?: string) => {
        if (codeString) {
            setVerifiedCode(codeString);
        }
        if (mode === "recovery") {
            setStep("reset");
        } else if (mode === "verify") {
            navigate("/dashboard");
        }
    };
    //console.log(username);
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
                    username={username}
                    email={email}
                    mode={mode}
                    onSuccess={handleCodeSuccess}
                />
            )}
            {step === "reset" && (
                <ResetPasswordPopup username={username} code={verifiedCode} />
            )}
        </>
    );
};

export default VerificationFlow;
