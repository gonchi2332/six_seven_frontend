import WorkExperienceListConfig from '../../features/WorkExperience/components/WorkExperienceListConfig';

const styles = {
    container: "w-full",
};

// Página de configuración de visibilidad de experiencia laboral
const WorkExperienceConfigPage = () => {
    return (
        <div className={styles.container}>
            <WorkExperienceListConfig />
        </div>
    );
};

export default WorkExperienceConfigPage;