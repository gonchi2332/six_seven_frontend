import { useCountries } from '../../../hooks/useCountries';
import Button from '../../../components/Button';
import TextField from '../../../components/TextField';
import { useAddInfoForm } from '../../../hooks/useAddInfoForm';

// Campos que se pueden agregar (los que pueden estar vacíos)
type AvailableField = 'secondSurname' | 'city' | 'email' | 'phone' | 'country';

interface FieldOption {
    value: AvailableField;
    label: string;
    placeholder: string;
    type?: 'text' | 'email';
}

const fieldOptions: FieldOption[] = [
    { value: 'secondSurname', label: 'Segundo Apellido', placeholder: 'Ej: Pérez', type: 'text' },
    { value: 'city', label: 'Ciudad', placeholder: 'Ej: La Paz', type: 'text' },
    { value: 'email', label: 'Correo electrónico', placeholder: 'Ej: juan@ejemplo.com', type: 'email' },
    { value: 'phone', label: 'Teléfono', placeholder: 'Ej: +591 77123456', type: 'text' },
    { value: 'country', label: 'País de residencia', placeholder: 'Selecciona un país', type: 'text' },
];

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