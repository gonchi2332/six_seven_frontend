import { useState } from "react";
import { updatePersonalInfo } from "../services/personalInfoService";
import type { FormData as ProfileFormData } from "./useProfileFormRegex";
import { useNavigate } from "react-router-dom";

// ============================================
// TIPOS
// ============================================

/*
  Campos que se pueden eliminar/agregar:
  -secondSurname: Segundo apellido
  -city: Ciudad
  -email: Correo de contacto
  -phone: Teléfono
  -country: País
*/
export type DeletableField = 'secondSurname' | 'city' | 'email' | 'phone' | 'country';

/*
  Estructura de la respuesta de información personal:
  -username: Nombre de usuario
  -is_new: Indica si el usuario es nuevo
  -state: Estado del usuario (verified, unverified, etc.)
  -phone_number: Número de teléfono (opcional)
  -names: Nombre(s) del usuario
  -first_surname: Primer apellido
  -second_surname: Segundo apellido (opcional)
  -residence_city_name: Ciudad de residencia (opcional)
  -residence_country_name: País de residencia (opcional)
  -contact_email: Correo de contacto (opcional)
  -profile_picture: URL de la imagen de perfil (opcional)
*/
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

/*
  Características:
  -Hook personalizado que maneja el envío de información personal (edición y agregado de campos)
  -Maneja estado de carga (isSubmitting), errores (submitError) y éxito (submitSuccess)
  -handleSubmit: Envía el formulario completo de edición de información personal
  -addField: Agrega un campo específico manteniendo los demás datos existentes
  -Ambos usan FormData para enviar la información al servicio updatePersonalInfo
  -Después de un submit exitoso, navega a /info-personal

  @ Ejemplo edición completa:
  const { handleSubmit, isSubmitting, submitError } = usePersonalInfoSubmit();
  await handleSubmit(profileFormData);

  @ Ejemplo agregar campo:
  const { addField } = usePersonalInfoSubmit();
  await addField('city', 'La Paz', currentUserInfo);
*/
export const usePersonalInfoSubmit = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();

    
    const handleSubmit = async (profileData: ProfileFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const formData = new FormData();
            formData.append("is_new", "false");

            // Solo hacemos append si el valor tiene contenido real
            if (profileData.firstName?.trim()) formData.append("names", profileData.firstName);
            if (profileData.firstSurname?.trim()) formData.append("firstSurname", profileData.firstSurname);
            
            // Campos opcionales: solo se envían si existen y no están vacíos
            if (profileData.secondSurname?.trim()) formData.append("secondSurname", profileData.secondSurname);
            if (profileData.city?.trim()) formData.append("residenceCity", profileData.city);
            if (profileData.country?.trim()) formData.append("residenceCountry", profileData.country);
            if (profileData.email?.trim()) formData.append("contactEmail", profileData.email);
            if (profileData.phone?.trim()) formData.append("phone", profileData.phone);
            
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

    /*
      Características:
      -Agrega un campo específico (secondSurname, city, email, phone, country)
      -Mantiene los datos existentes del usuario (names, firstSurname)
      -Envía el campo actualizado junto con los campos existentes
      -Si el campo a agregar es uno específico, usa el nuevo valor; si no, mantiene el existente

      @ Parámetros:
      -field: Campo a agregar/actualizar
      -value: Nuevo valor del campo
      -currentUserInfo: Información actual del usuario (para mantener datos existentes)
    */
    const addField = async (field: DeletableField, value: string, currentUserInfo: PersonalInfoResponse | null) => {
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



    return { 
        handleSubmit, 
        addField, 
        isSubmitting, 
        submitError, 
        submitSuccess 
    };
};