import { useState, useEffect, useCallback } from "react";
import type { Certificate } from "../services/certificateService";
import {
    fetchCertificates,
    fetchCertificatesPublic,
    createCertificate,
    updateCertificate,
    deleteCertificate as apiDeleteCertificate,
} from "../services/certificateService";

/*
  Características:
  -Hook personalizado que gestiona el estado y operaciones CRUD de certificados
  -Maneja dos conjuntos de datos: certificados privados (autenticado) y públicos (vista de portafolio)
  -Carga automática de certificados privados al montar el componente
  -Carga automática de certificados públicos cuando cambia currentPublicUsername
  -Filtra certificados públicos solo con visible === true
  -Maneja mensajes de éxito y error (se autolimpian después de 3 segundos)
  -Operaciones CRUD: agregar, editar, eliminar (recargan la lista automáticamente)

  @ Ejemplo:
  const {
    certificates, publicCertificates, isLoading, error,
    addCertificate, editCertificate, deleteCertificate, setPublicUser
  } = useCertificates();

  // Vista privada (panel de control)
  <CertificateList certificates={certificates} onDelete={deleteCertificate} />

  // Vista pública (portafolio)
  setPublicUser("juanperez");
  <PublicCertificateList certificates={publicCertificates} isLoading={isLoadingPublic} />
*/
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

    // Carga de certificados privados (autenticado) al montar el componente
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

    // Carga certificados públicos automáticamente cuando cambia currentPublicUsername
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
                // Filtrar solo los visibles (portafolio público)
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

    // Función pública para cambiar el usuario a visualizar en el portafolio
    const setPublicUser = useCallback((username: string | null) => {
        setCurrentPublicUsername(username);
    }, []);

    /*
      Agrega un nuevo certificado:
      -Envía los datos al servicio createCertificate
      -Recarga la lista actualizada
    */
    const addCertificate = async (
        data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }
    ) => {
        await createCertificate(data);
        const updated = await fetchCertificates();
        setCertificates(updated);
        showSuccess("Certificado registrado correctamente");
    };

    /*
      Edita un certificado existente:
      -Envía los datos actualizados al servicio updateCertificate
      -Recarga la lista actualizada
    */
    const editCertificate = async (
        id: number,
        data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }
    ) => {
        await updateCertificate(id, data);
        const updated = await fetchCertificates();
        setCertificates(updated);
        showSuccess("Certificado modificado correctamente");
    };

    /*
      Elimina un certificado:
      -Llama al servicio deleteCertificate
      -Actualiza el estado local filtrando el certificado eliminado
    */
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
