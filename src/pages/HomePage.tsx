import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { useUserSearch } from "../hooks/useHomepage";
import Button from "../components/Button";

const styles = {
    wrapper: "min-h-dvh bg-[#031B1D] flex flex-col items-center justify-center p-4 sm:p-6",
    heroCard: "w-full max-w-[800px] rounded-2xl  p-6 sm:p-10 flex flex-col items-center gap-8 relative overflow-hidden",
    brandWrapper: "flex items-center gap-2 text-[#90DDF0] font-inter text-xs uppercase tracking-widest font-bold bg-black/20 px-3 py-1.5 rounded-full border border-white/5",
    title: "text-3xl sm:text-5xl font-extrabold font-inter text-white text-center leading-tight max-w-xl",
    subtitle: "text-white/60 font-nunito text-sm sm:text-base text-center -mt-4 max-w-md",
    buttonGroup: "flex items-center justify-center gap-4 w-full",
    primaryBtn: "flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#90DDF0] text-[#07393C] font-nunito font-bold text-sm sm:text-base hover:bg-[#90DDF0]/90 transition-all shadow-lg shadow-[#90DDF0]/10 flex items-center justify-center gap-2 group",
    secondaryBtn: "flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-white/20 text-white font-nunito font-bold text-sm sm:text-base hover:border-[#90DDF0] hover:text-[#90DDF0] transition-all bg-black/10 flex items-center justify-center gap-2",
    searchSection: "w-full max-w-lg flex flex-col gap-2 relative mt-4",
    searchBarWrapper: "flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-black/40 focus-within:border-[#90DDF0] transition-all shadow-inner",
    searchIcon: "text-[#90DDF0] shrink-0",
    searchInput: "bg-transparent outline-none text-white font-nunito text-sm sm:text-base placeholder:text-white/30 w-full",
    resultsDropdown: "absolute top-full left-0 w-full bg-[#07393C] border border-[#2C666E] rounded-xl mt-2 overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-white/5",
    resultRow: "w-full flex items-center justify-between p-3 hover:bg-black/20 text-left transition-colors group",
    avatarWrapper: "w-9 h-9 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-[#90DDF0] font-bold font-inter text-sm shrink-0 overflow-hidden",
    avatarImg: "w-full h-full object-cover",
    userInfo: "flex flex-col ml-3 flex-1 overflow-hidden",
    userName: "text-white font-nunito text-sm font-semibold truncate",
    userHandle: "text-white/40 font-nunito text-xs truncate",
    arrowIcon: "text-white/20 group-hover:text-[#90DDF0] group-hover:translate-x-1 transition-all shrink-0 ml-2",
    statusMessage: "text-white/40 font-nunito text-xs text-center py-4 italic",
};

const HomePage = () => {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const { query, setQuery, filteredUsers, isFetching } = useUserSearch();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUserSelect = (username: string) => {
        setShowDropdown(false);
        setQuery("");
        navigate(`/ver/${username}`);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.heroCard}>

                <div className={styles.brandWrapper}>
                    <span>SixSeven Portafolios profesionales</span>
                </div>

                <div className="flex flex-col gap-4 items-center">
                    <h1 className={styles.title}>
                        Busca y Verifica Perfiles Profesionales
                    </h1>
                    <p className={styles.subtitle}>
                        Encuentra portafolios, profesionales del area y verifica su autenticidad con nuestra plataforma de confianza.
                    </p>
                </div>

                <div className={styles.searchSection} ref={dropdownRef}>
                    <div className={styles.searchBarWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Buscar por nombre o nombre de usuario..."
                            className={styles.searchInput}
                        />
                    </div>

                    {/* Dropdown de resultados de búsqueda */}
                    {showDropdown && query.trim() && (
                        <div className={styles.resultsDropdown}>
                            {isFetching ? (
                                <p className={styles.statusMessage}>Buscando usuarios...</p>
                            ) : filteredUsers.length === 0 ? (
                                <p className={styles.statusMessage}>No se encontraron perfiles coincidentes</p>
                            ) : (
                                filteredUsers.map((user) => {
                                    const fullName = `${user.names} ${user.first_surname}`;
                                    const initial = user.names ? user.names.charAt(0).toUpperCase() : "?";

                                    return (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => handleUserSelect(user.username)}
                                            className={styles.resultRow}
                                        >
                                            <div className="flex items-center overflow-hidden flex-1">
                                                <div className={styles.avatarWrapper}>
                                                    {user.profile_picture_url ? (
                                                        <img
                                                            src={user.profile_picture_url}
                                                            alt={fullName}
                                                            className={styles.avatarImg}
                                                        />
                                                    ) : (
                                                        <span>{initial}</span>
                                                    )}
                                                </div>
                                                <div className={styles.userInfo}>
                                                    <span className={styles.userName}>{fullName}</span>
                                                    <span className={styles.userHandle}>@{user.username}</span>
                                                </div>
                                            </div>
                                            <ArrowRight size={16} className={styles.arrowIcon} />
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                <div className="w-full max-w-xs h-[1px] bg-white/5 my-2" />

                <div className={styles.buttonGroup}>
                    <Button
                        onClick={() => navigate("/login")}
                        variant="primary"
                    >
                        Iniciar Sesion
                    </Button>
                    <Button
                        onClick={() => navigate("/register")}
                        variant="secondary"
                    >
                        <span>Registrarse</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
