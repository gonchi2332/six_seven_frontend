import { useParams } from "react-router-dom"; // Importamos para obtener el username
import Navbar from "../components/Navbar/Navbar";
import PublicSoftSkillsList from "../features/SoftSkills/PublicSoftSkillsList";
import PublicPersonalInfo from "../features/EditPersonalInfo/components/PublicPersonalInfo";
import PublicLinkedIn from "../features/LinkedIn/PublicLinkedIn";
import PublicHardSkillsList from "../features/skills/components/PublicHardSkillsList";

const STYLES = {
  WRAPPER: "min-h-screen bg-main flex flex-col",
  CONTENT: "w-full p-6",
  // Grid para poner componentes lado a lado
  GRID_CONTAINER: "grid grid-cols-1 lg:grid-cols-2 gap-8 w-full"
};

const PublicDashboard = () => {
  // Obtenemos el username para pasárselo al Navbar
  const { username } = useParams<{ username: string }>();

  return (
    <div className={STYLES.WRAPPER}>
      {/* Navbar con el nombre del dueño del portafolio */}
      <Navbar isPublic={true} ownerName={username} />

      {/* 1. Sección: Información Personal (Ancho completo) */}
      <div className={STYLES.CONTENT}>
        <PublicPersonalInfo />
      </div>

      {/* 2. Sección: Habilidades (Lado a lado en pantallas grandes) */}
      <div className={STYLES.CONTENT}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"> 
          {/* items-start es clave para que si una lista es más corta, no intente centrarse verticalmente */}
          <PublicHardSkillsList />
          <PublicSoftSkillsList />
        </div>
      </div>

      {/* 3. Sección: LinkedIn (Ancho completo o al final) */}
      <div className={STYLES.CONTENT}>
        <PublicLinkedIn />
      </div>
    </div>
  );
};

export default PublicDashboard;