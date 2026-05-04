import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import VerificationPage from "../pages/VerificationPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import Dashboard from "../pages/Dashboard";
import AdditionalInfoPage from "../pages/AdditionalInfoPage";
import PublicDashboard from "../pages/PublicDashboard";
import HardSkillsPage from "../pages/HardSkillsPage";
import SoftSkillsPage from "../pages/SoftSkillsPage";
import EducationPage from "../pages/EducationPage";



const Router = () => {
    //TODO: integrar dashboard luego de login(usuario verificado) o verificacion de cuenta @Arrick
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/changePassword" element={<PasswordResetPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/additional-info" element={<AdditionalInfoPage />} />
                <Route path="/ver/:username" element={<PublicDashboard />} />
                <Route path="/skills/hard" element={<HardSkillsPage />} />
                <Route path="/skills/soft" element={<SoftSkillsPage />} />
                <Route path="/education" element={<EducationPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
