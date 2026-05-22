import { useState } from "react";
import { useCertificates } from "./useCertificates";
import useSearch from "./useSearch";
import usePagination from "./usePagination";
import type { Certificate } from "../services/certificateService";

const PAGE_SIZE = 12;

const useCertificatesPage = () => {
    const { certificates, isLoading, error, successMessage, addCertificate, editCertificate, deleteCertificate } = useCertificates();

    const { searchInput, filtered, handleSearch, handleKeyDown, handleChange } = useSearch(
        certificates,
        (c, q) => c.title.toLowerCase().includes(q.toLowerCase())
    );

    const { currentPage, totalPages, paginated, prevPage, nextPage, resetPage, adjustAfterDelete } = usePagination(filtered, PAGE_SIZE);

    const [certAction, setCertAction] = useState<Certificate | null>(null);
    const [certToView, setCertToView] = useState<Certificate | null>(null);
    const [certToEdit, setCertToEdit] = useState<Certificate | null>(null);
    const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSearch = () => { handleSearch(); resetPage(); };

    const closeAll = () => {
        setCertAction(null);
        setCertToView(null);
        setCertToEdit(null);
        setCertToDelete(null);
        setShowAdd(false);
        setFormError(null);
    };

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
            adjustAfterDelete(paginated.length);
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