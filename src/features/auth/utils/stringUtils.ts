export const censorEmail = (email: string): string => {
    if (!email) return email;

    const [local, domain] = email.split("@");
    if (!local || !domain) return email;

    const visible = local.slice(0, 4);
    const censored = "*".repeat(4);
    return `${visible}${censored}@${domain}`;
};
