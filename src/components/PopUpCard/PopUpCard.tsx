import type React from "react";

/*
  Propiedades del componente PopUpCard:
  -title: Título que se muestra en la cabecera del popup
  -children: Contenido interno que se renderiza dentro del popup
*/
interface PopUpCardProps {
    title: string;
    children?: React.ReactNode;
}

/*
  Caracteristicas:
  -Tarjeta emergente reutilizable para modales y popups.
  -Muestra un título centrado con un borde inferior, y el contenido dinámico (children) se renderiza debajo. Tiene fondo primario, bordes redondeados y una sombra pronunciada.

  Ejemplo de uso:
  <PopUpCard title="Eliminar">
    <p>¿Estás seguro?</p>
  </PopUpCard>
*/
const PopUpCard = ({ title, children }: PopUpCardProps) => {
    return (
        <div className="bg-primary rounded-xl pb-4 w-full max-w-5xl mx-auto shadow-2xl">
            <div className="mb-8 border-b-2 border-surface pb-4 w-full">
                <h2 className="text-3xl font-bold text-surface text-center font-inter align-center pt-4 px-6">
                    {title}
                </h2>
            </div>
            <div className="w-full">{children}</div>
        </div>
    );
};

export default PopUpCard;
