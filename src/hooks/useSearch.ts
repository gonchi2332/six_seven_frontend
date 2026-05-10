import { useState } from "react";

const useSearch = <T,>(items: T[], filterFn: (item: T, query: string) => boolean) => {
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const filtered = filterFn ? items.filter((item) => filterFn(item, activeSearch)) : items;
    const handleSearch = () => setActiveSearch(searchInput);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value);
    return { searchInput, activeSearch, filtered, handleSearch, handleKeyDown, handleChange };
};

export default useSearch;