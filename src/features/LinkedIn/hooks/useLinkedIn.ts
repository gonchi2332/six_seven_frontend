// hooks/useLinkedIn.ts
import { useState, useEffect } from 'react';
import { linkedinService } from '../services/linkedInService';

/*
  Características:
  -Hook personalizado que gestiona el perfil de LinkedIn del usuario
  -Carga automáticamente el perfil cuando cambia appUsername
  -Maneja estado de carga (isLoading) y el nombre de usuario de LinkedIn
  -saveProfile: actualiza el perfil de LinkedIn del usuario

  @ Parámetro: appUsername - Nombre de usuario de la aplicación (dueño del perfil)
  @ Retorna:
  -linkedinUser: Nombre de usuario de LinkedIn (null si no hay o no existe)
  -isLoading: Estado de carga
  -saveProfile: Función para guardar/actualizar el perfil de LinkedIn

  @ Ejemplo:
  const { linkedinUser, isLoading, saveProfile } = useLinkedin("juanperez");
  
  // Guardar nuevo perfil
  const result = await saveProfile("anahisu");
  if (result.success) {
    console.log("Perfil actualizado");
  }
*/
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
                // Error silencioso, no se muestra al usuario
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [appUsername]);

    /*
      Actualiza el perfil de LinkedIn del usuario
      @ Parámetro: newLinkedinUser - Nuevo nombre de usuario de LinkedIn
      @ Retorna: Object con success (boolean) y message (string opcional)
    */
    const saveProfile = async (newLinkedinUser: string) => {
        try {
            const data = await linkedinService.updateProfile(newLinkedinUser);
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

