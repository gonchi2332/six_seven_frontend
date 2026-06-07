// Barras visuales para mostrar nivel de habilidad (0-5)
interface LevelBarsProps {
    level: number;      // Nivel actual (0-5)
    total?: number;     // Total de barras (default 5)
    size?: "sm" | "md"; // Tamaño: sm (pequeño) o md (mediano)
}

const LevelBars = ({ level, total = 5, size = "sm" }: LevelBarsProps) => {
    // Altura según tamaño
    const barHeight = size === "sm" ? "h-2 sm:h-3" : "h-4";
    return (
        <div className="flex gap-1 sm:gap-1.5 p-1 flex-1 bg-black/40 rounded-md">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`${barHeight} flex-1 rounded-sm ${i < level ? "bg-[#90DDF0]" : "bg-white/10"}`}
                />
            ))}
        </div>
    );
};
 
export default LevelBars;