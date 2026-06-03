// hooks/usePrintableView.ts
import { useRef, useState } from 'react';
// import { useReactToPrint } from 'react-to-print';

interface PrintConfig {
    style: 'single-column' | 'two-columns';
    sections: {
        profile: boolean;
        skills: boolean;
        experience: boolean;
        projects: boolean;
    };
    showDate: boolean;
    showVersion: boolean;
}

export const usePrintableView = (defaultConfig?: Partial<PrintConfig>) => {
    const printRef = useRef<HTMLDivElement>(null);
    const [config, setConfig] = useState<PrintConfig>({
        style: 'two-columns',
        sections: {
            profile: true,
            skills: true,
            experience: true,
            projects: true,
        },
        showDate: true,
        showVersion: true,
        ...defaultConfig,
    });

    // Mock print handler since react-to-print is not installed
    const handlePrint = () => {
        console.log('Impresión mock - instale react-to-print para habilitar');
    };

    const updateConfig = (newConfig: Partial<PrintConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const toggleSection = (section: keyof PrintConfig['sections']) => {
        setConfig(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [section]: !prev.sections[section],
            },
        }));
    };

    const toggleStyle = () => {
        setConfig(prev => ({
            ...prev,
            style: prev.style === 'single-column' ? 'two-columns' : 'single-column',
        }));
    };

    return {
        printRef,
        config,
        handlePrint,
        updateConfig,
        toggleSection,
        toggleStyle,
    };
};
