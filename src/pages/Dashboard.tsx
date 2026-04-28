import Navbar from "../components/Navbar/Navbar";
import LinkedIn from "../features/LinkedIn/LinkedIn";
import PersonalInfo from "./PersonalInfo";
import SkillsList from "../features/skills/components/SkillsList";
import SoftSkillPage from "./SoftSkill";

const STYLES = {
  WRAPPER: "min-h-screen bg-main flex flex-col",
  CONTENT: "w-full p-6",
  // Grid idéntico al público para consistencia visual
  GRID_CONTAINER: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
};

const Dashboard = () => {
  return (
    <div className={STYLES.WRAPPER}>
      <Navbar />

      {/* 1. Información Personal */}
      <div className={STYLES.CONTENT}>
        <PersonalInfo />
      </div>

      {/* 2. Habilidades Lado a Lado */}
      <div className={STYLES.CONTENT}>
        <div className={STYLES.GRID_CONTAINER}>
          {/* Técnicas */}
          <div className="w-full">
            <SkillsList />
          </div>

          {/* Blandas */}
          <div className="w-full">
            <SoftSkillPage />
          </div>
        </div>
      </div>

      {/* 3. LinkedIn */}
      <div className={STYLES.CONTENT}>
        <LinkedIn />
      </div>
    </div>
  );
};

export default Dashboard;