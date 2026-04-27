import { useNavigate } from "react-router-dom";
import { parseProfilePicture } from "../../services/decodeBase64";
import { useNavbarInfo } from "../../hooks/useNavbarInfo";

interface NavbarProps {
  isPublic?: boolean;
}

interface NavbarProps {
  isPublic?: boolean;
  ownerName?: string; // Nuevo: Para mostrar el nombre del dueño en modo público
}

const Navbar = ({ isPublic = false, ownerName }: NavbarProps) => {
  const { userInfo } = useNavbarInfo();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const NAVBAR = "w-full bg-secondary p-4 text-white font-inter font-bold text-xl";

  // Nombre del usuario logueado (para el panel privado)
  const userFullName = [
    userInfo?.names,
    userInfo?.first_surname,
  ].filter(Boolean).join(" ");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className={NAVBAR}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {/* Mostramos el avatar solo si NO es público */}
          {!isPublic && (
            <img
              src={(userInfo?.profile_picture ? parseProfilePicture(userInfo.profile_picture) : "") ?? ""}
              alt="Foto de perfil"
              className="w-10 h-10 object-cover rounded-full border border-white/10"
            />
          )}
          
          {/* Texto dinámico */}
          <span className="truncate">
            {isPublic 
              ? `Portafolio de ${userFullName || ownerName || "Usuario"}` 
              : (userFullName || "Mi Panel")}
          </span>
        </div>

        {/* Lógica de sesión simple */}
        <div>
          {!isPublic && token ? (
            <button onClick={handleLogout} className="cursor-pointer hover:text-red-400 transition-colors text-sm font-medium">
              Cerrar Sesión
            </button>
          ) : !token ? (
            <button onClick={() => navigate("/login")} className="cursor-pointer hover:text-accent transition-colors text-sm font-medium">
              Iniciar Sesión
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;