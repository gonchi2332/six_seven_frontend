import { useState } from "react";
import { updatePersonalInfo } from "../services/personalInfoService";
import type { FormData as ProfileFormData } from "./useProfileFormRegex";
import { useNavigate } from "react-router-dom";

// ============================================
// TIPOS
// ============================================

// Campos que se pueden eliminar/agregar
export type DeletableField = 'secondSurname' | 'city' | 'email' | 'phone' | 'country';

// Estructura de la respuesta de información personal
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

// Hook para manejar envío de información personal (edición completa y agregar campos)
export const usePersonalInfoSubmit = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();

    // Enviar formulario completo de edición
    const handleSubmit = async (profileData: ProfileFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const formData = new FormData();
            formData.append("is_new", "false");

            // Campos obligatorios
            if (profileData.firstName?.trim()) formData.append("names", profileData.firstName);
            if (profileData.firstSurname?.trim()) formData.append("firstSurname", profileData.firstSurname);
            
            // Campos opcionales (solo si tienen valor)
            if (profileData.secondSurname?.trim()) formData.append("secondSurname", profileData.secondSurname);
            if (profileData.city?.trim()) formData.append("residenceCity", profileData.city);
            if (profileData.country?.trim()) formData.append("residenceCountry", profileData.country);
            if (profileData.email?.trim()) formData.append("contactEmail", profileData.email);
            if (profileData.phone?.trim()) formData.append("phone", profileData.phone);
            
            // Imagen de perfil
            if (profileData.profileImage) {
                formData.append("profilePicture", profileData.profileImage);
            }

            await updatePersonalInfo(formData);
            setSubmitSuccess(true);
            navigate("/info-personal");
        } catch (error: any) {
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ============================================
    // AGREGAR UN CAMPO ESPECÍFICO
    // ============================================

    // Agregar un campo específico manteniendo los demás datos
    const addField = async (field: DeletableField, value: string, currentUserInfo: PersonalInfoResponse | null) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const formData = new FormData();
            formData.append("is_new", "false");
            
            // Campos obligatorios (se mantienen)
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
    

    return { 
        handleSubmit, 
        addField, 
        isSubmitting, 
        submitError, 
        submitSuccess 
    };
};