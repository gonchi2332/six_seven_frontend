import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import VerificationPage from "../pages/VerificationPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import PublicDashboard from "../pages/PublicDashboard";
import HardSkillsPage from "../pages/HardSkillsPage";
import SoftSkillsPage from "../pages/SoftSkillsPage";
import EducationPage from "../pages/EducationPage";


import MainLayout from "../pages/MainLayout";

const Router = () => {

    return (
        <BrowserRouter>
            <Routes>
                {/* no comparten navbar */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/ver/:username" element={<PublicDashboard />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/changePassword" element={<PasswordResetPage />} />
                {/*navbar compartido*/}
                <Route element={<MainLayout />}>
                    <Route path="/info-personal" element={<Dashboard />} />
                    <Route path="/habilidades-tecnicas" element={<HardSkillsPage />} />
                    <Route path="/habilidades-blandas" element={<SoftSkillsPage />} />
                    <Route path="/proyectos" element={<Projects />} />
                    <Route path="/educacion" element={<EducationPage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
