import { forwardRef } from "react";
import type { EducationEntry } from "../../Education/services/educationService";

interface Props {
    entries: EducationEntry[];
    username?: string;
}

const stateColors: Record<string, string> = {
    Culminado: "#16a34a",
    "En curso": "#2563eb",
    Abandonado: "#dc2626",
};

const EducationPrintView = forwardRef<HTMLDivElement, Props>(({ entries, username }, ref) => {
    const today = new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div
            ref={ref}
            style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                backgroundColor: "#ffffff",
                color: "#111827",
                padding: "40px 48px",
                minHeight: "100vh",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div style={{ borderBottom: "3px solid #07393C", paddingBottom: "20px", marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#6b7280", margin: "0 0 6px 0", fontFamily: "sans-serif" }}>
                            Portafolio Profesional
                        </p>
                        <h1 style={{ fontSize: "26px", fontWeight: "bold", margin: 0, color: "#07393C" }}>
                            Formación Académica
                        </h1>
                        {username && (
                            <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0 0", fontFamily: "sans-serif" }}>
                                @{username}
                            </p>
                        )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, fontFamily: "sans-serif" }}>
                            Generado el
                        </p>
                        <p style={{ fontSize: "12px", color: "#374151", margin: "2px 0 0 0", fontFamily: "sans-serif" }}>
                            {today}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "24px", marginBottom: "32px" }}>
                {[
                    { label: "Total de registros", value: entries.length },
                    { label: "Culminados", value: entries.filter(e => e.educationState === "Culminado").length },
                    { label: "En curso", value: entries.filter(e => e.educationState === "En curso").length },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            flex: 1,
                            backgroundColor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            textAlign: "center",
                        }}
                    >
                        <p style={{ fontSize: "22px", fontWeight: "bold", margin: 0, color: "#07393C" }}>
                            {stat.value}
                        </p>
                        <p style={{ fontSize: "11px", color: "#6b7280", margin: "4px 0 0 0", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", fontFamily: "sans-serif" }}>
                <thead>
                    <tr style={{ backgroundColor: "#07393C" }}>
                        {["#", "Título / Grado", "Nivel Académico", "Institución", "Año", "Estado"].map((col) => (
                            <th
                                key={col}
                                style={{
                                    padding: "10px 14px",
                                    textAlign: "left",
                                    color: "#ffffff",
                                    fontWeight: "600",
                                    fontSize: "12px",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, i) => (
                        <tr
                            key={entry.id}
                            style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f0fdfa" }}
                        >
                            <td style={{ padding: "10px 14px", color: "#9ca3af", width: "32px" }}>{i + 1}</td>
                            <td style={{ padding: "10px 14px", fontWeight: "600", color: "#111827" }}>{entry.degree}</td>
                            <td style={{ padding: "10px 14px", color: "#374151" }}>{entry.academicLevel}</td>
                            <td style={{ padding: "10px 14px", color: "#374151" }}>{entry.institution}</td>
                            <td style={{ padding: "10px 14px", color: "#374151" }}>{entry.startDate}</td>
                            <td style={{ padding: "10px 14px" }}>
                                <span style={{
                                    display: "inline-block",
                                    padding: "2px 10px",
                                    borderRadius: "999px",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    color: stateColors[entry.educationState] ?? "#374151",
                                    backgroundColor: `${stateColors[entry.educationState] ?? "#374151"}18`,
                                    border: `1px solid ${stateColors[entry.educationState] ?? "#374151"}40`,
                                }}>
                                    {entry.educationState}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Divider line at bottom */}
            <div style={{ marginTop: "40px", borderTop: "1px solid #e5e7eb", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, fontFamily: "sans-serif" }}>
                    Documento generado automáticamente — no requiere firma
                </p>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, fontFamily: "sans-serif" }}>
                    {entries.length} registro{entries.length !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
});

EducationPrintView.displayName = "EducationPrintView";
export default EducationPrintView;
