import { WorkExperienceList } from '../../features/WorkExperience/components';

const styles = {
    container: "w-full",
};

const WorkExperiencePage = () => {
    return (
        <div className={styles.container}>
            <WorkExperienceList />
        </div>
    );
};

export default WorkExperiencePage;
