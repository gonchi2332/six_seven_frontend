import { useNavigate } from "react-router-dom";
import { parseProfilePicture } from "../../services/decodeBase64";
import { useNavbarInfo } from "../../hooks/useNavbarInfo";

const Navbar = () => {
  const { userInfo } = useNavbarInfo();
  const navigate = useNavigate();

  const NAVBAR = "w-full bg-secondary p-4 text-white font-inter font-bold text-xl";

  const fullName = [
    userInfo?.names,
    userInfo?.paternal_surname,
    userInfo?.maternal_surname,
  ]
    .filter(Boolean)
    .join(" ");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className={NAVBAR}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {userInfo?.profile_picture && (
            <img
              src={parseProfilePicture(userInfo.profile_picture) || ""}
              alt="Foto de perfil"
              className="w-10 h-10 object-cover rounded-full"
            />
          )}
          <span>{fullName || "Usuario"}</span>
        </div>

        <button onClick={handleLogout} className="cursor-pointer hover:underline">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;