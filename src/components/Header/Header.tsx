/*
  Propiedades del componente Header:
  -title: Título que se muestra en la cabecera de la sección
*/
interface Props {
  title: string;
}

const STYLES = {
    CONTAINER: "flex items-center gap-4 w-full",
    TITLE: "text-4xl font-bold font-inter mb-4 text-surface",
    LINE: "h-[3px] flex-grow bg-surface"
}

/*
  Caracteristicas:
  -Cabecera de sección con título y línea decorativa.
  -Muestra un título a la izquierda y una línea horizontal que ocupa el espacio restante a la derecha. 
  -Útil para separar secciones dentro del portafolio.

  Ejemplo de uso:
  <Header title="Experiencia Laboral" />
*/
const Header = ({ title }: Props) => {
  return (
    <div className={STYLES.CONTAINER}>
      <h2 className={STYLES.TITLE}>
        {title}
      </h2>
      <div className={STYLES.LINE} />
    </div>
  );
};

export default Header;