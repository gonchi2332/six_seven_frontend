// hooks/usePersonalInfo.ts
import { useEffect, useState, useCallback } from "react";
import { getPersonalInfo, fetchPublicPersonalInfo, type PersonalInfoResponse } from "../features/PersonalInfo/services/personalInfoService";
import { useAuthContext } from "../context/AuthContext";

// Hook para manejar informacion personal del usuario autenticado y publica
export const usePersonalInfo = (refreshTrigger?: number) => {
    const { username } = useAuthContext();
    const [userInfo, setUserInfo] = useState<PersonalInfoResponse | null>(null);
    const [publicInfo, setPublicInfo] = useState<PersonalInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [publicError, setPublicError] = useState<string | null>(null);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    // Cargar informacion privada del usuario autenticado
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

    // Cargar informacion publica automaticamente cuando cambia el usuario a visualizar
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

    // Cambiar el usuario cuya informacion publica se quiere ver
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

// Hook simplificado para la navbar, mantiene compatibilidad
export const useNavbarInfo = (refreshTrigger?: number) => {
    const { username } = useAuthContext();
    const [userInfo, setUserInfo] = useState<PersonalInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar informacion del usuario para la navbar
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