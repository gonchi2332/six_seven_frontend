// src/hooks/useCountries.ts
import { useState, useEffect } from 'react';
import { getCountries } from '../services/getCountries';

export const useCountries = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Llamamos a la función de tu servicio en lugar de usar fetch directamente
        const data = await getCountries();
        
        // Mapeamos para sacar el nombre en español y los ordenamos de la A a la Z
        const countryNames = data
          .map((country: any) => country.translations?.spa?.common || country.name.common)
          .sort((a: string, b: string) => a.localeCompare(b));
          
        setCountries(countryNames);
      } catch (err) {
        console.error("Error al obtener los países:", err);
        setError("No se pudieron cargar los países");
        
        // Fallback en caso de error para que el select no quede vacío
        setCountries(["Argentina", "Bolivia", "Chile", "Colombia", "México", "Perú", "Venezuela"]); 
      } finally {
        // Esto garantiza que el loading se quite, ya sea que haya éxito o error
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // ¡ESTO ES CLAVE! Retornamos los estados para que el componente los pueda usar
  return { countries, isLoading, error };
};