import { useState, useEffect } from 'react';
import { linkedinService } from '../services/linkedInService';

// Hook para gestionar el perfil de LinkedIn del usuario
export const useLinkedin = (appUsername: string) => {
    const [linkedinUser, setLinkedinUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!appUsername) return;
            setIsLoading(true);
            try {
                const data = await linkedinService.getProfile(appUsername);
                if (data.success) {
                    setLinkedinUser(data.linkedinUsername);
                }
            } catch (err) {
                // No muestra error si simplemente no tiene perfil vinculado
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [appUsername]);

    const saveProfile = async (newLinkedinUser: string) => {
        try {
            const data = await linkedinService.updateProfile(newLinkedinUser);
            if (data.success) {
                setLinkedinUser(newLinkedinUser); // Actualiza el estado local tras guardar
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (err) {
            return { success: false, message: "Error de red" };
        }
    };

    return { linkedinUser, isLoading, saveProfile };
};