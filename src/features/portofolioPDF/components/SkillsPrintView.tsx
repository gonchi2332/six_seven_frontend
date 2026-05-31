// components/printable/SkillsPrintView.tsx
import { forwardRef } from 'react';
import type { Skill } from '../../../features/skills/types/skill.types';

interface SkillsPrintViewProps {
    skills: Skill[];
    date?: Date;
    version?: string;
    style?: 'single-column' | 'two-columns';
    showDate?: boolean;
    showVersion?: boolean;
}

const SkillsPrintView = forwardRef<HTMLDivElement, SkillsPrintViewProps>(
    ({ skills, date = new Date(), version = 'v1.0.4', style = 'two-columns', showDate = true, showVersion = true }, ref) => {

        const sortedSkills = [...skills].sort((a, b) => b.level - a.level);

        // Dividir en columnas para diseño de dos columnas
        const midPoint = Math.ceil(sortedSkills.length / 2);
        const leftColumn = sortedSkills.slice(0, midPoint);
        const rightColumn = sortedSkills.slice(midPoint);

        return (
            <div ref={ref} className="print:bg-white print:p-0 max-w-[1200px] mx-auto p-5 bg-white text-gray-900 font-['Inter','Nunito',sans-serif]">

                {/* Encabezado */}
                <div className="text-center mb-8 pb-5 border-b-2 border-[#2C666E]">
                    <h1 className="text-3xl font-bold text-[#07393C] mb-2">Ignacio Jaldín Janko</h1>
                    <p className="text-lg text-[#2C666E] mb-3">Matriz de Habilidades Técnicas</p>
                    <div className="text-xs text-gray-600 bg-gray-100 inline-block px-3 py-1 rounded-full">
                        Estándar A4 • {Math.ceil(sortedSkills.length / 12)} Páginas • Borrador {version}
                    </div>
                </div>

                {/* Metadatos */}
                {(showDate || showVersion) && (
                    <div className="flex justify-between bg-gray-50 p-3 rounded-lg mb-8 text-xs text-gray-600 border border-gray-200">
                        {showDate && (
                            <div className="flex items-center gap-2">
                                <span>📅</span>
                                <span>Fecha de exportación: {date.toLocaleDateString('es-ES')}</span>
                            </div>
                        )}
                        {showVersion && (
                            <div className="flex items-center gap-2">
                                <span>🔖</span>
                                <span>Código de versión: {version}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Matriz de Habilidades */}
                <div className="mb-10 print:break-inside-avoid">
                    <h2 className="text-xl font-semibold text-[#07393C] border-l-4 border-[#2C666E] pl-3 mb-5">
                        📊 MATRIZ DE HABILIDADES
                    </h2>

                    {style === 'two-columns' ? (
                        <div className="flex gap-10 justify-between print:gap-10">
                            {/* Columna izquierda */}
                            <div className="flex-1">
                                {leftColumn.map((skill) => (
                                    <div key={skill.skill_id} className="mb-5 print:break-inside-avoid">
                                        <div className="flex justify-between mb-1.5 text-sm">
                                            <span className="font-medium text-gray-800">{skill.name}</span>
                                            <span className="text-[#2C666E] font-semibold">{skill.level}/100</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#2C666E] to-[#90DDF0] rounded-full"
                                                style={{ width: `${skill.level}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Columna derecha */}
                            <div className="flex-1">
                                {rightColumn.map((skill) => (
                                    <div key={skill.skill_id} className="mb-5 print:break-inside-avoid">
                                        <div className="flex justify-between mb-1.5 text-sm">
                                            <span className="font-medium text-gray-800">{skill.name}</span>
                                            <span className="text-[#2C666E] font-semibold">{skill.level}/100</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#2C666E] to-[#90DDF0] rounded-full"
                                                style={{ width: `${skill.level}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Columna única
                        <div>
                            {sortedSkills.map((skill) => (
                                <div key={skill.skill_id} className="mb-5 print:break-inside-avoid">
                                    <div className="flex justify-between mb-1.5 text-sm">
                                        <span className="font-medium text-gray-800">{skill.name}</span>
                                        <span className="text-[#2C666E] font-semibold">{skill.level}/100</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#2C666E] to-[#90DDF0] rounded-full"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Resumen de habilidades por nivel */}
                <div className="mb-10 print:break-inside-avoid">
                    <h2 className="text-xl font-semibold text-[#07393C] border-l-4 border-[#2C666E] pl-3 mb-5">
                        📈 RESUMEN DE NIVELES
                    </h2>
                    <div className="flex gap-5 justify-around bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <div className="flex flex-col items-center gap-2 text-sm">
                            <span className="font-medium text-[#07393C]">🚀 Avanzado (80-100%)</span>
                            <span className="text-2xl font-bold text-[#2C666E]">
                                {sortedSkills.filter(s => s.level >= 80).length}
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-sm">
                            <span className="font-medium text-[#07393C]">📘 Intermedio (50-79%)</span>
                            <span className="text-2xl font-bold text-[#2C666E]">
                                {sortedSkills.filter(s => s.level >= 50 && s.level < 80).length}
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-sm">
                            <span className="font-medium text-[#07393C]">📗 Básico (0-49%)</span>
                            <span className="text-2xl font-bold text-[#2C666E]">
                                {sortedSkills.filter(s => s.level < 50).length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-5 text-center text-xs text-gray-400 border-t border-gray-200">
                    <p>Documento generado automáticamente • {date.toLocaleString('es-ES')}</p>
                </div>
            </div>
        );
    }
);

SkillsPrintView.displayName = 'SkillsPrintView';

export default SkillsPrintView;
