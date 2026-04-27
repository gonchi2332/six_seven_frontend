import { useState } from "react"; // Para el feedback visual de "Copiado"
import { useNavigate } from "react-router-dom";
import { parseProfilePicture } from "../../services/decodeBase64";
import { useNavbarInfo } from "../../hooks/useNavbarInfo";
import { Copy, Check } from "lucide-react"; // Opcional: iconos para mejorar la UI

const defAvatar = "/defAvatar.png";

interface NavbarProps {
  isPublic?: boolean;
  ownerName?: string;
}

const Navbar = ({ isPublic = false, ownerName }: NavbarProps) => {
  const { userInfo } = useNavbarInfo();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [copied, setCopied] = useState(false);

  const NAVBAR = "w-full bg-secondary p-4 text-white font-inter font-bold text-xl";

  const userFullName = [userInfo?.names, userInfo?.first_surname]
    .filter(Boolean)
    .join(" ");
  const handleCopyLink = () => {
    if (!userInfo?.username) return;

    //es la ruta raiz del proyecto con el ruteo del index 
    const publicUrl = `${window.location.origin}/ver/${userInfo.username}`;
    
    navigator.clipboard.writeText(publicUrl);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className={NAVBAR}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {!isPublic && (
            <img
              src={(userInfo?.profile_picture ? parseProfilePicture(userInfo.profile_picture) : defAvatar) ?? defAvatar}
              alt="Foto de perfil"
              className="w-10 h-10 object-cover rounded-full border border-white/10"
            />
          )}
          
          <span className="truncate">
            {isPublic 
              ? `Portafolio de ${ownerName || "Usuario"}` 
              : (userFullName || "Mi Panel")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {!isPublic && userInfo?.username && (
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                ${copied ? "bg-green-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
            >
              {copied ? (
                <><Check size={16} /> ¡Copiado!</>
              ) : (
                <><Copy size={16} /> Copiar Link Público</>
              )}
            </button>
          )}

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