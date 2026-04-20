export interface RegisterFormData {
    name: string;
    paternalLastName: string;
    username: string;
    password: string;
    confirmPassword: string;
    mail: string;

}

export interface RegisterFormErrors {
    name: string;
    paternalLastName: string;
    username: string;
    password: string;
    confirmPassword: string;
    mail: string;
}

export interface RegisterFormTouched {
    name: boolean;
    paternalLastName: boolean;
    username: boolean;
    password: boolean;
    confirmPassword: boolean;
    mail: boolean;
}