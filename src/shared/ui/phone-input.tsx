import * as React from "react";
import { cn } from "@/shared/lib";
import { Combobox } from "./combobox";
import type { ComboboxOption } from "./combobox";
import { Input } from "./input";

// Country codes with their dial codes and masks
export const COUNTRY_CODES = [
    { code: "KG", dialCode: "+996", name: "Kyrgyzstan", mask: "XXX XXX XXX" }, // 9 digits
    { code: "RU", dialCode: "+7", name: "Russia", mask: "XXX XXX XX XX" }, // 10 digits
    { code: "US", dialCode: "+1", name: "United States", mask: "XXX XXX XXXX" }, // 10 digits
    { code: "GB", dialCode: "+44", name: "United Kingdom", mask: "XXXX XXXXXX" }, // 10 digits
    { code: "DE", dialCode: "+49", name: "Germany", mask: "XXX XXXXXXX" }, // 10 digits
    { code: "FR", dialCode: "+33", name: "France", mask: "X XX XX XX XX" }, // 9 digits
    { code: "TR", dialCode: "+90", name: "Turkey", mask: "XXX XXX XX XX" }, // 10 digits
    { code: "KZ", dialCode: "+7", name: "Kazakhstan", mask: "XXX XXX XX XX" }, // 10 digits
    { code: "UA", dialCode: "+380", name: "Ukraine", mask: "XX XXX XX XX" }, // 9 digits
    { code: "UZ", dialCode: "+998", name: "Uzbekistan", mask: "XX XXX XX XX" }, // 9 digits
] as const;

export interface PhoneInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
    value?: string;
    onChange?: (value: string) => void;
    defaultCountry?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ className, value = "", onChange, defaultCountry = "KG", disabled, ...props }, ref) => {
        // Parse the value to extract country code and number
        const parsePhoneNumber = (phoneValue: string) => {
            if (!phoneValue || !phoneValue.startsWith("+")) {
                return { dialCode: COUNTRY_CODES.find(c => c.code === defaultCountry)?.dialCode || "+996", number: "" };
            }

            // Find matching country code
            const matchingCountry = COUNTRY_CODES.find(c => phoneValue.startsWith(c.dialCode));
            if (matchingCountry) {
                return {
                    dialCode: matchingCountry.dialCode,
                    number: phoneValue.slice(matchingCountry.dialCode.length).replace(/\s/g, "")
                };
            }

            // Fallback to default country
            return { dialCode: COUNTRY_CODES.find(c => c.code === defaultCountry)?.dialCode || "+996", number: "" };
        };

        const { dialCode: initialDialCode, number: initialNumber } = parsePhoneNumber(value);
        const [selectedDialCode, setSelectedDialCode] = React.useState(initialDialCode);
        const [phoneNumber, setPhoneNumber] = React.useState(initialNumber);

        // Update state when value prop changes (but preserve country selection if number is empty)
        React.useEffect(() => {
            if (!value || value === "") {
                // If value is empty, only clear the number but keep the selected country
                setPhoneNumber("");
            } else {
                const { dialCode, number } = parsePhoneNumber(value);
                setSelectedDialCode(dialCode);
                setPhoneNumber(number);
            }
        }, [value]);

        const selectedCountry = COUNTRY_CODES.find(c => c.dialCode === selectedDialCode);

        // Format phone number according to mask
        const formatPhoneNumber = (input: string, mask: string) => {
            const digits = input.replace(/\D/g, "");
            let formatted = "";
            let digitIndex = 0;

            for (const char of mask) {
                if (digitIndex >= digits.length) break;
                if (char === "X") {
                    formatted += digits[digitIndex];
                    digitIndex++;
                } else {
                    formatted += char;
                }
            }

            return formatted;
        };

        // Get max digits from mask
        const getMaxDigits = (mask: string) => {
            return mask.replace(/[^X]/g, "").length;
        };

        const handleCountryChange = (newDialCode: string) => {
            setSelectedDialCode(newDialCode as typeof COUNTRY_CODES[number]["dialCode"]);

            // Clear the number when changing country
            setPhoneNumber("");

            // Notify parent with just the dial code
            onChange?.(newDialCode);
        };

        const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target.value.replace(/\D/g, ""); // Remove non-digits
            const maxDigits = selectedCountry ? getMaxDigits(selectedCountry.mask) : 15;

            // Limit to max digits
            const limitedInput = input.slice(0, maxDigits);

            setPhoneNumber(limitedInput);

            // Combine dial code and number for E.164 format
            const fullNumber = limitedInput ? `${selectedDialCode}${limitedInput}` : "";
            onChange?.(fullNumber);
        };

        const displayValue = selectedCountry && phoneNumber
            ? formatPhoneNumber(phoneNumber, selectedCountry.mask)
            : phoneNumber;

        // Convert country codes to combobox options
        const countryOptions: ComboboxOption[] = React.useMemo(
            () =>
                COUNTRY_CODES.map((country) => ({
                    value: country.dialCode,
                    label: `${country.dialCode} ${country.code}`,
                    description: country.name,
                })),
            [],
        );

        return (
            <div className={cn("flex gap-2", className)}>
                <Combobox
                    value={selectedDialCode}
                    onChange={handleCountryChange}
                    options={countryOptions}
                    disabled={disabled}
                    className="w-auto min-w-[140px]"
                    aria-label="Country code"
                />
                <Input
                    {...props}
                    ref={ref}
                    type="tel"
                    value={displayValue}
                    onChange={handleNumberChange}
                    disabled={disabled}
                    className="flex-1"
                    placeholder={selectedCountry?.mask.replace(/X/g, "0")}
                />
            </div>
        );
    }
);

PhoneInput.displayName = "PhoneInput";
