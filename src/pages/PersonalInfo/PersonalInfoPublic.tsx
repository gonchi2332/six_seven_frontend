import PublicLinkedIn from "../../features/LinkedIn/components/PublicLinkedIn";
import PublicPersonalInfo from "../../features/PersonalInfo/PublicPersonalInfo";
import GitHub from "../../features/Github/components/Github";

const STYLES = {
    WRAPPER: "min-h-screen bg-main flex flex-col",
    CONTENT: "w-full",
    GRID_CONTAINER: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
};

const Dashboard = () => {
    return (
        <div className={STYLES.WRAPPER}>
            <div className={STYLES.CONTENT}>
                <PublicPersonalInfo />
            </div>
            <div className={STYLES.CONTENT}>
                <PublicLinkedIn />
            </div>
            <div className={STYLES.CONTENT}>
                <GitHub isPublic={true} />
            </div>
        </div>
    );
};

export default Dashboard;
