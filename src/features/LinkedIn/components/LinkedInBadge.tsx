import { ExternalLink } from 'lucide-react';

interface Props {
  username: string;
}

const LinkedInBadge = ({ username }: Props) => {
    // Extrae solo el nombre de usuario si se pegó una URL completa
    const cleanUser = username.split('/').filter(Boolean).pop() || "";

    if (!cleanUser) return null;

    const initial = cleanUser.charAt(0).toUpperCase(); // Inicial para el avatar dinámico

    return (
        <div className="group relative w-72 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
                {/* Avatar con inicial del username */}
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#0077b5] to-[#00a0dc] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner">
                    {initial}
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className="text-gray-900 font-bold truncate leading-tight">
                        {cleanUser}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-bold text-[#0077b5] uppercase tracking-wider">
                            LinkedIn
                        </span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-[10px] text-gray-400 font-medium">Perfil Público</span>
                    </div>
                </div>
            </div>
            <a
                href={`https://www.linkedin.com/in/${cleanUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-[#0077b5] transition-colors duration-200"
            >
                Visitar Perfil
                <ExternalLink size={14} />
            </a>
        </div>
    );
};

export default LinkedInBadge;