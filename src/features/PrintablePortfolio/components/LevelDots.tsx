
interface LevelDotsProps {
    level: number;
}

const LevelDots = ({ level }: LevelDotsProps) => (
    <div className="flex gap-0.5 items-center">
        {[1, 2, 3, 4, 5].map((n) => (
            <div
                key={n}
                className={`w-4 h-1 rounded-sm ${n <= level ? "bg-[#07393C]" : "bg-gray-200"}`}
            />
        ))}
    </div>
);

export default LevelDots;
