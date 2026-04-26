import { useState } from 'react';
import LinkedInInput from './LinkedInInput'; // Renombrado para claridad
import LinkedInBadge from './LinkedInBadge';
import Button from '../../components/Button'; 
import Header from '../../components/Header/Header';
import { useLinkedin } from '../../hooks/useLinkedIn';

function LinkedIn() {
  const [showModal, setShowModal] = useState(false);
  
  // Obtener datos reales del localStorage o Context
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

  const STYLES = {
    CONTAINER: "flex flex-col items-center justify-center min-h-[200px]",
    LINK_BUTTON: "text-xs text-blue-600 hover:underline mt-4 font-medium",
    BADGE_CONTAINER: "mt-6 flex flex-col items-center gap-2",
    MODAL_OVERLAY: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
  }

  if (isLoading && !showModal) return <div>Cargando...</div>;

  return (
    <div className={STYLES.CONTAINER}>
      <Header title="LinkedIn" />

      {!linkedinUser ? (
        <Button onClick={() => setShowModal(true)}>
          Vincular LinkedIn
        </Button>
      ) : (
        <div className={STYLES.BADGE_CONTAINER}>
          <LinkedInBadge username={linkedinUser} />
          <button 
            onClick={() => setShowModal(true)}
            className={STYLES.LINK_BUTTON}>
            Actualizar perfil
          </button>
        </div>
      )}

      {showModal && (
        <div className={STYLES.MODAL_OVERLAY}>
          <LinkedInInput 
            onSuccess={handleLinkedInSuccess} 
            onClose={() => setShowModal(false)} 
            initialValue={linkedinUser || ''}
          />
        </div>
      )}
    </div>
  );
}

export default LinkedIn;