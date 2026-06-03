// hooks/useLinkedIn.ts
import { useState, useEffect } from 'react';
import { linkedinService } from '../services/linkedInService';

export const useLinkedin = (appUsername: string) => {
    const [linkedinUser, setLinkedinUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!appUsername) return;
            setIsLoading(true);
            try {
                const data = await linkedinService.getProfile(appUsername);
                // Según tu doc: success es true y linkedinUsername puede ser string o null
                if (data.success) {
                    setLinkedinUser(data.linkedinUsername);
                }
            } catch (err) {
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [appUsername]);

    const saveProfile = async (newLinkedinUser: string, token: string) => {
        try {
            const data = await linkedinService.updateProfile(newLinkedinUser, token);
            if (data.success) {
                setLinkedinUser(newLinkedinUser);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (err) {
            return { success: false, message: "Error de red" };
        }
    };

    return { linkedinUser, isLoading, saveProfile };
};
