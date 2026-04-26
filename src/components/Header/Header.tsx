interface Props {
  title: string;
}

const STYLES = {
    CONTAINER: "flex items-center gap-4 w-full",
    TITLE: "text-4xl font-bold font-inter mb-4 text-surface",
    LINE: "h-[3px] flex-grow bg-surface"
}

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