// ============================================
// TIPOS
// ============================================

import { fetchWithAuth } from "../../../services/refreshToken";

/*
  Interfaz que define la estructura de una entrada de formación académica:
  -id: Identificador único de la formación
  -degree: Título o carrera (ej: Ingeniería Informática)
  -academicLevel: Nombre del grado académico (ej: Licenciatura)
  -academicLevelId: ID del grado académico (para el select)
  -institution: Nombre de la institución educativa
  -startDate: Año de inicio o emisión (formato YYYY)
  -educationState: Estado - "Cursando" o "Egresado"
  -visible: Indica si es público en el portafolio
*/
export interface EducationEntry {
    id: string;
    degree: string;
    academicLevel: string;
    academicLevelId: number;
    institution: string;
    startDate: string;
    educationState: string;
    visible: boolean;
}

/*
  Interfaz que define un grado académico del catálogo:
  -id: Identificador único del grado
  -academicdegree: Nombre del grado (ej: "Ingeniería", "Licenciatura", "Técnico")
*/
export interface AcademicDegree {
    id: number;
    academicdegree: string;
}

// ============================================
// CONSTANTES
// ============================================

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/portfolio`;

/*
  Características:
  -Obtiene el nombre de usuario almacenado en localStorage
  -Usado para autenticar peticiones de datos privados

  @ Retorna: Nombre de usuario o cadena vacía
*/
const getUsername = (): string => {
    return localStorage.getItem("username") ?? "";
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/*
  Características:
  -Formatea la fecha de inicio para mostrar solo el año
  -Si ya viene en formato YYYY, lo deja igual
  -Si viene en formato ISO (YYYY-MM-DD), extrae solo el año

  @ Parámetro: dateStr - Fecha en formato YYYY o ISO
  @ Retorna: Año en formato YYYY
*/
const formatStartDate = (dateStr: string): string => {
    // Si viene en formato YYYY, dejarlo así
    if (/^\d{4}$/.test(dateStr)) return dateStr;
    // Si viene en formato ISO, extraer el año
    return dateStr.split('-')[0] ?? dateStr;
};

/*
  Características:
  -Convierte un año al formato ISO requerido por el backend
  -Ejemplo: "2020" -> "2020-01-01T00:00:00.000Z"

  @ Parámetro: year - Año en formato YYYY
  @ Retorna: Fecha ISO con 1 de enero a las 00:00:00
*/
const formatToISO = (year: string): string => {
    return `${year}-01-01T00:00:00.000Z`;
};

// ============================================
// SERVICIOS
// ============================================

/*
  Características:
  -Obtiene el catálogo de grados académicos disponibles
  -Endpoint: GET /api/v1/portfolio/education_degree
  -Usa fetchWithAuth para manejo automático de refresh token

  @ Retorna: Array de grados académicos (id + nombre)

  @ Ejemplo:
  const degrees = await fetchAcademicDegrees();
  // [{ id: 1, academicdegree: "Ingeniería" }, ...]
*/
export const fetchAcademicDegrees = async (): Promise<AcademicDegree[]> => {
    const res = await fetchWithAuth(`${BASE_URL}/education_degree`, {
        method: "GET",
    });
    if (!res.ok) throw new Error("Error al obtener grados académicos");
    const data = await res.json();
    return data.educationGrade ?? [];
};

/*
  Características:
  -Obtiene formaciones académicas públicas de un usuario (NO requiere autenticación)
  -Endpoint: GET /api/v1/portfolio/users/{username}/education
  -Mapea la respuesta del backend al formato EducationEntry
  -Convierte start_date a año con formatStartDate

  @ Parámetro: username - Nombre de usuario del portafolio a visualizar
  @ Retorna: Array de formaciones académicas públicas

  @ Ejemplo:
  const education = await fetchPublicEducation("juanperez");
*/
export const fetchPublicEducation = async (username: string): Promise<EducationEntry[]> => {
    const res = await fetch(`${BASE_URL}/users/${username}/education`)
    if (!res.ok) throw new Error("Error al cargar formaciones académicas");
    const data = await res.json();

    if (!data.education) return [];

    return data.education.map((e: {
        id: number;
        title: string;
        institution: string;
        academicdegree: string;
        start_date: string;
        education_state: string;
        visible: string;
    }) => ({
        id: String(e.id),
        degree: e.title,
        academicLevel: e.academicdegree,
        academicLevelId: 0, // Se actualizará con el ID correspondiente
        institution: e.institution,
        startDate: formatStartDate(e.start_date),
        educationState: e.education_state || 'Culminado',
        visible: e.visible
    }));
}

/*
  Características:
  -Obtiene formaciones académicas del usuario autenticado (requiere token)
  -Endpoint: GET /api/v1/portfolio/users/education?username={username}
  -Usa fetchWithAuth para manejo automático de refresh token
  -Mapea la respuesta del backend al formato EducationEntry

  @ Retorna: Array de formaciones académicas del usuario

  @ Ejemplo:
  const myEducation = await fetchEducation();
*/
export const fetchEducation = async (): Promise<EducationEntry[]> => {
    const username = getUsername();
    if (!username) return [];

    const res = await fetchWithAuth(`${BASE_URL}/users/education?username=${username}`, {
        method: "GET"
    });
    if (!res.ok) throw new Error("Error al cargar formaciones académicas");
    const data = await res.json();

    if (!data.education) return [];

    return data.education.map((e: {
        id: number;
        title: string;
        institution: string;
        academicdegree: string;
        start_date: string;
        education_state: string;
        visible: string;
    }) => ({
        id: String(e.id),
        degree: e.title,
        academicLevel: e.academicdegree,
        academicLevelId: 0, // Se actualizará con el ID correspondiente
        institution: e.institution,
        startDate: formatStartDate(e.start_date),
        educationState: e.education_state || 'Culminado',
        visible: e.visible
    }));
};

/*
  Características:
  -Crea una nueva formación académica para el usuario autenticado
  -Endpoint: POST /api/v1/portfolio/users/education
  -Usa fetchWithAuth para manejo automático de refresh token
  -Convierte startDate a formato ISO con formatToISO
  -Después de crear, retorna la lista actualizada de formaciones

  @ Parámetro: data - Datos de la formación (sin id)
  @ Retorna: Array actualizado de formaciones académicas

  @ Ejemplo:
  const updatedList = await createEducation({
    degree: "Ingeniería Informática",
    academicLevelId: 1,
    institution: "Universidad Central",
    startDate: "2020",
    educationState: "Cursando",
    academicLevel: "Ingeniería",
    visible: true
  });
*/
export const createEducation = async (
    data: Omit<EducationEntry, "id">
): Promise<EducationEntry[]> => {
    const body = {
        title: data.degree,
        academyDegreeId: data.academicLevelId,
        institution: data.institution,
        startDate: formatToISO(data.startDate),
        educationState: data.educationState,
    };

    const res = await fetchWithAuth(`${BASE_URL}/users/education`, {
        method: "POST",
        body: JSON.stringify(body),
    });

    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al crear formación académica");

    return fetchEducation();
};

/*
  Características:
  -Actualiza una formación académica existente
  -Endpoint: PATCH /api/v1/portfolio/users/education?id={id}
  -Usa fetchWithAuth para manejo automático de refresh token
  -Solo envía los campos que están presentes (actualización parcial)
  -Después de actualizar, retorna la lista actualizada

  @ Parámetros:
  -id: Identificador de la formación a modificar
  -data: Datos actualizados (parciales)
  @ Retorna: Array actualizado de formaciones académicas

  @ Ejemplo:
  const updatedList = await updateEducation("123", {
    degree: "Nuevo título",
    startDate: "2021",
    educationState: "Egresado"
  });
*/
export const updateEducation = async (
    id: string,
    data: Omit<EducationEntry, "id">
): Promise<EducationEntry[]> => {
    const body: Record<string, unknown> = {};

    if (data.degree) body.title = data.degree;
    if (data.academicLevelId && data.academicLevelId !== 0) body.academyDegreeId = data.academicLevelId;
    if (data.institution) body.institution = data.institution;
    if (data.startDate) body.startDate = formatToISO(data.startDate);
    if (data.educationState) body.educationState = data.educationState;

    const res = await fetchWithAuth(`${BASE_URL}/users/education?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });

    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message ?? "Error al actualizar formación académica");

    return fetchEducation();
};

/*
  Características:
  -Elimina una formación académica del usuario autenticado
  -Endpoint: DELETE /api/v1/portfolio/users/education?id={id}
  -Usa fetchWithAuth para manejo automático de refresh token

  @ Parámetro: id - Identificador de la formación a eliminar
  @ Lanza: Error si la eliminación falla

  @ Ejemplo:
  await deleteEducation("123");
*/
export const deleteEducation = async (id: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/users/education?id=${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Error al eliminar formación académica");
    }
};

