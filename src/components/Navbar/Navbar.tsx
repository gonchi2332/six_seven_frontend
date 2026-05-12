import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { parseProfilePicture } from "../../services/decodeBase64";
import { useNavbarInfo } from "../../hooks/useNavbarInfo";
import { Copy, LogOut, Menu, X } from "lucide-react";
import PublicProfileLink from "../PublicProfileLink/PublicProfileLink";

const defAvatar = "/defAvatar.png";

// Rutas fijas para el modo edición (Privado)
const PRIVATE_TABS = [
  { name: "Perfil", path: "/info-personal" },
  { name: "Habilidades Técnicas", path: "/habilidades-tecnicas" },
  { name: "Habilidades Blandas", path: "/habilidades-blandas" },
  { name: "Experiencia Laboral", path: "/experiencia-laboral" },
  { name: "Proyectos Personales", path: "/proyectos" },
  { name: "Educación", path: "/educacion" },
];

const STYLES = {
  NAVBAR: "w-full bg-secondary px-4 sm:px-6 py-3 text-white font-inter border-b border-white/5 sticky top-0 z-50",
  CONTAINER: "flex items-center justify-between w-full max-w-7xl mx-auto",
  LEFT_SECTION: "flex items-center gap-4 lg:gap-8",
  USER_INFO: "flex items-center gap-3 lg:border-r lg:border-white/10 lg:pr-4", 
  AVATAR: "w-9 h-9 object-cover rounded-full border border-white/20 shrink-0",
  USER_NAME: "font-bold text-base sm:text-lg whitespace-nowrap shrink-0",
  TABS_CONTAINER: "hidden lg:flex items-center gap-1",
  TAB_BUTTON: "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap",
  TAB_ACTIVE: "bg-accent text-secondary shadow-lg shadow-accent/20",
  TAB_INACTIVE: "text-white/60 hover:text-white hover:bg-white/5",
  ACTIONS_CONTAINER: "hidden lg:flex items-center gap-4 ml-auto",
  COPY_BUTTON: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 bg-white/10 hover:bg-white/20 text-white shrink-0",
  LOGOUT_BUTTON: "flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors text-sm font-bold ml-2 shrink-0",
  MOBILE_TOGGLE: "lg:hidden p-2 text-white/80 hover:text-white transition-colors ml-4",
  MOBILE_MENU: "lg:hidden absolute top-full left-0 w-full bg-secondary border-b border-white/10 flex flex-col p-4 gap-4 animate-in slide-in-from-top duration-300",
  MOBILE_TAB: "w-full text-left px-4 py-3 rounded-xl text-sm font-medium",
  LOGIN_BUTTON: "bg-accent/10 text-accent px-4 py-2 rounded-xl hover:bg-accent hover:text-secondary transition-all text-sm font-bold",
  OVERLAY: "fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",
};

interface NavbarProps {
  isPublic?: boolean;
  ownerName?: string;
}

const Navbar = ({ isPublic = false, ownerName }: NavbarProps) => {
  const { userInfo } = useNavbarInfo();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { username: urlUsername } = useParams(); 
  const token = localStorage.getItem("token");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- LÓGICA DE RUTAS ---
  // Obtenemos el username ya sea de los params o del prop ownerName (desde MainLayout)
  const activeUsername = urlUsername || ownerName;

  const publicTabs = [
    { name: "Perfil", path: `/ver/${activeUsername}` },
    { name: "Habilidades Técnicas", path: `/ver/${activeUsername}/habilidades-tecnicas` },
    { name: "Habilidades Blandas", path: `/ver/${activeUsername}/habilidades-blandas` },
    { name: "Experiencia Laboral", path: `/ver/${activeUsername}/experiencia-laboral` },
    { name: "Proyectos Personales", path: `/ver/${activeUsername}/proyectos` },
    { name: "Educación", path: `/ver/${activeUsername}/educacion` },
  ];

  // Si isPublic es true, usamos las rutas con /ver/...
  const currentTabs = isPublic ? publicTabs : PRIVATE_TABS;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
              {/* Solo mostrar avatar si es sesión privada */}
              {!isPublic && (
                <img
                  src={(userInfo?.profile_picture ? parseProfilePicture(userInfo.profile_picture) : defAvatar) ?? defAvatar}
                  alt="Foto de perfil"
                  className={STYLES.AVATAR}
                />
              )}
              <span className={STYLES.USER_NAME}>
                {isPublic ? `Portafolio de ${ownerName || activeUsername}` : (userFullName || "Mi Panel")}
              </span>
            </div>

            {/* Navegación Desktop */}
            <div className={STYLES.TABS_CONTAINER}>
              {currentTabs.map((tab) => (
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
          </div>

          {/* Acciones Desktop */}
          <div className={STYLES.ACTIONS_CONTAINER}>
            {!isPublic && userInfo?.username && (
              <button onClick={() => setIsShareModalOpen(true)} className={STYLES.COPY_BUTTON}>
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

          {/* Botón menú móvil */}
          <button className={STYLES.MOBILE_TOGGLE} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú Móvil Dropdown */}
        {isMenuOpen && (
          <div className={STYLES.MOBILE_MENU}>
            <div className="flex flex-col gap-1">
              {currentTabs.map((tab) => (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`${STYLES.MOBILE_TAB} ${
                    location.pathname === tab.path ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            
            {!isPublic && (
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                {userInfo?.username && (
                  <button 
                    onClick={() => { setIsShareModalOpen(true); setIsMenuOpen(false); }} 
                    className={STYLES.COPY_BUTTON}
                  >
                    <Copy size={16} />
                    <span>Generar Enlace Público</span>
                  </button>
                )}
                {token && (
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-red-400 font-bold text-sm">
                    <LogOut size={18} />
                    <span>Cerrar Sesión</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Modal de Compartir */}
      {isShareModalOpen && userInfo?.username && (
        <div className={STYLES.OVERLAY} onClick={() => setIsShareModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
            <PublicProfileLink username={userInfo.username} onClose={() => setIsShareModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;