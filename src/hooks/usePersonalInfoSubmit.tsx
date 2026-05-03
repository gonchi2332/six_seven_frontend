import { useState } from "react";
import { updatePersonalInfo } from "../services/personalInfoService";
import type { FormData as ProfileFormData } from "./useProfileFormRegex";
import { useNavigate } from "react-router-dom";

// ============================================
// TIPOS
// ============================================

export interface PersonalInfoResponse {
    username: string;
    is_new: boolean;
    state: string;
    phone_number: string | null;
    names: string;
    first_surname: string;
    second_surname: string | null;
    residence_city_name: string | null;
    residence_country_name: string | null;
    contact_email: string | null;
    profile_picture: string | null;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export const usePersonalInfoSubmit = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();

    // ============================================
    // ACTUALIZAR TODO EL FORMULARIO (Editar)
    // ============================================

    const handleSubmit = async (profileData: ProfileFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const formData = new FormData();
            formData.append("is_new", "false");
            if (profileData.phone) formData.append("phone", profileData.phone);
            if (profileData.firstName) formData.append("names", profileData.firstName);
            if (profileData.firstSurname) formData.append("firstSurname", profileData.firstSurname);
            if (profileData.secondSurname) formData.append("secondSurname", profileData.secondSurname);
            if (profileData.city) formData.append("residenceCity", profileData.city);
            if (profileData.country) formData.append("residenceCountry", profileData.country);
            if (profileData.email) formData.append("contactEmail", profileData.email);
            if (profileData.profileImage) formData.append("profilePicture", profileData.profileImage);

            await updatePersonalInfo(formData);
            setSubmitSuccess(true);
            navigate("/dashboard");
        } catch (error: any) {
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ============================================
    // AGREGAR UN CAMPO ESPECÍFICO
    // ============================================

    const addField = async (field: string, value: string, currentUserInfo: PersonalInfoResponse | null) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const formData = new FormData();
            formData.append("is_new", "false");
            
            // Campos obligatorios
            formData.append("names", currentUserInfo?.names || '');
            formData.append("firstSurname", currentUserInfo?.first_surname || '');
            
            // Campos opcionales (actualizados o existentes)
            formData.append("secondSurname", field === "secondSurname" ? value : currentUserInfo?.second_surname || '');
            formData.append("residenceCity", field === "city" ? value : currentUserInfo?.residence_city_name || '');
            formData.append("contactEmail", field === "email" ? value : currentUserInfo?.contact_email || '');
            formData.append("phone", field === "phone" ? value : currentUserInfo?.phone_number || '');
            formData.append("residenceCountry", field === "country" ? value : currentUserInfo?.residence_country_name || '');

            await updatePersonalInfo(formData);
            setSubmitSuccess(true);
        } catch (error: any) {
            setSubmitError(error.message);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    // ============================================
    // ELIMINAR UN CAMPO ESPECÍFICO
    // ============================================

    const deleteField = async (field: string, currentUserInfo: PersonalInfoResponse | null) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const formData = new FormData();
            formData.append("is_new", "false");
            
            // Campos obligatorios
            formData.append("names", currentUserInfo?.names || '');
            formData.append("firstSurname", currentUserInfo?.first_surname || '');
            
            // Campos opcionales (enviar vacío para eliminar)
            formData.append("secondSurname", field === "secondSurname" ? '' : currentUserInfo?.second_surname || '');
            formData.append("residenceCity", field === "city" ? '' : currentUserInfo?.residence_city_name || '');
            formData.append("contactEmail", field === "email" ? '' : currentUserInfo?.contact_email || '');
            formData.append("phone", field === "phone" ? '' : currentUserInfo?.phone_number || '');
            formData.append("residenceCountry", field === "country" ? '' : currentUserInfo?.residence_country_name || '');

            await updatePersonalInfo(formData);
            setSubmitSuccess(true);
        } catch (error: any) {
            setSubmitError(error.message);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { 
        handleSubmit, 
        addField, 
        deleteField, 
        isSubmitting, 
        submitError, 
        submitSuccess 
    };
};