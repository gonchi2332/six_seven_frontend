import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Step = "email" | "verification" | "reset";
type Mode = "verify" | "recovery";

interface UseVerificationFlowProps {
    initialMode?: Mode;
    initialStep?: Step;
    initialUsername?: string;
    initialEmail?: string;
    onClose?: () => void;
}

interface UseVerificationFlowReturn {
    step: Step;
    mode: Mode;
    username: string;
    email: string;
    verifiedCode: string;
    handleEmailSubmit: (submittedUsername: string, recoveryEmail: string) => void;
    handleCodeSuccess: (codeString?: string) => void;
    handleClose: () => void;
}

// Orquesta los tres pasos del flujo: email → verificación → reset
export const useEmailVerificationFlow = ({
    initialMode = "verify",
    initialStep = "email",
    initialUsername = "",
    initialEmail = "",
    onClose,
}: UseVerificationFlowProps): UseVerificationFlowReturn => {
    const [step, setStep] = useState<Step>(initialStep);
    const [mode] = useState<Mode>(initialMode);
    const [username, setUsername] = useState(initialUsername);
    const [verifiedCode, setVerifiedCode] = useState("");
    const [email, setEmail] = useState(initialEmail);
    const navigate = useNavigate();

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate("/login");
        }
    };

    const handleEmailSubmit = (submittedUsername: string, recoveryEmail: string) => {
        setUsername(submittedUsername);
        setEmail(recoveryEmail);
        setStep("verification");
    };

    const handleCodeSuccess = (codeString?: string) => {
        if (codeString) {
            setVerifiedCode(codeString);
        }
        // En recovery avanza a reset, en verify cierra el flujo
        if (mode === "recovery") {
            setStep("reset");
        } else if (mode === "verify") {
            handleClose();
        }
    };

    return {
        step, mode, username, email, verifiedCode,
        handleEmailSubmit, handleCodeSuccess, handleClose,
    };
};