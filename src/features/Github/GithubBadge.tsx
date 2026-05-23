import { ExternalLink } from 'lucide-react';

interface Props {
    username: string;
}

const GithubBadge = ({ username }: Props) => {
    // Limpieza de URL para obtener solo el nombre
    const cleanUser = username.split('/').filter(Boolean).pop() || "";
    
    if (!cleanUser) return null;

    // Generamos la inicial para el avatar
    const initial = cleanUser.charAt(0).toUpperCase();

    return (
        <div className="group relative w-72 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
                {/* Avatar dinámico con inicial */}
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#333] to-[#6e5494] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner">
                    {initial}
                </div>

                {/* Info principal */}
                <div className="flex-grow min-w-0">
                    <h3 className="text-gray-900 font-bold truncate leading-tight">
                        {cleanUser}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-bold text-[#6e5494] uppercase tracking-wider">
                            GitHub
                        </span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-[10px] text-gray-400 font-medium">Perfil Público</span>
                    </div>
                </div>
            </div>

            {/* Botón de acción */}
            <a
                href={`https://github.com/${cleanUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-[#6e5494] transition-colors duration-200"
            >
                Visitar Perfil
                <ExternalLink size={14} />
            </a>
        </div>
    );
};

export default GithubBadge;