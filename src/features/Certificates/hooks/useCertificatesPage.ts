import { useState } from "react";
import { useCertificates } from "./useCertificates";
import useSearch from "../../../hooks/useSearch";
import usePagination from "../../../hooks/usePagination";
import type { Certificate } from "../services/certificateService";

const PAGE_SIZE = 12;

// Hook que orquesta la página de certificados: CRUD, búsqueda, paginación y estados de UI
const useCertificatesPage = () => {
    const { certificates, isLoading, error, successMessage, addCertificate, editCertificate, deleteCertificate } = useCertificates();

    // Búsqueda por título
    const { searchInput, filtered, handleSearch, handleKeyDown, handleChange } = useSearch(
        certificates,
        (c, q) => c.title.toLowerCase().includes(q.toLowerCase())
    );

    const { currentPage, totalPages, paginated, prevPage, nextPage, resetPage, adjustAfterDelete } = usePagination(filtered, PAGE_SIZE);

    // Estados de UI para los popups
    const [certAction, setCertAction] = useState<Certificate | null>(null);
    const [certToView, setCertToView] = useState<Certificate | null>(null);
    const [certToEdit, setCertToEdit] = useState<Certificate | null>(null);
    const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSearch = () => { handleSearch(); resetPage(); };

    // Cierra todos los popups y limpia estados
    const closeAll = () => {
        setCertAction(null);
        setCertToView(null);
        setCertToEdit(null);
        setCertToDelete(null);
        setShowAdd(false);
        setFormError(null);
    };

    // Vuelve al menú de acciones del certificado
    const goToMenu = (cert: Certificate) => {
        setCertToView(null);
        setCertToEdit(null);
        setCertToDelete(null);
        setCertAction(cert);
    };

    const onAddSubmit = async (data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }) => {
        setIsSubmitting(true);
        setFormError(null);
        try {
            await addCertificate(data);
            closeAll();
        } catch (err: unknown) {
            setFormError(err instanceof Error ? err.message : "Error al registrar certificado");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onEditSubmit = async (data: Omit<Certificate, "id" | "coverImage"> & { coverImage: File }) => {
        if (!certToEdit) return;
        setIsSubmitting(true);
        setFormError(null);
        try {
            await editCertificate(certToEdit.id, data);
            closeAll();
        } catch (err: unknown) {
            setFormError(err instanceof Error ? err.message : "Error al modificar certificado");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (!certToDelete) return;
        setIsSubmitting(true);
        try {
            await deleteCertificate(certToDelete.id);
            adjustAfterDelete(paginated.length); // Ajusta la página si queda vacía
            closeAll();
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        certificates, isLoading, error, successMessage,
        searchInput, filtered, paginated, currentPage, totalPages,
        prevPage, nextPage, onSearch, handleKeyDown, handleChange,
        certAction, setCertAction,
        certToView, setCertToView,
        certToEdit, setCertToEdit,
        certToDelete, setCertToDelete,
        showAdd, setShowAdd,
        formError, setFormError,
        isSubmitting,
        closeAll, goToMenu,
        onAddSubmit, onEditSubmit, onDeleteConfirm,
    };
};

export default useCertificatesPage;