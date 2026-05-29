import EmailVerificationFlow from "../features/auth/components/EmailPasswordVerification/EmailVerificationFlow";

const PasswordResetPage = () => {
  return (
    <div>
      <EmailVerificationFlow initialMode="recovery" />
    </div>
  );
};


export default PasswordResetPage;
