import PublicLinkedIn from "../../features/LinkedIn/components/PublicLinkedIn";
import PublicPersonalInfo from "../../features/PersonalInfo/components/PublicPersonalInfo";
import GitHub from "../../features/Github/components/Github";

const STYLES = {
    WRAPPER: "min-h-screen bg-main flex flex-col",
    CONTENT: "w-full",
    GRID_CONTAINER: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
};

/*
  Características:
  -Página principal del portafolio público (dashboard)
  -Renderiza tres secciones principales en modo público:
    - Información personal (PublicPersonalInfo)
    - Perfil de LinkedIn (PublicLinkedIn)
    - Perfil de GitHub (GitHub con isPublic={true})
  -Diseño en columna (flex-col) para móvil, sin grid implementado actualmente

  @ Ejemplo:
  // Ruta: /ver/juanperez
  <Dashboard />
*/
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
