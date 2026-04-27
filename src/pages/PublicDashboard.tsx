import Navbar from "../components/Navbar/Navbar";
import PublicSoftSkillsList from "../features/SoftSkills/PublicSoftSkillsList";
import PublicPersonalInfo from "../features/EditPersonalInfo/components/PublicPersonalInfo";
import PublicLinkedIn from "../features/LinkedIn/PublicLinkedIn";
import Header from "../components/Header/Header";

const STYLES = {
  WRAPPER: "min-h-screen bg-main flex flex-col",
  CONTENT: "w-full p-6", // Respetamos exactamente tu padding del dashboard privado
};

const PublicDashboard = () => {
  return (
    <div className={STYLES.WRAPPER}>
      <Navbar isPublic={true} />

      {/* Sección: Información Personal */}
      <div className={STYLES.CONTENT}>
        <Header title='Información Personal' />
        <PublicPersonalInfo />
      </div>

      {/* Sección: Habilidades Blandas */}
      <div className={STYLES.CONTENT}>
        <PublicSoftSkillsList />
      </div>
      {/* Sección: LinkedIn */}
      <div className={STYLES.CONTENT}>
        <PublicLinkedIn />
      </div>
    </div>
  );
};

export default PublicDashboard;