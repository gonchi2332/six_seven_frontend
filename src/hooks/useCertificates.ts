import { useState, useEffect, useCallback } from "react";
import type { Certificate } from "../services/certificateService";
import {
    fetchCertificates,
    fetchCertificatesPublic,
    createCertificate,
    updateCertificate,
    deleteCertificate as apiDeleteCertificate,
} from "../services/certificateService";

export const useCertificates = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [publicCertificates, setPublicCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [publicError, setPublicError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentPublicUsername, setCurrentPublicUsername] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    // Carga de certificados privados (autenticado)
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await fetchCertificates();
                setCertificates(data ?? []);
            } catch {
                showError("No se pudieron cargar los certificados");
                setCertificates([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // useEffect para cargar certificados públicos automáticamente cuando cambia currentPublicUsername
    useEffect(() => {
        const fetchPublicUserCertificates = async () => {
            if (!currentPublicUsername || currentPublicUsername.trim() === "") {
                setPublicCertificates([]);
                setIsLoadingPublic(false);
                return;
            }

            setIsLoadingPublic(true);
            setPublicError(null);
            try {
                const data = await fetchCertificatesPublic(currentPublicUsername);
                // Filtrar solo los visibles
                const visibleData = (data ?? []).filter((cert) => cert.visible === true);
                setPublicCertificates(visibleData);
            } catch (err: any) {
                console.error(err);
                // No mostrar error de autenticación en vista pública
                if (!err.message?.includes("token") && !err.message?.includes("autenticacion") && !err.message?.includes("Authorization")) {
                    setPublicError(err.message || 'Error al obtener certificados públicos');
                }
                setPublicCertificates([]);
            } finally {
                setIsLoadingPublic(false);
            }
        };

        fetchPublicUserCertificates();
    }, [currentPublicUsername]);

    // Función pública para cambiar el usuario a visualizar
    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    const addCertificate = async (
        data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }
    ) => {
        await createCertificate(data);
        const updated = await fetchCertificates();
        setCertificates(updated);
        showSuccess("Certificado registrado correctamente");
    };

    const editCertificate = async (
        id: number,
        data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }
    ) => {
        await updateCertificate(id, data);
        const updated = await fetchCertificates();
        setCertificates(updated);
        showSuccess("Certificado modificado correctamente");
    };

    const deleteCertificate = async (id: number) => {
        await apiDeleteCertificate(id);
        setCertificates((prev) => prev.filter((c) => c.id !== id));
        showSuccess("Certificado eliminado correctamente");
    };

    return {
        certificates,
        publicCertificates,
        isLoading,
        isLoadingPublic,
        error,
        publicError,
        successMessage,
        addCertificate,
        editCertificate,
        deleteCertificate,
        setPublicUser,
        currentPublicUsername,
    };
};
