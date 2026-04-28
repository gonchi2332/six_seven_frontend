import { useEffect, useState } from "react";
import { getPersonalInfo } from "../services/personalInfoService";
import type { FormData } from "./useProfileFormRegex";
import { parseProfilePicture } from "../services/decodeBase64";

const getUsernameFromToken = (): string => {
    const token = localStorage.getItem("token");
    if (!token) return "";

    try {
        const payload = token.split(".")[1] || "";
        const decoded = JSON.parse(atob(payload));
        return decoded.username ?? decoded.sub ?? "";
    } catch {
        return "";
    }
};

export const usePersonalInfo = (
    setInitialData: (data: Partial<FormData>) => void
) => {
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = getUsernameFromToken();

                if (!username) throw new Error("No se encontró el usuario");

                // Dentro de usePersonalInfo (useEffect)
                const info = await getPersonalInfo(username);

                // Asegúrate de que estas llaves coincidan EXACTAMENTE con PersonalInfoResponse
                setInitialData({
                    firstName: info.names ?? "",
                    firstSurname: info.first_surname ?? "",     // API usa first_surname
                    secondSurname: info.second_surname ?? "",    // API usa second_surname
                    city: info.residence_city_name ?? "",        // API usa residence_city_name
                    email: info.contact_email ?? "",
                    phone: info.phone_number ? String(info.phone_number) : "", // API usa phone_number
                    country: info.residence_country_name ?? "",  // API usa residence_country_name
                    profileImageUrl: parseProfilePicture(info.profile_picture) ?? null,
                });
            } catch (err: any) {
                setLoadError(err.message);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, []);

    return { isLoadingData, loadError };
};
