import Navbar from "../components/Navbar/Navbar";
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
    </div>
  );
};

export default Dashboard;