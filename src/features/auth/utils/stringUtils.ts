// Censura el email mostrando solo los primeros 4 caracteres de la parte local
export const censorEmail = (email: string): string => {
    if (!email) return email;
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    const visible = local.slice(0, 4);
    const censored = "*".repeat(4);
    return `${visible}${censored}@${domain}`;
};