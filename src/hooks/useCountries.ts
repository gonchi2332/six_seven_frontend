// src/hooks/useCountries.ts
import { useState, useEffect } from 'react';
import { getCountries } from '../services/getCountries';

// Hook para obtener y manejar la lista de paises
export const useCountries = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar paises al montar el hook
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

  // Retornamos los estados para que el componente los pueda usar
  return { countries, isLoading, error };
};