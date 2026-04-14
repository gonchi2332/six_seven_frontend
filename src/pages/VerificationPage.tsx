import EmailVerificationFlow from "../features/auth/components/EmailPasswordVerification/EmailVerificationFlow";

const VerificationPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center flex-1">
        <EmailVerificationFlow initialMode="verify" />
      </div>
    </div>
  );
};

export default VerificationPage;