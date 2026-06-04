// hooks/useSearch.ts
import { useState } from "react";

// Hook generico para manejar busqueda en listas
const useSearch = <T,>(items: T[], filterFn: (item: T, query: string) => boolean) => {
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    
    // Filtrar items usando la funcion proporcionada
    const filtered = filterFn ? items.filter((item) => filterFn(item, activeSearch)) : items;
    
    // Ejecutar la busqueda
    const handleSearch = () => setActiveSearch(searchInput);
    
    // Manejar tecla Enter para buscar
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };
    
    // Manejar cambio en el input de busqueda
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value);
    
    return { searchInput, activeSearch, filtered, handleSearch, handleKeyDown, handleChange };
};

export default useSearch;