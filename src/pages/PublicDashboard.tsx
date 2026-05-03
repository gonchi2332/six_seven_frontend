import { useParams } from "react-router-dom"; // Importamos para obtener el username
import Navbar from "../components/Navbar/Navbar";
import PublicSoftSkillsList from "../features/SoftSkills/PublicSoftSkillsList";
import PublicPersonalInfo from "../features/PersonalInfo/EditPersonalInfo/PublicPersonalInfo";
import PublicLinkedIn from "../features/LinkedIn/PublicLinkedIn";
import PublicHardSkillsList from "../features/skills/components/PublicHardSkillsList";

const STYLES = {
  WRAPPER: "min-h-screen bg-main flex flex-col",
  CONTENT: "w-full p-6",
  GRID_CONTAINER: "grid grid-cols-1 lg:grid-cols-2 gap-8 w-full"
};

const PublicDashboard = () => {
  const { username } = useParams<{ username: string }>();

  return (
    <div className={STYLES.WRAPPER}>
      <Navbar isPublic={true} ownerName={username} />
      <div className={STYLES.CONTENT}>
        <PublicPersonalInfo />
      </div>
      <div className={STYLES.CONTENT}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"> 
          <PublicHardSkillsList />
          <PublicSoftSkillsList />
        </div>
      </div>
      <div className={STYLES.CONTENT}>
        <PublicLinkedIn />
      </div>
    </div>
  );
};

export default PublicDashboard;