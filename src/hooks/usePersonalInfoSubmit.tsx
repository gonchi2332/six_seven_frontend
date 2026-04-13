import { useState } from "react";
import { updatePersonalInfo } from "../services/personalInfoService";
import type { FormData as ProfileFormData } from "./useProfileFormRegex";

export const usePersonalInfoSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (profileData: ProfileFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();

      if (profileData.phone)           formData.append("phone", profileData.phone);
      if (profileData.firstName)       formData.append("names", profileData.firstName);
      if (profileData.lastNamePaternal) formData.append("paternalSurname", profileData.lastNamePaternal);
      if (profileData.lastNameMaternal) formData.append("maternalSurname", profileData.lastNameMaternal);
      if (profileData.address)         formData.append("address", profileData.address);
      if (profileData.country)         formData.append("residenceCountry", profileData.country);
      if (profileData.email)           formData.append("contactEmail", profileData.email);
      if (profileData.profileImage)    formData.append("profilePicture", profileData.profileImage);

      await updatePersonalInfo(formData);
      setSubmitSuccess(true);
    } catch (error: any) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, submitError, submitSuccess };
};