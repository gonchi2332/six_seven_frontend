import TextField from "../../../components/TextField";
import Button from "../../../components/Button";
import PopUpCard from "../../../components/PopUpCard";

interface UserData {
    firstName: string;
    paternalLastName: string;
    maternalLastName: string;
    address: string;
    email: string;
    phone: string;
    country: string;
}

// de momento estan asi pq no tenemos rutas
interface ShowPersonalInfoCardProps {
    data: UserData;
    onEdit: () => void;
    onLogout: () => void;
}

const ShowPersonalInfoCard = ({
    data,
    onEdit,
    onLogout,
}: ShowPersonalInfoCardProps) => {
    return (
        <div>
            <PopUpCard title={"Perfil"}>
                <div>
                    <div className="flex flex-col gap-6 px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TextField
                                label="Nombres:"
                                value={data.firstName}
                                onChange={() => { }}
                                className="w-full"
                                disabled={true}
                            />
                            <TextField
                                label="Apellido Paterno:"
                                value={data.paternalLastName}
                                onChange={() => { }}
                                className="w-full"
                                disabled={true}
                            />
                            <TextField
                                label="Apellido Materno:"
                                value={data.maternalLastName}
                                onChange={() => { }}
                                className="w-full"
                                disabled={true}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TextField
                                label="Dirección:"
                                value={data.address}
                                onChange={() => { }}
                                className="w-full"
                                disabled={true}
                            />
                            <TextField
                                label="Correo de contacto:"
                                value={data.email}
                                onChange={() => { }}
                                type="email"
                                className="w-full"
                                disabled={true}
                            />
                            <TextField
                                label="Teléfono:"
                                value={data.phone}
                                onChange={() => { }}
                                type="text"
                                className="w-full"
                                disabled={true}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TextField
                                label="País de residencia:"
                                value={data.country}
                                onChange={() => { }}
                                className="w-full"
                                disabled={true}
                            />
                            {/* espacios vacios para que el input no se estire mucho, si se anaden mas botones borrar estos */}
                            <div className="hidden md:block"></div>
                            <div className="hidden md:block"></div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end items-center gap-4 mt-10 pt-6 px-8">
                        <Button variant="secondary" onClick={onLogout}>
                            Cerrar Sesión
                        </Button>
                        <Button variant="primary" onClick={onEdit}>
                            Editar
                        </Button>
                    </div>
                </div>
            </PopUpCard>
        </div>
    );
};

export default ShowPersonalInfoCard;
