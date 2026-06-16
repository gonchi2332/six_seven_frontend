import { MapPin, Mail, Phone } from "lucide-react";
import type { CVDocumentProps } from "../types/cv.types";
import LevelDots from "./LevelDots";

const STATUS_MAP: Record<string, string> = {
    "En proceso": "En proceso",
    "Finalizado": "Finalizado",
    "Cancelado": "Cancelado",
};

const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", { year: "numeric", month: "short" });
    } catch {
        return dateString;
    }
};

const CVDocument = ({
    username,
    personalInfo,
    education,
    workExperiences,
    projects,
    hardSkills,
    softSkills,
    certificates,
}: CVDocumentProps) => {
    const visibleCertificates = certificates.filter((c) => c.visible === true);
    const visibleWorkExperiences = workExperiences.filter((exp) => exp.visible === true);

    const fullName = personalInfo
        ? [personalInfo.names, personalInfo.first_surname, personalInfo.second_surname]
            .filter(Boolean)
            .join(" ")
        : username;

    const residence = personalInfo
        ? [personalInfo.residence_city_name, personalInfo.residence_country_name]
            .filter(Boolean)
            .join(", ")
        : null;

    return (
        <div className="
            bg-white text-gray-800 font-sans box-border overflow-hidden
            w-[210mm] min-h-[297mm] p-[14mm]
            max-sm:w-full max-sm:min-h-0 max-sm:p-4
        ">

            {/* HEADER */}
            <div className="
                flex justify-between items-start pb-4 mb-6 border-b-[3px] border-[#07393C]
                max-sm:pb-3 max-sm:mb-4
            ">
                <div className="min-w-0 flex-1">
                    <h1
                        className="
                            text-[28px] font-bold text-[#07393C] mb-1 tracking-tight min-w-0
                            [overflow-wrap:anywhere]
                            max-sm:text-[20px]
                        "
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        {fullName}
                    </h1>
                </div>
            </div>

            {/* DOS COLUMNAS → una columna en mobile */}
            <div className="flex gap-6 max-sm:flex-col max-sm:gap-0">

                {/* Columna izquierda — 3/4 */}
                <div className="w-3/4 min-w-0 max-sm:w-full">

                    {/* INFORMACIÓN PERSONAL */}
                    {personalInfo && (
                        <div className="mb-6 bg-[#F5F5F5] rounded-lg p-2.5 max-sm:mb-4">
                            <div className="grid grid-cols-3 gap-2 text-xs max-sm:grid-cols-1 max-sm:gap-1.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <MapPin size={12} className="text-[#07393C] shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[8px] text-gray-400 uppercase leading-tight">Ubicación</p>
                                        <p className="text-[10px] font-semibold text-gray-800 [overflow-wrap:anywhere] max-sm:text-[11px]">
                                            {residence || "No especificada"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 min-w-0">
                                    <Mail size={12} className="text-[#07393C] shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[8px] text-gray-400 uppercase leading-tight">Correo</p>
                                        <p className="text-[10px] font-semibold text-gray-800 [overflow-wrap:anywhere] overflow-hidden max-sm:text-[11px]">
                                            {personalInfo.contact_email || "No especificado"}
                                        </p>
                                    </div>
                                </div>

                                {personalInfo.phone_number && (
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <Phone size={12} className="text-[#07393C] shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[8px] text-gray-400 uppercase leading-tight">Teléfono</p>
                                            <p className="text-[10px] font-semibold text-gray-800 [overflow-wrap:anywhere] max-sm:text-[11px]">
                                                {personalInfo.phone_number}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* EXPERIENCIA LABORAL */}
                    {visibleWorkExperiences.length > 0 && (
                        <div className="mb-6 max-sm:mb-4">
                            <div className="flex items-center gap-3 mb-4 max-sm:mb-3">
                                <h2 className="
                                    text-[11px] font-bold tracking-[2.5px] uppercase text-[#07393C] whitespace-nowrap m-0
                                    max-sm:text-[10px]
                                ">
                                    Experiencia Laboral
                                </h2>
                                <div className="flex-1 h-px bg-[#2C666E]" />
                            </div>
                            <div className="flex flex-col gap-3">
                                {visibleWorkExperiences.map((exp) => (
                                    <div
                                        key={exp.id}
                                        className="flex justify-between items-start pb-2 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-bold text-gray-800 [overflow-wrap:anywhere] max-sm:text-[13px]">
                                                {exp.position}
                                            </p>
                                            <p className="text-[11px] text-[#2C666E] font-medium [overflow-wrap:anywhere] max-sm:text-[12px]">
                                                {exp.company_name}
                                            </p>
                                            {exp.description && (
                                                <p className="text-[9px] text-gray-500 mt-0.5 line-clamp-2 [overflow-wrap:anywhere] overflow-hidden max-sm:text-[10px]">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0 ml-3">
                                            {exp.start_date && (
                                                <p className="text-[9px] text-gray-400 whitespace-nowrap max-sm:text-[10px]">
                                                    {formatDate(exp.start_date)}{" "}
                                                    {exp.end_date ? `- ${formatDate(exp.end_date)}` : "- Actualidad"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FORMACIÓN ACADÉMICA */}
                    {education.length > 0 && (
                        <div className="mb-6 max-sm:mb-4">
                            <div className="flex items-center gap-3 mb-4 max-sm:mb-3">
                                <h2 className="
                                    text-[11px] font-bold tracking-[2.5px] uppercase text-[#07393C] whitespace-nowrap m-0
                                    max-sm:text-[10px]
                                ">
                                    Formación Académica
                                </h2>
                                <div className="flex-1 h-px bg-[#2C666E]" />
                            </div>
                            {education.map((e) => (
                                <div
                                    key={e.id}
                                    className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-bold mb-0.5 text-gray-800 [overflow-wrap:anywhere] max-sm:text-[13px]">
                                            {e.degree}
                                        </p>
                                        <p className="text-[11px] text-[#2C666E] font-semibold mb-0.5 [overflow-wrap:anywhere] max-sm:text-[12px]">
                                            {e.institution}
                                        </p>
                                        <p className="text-[10px] text-gray-400 m-0 max-sm:text-[11px]">
                                            {e.academicLevel}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                        <p className="text-[10px] text-gray-400 mb-0.5 max-sm:text-[11px]">{e.startDate}</p>
                                        <p className="text-[10px] text-[#2C666E] font-semibold m-0 max-sm:text-[11px]">{e.educationState}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PROYECTOS PERSONALES */}
                    {projects.length > 0 && (
                        <div className="mb-6 max-sm:mb-4">
                            <div className="flex items-center gap-3 mb-4 max-sm:mb-3">
                                <h2 className="
                                    text-[11px] font-bold tracking-[2.5px] uppercase text-[#07393C] whitespace-nowrap m-0
                                    max-sm:text-[10px]
                                ">
                                    Proyectos Personales
                                </h2>
                                <div className="flex-1 h-px bg-[#2C666E]" />
                            </div>
                            <div className="flex flex-col gap-3">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-[12px] font-bold text-gray-800 [overflow-wrap:anywhere] max-sm:text-[13px]">
                                                        {project.name}
                                                    </p>
                                                    <span className="text-[8px] bg-[#2C666E]/10 text-[#2C666E] px-1.5 py-0.5 rounded-full">
                                                        {STATUS_MAP[project.status] || project.status}
                                                    </span>
                                                    {project.topic && (
                                                        <span className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                                                            {project.topic}
                                                        </span>
                                                    )}
                                                </div>
                                                {project.role && (
                                                    <p className="text-[9px] text-[#2C666E] font-medium mt-0.5 [overflow-wrap:anywhere] max-sm:text-[10px]">
                                                        Rol: {project.role}
                                                    </p>
                                                )}
                                                {project.description && (
                                                    <p className="text-[9px] text-gray-500 mt-0.5 line-clamp-2 [overflow-wrap:anywhere] overflow-hidden max-sm:text-[10px]">
                                                        {project.description}
                                                    </p>
                                                )}
                                                {project.links && project.links.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {project.links.slice(0, 2).map((link, idx) => (
                                                            <span
                                                                key={`${project.id}-link-${idx}`}
                                                                className="text-[8px] text-gray-400 truncate max-w-[120px] block"
                                                            >
                                                                {link.label}
                                                            </span>
                                                        ))}
                                                        {project.links.length > 2 && (
                                                            <span className="text-[8px] text-gray-400">
                                                                +{project.links.length - 2} más
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {project.createdAt && (
                                                <p className="text-[8px] text-gray-400 shrink-0 max-sm:text-[9px]">
                                                    {formatDate(project.createdAt)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CERTIFICACIONES */}
                    {visibleCertificates.length > 0 && (
                        <div className="mb-6 max-sm:mb-4">
                            <div className="flex items-center gap-3 mb-4 max-sm:mb-3">
                                <h2 className="
                                    text-[11px] font-bold tracking-[2.5px] uppercase text-[#07393C] whitespace-nowrap m-0
                                    max-sm:text-[10px]
                                ">
                                    Certificaciones
                                </h2>
                                <div className="flex-1 h-px bg-[#2C666E]" />
                            </div>
                            <div className="flex flex-col gap-2">
                                {visibleCertificates.map((cert) => (
                                    <div
                                        key={cert.id}
                                        className="flex justify-between items-start pb-2 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-semibold text-gray-800 [overflow-wrap:anywhere] max-sm:text-[12px]">
                                                {cert.title}
                                            </p>
                                            {cert.area && (
                                                <p className="text-[9px] text-[#2C666E] [overflow-wrap:anywhere] max-sm:text-[10px]">
                                                    {cert.area}
                                                </p>
                                            )}
                                            {cert.description && (
                                                <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-1 [overflow-wrap:anywhere] overflow-hidden max-sm:text-[10px]">
                                                    {cert.description}
                                                </p>
                                            )}
                                        </div>
                                        {cert.issueDate && (
                                            <p className="text-[9px] text-gray-400 shrink-0 ml-3 max-sm:text-[10px]">
                                                {formatDate(cert.issueDate)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Estado vacío */}
                    {visibleWorkExperiences.length === 0 &&
                        education.length === 0 &&
                        projects.length === 0 &&
                        visibleCertificates.length === 0 && (
                            <p className="text-[12px] text-gray-400 text-center py-10">
                                No hay información profesional para mostrar.
                            </p>
                        )}
                </div>

                {/* Columna derecha — 1/4 → ancho completo en mobile */}
                <div className="w-1/4 min-w-0 max-sm:w-full max-sm:mt-2">

                    {/* Divisor visible solo en mobile */}
                    <div className="hidden max-sm:block mb-4">
                        <div className="h-px bg-[#07393C]" />
                    </div>

                    {/* HABILIDADES TÉCNICAS */}
                    {hardSkills.length > 0 && (
                        <div className="mb-6 max-sm:mb-4">
                            <div className="flex items-center gap-3 mb-4 max-sm:mb-3">
                                <h2 className="
                                    text-[11px] font-bold tracking-[2.5px] uppercase text-[#07393C] whitespace-nowrap m-0
                                    max-sm:text-[10px]
                                ">
                                    Habilidades Técnicas
                                </h2>
                                <div className="flex-1 h-px bg-[#2C666E]" />
                            </div>
                            <div className="flex flex-col gap-2 max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-4 max-sm:gap-y-2">
                                {hardSkills.map((s) => (
                                    <div key={s.skill_id} className="flex flex-col gap-1 min-w-0">
                                        <span className="text-[11px] font-semibold text-gray-800 [overflow-wrap:anywhere] max-sm:text-[12px]">
                                            {s.name}
                                        </span>
                                        <LevelDots level={s.level} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* HABILIDADES BLANDAS */}
                    {softSkills.length > 0 && (
                        <div className="mb-6 max-sm:mb-4">
                            <div className="flex items-center gap-3 mb-4 max-sm:mb-3">
                                <h2 className="
                                    text-[11px] font-bold tracking-[2.5px] uppercase text-[#07393C] whitespace-nowrap m-0
                                    max-sm:text-[10px]
                                ">
                                    Habilidades Blandas
                                </h2>
                                <div className="flex-1 h-px bg-[#2C666E]" />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {softSkills.map((s) => (
                                    <span
                                        key={s.skill_id}
                                        className="text-[10px] bg-[#2C666E]/10 text-[#2C666E] px-2 py-1 rounded-full font-medium [overflow-wrap:anywhere] max-sm:text-[11px]"
                                    >
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {hardSkills.length === 0 && softSkills.length === 0 && (
                        <p className="text-[10px] text-gray-400 text-center py-4">
                            No hay habilidades registradas.
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default CVDocument;
