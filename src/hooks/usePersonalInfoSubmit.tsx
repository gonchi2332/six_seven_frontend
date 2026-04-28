import { useState } from "react";
import { updatePersonalInfo } from "../services/personalInfoService";
import type { FormData as ProfileFormData } from "./useProfileFormRegex";
import { useNavigate } from "react-router-dom";

export const usePersonalInfoSubmit = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();

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

    return { handleSubmit, isSubmitting, submitError, submitSuccess };
};
