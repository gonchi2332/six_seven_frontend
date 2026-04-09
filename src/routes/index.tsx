import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/registerPage";
import VerificationPage from "../pages/VerificationPage";
import EditPersonalInfocard from "../features/EditPersonalInfo/components/EditPersonalInfoCard";



const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/personalInfo" element={<EditPersonalInfocard />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
