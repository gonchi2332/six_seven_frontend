// hooks/useEmail.ts
import { useEffect, useState } from "react";
import { getEmail } from "../services/getemail"
import { useAuthContext } from "../context/AuthContext";

// Hook para obtener el email del usuario autenticado
const useEmail = () => {
    const [email, setEmail] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuthContext();

    // Obtener email cuando el token esta disponible
    useEffect(() => {
        if (!token) return;
        const fetchEmail = async () => {
            setIsLoading(true);
            try {
                const data = await getEmail();
                setEmail(data.email);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEmail();
    }, [token]);

    return {
        email,
        isLoading
    };
};

export default useEmail;