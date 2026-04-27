import { useEffect, useState } from "react";
import { getEmail } from "../services/getemail"
import { useAuthContext } from "../context/AuthContext";


const useEmail = () => {
    const [email, setEmail] = useState("");

    const [isLoading, setIsLoading] = useState(false);


    const { token } = useAuthContext();


    useEffect(() => {
        if (!token) return;
        const fetchEmail = async () => {
            setIsLoading(true);
            try {
                const data = await getEmail({ token });
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
