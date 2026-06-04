import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Auth/LoginPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/Auth/RegisterPage";
import VerificationPage from "../pages/Auth/VerificationPage";
import PasswordResetPage from "../pages/Auth/PasswordResetPage";
import Dashboard from "../pages/Dashboard";
import CertificatesPage from "../pages/Certificates/CertificatesPage";
import HardSkillsPage from "../pages/HardSkills/HardSkillsPage";
import SoftSkillsPage from "../pages/SoftSkills/SoftSkillsPage";
import EducationPage from "../pages/Education/EducationPage";

import PersonalProjectsPage from "../pages/PersonalProjects/PersonalProjectsPage";
import PersonalProjectsPagePublic from "../pages/PersonalProjects/PersonalProjectsPagePublic";
import Experience from "../pages/WorkExperience/WorkExperiencePage";

import MainLayout from "../pages/MainLayout";
import PersonalInfoPublic from "../pages/PersonalInfo/PersonalInfoPublic";
import SoftSkillsPagePublic from "../pages/SoftSkills/SoftSkillsPagePublic";
import HardSkillsPagePublic from "../pages/HardSkills/HardSkillsPagePublic";
import EducationPagePublic from "../pages/Education/EducationPagePublic";
import HardSkillsConfigPage from "../pages/HardSkills/HardSkillsConfigPage"
import SoftSkillsConfigPage from "../pages/SoftSkills/SoftSkillsConfigPage";
import PersonalProjectsConfigPage from "../pages/PersonalProjects/PersonalProjectsConfigPage";
import EducationConfigPage from "../pages/Education/EducationConfigPage";
import WorkExperienceListConfig from "../features/WorkExperience/components/WorkExperienceListConfig";
import CertificatesConfigPage from "../pages/Certificates/CertificatesConfigPage";
import CertificatesPublicPage from "../pages/Certificates/CertificatesPagePublic";
import PersonalInfoConfigPage from "../pages/PersonalInfo/PersonalInfoConfigPage";
import WorkExperiencePagePublic from "../pages/WorkExperience/WorkExperiencePagePublic";
import CVPrintPage from "../features/PrintablePortfolio/components/CvPrintPage";
import { ReportsPage } from "../features/Reports";


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
                    <Route path="/reportes" element={<ReportsPage />} />

                    <Route path="ver/:username" element={<PersonalInfoPublic />} />
                    <Route path="ver/:username/habilidades-tecnicas" element={<HardSkillsPagePublic />} />
                    <Route path="ver/:username/habilidades-blandas" element={<SoftSkillsPagePublic />} />
                    <Route path="ver/:username/proyectos" element={<PersonalProjectsPagePublic />} />
                    <Route path="ver/:username/educacion" element={<EducationPagePublic />} />
                    <Route path="ver/:username/experiencia-laboral" element={<WorkExperiencePagePublic />} />
                    <Route path="ver/:username/certificados" element={<CertificatesPublicPage />} />

                    <Route path="/print" element={<CVPrintPage />} />
                    <Route path="configurar/habilidades-tecnicas" element={<HardSkillsConfigPage />} />
                    <Route path="configurar/habilidades-blandas" element={<SoftSkillsConfigPage />} />
                    <Route path="configurar/proyectos-personales" element={<PersonalProjectsConfigPage />} />
                    <Route path="configurar/educacion" element={<EducationConfigPage />} />
                    <Route path="configurar/experiencia-laboral" element={<WorkExperienceListConfig />} />
                    <Route path="configurar/certificados" element={<CertificatesConfigPage />} />
                    <Route path="configurar/informacion-personal" element={<PersonalInfoConfigPage />} />
                </Route>
            </Routes>
        </BrowserRouter >
    );
};

export default Router;
