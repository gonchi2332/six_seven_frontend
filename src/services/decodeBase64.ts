/*
  Características:
  -Función que decodifica y procesa la imagen de perfil proveniente del backend
  -Maneja dos formatos posibles:
    1. Objeto Multer con buffer.data (estructura de archivo subido)
    2. String base64 directo
  -Si recibe un objeto Multer, convierte el buffer a Blob y crea una URL de objeto
  -Si recibe un string base64, lo devuelve tal cual
  -Si no hay imagen o hay error, retorna null

  @ Parámetro: raw - String base64 o null desde el backend
  @ Retorna: URL de objeto (blob) para usar en <img>, o el base64 original, o null

  @ Ejemplo:
  const avatarUrl = parseProfilePicture(userInfo.profile_picture);
  <img src={avatarUrl} alt="Avatar" />
*/
export const parseProfilePicture = (raw: string | null): string | null => {
  if (!raw) return null;

  try {
    // Decodifica el base64 que viene del backend
    const decoded = atob(raw.replace("data:image/jpeg;base64,", ""));
    const parsed = JSON.parse(decoded);

    // Verifica si es el objeto de Multer con buffer.data
    if (parsed?.buffer?.data) {
      const uint8Array = new Uint8Array(parsed.buffer.data);
      const blob = new Blob([uint8Array], {
        type: parsed.mimetype ?? "image/jpeg",
      });
      return URL.createObjectURL(blob);
    }

    // Si ya es una imagen base64 normal, la devuelve tal cual
    return raw;
  } catch {
    // Si no se puede parsear, asumir que es base64 válido
    return raw;
  }
};