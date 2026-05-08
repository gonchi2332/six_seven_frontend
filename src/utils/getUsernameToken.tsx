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
