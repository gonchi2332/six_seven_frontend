// src/features/CV/pages/CVPrintPage.tsx

import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Printer, ArrowLeft } from "lucide-react";

import { useCVData } from "../hooks/useCVData";
import CVDocument from "../components/CVDocument";

const CVPrintPage = () => {
    const username = localStorage.getItem("username") ?? "";
    const navigate = useNavigate();
    const printRef = useRef<HTMLDivElement>(null);

    const {
        education,
        softSkills,
        certificates,
        workExperiences,
        projects,
        personalInfo,
        hardSkills,
        isLoading,
    } = useCVData(username);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `CV-${username || "portfolio"}`,
        pageStyle: `
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `,
    });

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col">

            {/* Barra de control */}
            <div className="sticky top-0 z-10 bg-[#07393C] px-6 py-2.5 flex items-center justify-between shadow-lg">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-white/60 text-[13px] font-sans hover:text-white transition-colors"
                >
                    <ArrowLeft size={15} />
                    Volver
                </button>

                <div className="flex items-center gap-2">
                    <Printer size={15} className="text-[#90DDF0]" />
                    <span className="text-white text-[13px] font-semibold">
                        Vista previa
                    </span>
                </div>

                <button
                    onClick={() => handlePrint()}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 bg-[#90DDF0] text-[#07393C] rounded-lg px-4 py-2 text-[13px] font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                    <Printer size={14} />
                    {isLoading ? "Cargando..." : "Imprimir / Guardar PDF"}
                </button>
            </div>

            {/* Preview */}
            <div className="flex-1 overflow-auto p-8 flex justify-center">
                <div ref={printRef} className="shadow-2xl rounded-sm">
                    <CVDocument
                        username={username}
                        personalInfo={personalInfo}
                        education={education}
                        workExperiences={workExperiences}
                        projects={projects}
                        hardSkills={hardSkills}
                        softSkills={softSkills}
                        certificates={certificates}
                    />
                </div>
            </div>
        </div>
    );
};

export default CVPrintPage;
