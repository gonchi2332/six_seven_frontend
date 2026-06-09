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