import { useState } from "react";
import { registerPersonalInfo } from "../services/personalInfoService";
import type { FormData } from "../hooks/useProfileFormRegex"; 

export const usePersonalInfoSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData, residenceCountryId: number) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await registerPersonalInfo({
        phone: Number(formData.phone),
        maternalSurname: formData.lastNameMaternal,
        address: formData.address,
        residenceCountryId,
        contactEmail: formData.email,
      });
      console.log("Info registrada correctamente");
    } catch (error: any) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, submitError };
};