import { useEmailVerificationFlow } from "../../hooks/useEmailVerificationFlow";
import EmailInputPopup from "./EmailInputPopup";
import VerificationPopup from "./CodeEmailPopup";
import ResetPasswordPopup from "./ChangePassword";

type Step = "email" | "verification" | "reset";
type Mode = "verify" | "recovery";

type Props = {
    initialMode?: Mode;
    initialStep?: Step;
    initialUsername?: string;
    initialEmail?: string;
    onClose?: () => void;
};

const VerificationFlow = (props: Props) => {

    const {
        step,
        mode,
        username,
        email,
        verifiedCode,
        handleEmailSubmit,
        handleCodeSuccess,
        handleClose,
    } = useEmailVerificationFlow(props);

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
