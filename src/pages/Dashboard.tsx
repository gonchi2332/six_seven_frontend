import LinkedIn from "../features/LinkedIn/LinkedIn";
import PersonalInfo from "./PersonalInfo";

const STYLES = {
  WRAPPER: "min-h-screen bg-main flex flex-col",
  CONTENT: "w-full",
  GRID_CONTAINER: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
};

const Dashboard = () => {
  return (
    <div className={STYLES.WRAPPER}>
      <div className={STYLES.CONTENT}>
        <PersonalInfo />
      </div>
      <div className={STYLES.CONTENT}>
        <LinkedIn />
      </div>
    </div>
  );
};

export default Dashboard;