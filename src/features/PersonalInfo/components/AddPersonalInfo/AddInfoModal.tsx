import { useCountries } from '../../../../hooks/useCountries';
import Button from '../../../../components/Button';
import TextField from '../../../../components/TextField';
import { useAddInfoForm } from '../../hooks/useAddInfoForm';

/*
  Tipos de campos que se pueden agregar en el formulario:
  -secondSurname: Segundo apellido (opcional)
  -city: Ciudad de residencia
  -email: Correo electrónico de contacto
  -phone: Número de teléfono
  -country: País de residencia
*/
type AvailableField = 'secondSurname' | 'city' | 'email' | 'phone' | 'country';

/*
  Estructura de opción de campo:
  -value: Identificador del campo
  -label: Etiqueta mostrada al usuario
  -placeholder: Texto de ayuda en el input
  -type: Tipo de input (text o email)
*/
interface FieldOption {
    value: AvailableField;
    label: string;
    placeholder: string;
    type?: 'text' | 'email';
}

/*
  Lista de opciones disponibles para agregar información personal
*/
const fieldOptions: FieldOption[] = [
    { value: 'secondSurname', label: 'Segundo apellido', placeholder: 'Ej: Pérez', type: 'text' },
    { value: 'city', label: 'Ciudad', placeholder: 'Ej: La Paz', type: 'text' },
    { value: 'email', label: 'Correo de contacto', placeholder: 'Ej: juan@ejemplo.com', type: 'email' },
    { value: 'phone', label: 'Teléfono', placeholder: 'Ej: +591 77123456', type: 'text' },
    { value: 'country', label: 'País de residencia', placeholder: 'Selecciona un país', type: 'text' },
];

/*
  Props del componente AddInfoModal:
  -isOpen: Controla si el modal es visible
  -onClose: Función ejecutada al cerrar el modal
  -onAdd: Función para agregar el campo, recibe el campo y el valor
  -emptyFields: Lista de campos que aún no tiene el usuario (se pueden agregar)
*/
interface AddInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (field: AvailableField, value: string) => Promise<void>;
    emptyFields: AvailableField[];
}

const styles = {
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto",
    container: "min-h-screen flex items-center justify-center p-4",
    modal: "bg-primary rounded-2xl p-6 w-full max-w-md mx-auto",
    title: "text-2xl font-bold text-surface font-inter mb-4",
    label: "block text-surface font-nunito mb-1",
    select: "w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-nunito bg-white",
    buttonContainer: "flex gap-3 mt-6",
};

/*
  Características:
  -Modal para agregar campos faltantes de información personal
  -Muestra un selector con los campos que el usuario aún no tiene registrados
  -Soporta diferentes tipos de campos: texto, email, país (con selector)
  -Para el campo "país", utiliza un selector con lista de países (useCountries)
  -Validaciones según tipo de campo (email, etc.)
  -Muestra mensajes de error si el campo es inválido o ya existe
  -Botón Registrar deshabilitado mientras se valida o se envía

  @ Ejemplo:
  <AddInfoModal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    onAdd={handleAddField}
    emptyFields={['city', 'phone', 'email']}
  />
*/
const AddInfoModal = ({ isOpen, onClose, onAdd, emptyFields }: AddInfoModalProps) => {
    const { countries, isLoading: countriesLoading } = useCountries();

    const {
        selectedField,
        value,
        isSubmitting,
        error,
        fieldError,
        handleFieldChange,
        handleValueChange,
        handleSubmit,
        handleClose,
        isSubmitDisabled,
    } = useAddInfoForm({ onAdd, onClose });

    const availableOptions = fieldOptions.filter(opt => emptyFields.includes(opt.value));
    const selectedOption = fieldOptions.find(opt => opt.value === selectedField);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modal}>
                    <h2 className={styles.title}>Registrar Información Personal</h2>

                    <label className={styles.label}>Campo a registrar</label>
                    <select
                        value={selectedField}
                        onChange={handleFieldChange}
                        className={styles.select}
                    >
                        <option value="" disabled>Selecciona un campo</option>
                        {availableOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {selectedField && (
                        <div className="mt-4">
                            <label className={styles.label}>
                                {selectedOption?.label}
                            </label>
                            {selectedField === 'country' ? (
                                <select
                                    value={value}
                                    onChange={(e) => handleValueChange(e.target.value)}
                                    className={styles.select}
                                    disabled={countriesLoading}
                                >
                                    <option value="" disabled>Selecciona un país</option>
                                    {countries.map((country) => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            ) : (
                                <TextField
                                    value={value}
                                    onChange={(e) => handleValueChange(e.target.value)}
                                    placeholder={selectedOption?.placeholder}
                                    type={selectedOption?.type}
                                    error={fieldError || undefined}
                                    className="w-full"
                                />
                            )}
                        </div>
                    )}

                    {(error || (selectedField && !fieldError && !value && error)) && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}

                    <div className={styles.buttonContainer}>
                        <Button variant="secondary" onClick={handleClose} fullWidth>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled()}
                            fullWidth
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrar'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInfoModal;

