import Navbar from "../components/Navbar/Navbar";
import LinkedIn from "../features/LinkedIn/LinkedIn";
import PersonalInfo from "./PersonalInfo";

const STYLES = {
  WRAPPER: "flex flex-col items-center bg-main h-screen",
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
    </div>
  );
};

export default Dashboard;