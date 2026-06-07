/*
  Características:
  -Extrae el nombre de usuario del token JWT almacenado en localStorage
  -Divide el token por "." y toma la segunda parte (payload)
  -Decodifica base64 (atob) y extrae la propiedad username
  -Si no hay token o falla la decodificación, retorna cadena vacía

  @ Retorna: Nombre de usuario o cadena vacía

  @ Ejemplo:
  const username = getUsernameFromToken();
  if (username) {
    console.log("Usuario autenticado:", username);
  } else {
    console.log("No hay sesión activa");
  }
*/
const getUsernameFromToken = (): string => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
        const part = token.split(".").at(1);
        if (!part) return "";
        const payload = JSON.parse(atob(part));
        return payload.username ?? "";
    } catch {
        return "";
    }
};

export default getUsernameFromToken;