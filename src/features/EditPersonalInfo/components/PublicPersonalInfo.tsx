import { useParams } from "react-router-dom";
import { usePublicPersonalInfo } from "../../../hooks/usePublicPersonalInfo";


const STYLES = {
  CARD: " p-8 flex flex-col md:flex-row gap-8 items-center",
  AVATAR: "w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-accent shadow-xl",
  INFO_BOX: "flex-1 flex flex-col gap-2 text-center md:text-left",
  NAME: "text-3xl font-bold text-white font-inter",
  DETAILS: "text-surface text-lg font-nunito",
  LABEL: "text-accent font-bold text-sm uppercase tracking-widest"
};

const PublicPersonalInfo = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, error } = usePublicPersonalInfo(username);

  if (isLoading) return <p className="text-white text-center">Cargando perfil...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (!data) return null;

  return (
    <div className={STYLES.CARD}>
      <img 
        src={data.profileImageUrl || ""} 
        alt={data.firstName} 
        className={STYLES.AVATAR} 
      />
      <div className={STYLES.INFO_BOX}>
        <h2 className={STYLES.NAME}>
          {data.firstName} {data.firstSurname} {data.secondSurname}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {data.city && data.country && (
            <p className={STYLES.DETAILS}>
              <strong>Ubicación:</strong> {data.city}, {data.country}
            </p>
          )}
          {data.email && (
            <p className={STYLES.DETAILS}>
              <strong>Email:</strong> {data.email}
            </p>
          )}
          {data.phone && (
            <p className={STYLES.DETAILS}>
             <strong>Teléfono:</strong> {data.phone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicPersonalInfo;