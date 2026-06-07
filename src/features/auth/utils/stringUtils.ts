/*
  Características:
  -Censura parcialmente un correo electrónico para mostrar solo los primeros 4 caracteres
  -El resto de la parte local se reemplaza por 4 asteriscos
  -Ejemplo: "usuario123@gmail.com" -> "usua****@gmail.com"
  -Si el email es vacío o no se puede dividir correctamente, retorna el email original sin cambios

  @ Parámetro: email - Correo electrónico a censurar
  @ Retorna: Email censurado o el original si hay error
*/
export const censorEmail = (email: string): string => {
    if (!email) return email;

    const [local, domain] = email.split("@");
    if (!local || !domain) return email;

    const visible = local.slice(0, 4);
    const censored = "*".repeat(4);
    return `${visible}${censored}@${domain}`;
};

