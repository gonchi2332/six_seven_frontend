export interface RegisterFormData {
    mail: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormErrors {
    mail: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormTouched {
    mail: boolean;
    password: boolean;
    confirmPassword: boolean;
}