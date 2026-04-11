import EmailVerificationFlow from "../features/auth/components/EmailPasswordVerification/EmailVerificationFlow";

const VerificationPage = () => {
  return (
    <div>
      <EmailVerificationFlow initialMode="verify" />
    </div>
  );
};


export default VerificationPage;