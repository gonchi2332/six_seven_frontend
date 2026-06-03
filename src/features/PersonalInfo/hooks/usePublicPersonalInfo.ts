import { useEffect, useState } from "react";
import { getPersonalInfo } from "../services/personalInfoService";
import { parseProfilePicture } from "../../../services/decodeBase64";
import type { FormData } from "./useProfileFormRegex";

export const usePublicPersonalInfo = (username: string | undefined) => {
    const [data, setData] = useState<Partial<FormData> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublicData = async () => {
            if (!username) return;
            try {
                setIsLoading(true);
                const info = await getPersonalInfo(username);

                setData({
                    firstName: info.names,
                    firstSurname: info.first_surname,
                    secondSurname: info.second_surname || "",
                    city: info.residence_city_name || "",
                    country: info.residence_country_name || "",
                    email: info.contact_email || "",
                    phone: info.phone_number || "",
                    profileImageUrl: parseProfilePicture(info.profile_picture),
                });
            } catch (err: any) {
                setError("No se pudo cargar la información del perfil.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicData();
    }, [username]);

    return { data, isLoading, error };
};
