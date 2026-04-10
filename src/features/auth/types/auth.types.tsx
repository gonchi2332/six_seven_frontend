export interface RegisterFormData {
    name: string;
    paternalLastName: string;
    maternalLastName?: string;
    username: string;
    password: string;
    confirmPassword: string;

}

export interface RegisterFormErrors {
    name: string;
    paternalLastName: string;
    maternalLastName?: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormTouched {
    name: boolean;
    paternalLastName: boolean;
    maternalLastName?: boolean;
    username: boolean;
    password: boolean;
    confirmPassword: boolean;
}