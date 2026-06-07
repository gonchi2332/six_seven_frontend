// Interfaz de la respuesta de la API RestCountries
export interface RestCountryResponse {
  name: {
    common: string;
  };
  translations?: {
    spa?: {
      common: string;
    };
  };
}

// Obtiene todos los países con soporte para nombre en español
export const getCountries = async (): Promise<RestCountryResponse[]> => {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=translations,name");
  
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status}`);
  }
  
  return response.json();
};