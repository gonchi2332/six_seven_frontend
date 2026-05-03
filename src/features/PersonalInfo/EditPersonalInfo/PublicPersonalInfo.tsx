import { useParams } from "react-router-dom";
import { usePublicPersonalInfo } from "../../../hooks/usePublicPersonalInfo";

const STYLES = {
  CARD: "p-8 flex flex-col md:flex-row gap-8 items-center bg-white/5 rounded-3xl border border-white/10",
  AVATAR: "w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-accent shadow-xl bg-gray-800",
  INFO_BOX: "flex-1 flex flex-col gap-2 text-center md:text-left",
  NAME: "text-3xl font-bold text-white font-inter",
  USERNAME: "text-accent font-nunito text-lg mb-2",
  STATE: "text-surface/80 italic font-nunito mb-4 block",
  DETAILS: "text-surface text-lg font-nunito flex items-center gap-2",
  LABEL: "text-accent font-bold text-sm uppercase tracking-widest"
};

const PublicPersonalInfo = () => {
  const { username: urlUsername } = useParams<{ username: string }>();
  const { data, isLoading, error } = usePublicPersonalInfo(urlUsername);

  if (isLoading) return <p className="text-white text-center py-10">Cargando perfil...</p>;
  if (error) return <p className="text-red-400 text-center py-10">{error}</p>;
  if (!data) return null;

  return (
    <div className={STYLES.CARD}>
      <img 
        src={data.profileImageUrl || ""} 
        alt={data.firstName} 
        className={STYLES.AVATAR} 
      />

      <div className={STYLES.INFO_BOX}>
        <span className={STYLES.LABEL}>Perfil Profesional</span>
        
        <h2 className={STYLES.NAME}>
          {data.firstName} {data.firstSurname} {data.secondSurname}
        </h2>

        <p className={STYLES.USERNAME}>@{urlUsername}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-2 border-t border-white/10 pt-4">
          {data.city && data.country && (
            <p className={STYLES.DETAILS}>
              <span className="text-accent text-xl">Ubicación:</span>
              <span>{data.city}, {data.country}</span>
            </p>
          )}
          
          {data.email && (
            <p className={STYLES.DETAILS}>
              <span className="text-accent text-xl">Correo electronico:</span>
              <a href={`mailto:${data.email}`} className="hover:text-accent transition-colors">
                {data.email}
              </a>
            </p>
          )}

          {data.phone && (
            <p className={STYLES.DETAILS}>
              <span className="text-accent text-xl">Teléfono:</span>
              <span>{data.phone}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicPersonalInfo;