import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { parseProfilePicture } from "../../services/decodeBase64";
import { useNavbarInfo } from "../../hooks/useNavbarInfo";
import { Copy, LogOut, Menu, X, ChevronDown, Home } from "lucide-react";
import PublicProfileLink from "../PublicProfileLink/PublicProfileLink";

const defAvatar = "/defAvatar.png";

const STYLES = {
    NAVBAR: "w-full bg-secondary px-4 sm:px-6 py-3 text-white font-inter border-b border-white/5 sticky top-0 z-50",
    CONTAINER: "flex items-center justify-between w-full mx-auto",
    LEFT_SECTION: "flex items-center gap-4 lg:gap-8 flex-1 min-w-0",
    USER_INFO: "flex items-center gap-3 lg:border-r lg:border-white/10 lg:pr-4 shrink-0",
    AVATAR: "w-9 h-9 object-cover rounded-full border border-white/20 shrink-0",
    USER_NAME: "font-bold text-base sm:text-lg truncate",
    TABS_CONTAINER: "hidden lg:flex items-center gap-1 flex-wrap",
    TAB_BUTTON: "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5",
    TAB_ACTIVE: "bg-accent text-secondary shadow-lg shadow-accent/20",
    TAB_INACTIVE: "text-white/60 hover:text-white hover:bg-white/5",
    ACTIONS_CONTAINER: "flex items-center gap-3 ml-4 shrink-0",
    HOME_BUTTON: "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 bg-[#2C666E]/40 border border-[#90DDF0]/30 text-[#90DDF0] hover:bg-[#2C666E]/60 whitespace-nowrap",
    COPY_BUTTON: "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 bg-white/10 hover:bg-white/20 text-white whitespace-nowrap",
    LOGOUT_BUTTON: "flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors text-sm font-bold whitespace-nowrap",
    MOBILE_TOGGLE: "lg:hidden p-2 text-white/80 hover:text-white transition-colors ml-2 shrink-0",
    MOBILE_MENU: "lg:hidden absolute top-full left-0 w-full bg-secondary border-b border-white/10 flex flex-col p-4 gap-4 animate-in slide-in-from-top duration-300",
    MOBILE_TAB: "w-full text-left px-4 py-3 rounded-xl text-sm font-medium",
    LOGIN_BUTTON: "bg-accent/10 text-accent px-4 py-2 rounded-xl hover:bg-accent hover:text-secondary transition-all text-sm font-bold",
    OVERLAY: "fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",
    dropdownWrapper: "relative inline-block",
    dropdownMenu: "absolute top-full left-0 mt-2 w-56 bg-secondary border border-white/10 rounded-xl p-1.5 shadow-xl flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]",
    dropdownItem: "w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all cursor-pointer",
    dropdownItemActive: "bg-accent/10 text-accent hover:bg-accent/15"
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

    const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
    const [isVisibilityDropdownOpen, setIsVisibilityDropdownOpen] = useState(false);

    const [isMobileSkillsOpen, setIsMobileSkillsOpen] = useState(false);
    const [isMobileVisibilityOpen, setIsMobileVisibilityOpen] = useState(false);

    const skillsRef = useRef<HTMLDivElement>(null);
    const visibilityRef = useRef<HTMLDivElement>(null);
    const activeUsername = urlUsername || ownerName;

    const pathTech = isPublic ? `/ver/${activeUsername}/habilidades-tecnicas` : "/habilidades-tecnicas";
    const pathSoft = isPublic ? `/ver/${activeUsername}/habilidades-blandas` : "/habilidades-blandas";

    const configPaths = {
        personalInfo: "/configurar/informacion-personal",
        experience: "/configurar/experiencia-laboral",
        skillsTech: "/configurar/habilidades-tecnicas",
        skillsSoft: "/configurar/habilidades-blandas",
        projects: "/configurar/proyectos-personales",
        education: "/configurar/educacion",
        certificates: "/configurar/certificados",
    };

    const mainTabs = [
        { name: "Perfil", path: isPublic ? `/ver/${activeUsername}` : "/info-personal" },
        { name: "Experiencia Laboral", path: isPublic ? `/ver/${activeUsername}/experiencia-laboral` : "/experiencia-laboral" },
        { name: "Proyectos Personales", path: isPublic ? `/ver/${activeUsername}/proyectos` : "/proyectos" },
        { name: "Educación", path: isPublic ? `/ver/${activeUsername}/educacion` : "/educacion" },
        { name: "Certificados", path: isPublic ? `/ver/${activeUsername}/certificados` : "/certificados" }
    ];

    const isSkillsTabActive = location.pathname === pathTech || location.pathname === pathSoft;
    const isVisibilityActive = Object.values(configPaths).includes(location.pathname);

    // 💡 Modificado: Mostrar botón si es vista pública y NO estamos ya en la raíz principal "/"
    const showHomeButton = isPublic && location.pathname !== "/";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (skillsRef.current && !skillsRef.current.contains(event.target as Node)) {
                setIsSkillsDropdownOpen(false);
            }
            if (visibilityRef.current && !visibilityRef.current.contains(event.target as Node)) {
                setIsVisibilityDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsSkillsDropdownOpen(false);
        setIsVisibilityDropdownOpen(false);
        setIsMobileSkillsOpen(false);
        setIsMobileVisibilityOpen(false);
    }, [location.pathname]);

    const userFullName = [userInfo?.names, userInfo?.first_surname].filter(Boolean).join(" ");

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
                                {isPublic ? `Portafolio de ${userFullName || activeUsername}` : (userFullName || "Mi Panel")}
                            </span>
                        </div>

                        <div className={STYLES.TABS_CONTAINER}>
                            <button
                                onClick={() => navigate(mainTabs[0]!.path)}
                                className={`${STYLES.TAB_BUTTON} ${location.pathname === mainTabs[0]!.path ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                            >
                                {mainTabs[0]!.name}
                            </button>

                            <div className={STYLES.dropdownWrapper} ref={skillsRef}>
                                <button
                                    onClick={() => { setIsSkillsDropdownOpen(!isSkillsDropdownOpen); setIsVisibilityDropdownOpen(false); }}
                                    className={`${STYLES.TAB_BUTTON} ${isSkillsTabActive ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                >
                                    <span>Habilidades</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${isSkillsDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isSkillsDropdownOpen && (
                                    <div className={STYLES.dropdownMenu}>
                                        <button
                                            onClick={() => navigate(pathTech)}
                                            className={`${STYLES.dropdownItem} ${location.pathname === pathTech ? STYLES.dropdownItemActive : ''}`}
                                        >
                                            Habilidades Técnicas
                                        </button>
                                        <button
                                            onClick={() => navigate(pathSoft)}
                                            className={`${STYLES.dropdownItem} ${location.pathname === pathSoft ? STYLES.dropdownItemActive : ''}`}
                                        >
                                            Habilidades Blandas
                                        </button>
                                    </div>
                                )}
                            </div>

                            {mainTabs.slice(1).map((tab) => (
                                <button
                                    key={tab.path}
                                    onClick={() => navigate(tab.path)}
                                    className={`${STYLES.TAB_BUTTON} ${location.pathname === tab.path ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                >
                                    {tab.name}
                                </button>
                            ))}

                            {!isPublic && (
                                <div className={STYLES.dropdownWrapper} ref={visibilityRef}>
                                    <button
                                        onClick={() => { setIsVisibilityDropdownOpen(!isVisibilityDropdownOpen); setIsSkillsDropdownOpen(false); }}
                                        className={`${STYLES.TAB_BUTTON} ${isVisibilityActive ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                    >
                                        <span>Visibilidad</span>
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${isVisibilityDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isVisibilityDropdownOpen && (
                                        <div className={STYLES.dropdownMenu}>
                                            <button
                                                onClick={() => navigate(configPaths.personalInfo)}
                                                className={`${STYLES.dropdownItem} ${location.pathname === configPaths.personalInfo ? STYLES.dropdownItemActive : ''}`}
                                            >
                                                Visibilidad Inf. Personal
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.experience)}
                                                className={`${STYLES.dropdownItem} ${location.pathname === configPaths.experience ? STYLES.dropdownItemActive : ''}`}
                                            >
                                                Visibilidad Exp. Laboral
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.skillsTech)}
                                                className={`${STYLES.dropdownItem} ${location.pathname === configPaths.skillsTech ? STYLES.dropdownItemActive : ''}`}
                                            >
                                                Visibilidad Hab. Técnicas
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.skillsSoft)}
                                                className={`${STYLES.dropdownItem} ${location.pathname === configPaths.skillsSoft ? STYLES.dropdownItemActive : ''}`}
                                            >
                                                Visibilidad Hab. Blandas
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.projects)}
                                                className={`${STYLES.dropdownItem} ${location.pathname === configPaths.projects ? STYLES.dropdownItemActive : ''}`}
                                            >
                                                Visibilidad Proyectos
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.education)}
                                                className={`${STYLES.dropdownItem} ${location.pathname === configPaths.education ? STYLES.dropdownItemActive : ''}`}
                                            >
                                                Visibilidad Educación
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.certificates)}
                                                className={`${STYLES.dropdownItem} ${location.pathname === configPaths.certificates ? STYLES.dropdownItemActive : ''}`}
                                            >
                                                Visibilidad Certificados
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={STYLES.ACTIONS_CONTAINER}>
                        {/* 💡 Botón de Volver al Inicio exclusivo para Vistas Públicas */}
                        {showHomeButton && (
                            <button onClick={() => navigate("/")} className={STYLES.HOME_BUTTON}>
                                <Home size={16} />
                                <span className="hidden sm:inline">Página Principal</span>
                                <span className="sm:hidden">Inicio</span>
                            </button>
                        )}

                        {!isPublic && userInfo?.username && (
                            <button onClick={() => setIsShareModalOpen(true)} className={STYLES.COPY_BUTTON}>
                                <Copy size={16} />
                                <span className="hidden sm:inline">Generar Enlace</span>
                                <span className="sm:hidden">Enlace</span>
                            </button>
                        )}

                        {!isPublic && token ? (
                            <button onClick={handleLogout} className={STYLES.LOGOUT_BUTTON}>
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        ) : !token ? (
                            <button onClick={() => navigate("/login")} className={STYLES.LOGIN_BUTTON}>
                                Iniciar Sesión
                            </button>
                        ) : null}
                    </div>

                    <button className={STYLES.MOBILE_TOGGLE} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className={STYLES.MOBILE_MENU}>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => navigate(mainTabs[0]!.path)}
                                className={`${STYLES.MOBILE_TAB} ${location.pathname === mainTabs[0]!.path ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                            >
                                {mainTabs[0]!.name}
                            </button>

                            <div>
                                <button
                                    onClick={() => { setIsMobileSkillsOpen(!isMobileSkillsOpen); setIsMobileVisibilityOpen(false); }}
                                    className={`${STYLES.MOBILE_TAB} ${isSkillsTabActive ? 'bg-white/5 text-white' : STYLES.TAB_INACTIVE} flex items-center justify-between`}
                                >
                                    <span>Habilidades</span>
                                    <ChevronDown size={16} className={`transition-transform ${isMobileSkillsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isMobileSkillsOpen && (
                                    <div className="pl-4 flex flex-col gap-1 mt-1 bg-black/10 rounded-xl p-1.5 border border-white/5">
                                        <button
                                            onClick={() => navigate(pathTech)}
                                            className={`${STYLES.MOBILE_TAB} ${location.pathname === pathTech ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                        >
                                            Habilidades Técnicas
                                        </button>
                                        <button
                                            onClick={() => navigate(pathSoft)}
                                            className={`${STYLES.MOBILE_TAB} ${location.pathname === pathSoft ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                        >
                                            Habilidades Blandas
                                        </button>
                                    </div>
                                )}
                            </div>

                            {mainTabs.slice(1).map((tab) => (
                                <button
                                    key={tab.path}
                                    onClick={() => navigate(tab.path)}
                                    className={`${STYLES.MOBILE_TAB} ${location.pathname === tab.path ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                >
                                    {tab.name}
                                </button>
                            ))}

                            {!isPublic && (
                                <div>
                                    <button
                                        onClick={() => { setIsMobileVisibilityOpen(!isMobileVisibilityOpen); setIsMobileSkillsOpen(false); }}
                                        className={`${STYLES.MOBILE_TAB} ${isVisibilityActive ? 'bg-white/5 text-white' : STYLES.TAB_INACTIVE} flex items-center justify-between`}
                                    >
                                        <span>Visibilidad</span>
                                        <ChevronDown size={16} className={`transition-transform ${isMobileVisibilityOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isMobileVisibilityOpen && (
                                        <div className="pl-4 flex flex-col gap-1 mt-1 bg-black/10 rounded-xl p-1.5 border border-white/5">
                                            <button
                                                onClick={() => navigate(configPaths.personalInfo)}
                                                className={`${STYLES.MOBILE_TAB} ${location.pathname === configPaths.personalInfo ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                            >
                                                Visibilidad Info. Personal
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.experience)}
                                                className={`${STYLES.MOBILE_TAB} ${location.pathname === configPaths.experience ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                            >
                                                Visibilidad Exp. Laboral
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.skillsTech)}
                                                className={`${STYLES.MOBILE_TAB} ${location.pathname === configPaths.skillsTech ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                            >
                                                Visibilidad Hab. Técnicas
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.skillsSoft)}
                                                className={`${STYLES.MOBILE_TAB} ${location.pathname === configPaths.skillsSoft ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                            >
                                                Visibilidad Hab. Blandas
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.projects)}
                                                className={`${STYLES.MOBILE_TAB} ${location.pathname === configPaths.projects ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                            >
                                                Visibilidad Proyectos
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.education)}
                                                className={`${STYLES.MOBILE_TAB} ${location.pathname === configPaths.education ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                            >
                                                Visibilidad Educación
                                            </button>
                                            <button
                                                onClick={() => navigate(configPaths.certificates)}
                                                className={`${STYLES.MOBILE_TAB} ${location.pathname === configPaths.certificates ? STYLES.TAB_ACTIVE : STYLES.TAB_INACTIVE}`}
                                            >
                                                Visibilidad Certificados
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Acciones móviles */}
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                            {showHomeButton && (
                                <button
                                    onClick={() => { navigate("/"); setIsMenuOpen(false); }}
                                    className={STYLES.HOME_BUTTON}
                                >
                                    <Home size={16} />
                                    <span>Volver al Inicio</span>
                                </button>
                            )}
                            {!isPublic && userInfo?.username && (
                                <button
                                    onClick={() => { setIsShareModalOpen(true); setIsMenuOpen(false); }}
                                    className={STYLES.COPY_BUTTON}
                                >
                                    <Copy size={16} />
                                    <span>Generar Enlace</span>
                                </button>
                            )}
                            {token && (
                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-red-400 font-bold text-sm">
                                    <LogOut size={18} />
                                    <span>Cerrar Sesión</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

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