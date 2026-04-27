import Navbar from "../components/Navbar/Navbar";
import PersonalInfo from "./PersonalInfo";
import SkillsList from "../features/skills/components/SkillsList";

const STYLES = {
  WRAPPER: "flex flex-col items-center bg-main h-screen",
  CONTENT: "w-full p-6 flex flex-col gap-8",
};

const Dashboard = () => {
  return (
    <div className={STYLES.WRAPPER}>
      <Navbar />
      <div className={STYLES.CONTENT}>
        <PersonalInfo />
        <SkillsList />
      </div>
    </div>
  );
};

export default Dashboard;