import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import VerificationPage from "../pages/VerificationPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import Dashboard from "../pages/Dashboard";
import PublicDashboard from "../pages/PublicDashboard";
import CertificatesPage from "../pages/CertificatesPage";
import HardSkillsPage from "../pages/HardSkillsPage";
import SoftSkillsPage from "../pages/SoftSkillsPage";
import EducationPage from "../pages/EducationPage";

import PersonalProjectsPage from "../pages/PersonalProjectsPage";
import PersonalProjectsPagePublic from "../pages/PersonalProjectsPagePublic";
import Experience from "../pages/WorkExperiencePage";

import MainLayout from "../pages/MainLayout";
import PersonalInfoPublic from "../pages/PersonalInfoPublic";
import SoftSkillsPagePublic from "../pages/SoftSkillsPagePublic";
import HardSkillsPagePublic from "../pages/HardSkillsPagePublic";
import EducationPagePublic from "../pages/EducationPagePublic";
import WorkExperiencePagePublic from "../pages/WorkExperiencePagePublic";

const Router = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/changePassword" element={<PasswordResetPage />} />
                <Route element={<MainLayout />}>
                    <Route path="/info-personal" element={<Dashboard />} />
                    <Route path="/habilidades-tecnicas" element={<HardSkillsPage />} />
                    <Route path="/habilidades-blandas" element={<SoftSkillsPage />} />
                    <Route path="/proyectos" element={<PersonalProjectsPage />} />
                    <Route path="/educacion" element={<EducationPage />} />
                    <Route path="/experiencia-laboral" element={<Experience />} />
                    <Route path="/certificados" element={<CertificatesPage />} />
                    <Route path="ver/:username" element={<PersonalInfoPublic />} />
                    <Route path="ver/:username/habilidades-tecnicas" element={<HardSkillsPagePublic />} />
                    <Route path="ver/:username/habilidades-blandas" element={<SoftSkillsPagePublic />} />
                    <Route path="ver/:username/proyectos" element={<PersonalProjectsPagePublic />} />
                    <Route path="ver/:username/educacion" element={<EducationPagePublic />} />
                    <Route path="ver/:username/experiencia-laboral" element={<WorkExperiencePagePublic />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
