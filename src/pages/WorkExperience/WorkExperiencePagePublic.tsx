
import WorkExperienceListPublic from '../../features/WorkExperience/components/WorkExperienceListPublic';

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
