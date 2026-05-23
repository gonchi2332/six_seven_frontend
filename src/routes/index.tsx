import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import VerificationPage from "../pages/VerificationPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import Dashboard from "../pages/Dashboard";
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
import WorkExperiencieConfigPage from "../pages/WorkExperienceConfigPage";
import HardSkillsConfigPage from "../pages/HardSkillsConfigPage"
import SoftSkillsConfigPage from "../pages/SoftSkillsConfigPage";
import PersonalProjectsConfigPage from "../pages/PersonalProjectsConfigPage";
import EducationConfigPage from "../pages/EducationConfigPage";
import WorkExperienceListConfig from "../features/WorkExperience/WorkExperienceListConfig";
import CertificatesConfigPage from "../pages/CertificatesConfigPage";
import PersonalInfoConfigPage from "../pages/PersonalInfoConfigPage";

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
                    <Route path="ver/:username/experiencia-laboral" element={<WorkExperiencieConfigPage />} />
                    <Route path="ver/:username/certificados" />

                    <Route path="configurar/habilidades-tecnicas" element={<HardSkillsConfigPage />} />
                    <Route path="configurar/habilidades-blandas" element={<SoftSkillsConfigPage />} />
                    <Route path="configurar/proyectos-personales" element={<PersonalProjectsConfigPage />} />
                    <Route path="configurar/educacion" element={<EducationConfigPage />} />
                    <Route path="configurar/experiencia-laboral" element={<WorkExperienceListConfig />} />
                    <Route path="configurar/certificados" element={<CertificatesConfigPage />} />
                    <Route path="configurar/informacion-personal" element={<PersonalInfoConfigPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
