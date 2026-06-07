import WorkExperienceListPublic from '../../features/WorkExperience/components/WorkExperienceListPublic';

const styles = {
    container: "w-full",
};

// Página pública de experiencia laboral (portafolio visible)
const WorkExperiencePage = () => {
    return (
        <div className={styles.container}>
            <WorkExperienceListPublic />
        </div>
    );
};

export default WorkExperiencePage;