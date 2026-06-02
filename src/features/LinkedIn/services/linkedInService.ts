// services/linkedinService.ts
const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api/v1/platforms/users`;

export const linkedinService = {
  // GET: Obtener perfil
  getProfile: async (username: string) => {
    const response = await fetch(`${BASE_URL}/${username}/linkedin`);
    return await response.json();
  },

  // PUT: Registrar o modificar
  updateProfile: async (linkedinUsername: string, token: string) => {
    // CORRECCIÓN: La URL base ya contiene la ruta, no la repitas
    const response = await fetch(`${BASE_URL}/linkedin`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ linkedinUsername }),
    });
    return await response.json();
  }
};