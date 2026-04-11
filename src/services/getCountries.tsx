// Opcional: Puedes definir la interfaz de lo que devuelve la API para mayor tipado
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

export const getCountries = async (): Promise<RestCountryResponse[]> => {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=translations,name");
  
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status}`);
  }
  
  return response.json();
};