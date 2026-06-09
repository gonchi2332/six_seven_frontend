import { useEffect, useState } from "react";
import { getPersonalInfo } from "../services/personalInfoService";
import type { FormData } from "./useProfileFormRegex";
import { parseProfilePicture } from "../../../services/decodeBase64";

// Extraer username del token JWT
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

// Hook para cargar información personal del usuario autenticado
export const usePersonalInfo = (setInitialData: (data: Partial<FormData>) => void) => {
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = getUsernameFromToken();
                if (!username) throw new Error("No se encontró el usuario");

                const info = await getPersonalInfo(username);

                // Si el valor es null o "", se envía como undefined para ocultar el campo en el formulario
                setInitialData({
                    firstName: info.names || "",
                    firstSurname: info.first_surname || "",
                    secondSurname: info.second_surname || undefined,
                    city: info.residence_city_name || undefined,
                    email: info.contact_email || undefined,
                    phone: info.phone_number ? String(info.phone_number) : undefined,
                    country: info.residence_country_name || undefined,
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

