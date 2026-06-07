// Opcional: Puedes definir la interfaz de lo que devuelve la API para mayor tipado

/*
  Interfaz que define la estructura de la respuesta de la API de RestCountries:
  -name: Objeto con el nombre del país (common: nombre común en inglés)
  -translations: Traducciones del nombre a diferentes idiomas (español disponible en spa.common)
*/
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

/*
  Características:
  -Función que obtiene la lista de países desde la API pública RestCountries
  -Endpoint: https://restcountries.com/v3.1/all?fields=translations,name
  -Solicita solo los campos name y translations (para optimizar la respuesta)
  -Si la respuesta no es exitosa, lanza un error con el código de estado
  -Útil para llenar selectores de país en formularios (ej: país de residencia)

  @ Retorna: Promise con array de RestCountryResponse
  @ Lanza: Error si la solicitud falla

  @ Ejemplo:
  const countries = await getCountries();
  const countryNames = countries.map(c => c.translations?.spa?.common || c.name.common);
  // ["Argentina", "México", "España", ...]
*/
export const getCountries = async (): Promise<RestCountryResponse[]> => {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=translations,name");
  
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status}`);
  }
  
  return response.json();
};