import { WorkExperienceList } from '../features/WorkExperience';

const styles = {
    container: "w-full max-w-4xl mx-auto",
};

const WorkExperiencePage = () => {
    return (
        <div className={styles.container}>
            <WorkExperienceList />
        </div>
    );
};

export default WorkExperiencePage;