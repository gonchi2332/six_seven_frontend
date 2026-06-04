// hooks/useUserSearch.ts
import { useState, useEffect } from "react";
import { userService } from "../services/homepageService";
import type { UserSearchResult } from "../services/homepageService";

// Hook para buscar usuarios por nombre o username
export const useUserSearch = () => {
    const [query, setQuery] = useState("");
    const [allUsers, setAllUsers] = useState<UserSearchResult[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserSearchResult[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    // Obtener todos los usuarios al montar el hook
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsFetching(true);
                const data = await userService.getAllUsers();
                setAllUsers(data);
            } catch (error) {
                setAllUsers([]);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUsers();
    }, []);

    // Filtrar usuarios cuando cambia la consulta
    useEffect(() => {
        if (!query.trim()) {
            setFilteredUsers([]);
            return;
        }

        const cleanQuery = query.toLowerCase();
        const filtered = allUsers.filter((user) => {
            const fullName = `${user.names} ${user.first_surname} ${user.second_surname || ""}`.toLowerCase();
            const username = (user.username || "").toLowerCase();
            return fullName.includes(cleanQuery) || username.includes(cleanQuery);
        });

        setFilteredUsers(filtered);
    }, [query, allUsers]);

    return {
        query,
        setQuery,
        filteredUsers,
        isFetching
    };
};