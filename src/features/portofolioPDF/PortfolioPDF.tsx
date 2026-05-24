import { PDFDownloadLink, Document, Page, View, Text } from '@react-pdf/renderer';
import { useSkills } from '../../hooks/useSkills'; // tu hook real
import { PDFSkillsSection } from './components/PDFSkillsSection';
// ...resto de imports

// El documento recibe los skills como prop
const PortfolioDocument = ({ skills }: { skills: Skill[] }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header, About, Experience... */}
            <PDFSkillsSection skills={skills} />
            {/* Projects... */}
        </Page>
    </Document>
);

// El botón consume el hook y pasa los datos
export const DownloadPortfolioPDF = () => {
    const { skills, isLoading } = useSkills();

    if (isLoading) return (
        <button disabled className="px-4 py-2 bg-teal-600/50 text-white rounded-md text-sm">
            Cargando...
        </button>
    );
    const bul = true;
    return (
        <PDFDownloadLink
            document={<PortfolioDocument skills={skills} />}
            fileName="portfolio.pdf"
        >
            {({ bul }) => (
                <button
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Generando...' : 'Descargar CV'}
                </button>
            )}
        </PDFDownloadLink>
    );
};
