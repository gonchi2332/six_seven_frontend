import LinkedIn from "../features/LinkedIn/LinkedIn";
import Github from "../features/Github/Github";
import PersonalInfo from "./PersonalInfo";

const STYLES = {
  WRAPPER: "min-h-screen bg-main flex flex-col",
  CONTENT: "w-full",
  GRID_CONTAINER: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start",
  SECTION: "mb-8",
};

const Dashboard = () => {
  return (
    <div className={STYLES.WRAPPER}>
      <div className={STYLES.CONTENT}>
        {/* Información Personal ocupa todo el ancho */}
        <div className={STYLES.SECTION}>
          <PersonalInfo />
        </div>
        
        {/* LinkedIn y GitHub en grid de 2 columnas */}
        <div className={STYLES.GRID_CONTAINER}>
          <LinkedIn />
          <Github />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;