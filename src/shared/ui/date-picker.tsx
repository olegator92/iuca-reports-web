import { Input } from "./input";
import { forwardRef } from "react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onChange, className, disabled, min, max }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        disabled={disabled}
        min={min}
        max={max}
      />
    );
  }
);

DatePicker.displayName = "DatePicker";
