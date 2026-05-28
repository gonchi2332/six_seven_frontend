
import WorkExperienceListPublic from '../../features/WorkExperience/WorkExperienceListPublic';

const styles = {
    container: "w-full",
};

const WorkExperiencePage = () => {
    return (
        <div className={styles.container}>
            <WorkExperienceListPublic />
        </div>
    );
};

export default WorkExperiencePage;