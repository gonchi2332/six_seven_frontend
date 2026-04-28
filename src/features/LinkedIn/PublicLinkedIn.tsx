import { useParams } from "react-router-dom";
import { useLinkedin } from "../../hooks/useLinkedIn";
import LinkedInBadge from "./LinkedInBadge";
import Header from "../../components/Header/Header";

const STYLES = {
  CONTAINER: "flex flex-col gap-4",
  TITLE: "text-2xl font-bold text-white font-inter mb-2",
  EMPTY: "text-surface/50 font-nunito italic"
};

const PublicLinkedIn = () => {
  const { username } = useParams<{ username: string }>();
  const { linkedinUser, isLoading } = useLinkedin(username || "");

  if (isLoading) return <p className="text-white/50">Cargando LinkedIn...</p>;

  if (!linkedinUser) return null;

  return (
    <div className={STYLES.CONTAINER}>
      <Header title='LinkedIn'/>
      <div className="flex justify-start">
        <LinkedInBadge username={linkedinUser} />
      </div>
    </div>
  );
};

export default PublicLinkedIn;