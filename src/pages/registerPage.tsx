import TextField from "../components/TextField";
import { useState } from "react";
import Button from "../components/Button";
import Logo from"../assets/pictureTis1.jpeg";
const RegisterPage = () => {
    const [formData, setFormData] = useState({
        mail:"",
        password:"",
        confirmPassword:""
    });

    const [errors, setErrors] = useState({
        mail:"",
        password:"",
        confirmPassword:""
    });
     const [touched, setTouched] = useState({
        mail: false,
        password: false,
        confirmPassword: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const validateMail =(mail:string)=>{
        if(!mail) return "El correo es requerido";
        const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!mailRegex.test(mail)) return "El correo no es válido";
        return "";
    };
    const validatePassword =(password:string)=>{
        if(!password) return "La contraseña es requerida";
        if(password.length < 8) return "La contraseña debe tener al menos 6 caracteres";
        return "";
    };
    const validateConfirmPassword =(password:string, confirm:string)=>{
        if(!password) return "La confirmación de contraseña es requerida";
         if(password !== confirm) return "Las contraseñas no coinciden";
         return "";
    };
    const handleMailChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;
        setFormData(prev=>({...prev, mail:value}));
        if(touched.mail){
            const error = validateMail(value);
            setErrors(prev=>({...prev, mail:error}));

        }
    };

    const handlePasswordChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;
        setFormData(prev=>({...prev, password:value}));
        if(touched.password){
            const error = validatePassword(value);
            setErrors(prev=>({...prev, password:error}));
        }
        if (touched.confirmPassword && formData.confirmPassword) {
            const confirmError = validateConfirmPassword(value, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };    
    const handleConfirmPasswordChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;
        setFormData(prev=>({...prev, confirmPassword:value}));
        if(touched.confirmPassword){
            const error = validateConfirmPassword(formData.password, value);
            setErrors(prev=>({...prev, confirmPassword:error}));
        }
    };
    const handleMailBlur =()=>{
        if(!touched.mail){
            setTouched(prev=>({...prev, mail:true}));
            const error = validateMail(formData.mail);
            setErrors(prev=>({...prev, mail:error}));
        }
    };
    const handlePasswordBlur =()=>{
        if(!touched.password){
            setTouched(prev=>({...prev, password:true}));
            const error = validatePassword(formData.password);
            setErrors(prev=>({...prev, password:error}));
        }
    };
    const handleConfirmPasswordBlur =()=>{
        if(!touched.confirmPassword){
            setTouched(prev=>({...prev, confirmPassword:true}));
            const error = validateConfirmPassword(formData.password, formData.confirmPassword);
            setErrors(prev=>({...prev, confirmPassword:error}));
        }

    };
    const handleSubmit =(e:React.FormEvent)=>{
        e.preventDefault();
        setTouched({mail:true, password:true, confirmPassword:true});
        const mailError = validateMail(formData.mail);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

        setErrors({mail:mailError,
             password:passwordError,
              confirmPassword:confirmPasswordError
        }); 

        if(mailError || passwordError || confirmPasswordError) return;
        setIsLoading(true);
        //ACA FALTA LA PUTA MADREEEE, NO QUIERO HACER BAAAACK xd
    };
    //fondo
    const CONTAINER = "min-h-screen bg-main flex items-center stretch";
    const IMAGE_SECTION = "hidden lg:flex lg:w-1/2 bg-cover bg-center";
    const FORM_SECTION = "w-full lg:w-1/2 flex items-center justify-center p-8";
    const FORM_CARD = "w-full max-w-md";
    const FORM_SPACING = "space-y-6";
    //tipografia
    const TITLE = "text-3xl font-bold text-left text-surface font-inter";
    const LINK_TEXT = "text-center text-sm text-surface font-nunito";
    const LINK_ANCHOR = "text-accent hover:text-accent/80 font-medium transition-colors font-nunito";
    // resto
    const FIELD_WRAPPER = "w-full";
    const BUTTON_WRAPPER = "flex justify-center";
    return(
        <div className={CONTAINER}>
            <div className = {IMAGE_SECTION}>
                <img
                    src ={ Logo}
                    alt = "Imagen de fondo"
                    className="w-3/4 h-3/4 object-cover"
                />
            </div>
            <div className={FORM_SECTION}>
                <div className ={FORM_CARD}>
                    <form onSubmit={handleSubmit}>
                        <div className={FORM_SPACING}>
                            <h1 className={TITLE}>
                                Empieza a construir tu Portafolio
                            </h1>
                            <div onBlur={handleMailBlur} className={FIELD_WRAPPER}>
                                <TextField
                                    label="Correo electrónico"
                                    type ="email"
                                    value = {formData.mail}
                                    onChange={handleMailChange}
                                    error={touched.mail ? errors.mail : ""}
                                    />
                            </div>
                            <div onBlur={handlePasswordBlur} className={FIELD_WRAPPER}>
                                <TextField
                                    label="Contraseña"
                                    type="password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    error={touched.password ? errors.password : ""}
                                />
                            </div>
                            <div onBlur={handleConfirmPasswordBlur} className={FIELD_WRAPPER}>
                                <TextField
                                    label="Confirmar contraseña"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    error={touched.confirmPassword ? errors.confirmPassword : ""}
                                />
                            </div>
                           <div className={BUTTON_WRAPPER}>
                                <Button type="submit" variant="primary">
                                    Registrate
                                </Button>
                           </div>
                            <p className={LINK_TEXT}>
                                ¿Ya tienes una cuenta?{" "}
                                <a href="/login" className={LINK_ANCHOR}>
                                    Inicia sesión
                                </a>

                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

};
export default RegisterPage;
