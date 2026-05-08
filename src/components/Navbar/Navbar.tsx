import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { parseProfilePicture } from "../../services/decodeBase64";
import { useNavbarInfo } from "../../hooks/useNavbarInfo";
import { Copy, LogOut } from "lucide-react";
import PublicProfileLink from "../PublicProfileLink/PublicProfileLink"; // 1. Importa tu nuevo modal

const defAvatar = "/defAvatar.png";

const STYLES = {
  NAVBAR: "w-full bg-secondary px-6 py-3 text-white font-inter border-b border-white/5",
  CONTAINER: "flex items-center justify-between w-full max-w-7xl mx-auto",
  LEFT_SECTION: "flex items-center gap-8",
  USER_INFO: "flex items-center gap-3 border-r border-white/10 pr-6",
  AVATAR: "w-10 h-10 object-cover rounded-full border border-white/20",
  USER_NAME: "font-bold text-lg truncate max-w-[150px]",
  TABS_CONTAINER: "flex items-center gap-2",
  TAB_BUTTON: "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
  TAB_ACTIVE: "bg-accent text-secondary shadow-lg shadow-accent/20",
  TAB_INACTIVE: "text-white/60 hover:text-white hover:bg-white/5",
  ACTIONS_CONTAINER: "flex items-center gap-4",
  COPY_BUTTON: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 bg-white/10 hover:bg-white/20 text-white",
  LOGOUT_BUTTON: "flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors text-sm font-bold ml-2",
  LOGIN_BUTTON: "bg-accent/10 text-accent px-4 py-2 rounded-xl hover:bg-accent hover:text-secondary transition-all text-sm font-bold",
  OVERLAY: "fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm",
};

const NAV_TABS = [
  { name: "Perfil", path: "/info-personal" },
  { name: "Habilidades Técnicas", path: "/habilidades-tecnicas" },
  { name: "Habilidades Blandas", path: "/habilidades-blandas" },
  { name: "Proyectos", path: "/proyectos" },
  { name: "Educación", path: "/educacion" },
];

interface NavbarProps {
  isPublic?: boolean;
  ownerName?: string;
}

const Navbar = ({ isPublic = false, ownerName }: NavbarProps) => {
  const { userInfo } = useNavbarInfo();
  const navigate = useNavigate();
  const location = useLocation(); 
  const token = localStorage.getItem("token");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const userFullName = [userInfo?.names, userInfo?.first_surname]
    .filter(Boolean)
    .join(" ");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <nav className={STYLES.NAVBAR}>
        <div className={STYLES.CONTAINER}>
          
          <div className={STYLES.LEFT_SECTION}>
            <div className={STYLES.USER_INFO}>
              {!isPublic && (
                <img
                  src={(userInfo?.profile_picture ? parseProfilePicture(userInfo.profile_picture) : defAvatar) ?? defAvatar}
                  alt="Foto de perfil"
                  className={STYLES.AVATAR}
                />
              )}
              <span className={STYLES.USER_NAME}>
                {isPublic ? `Portafolio de ${ownerName}` : (userFullName || "Mi Panel")}
              </span>
            </div>

            {!isPublic && (
              <div className={STYLES.TABS_CONTAINER}>
                {NAV_TABS.map((tab) => (
                  <button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    className={`${STYLES.TAB_BUTTON} ${
                      location.pathname === tab.path ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={STYLES.ACTIONS_CONTAINER}>
            {!isPublic && userInfo?.username && (
              <button
                onClick={() => setIsShareModalOpen(true)}
                className={STYLES.COPY_BUTTON}
              >
                <Copy size={16} />
                <span>Generar Enlace</span>
              </button>
            )}

            {!isPublic && token ? (
              <button onClick={handleLogout} className={STYLES.LOGOUT_BUTTON}>
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            ) : !token ? (
              <button onClick={() => navigate("/login")} className={STYLES.LOGIN_BUTTON}>
                Iniciar Sesión
              </button>
            ) : null}
          </div>
        </div>
      </nav>
      {isShareModalOpen && userInfo?.username && (
        <div className={STYLES.OVERLAY} onClick={() => setIsShareModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <PublicProfileLink 
              username={userInfo.username} 
              onClose={() => setIsShareModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;