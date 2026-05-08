import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

// esta es la pagina base para evitar que el navbar se recargue todo el timepo ojito, es como un lienzo

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-main flex flex-col">
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;