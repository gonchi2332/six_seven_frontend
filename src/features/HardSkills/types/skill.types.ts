// Interfaz que define la estructura de una habilidad (técnica o blanda)
export interface Skill { 
  name: string;      // Nombre de la habilidad
  level: number;     // Nivel de dominio (1-5)
  visible: boolean;  // Si es pública en el portafolio
  skill_id: number;  // Identificador único
}