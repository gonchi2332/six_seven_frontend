import { useEffect, useState } from "react";
import { getPersonalInfo } from "../services/personalInfoService";
import type { FormData } from "./useProfileFormRegex";
import { parseProfilePicture } from "../../../services/decodeBase64";

/*
  Características:
  -Extrae el nombre de usuario del token JWT almacenado en localStorage
  -Divide el token por "." y toma la segunda parte (payload)
  -Decodifica base64 (atob) y extrae la propiedad username o sub
  -Si no hay token o falla, retorna cadena vacía

  @ Retorna: Nombre de usuario o cadena vacía
*/
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

/*
  Características:
  -Hook personalizado que carga la información personal del usuario autenticado
  -Obtiene el username del token JWT
  -Llama al servicio getPersonalInfo para obtener los datos del usuario
  -Procesa la respuesta y la envía a setInitialData para inicializar el formulario
  -Convierte valores null/undefined a undefined para que el formulario oculte campos condicionales
  -Decodifica la imagen de perfil con parseProfilePicture
  -Maneja estado de carga (isLoadingData) y errores (loadError)

  @ Parámetro: setInitialData - Función para inicializar el formulario con los datos cargados
  @ Retorna: isLoadingData (bool), loadError (string | null)

  @ Ejemplo:
  const { isLoadingData, loadError } = usePersonalInfo((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  });
*/
export const usePersonalInfo = (setInitialData: (data: Partial<FormData>) => void) => {
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = getUsernameFromToken();
                if (!username) throw new Error("No se encontró el usuario");

                const info = await getPersonalInfo(username);

                // Si el valor es null o "", se enviará como undefined,
                // permitiendo que el componente Card oculte el campo.
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
