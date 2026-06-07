import { fetchWithAuth } from "../../../services/refreshToken";

/*
  Estructura de la respuesta de información personal:
  -username: Nombre de usuario
  -is_new: Indica si el usuario es nuevo (requiere completar perfil)
  -state: Estado del usuario (verified, unverified, etc.)
  -phone_number: Número de teléfono (opcional)
  -names: Nombre(s) del usuario
  -first_surname: Primer apellido
  -second_surname: Segundo apellido (opcional)
  -residence_city_name: Ciudad de residencia (opcional)
  -residence_country_name: País de residencia (opcional)
  -contact_email: Correo de contacto (opcional)
  -main_registration_email: Correo principal de registro
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
    main_registration_email: string;
    profile_picture: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;

/*
  Características:
  -Obtiene la información personal del usuario autenticado (requiere token)
  -Endpoint: GET /api/v2/register/users/personal-info?username={username}
  -Usa fetchWithAuth para manejo automático de refresh token
  -Verifica response.ok y data.success para determinar éxito
  -Retorna data.userPersonalInfo

  @ Parámetro: username - Nombre de usuario a consultar
  @ Retorna: Promise con PersonalInfoResponse
  @ Lanza: Error si la solicitud falla o data.success es false

  @ Ejemplo:
  const userInfo = await getPersonalInfo("juanperez");
  console.log(userInfo.names, userInfo.first_surname);
*/
export const getPersonalInfo = async (username: string): Promise<PersonalInfoResponse> => {
    const response = await fetchWithAuth(
        `${API_URL}/api/v2/register/users/personal-info?username=${username}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener la información");
    }
    return data.userPersonalInfo;
};

/*
  Características:
  -Obtiene la información personal pública de un usuario (NO requiere autenticación)
  -Endpoint: GET /api/v2/register/users/{username}/personal-info
  -Útil para vista de portafolio público
  -Verifica response.ok y data.success para determinar éxito

  @ Parámetro: username - Nombre de usuario del portafolio a visualizar
  @ Retorna: Promise con PersonalInfoResponse
  @ Lanza: Error si la solicitud falla o data.success es false

  @ Ejemplo:
  const publicInfo = await fetchPublicPersonalInfo("juanperez");
*/
export const fetchPublicPersonalInfo = async (username: string): Promise<PersonalInfoResponse> => {
    const response = await fetch(`${API_URL}/api/v2/register/users/${username}/personal-info`);
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener la información");
    }
    return data.userPersonalInfo;
}

/*
  Características:
  -Actualiza la información personal del usuario autenticado
  -Endpoint: PUT /api/v2/register/users/personal-info
  -Usa fetchWithAuth para manejo automático de refresh token
  -Acepta FormData para incluir archivos (imagen de perfil)
  -Imprime en consola los datos enviados (para depuración)
  -Maneja errores de respuesta

  @ Parámetro: formData - FormData con los campos a actualizar
  @ Retorna: Promise con la respuesta del servidor
  @ Lanza: Error si la solicitud falla

  @ Ejemplo:
  const formData = new FormData();
  formData.append("names", "Juan");
  formData.append("firstSurname", "Pérez");
  formData.append("profilePicture", imageFile);
  await updatePersonalInfo(formData);
*/
export const updatePersonalInfo = async (formData: FormData) => {
    console.log("Enviando datos al backend:");
    console.log(JSON.stringify(Object.fromEntries(formData)));
    const response = await fetchWithAuth(`${API_URL}/api/v2/register/users/personal-info`, {
        method: "PUT",
        body: formData,
    }, true);

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar");
    }

    return data;
};

