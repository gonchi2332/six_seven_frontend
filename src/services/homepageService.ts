const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1/profile/users`;

export interface UserSearchResult {
    id: string | number;
    names: string;
    first_surname: string;
    second_surname?: string;
    username: string;
    profile_picture_url?: string | null;
}

export const userService = {
    getAllUsers: async (): Promise<UserSearchResult[]> => {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        return Array.isArray(data?.users) ? data.users : [];
    }
};