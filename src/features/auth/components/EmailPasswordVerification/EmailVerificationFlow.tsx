import { useState } from 'react';
import VerificationPopup from './CodeEmailPopup';
import ExpiredCodePopup from './ExpiredCodePopup';

type PopupType = 'verification' | 'expired';
type Mode = 'verify' | 'reset';

type Props = {
  initialMode?: Mode;
};

const VerificationFlow = ({ initialMode = 'verify' }: Props) => {
  const [currentPopup, setCurrentPopup] = useState<PopupType>('verification');
  const [mode, setMode] = useState<Mode>(initialMode);

  const handleCodeExpired = () => {
    setCurrentPopup('expired');
  };

  const handleResendCode = () => {
    setCurrentPopup('verification');
  };

  return (
    <>
      {currentPopup === 'verification' && (
        <VerificationPopup
          mode={mode}
          onCodeExpired={handleCodeExpired}
        />
      )}
      {currentPopup === 'expired' && (
        <ExpiredCodePopup
          onResendCode={handleResendCode}
        />
      )}
    </>
  );
};

export default VerificationFlow;