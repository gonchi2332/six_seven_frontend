import { Outlet, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  const location = useLocation();
  const { username } = useParams();

  // Detectamos si la ruta actual es pública (contiene "/ver/")
  const isPublicView = location.pathname.includes("/ver/");

  return (
    <div className="min-h-screen bg-main flex flex-col">
      {/* Pasamos las props necesarias al Navbar */}
      <Navbar 
        isPublic={isPublicView} 
        ownerName={username} 
      />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;