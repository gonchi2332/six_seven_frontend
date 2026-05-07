import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import PopUpCard from "../../../../components/PopUpCard";

const STYLES = {
    FORM_WRAPPER: "flex flex-col gap-6 px-8",
    DYNAMIC_GRID: "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min",
    TITLE: "w-1/2",

    INPUT_LABEL: "mb-1 text-xl font-inter text-white",
    SELECT: "w-full px-4 py-2 border rounded-xl outline-none transition-all duration-200 bg-white font-nunito disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    SELECT_PLACEHOLDER: "text-gray-400",
    SELECT_VALUE: "text-black",
    IMAGE_WRAPPER: "flex flex-col gap-2",
    FOOTER: "flex flex-row justify-end items-center gap-4 mt-10 pt-6 px-8",
};

const PersonalProjectsModal = () => {
    return (
        <div>
            <PopUpCard title="Agregar Proyecto Personal">
                <div className={STYLES.FORM_WRAPPER}>
                    <div className={STYLES.TITLE}>
                        <TextField
                            label="Título"
                            type="text"
                            value={"he"}
                            onChange={() => { }}
                            error={"he"}
                        />
                    </div>
                    <div className="">
                        <TextField
                            label="Descripción"
                            type="text"
                            value={"he"}
                            onChange={() => { }}
                            error={"he"}
                            className="[&_input]:h-24"
                        />
                    </div>
                    <div className={STYLES.DYNAMIC_GRID}>
                        <div>
                            <TextField
                                label="Estado"
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                            <TextField
                                label="Habilidades"
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                            <TextField
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                            <TextField
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                        </div>
                        <div>
                            <TextField
                                label="Nombre de Usuario"
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                            <TextField
                                label="Nombre de Usuario"
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                            <TextField
                                label="Nombre de Usuario"
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                        </div>
                        <div>
                            <TextField
                                label="Nombre de Usuario"
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                            <TextField
                                label="Nombre de Usuario"
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                            <TextField
                                label="Nombre de Usuario"
                                type="text"
                                value={"he"}
                                onChange={() => { }}
                                error={"he"}
                            />
                        </div>
                    </div>
                </div>
            </PopUpCard>
        </div>
    );
};


export default PersonalProjectsModal;

