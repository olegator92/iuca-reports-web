import { cn } from "@/shared/lib";

interface SliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    className?: string;
}

export const Slider = ({ value, min, max, step = 1, onChange, className }: SliderProps) => {
    const percent = ((value - min) / (max - min)) * 100;

    return (
        <div className={cn("relative flex items-center w-full h-5", className)}>
            <div className="relative w-full h-1.5 rounded-full bg-muted overflow-visible">
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-brand"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={cn(
                    "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
                    "min-h-0"
                )}
            />
            <div
                className="absolute w-4 h-4 rounded-full bg-brand border-2 border-background shadow-sm pointer-events-none"
                style={{ left: `calc(${percent}% - 8px)` }}
            />
        </div>
    );
};
