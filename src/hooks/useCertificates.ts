import { useState, useEffect } from "react";
import type { Certificate } from "../services/certificateService";
import {
    fetchCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate as apiDeleteCertificate,
} from "../services/certificateService";

export const useCertificates = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

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
        isLoading,
        error,
        successMessage,
        addCertificate,
        editCertificate,
        deleteCertificate,
    };
};