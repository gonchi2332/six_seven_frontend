/*
  Props del componente LevelBars:
  -level: Nivel actual (cantidad de barras iluminadas, de 0 a total)
  -total: Número total de barras (por defecto 5)
  -size: Tamaño de las barras - "sm" (pequeño) o "md" (mediano)
*/
interface LevelBarsProps {
    level: number;
    total?: number;
    size?: "sm" | "md";
}

/*
  Características:
  -Componente visual que representa un nivel mediante barras horizontales
  -Útil para mostrar niveles de habilidad, puntuaciones, etc.
  -Barras iluminadas: color celeste (#90DDF0)
  -Barras no iluminadas: color blanco con 10% de opacidad
  -Tamaño pequeño (sm): altura h-2 en móvil, h-3 en desktop
  -Tamaño mediano (md): altura h-4
  -Fondo semitransparente (bg-black/40) con bordes redondeados

  @ Ejemplo:
  <LevelBars level={3} total={5} size="md" />
  // Muestra 3 barras celestes y 2 grises

  @ Ejemplo en tarjeta de habilidad:
  <div className="flex items-center gap-2">
    <span>JavaScript</span>
    <LevelBars level={4} />
  </div>
*/
const LevelBars = ({ level, total = 5, size = "sm" }: LevelBarsProps) => {
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