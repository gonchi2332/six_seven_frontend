import { useState } from 'react';
import LinkedInInput from './LinkedInInput';
import LinkedInBadge from './LinkedInBadge';
import Button from '../../components/Button'; 
import { useLinkedin } from '../../hooks/useLinkedIn';

const styles = {
    wrapper: "flex-1 flex flex-col overflow-hidden",
    pageContent: "flex-1 flex items-start justify-center px-3 sm:px-6 py-1 overflow-y-auto",
    outerCard: "w-full max-w-[1400px] px-2 sm:px-6 lg:px-14 py-4 sm:py-8 flex flex-col",
    // El contenedor verde distintivo de tu app
    greenContainer: "rounded-2xl border border-[#2C666E] bg-[#07393C] px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-6",
    header: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    title: "text-xl sm:text-2xl font-bold font-inter text-white flex items-center gap-2",
    
    // Contenido central
    content: "flex flex-col items-center justify-center py-8 sm:py-12 bg-black/20 rounded-xl border border-white/10 min-h-[250px]",
    emptyText: "text-white/50 font-nunito text-sm sm:text-base text-center max-w-xs mb-6",
    badgeWrapper: "w-full flex justify-center transform transition-all duration-300",
    
    // Modales
    overlay: "fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",
    loading: "text-white/70 font-nunito text-center py-12 bg-black/20 rounded-xl border border-white/10",
};

function LinkedIn() {
  const [showModal, setShowModal] = useState(false);
  
  const token = localStorage.getItem("token") || "";
  const appUsername = localStorage.getItem("username") || ""; 

  const { linkedinUser, isLoading, saveProfile } = useLinkedin(appUsername);

  const handleLinkedInSuccess = async (username: string) => {
    if (!token) {
      alert("Sesión expirada");
      return;
    }
    const result = await saveProfile(username, token);
    if (result.success) {
      setShowModal(false);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageContent}>
        <div className={styles.outerCard}>
          <div className={styles.greenContainer}>
            
            {/* Header Estandarizado */}
            <div className={styles.header}>
              <h1 className={styles.title}>
                Perfil de LinkedIn
              </h1>
              
              {linkedinUser && (
                <Button variant="secondary" onClick={() => setShowModal(true)}>
                  Cambiar Perfil
                </Button>
              )}
            </div>

            {isLoading && !showModal ? (
              <div className={styles.loading}>Cargando información de LinkedIn...</div>
            ) : (
              <div className={styles.content}>
                {!linkedinUser ? (
                  <>
                    <p className={styles.emptyText}>
                      Vincula tu cuenta de LinkedIn para mostrar tu insignia profesional en tu portafolio público
                    </p>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                      Vincular Ahora
                    </Button>
                  </>
                ) : (
                  <div className={styles.badgeWrapper}>
                    <LinkedInBadge username={linkedinUser} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Vinculación (Overlay estandarizado) */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <LinkedInInput 
              onSuccess={handleLinkedInSuccess} 
              onClose={() => setShowModal(false)} 
              initialValue={linkedinUser || ''}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkedIn;