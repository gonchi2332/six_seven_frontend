import { useEffect, useState } from "react";
import { getPersonalInfo } from "../services/personalInfoService";
import { parseProfilePicture } from "../../../services/decodeBase64";
import type { FormData } from "./useProfileFormRegex";

/*
  Características:
  -Hook personalizado que carga la información personal pública de un usuario
  -Útil para la vista de portafolio público (no requiere autenticación)
  -Carga automáticamente cuando cambia el username
  -Procesa la respuesta y la mapea al formato FormData
  -Decodifica la imagen de perfil con parseProfilePicture
  -Maneja estado de carga (isLoading) y errores (error)
  -Los campos opcionales (secondSurname, city, country, email, phone) usan || "" para evitar undefined

  @ Parámetro: username - Nombre de usuario del portafolio a visualizar
  @ Retorna:
  -data: Datos del usuario en formato FormData (parcial)
  -isLoading: Estado de carga
  -error: Mensaje de error (opcional)

  @ Ejemplo:
  const { data, isLoading, error } = usePublicPersonalInfo("juanperez");
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <PersonalInfoDisplay data={data} />;
*/
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

