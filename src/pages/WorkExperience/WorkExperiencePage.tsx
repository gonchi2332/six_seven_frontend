import { WorkExperienceList } from '../../features/WorkExperience/components';

const styles = {
    container: "w-full",
};

// Página principal de gestión de experiencia laboral (modo privado)
const WorkExperiencePage = () => {
    return (
        <div className={styles.container}>
            <WorkExperienceList />
        </div>
    );
};

export default WorkExperiencePage;