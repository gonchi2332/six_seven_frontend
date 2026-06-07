import type React from "react";

interface PopUpCardProps {
    title: string;
    children?: React.ReactNode;
}

const PopUpCard = ({ title, children }: PopUpCardProps) => {
    return (
        <div className="bg-primary rounded-xl pb-4 w-full max-w-5xl mx-auto shadow-2xl">
            {/* Cabecera con título y línea divisoria */}
            <div className="mb-8 border-b-2 border-surface pb-4 w-full">
                <h2 className="text-3xl font-bold text-surface text-center font-inter align-center pt-4 px-6">
                    {title}
                </h2>
            </div>
            <div className="w-full">{children}</div>
        </div>
    );
};

export default PopUpCard;