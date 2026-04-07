import { useState } from 'react';
import VerificationPopup from './CodeEmailPopup';
import ExpiredCodePopup from './ExpiredCodePopup';

type PopupType = 'verification' | 'expired';

const VerificationFlow = () => {
  const [currentPopup, setCurrentPopup] = useState<PopupType>('verification');

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
          mode="verify"
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