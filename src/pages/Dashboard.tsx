import LinkedIn from "../features/LinkedIn/components/LinkedIn";
import Github from "../features/Github/components/Github";
import PersonalInfo from "./PersonalInfo/PersonalInfo";

const STYLES = {
    WRAPPER: "min-h-screen bg-main flex flex-col",
    CONTENT: "w-full",
    GRID_CONTAINER: "grid grid-cols-1 lg:grid-cols-2 gap-2 items-start",
    SECTION: "mb-2 pb-2",
};

const Dashboard = () => {
    return (
        <div className={STYLES.WRAPPER}>
            <div className={STYLES.CONTENT}>
                <div className={STYLES.SECTION}>
                    <PersonalInfo />
                </div>
                <div className={STYLES.SECTION}>
                    <LinkedIn />
                </div>
                <div className={STYLES.SECTION}>
                    <Github />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
