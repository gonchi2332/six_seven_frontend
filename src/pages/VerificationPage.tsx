import VerificationFlow from "../features/auth/components/EmailPasswordVerification/EmailVerificationFlow";

const VerificationPage = () => {
  return (
    <div>
      <VerificationFlow initialMode="verify" />
    </div>
  );
};

export default VerificationPage;