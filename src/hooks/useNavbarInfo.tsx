// hooks/usePersonalInfo.ts
import { useEffect, useState, useCallback } from "react";
import { getPersonalInfo, fetchPublicPersonalInfo, type PersonalInfoResponse } from "../services/personalInfoService";
import { useAuthContext } from "../context/AuthContext";

export const usePersonalInfo = (refreshTrigger?: number) => {
    const { username } = useAuthContext();
    const [userInfo, setUserInfo] = useState<PersonalInfoResponse | null>(null);
    const [publicInfo, setPublicInfo] = useState<PersonalInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [publicError, setPublicError] = useState<string | null>(null);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    // Carga de información privada (autenticada)
    useEffect(() => {
        const fetchData = async () => {
            if (!username) {
                setUserInfo(null);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const info = await getPersonalInfo(username);
                setUserInfo(info);
            } catch (err: any) {
                setError(err.message || "Error al cargar información personal");
                setUserInfo(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [username, refreshTrigger]);

    // useEffect para cargar información pública automáticamente cuando cambia currentPublicUsername
    useEffect(() => {
        const fetchPublicUserInfo = async () => {
            if (!currentPublicUsername || currentPublicUsername.trim() === "") {
                setPublicInfo(null);
                setIsLoadingPublic(false);
                return;
            }

            setIsLoadingPublic(true);
            setPublicError(null);
            try {
                const data = await fetchPublicPersonalInfo(currentPublicUsername);
                setPublicInfo(data);
            } catch (err: any) {
                console.error(err);
                // No mostrar error de autenticación en vista pública
                if (!err.message?.includes("token") && !err.message?.includes("autenticacion") && !err.message?.includes("Authorization")) {
                    setPublicError(err.message || 'Error al obtener información personal pública');
                }
                setPublicInfo(null);
            } finally {
                setIsLoadingPublic(false);
            }
        };

        fetchPublicUserInfo();
    }, [currentPublicUsername]);

    // Función pública para cambiar el usuario a visualizar
    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    return {
        userInfo,
        publicInfo,
        isLoading,
        isLoadingPublic,
        error,
        publicError,
        setPublicUser,
        currentPublicUsername,
    };
};

// Mantener el hook original para compatibilidad
export const useNavbarInfo = (refreshTrigger?: number) => {
    const { username } = useAuthContext();
    const [userInfo, setUserInfo] = useState<PersonalInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!username) {
                setUserInfo(null);
                setIsLoading(false);
                return;
            }
            try {
                const info = await getPersonalInfo(username);
                setUserInfo(info);
            } catch {
                setUserInfo(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [username, refreshTrigger]);

    return { userInfo, isLoading };
};
