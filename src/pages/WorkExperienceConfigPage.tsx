
import WorkExperienceListConfig from '../features/WorkExperience/WorkExperienceListConfig';

const styles = {
    container: "w-full",
};

const WorkExperiencePage = () => {
    return (
        <div className={styles.container}>
            <WorkExperienceListConfig />
        </div>
    );
};

export default WorkExperiencePage;