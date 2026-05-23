// components/printable/PrintConfigPanel.tsx
import React from 'react';

interface PrintConfigPanelProps {
    config: {
        style: 'single-column' | 'two-columns';
        sections: {
            profile: boolean;
            skills: boolean;
            experience: boolean;
            projects: boolean;
        };
        showDate: boolean;
        showVersion: boolean;
    };
    onToggleSection: (section: keyof PrintConfigPanelProps['config']['sections']) => void;
    onToggleStyle: () => void;
    onToggleDate: () => void;
    onToggleVersion: () => void;
    onReset: () => void;
    onPrint: () => void;
}

const PrintConfigPanel: React.FC<PrintConfigPanelProps> = ({
    config,
    onToggleSection,
    onToggleStyle,
    onToggleDate,
    onToggleVersion,
    onReset,
    onPrint,
}) => {
    return (
        <div className="w-80 bg-gray-50 p-5 rounded-lg shadow-md h-fit sticky top-5">
            <h3 className="text-lg font-bold text-[#07393C] mb-4 pb-2 border-b border-gray-200">
                CONFIGURACIÓN DE EXPORTACIÓN
            </h3>

            {/* Estilo de diseño */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">ESTILO DE DISEÑO</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="radio"
                            checked={config.style === 'single-column'}
                            onChange={onToggleStyle}
                            className="text-[#2C666E]"
                        />
                        <span>COLUMNA ÚNICA</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="radio"
                            checked={config.style === 'two-columns'}
                            onChange={onToggleStyle}
                            className="text-[#2C666E]"
                        />
                        <span>DOS COLUMNAS</span>
                    </label>
                </div>
            </div>

            {/* Secciones visibles */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">SECCIONES VISIBLES</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.sections.profile}
                            onChange={() => onToggleSection('profile')}
                            className="rounded text-[#2C666E]"
                        />
                        <span>Resumen de Perfil</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.sections.skills}
                            onChange={() => onToggleSection('skills')}
                            className="rounded text-[#2C666E]"
                        />
                        <span>Matriz de Habilidades</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.sections.experience}
                            onChange={() => onToggleSection('experience')}
                            className="rounded text-[#2C666E]"
                        />
                        <span>Experiencia</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.sections.projects}
                            onChange={() => onToggleSection('projects')}
                            className="rounded text-[#2C666E]"
                        />
                        <span>Galería de Proyectos</span>
                    </label>
                </div>
            </div>

            {/* Metadatos */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">METADATOS E IMPRESIÓN</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.showDate}
                            onChange={onToggleDate}
                            className="rounded text-[#2C666E]"
                        />
                        <span>Mostrar fecha de exportación</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.showVersion}
                            onChange={onToggleVersion}
                            className="rounded text-[#2C666E]"
                        />
                        <span>Mostrar códigos de versión</span>
                    </label>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
                <button
                    onClick={onPrint}
                    className="w-full bg-[#2C666E] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1e4a50] transition-colors"
                >
                    GENERAR PORTFOLIO
                </button>
                <button
                    onClick={onReset}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                    RESTABLECER VALORES
                </button>
            </div>
        </div>
    );
};

export default PrintConfigPanel;
