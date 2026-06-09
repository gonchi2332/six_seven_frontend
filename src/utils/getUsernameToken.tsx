// Extrae el nombre de usuario del token JWT almacenado en localStorage
const getUsernameFromToken = (): string => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
        // Tomar la segunda parte del token (payload)
        const part = token.split(".").at(1);
        if (!part) return "";
        const payload = JSON.parse(atob(part));
        return payload.username ?? "";
    } catch {
        return "";
    }
};

export default getUsernameFromToken;