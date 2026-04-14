const Navbar = () => {
  const NAVBAR = "w-full bg-secondary p-4 text-white font-inter font-bold text-xl";

    const getNameFromToken = (): string => {
    const token = localStorage.getItem("token");
    if (!token) return "Usuario";
    try {
        const part = token.split(".").at(1);
        if (!part) return "Usuario";
        const payload = JSON.parse(atob(part));
        return payload.names ?? payload.username ?? "Usuario";
    } catch {
        return "Usuario";
    }
    };
  return (
    <nav className={NAVBAR}>
      <div className="flex items-center gap-3">
        <span>{getNameFromToken()}</span>
      </div>
    </nav>
  );
};

export default Navbar;