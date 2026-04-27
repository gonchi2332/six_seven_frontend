import Navbar from "../components/Navbar/Navbar";
import LinkedIn from "../features/LinkedIn/LinkedIn";
import PersonalInfo from "./PersonalInfo";
import SoftSkillPage from "./SoftSkill";

const STYLES = {
  WRAPPER: "min-h-screen bg-main flex flex-col",
  CONTENT: "w-full p-6",
};

const Dashboard = () => {
  return (
    <div className={STYLES.WRAPPER}>
      <Navbar />
      <div className={STYLES.CONTENT}>
        <PersonalInfo />
      </div>
      <div className={STYLES.CONTENT}>
        <LinkedIn/>
      </div>
       <div className={STYLES.CONTENT}>
        <SoftSkillPage />
      </div>
    </div>
  );
};

export default Dashboard;