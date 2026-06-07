/*
  Interfaz que define la estructura de una habilidad (técnica o blanda):
  -name: Nombre de la habilidad (ej: "JavaScript", "Trabajo en equipo")
  -level: Nivel de dominio (1-5, donde 1 es Básico y 5 es Experto/Excelente)
  -visible: Indica si la habilidad es pública en el portafolio
  -skill_id: Identificador único de la habilidad en el sistema
*/
export interface Skill { 
  name: string;
  level: number;
  visible:boolean;
  skill_id: number;
}