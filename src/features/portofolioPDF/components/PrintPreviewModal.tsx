// components/printable/PrintPreviewModal.tsx
import React from 'react';
import SkillsPrintView from './SkillsPrintView';
import PrintConfigPanel from '../PrintConfigPanel';
import type { Skill } from '../../../features/skills/types/skill.types';

interface PrintPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    skills: Skill[];
    config: any;
    onToggleSection: (section: string) => void;
    onToggleStyle: () => void;
    onToggleDate: () => void;
    onToggleVersion: () => void;
    onReset: () => void;
    onPrint: () => void;
    printRef: React.RefObject<HTMLDivElement>;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
    isOpen,
    onClose,
    skills,
    config,
    onToggleSection,
    onToggleStyle,
    onToggleDate,
    onToggleVersion,
    onReset,
    onPrint,
    printRef,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-[#07393C] text-white px-6 py-4">
                        <h2 className="text-xl font-bold">Vista Previa de Impresión</h2>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white text-2xl transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex gap-6 p-6">
                        <PrintConfigPanel
                            config={config}
                            onToggleSection={onToggleSection}
                            onToggleStyle={onToggleStyle}
                            onToggleDate={onToggleDate}
                            onToggleVersion={onToggleVersion}
                            onReset={onReset}
                            onPrint={onPrint}
                        />

                        <div className="flex-1 bg-gray-100 rounded-lg border border-gray-200 overflow-y-auto max-h-[80vh] p-4">
                            <div className="print-preview scale-90 origin-top">
                                <SkillsPrintView
                                    ref={printRef}
                                    skills={skills}
                                    date={config.showDate ? new Date() : undefined}
                                    version={config.showVersion ? 'v1.0.4' : undefined}
                                    style={config.style}
                                    showDate={config.showDate}
                                    showVersion={config.showVersion}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintPreviewModal;
