import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import CertificateCard from "../../features/Certificates/CertificateCard";
import ViewCertificatePopup from "../../features/Certificates/ViewCertificatePopup";
import { useCertificates } from "../../hooks/useCertificates";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";

const PAGE_SIZE = 12;

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col",
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4",
    header: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
    title: "text-xl sm:text-2xl font-bold font-inter text-white",
    searchRow: "flex items-center gap-2",
    searchInputWrapper: "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 bg-black/30 focus-within:border-[#90DDF0] transition-colors flex-1",
    searchIcon: "text-white shrink-0",
    searchInput: "bg-transparent outline-none text-white font-nunito text-[14px] sm:text-[15px] placeholder:text-white/40 w-full sm:w-80",
    listWrapper: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    empty: "text-white/70 font-nunito text-sm sm:text-base text-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10",
    pagination: "flex items-center justify-center gap-1 sm:gap-2 pt-4",
    pageBtn: (active: boolean) => `w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-nunito text-sm sm:text-base font-semibold transition-all ${active ? "bg-[#90DDF0] text-[#07393C]" : "border border-white/20 text-white/70 hover:border-[#90DDF0] hover:text-[#90DDF0]"}`,
    pageArrow: "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-white/20 text-white/70 text-sm sm:text-base hover:border-[#90DDF0] hover:text-[#90DDF0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
    toast: "font-nunito text-sm text-center py-2 px-4 rounded-xl",
};

const CertificatesPublicPage = () => {
    const { username } = useParams<{ username: string }>();
    const {
        publicCertificates,
        isLoadingPublic,
        publicError,
        setPublicUser
    } = useCertificates();

    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

    useEffect(() => {
        setPublicUser(username ?? null);
    }, [username, setPublicUser]);

    const handleSearch = () => {
        setActiveSearch(searchInput);
        setCurrentPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleCertificateClick = (certificate: any) => {
        setSelectedCertificate(certificate);
    };

    const handleCloseView = () => {
        setSelectedCertificate(null);
    };

    // Filtrar por búsqueda
    const filtered = publicCertificates.filter((cert) =>
        (cert.title || "").toLowerCase().includes(activeSearch.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    if (publicError) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.pageContent}>
                    <div className={styles.outerCard}>
                        <div className={styles.greenContainer}>
                            <p className={`${styles.empty} text-red-400`}>
                                Error al cargar los certificados: {publicError}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageContent}>
                <div className={styles.outerCard}>
                    <div className={styles.greenContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Certificados</h1>

                            <div className={styles.searchRow}>
                                <div className={styles.searchInputWrapper}>
                                    <Search size={16} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Buscar por título..."
                                        className={styles.searchInput}
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    variant="secondary"
                                >
                                    Buscar
                                </Button>
                            </div>
                        </div>

                        {isLoadingPublic ? (
                            <p className={styles.empty}>Cargando certificados...</p>
                        ) : paginated.length === 0 ? (
                            <div className={styles.empty}>
                                {activeSearch
                                    ? "No se encontraron certificados que coincidan con tu búsqueda"
                                    : "No hay certificados para mostrar"}
                            </div>
                        ) : (
                            <>
                                <div className={styles.listWrapper}>
                                    {paginated.map((certificate) => (
                                        <div
                                            key={certificate.id}
                                            onClick={() => handleCertificateClick(certificate)}
                                            className="cursor-pointer"
                                        >
                                            <CertificateCard certificate={certificate} onClick={() => { }} />
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className={styles.pagination}>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className={styles.pageArrow}
                                        >
                                            ‹
                                        </button>
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={styles.pageBtn(currentPage === i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className={styles.pageArrow}
                                        >
                                            ›
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {selectedCertificate && (
                <ViewCertificatePopup
                    certificate={selectedCertificate}
                    onClose={handleCloseView}
                />
            )}
        </div>
    );
};

export default CertificatesPublicPage;
