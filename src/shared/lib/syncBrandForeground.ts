const LUMINANCE_THRESHOLD = 0.6;
const DARK_TEXT = "hsl(0 0% 5%)";
const LIGHT_TEXT = "hsl(0 0% 100%)";

type RGB = [number, number, number];

let parsingContext: CanvasRenderingContext2D | null = null;

const getParsingContext = () => {
    if (typeof document === "undefined") {
        return null;
    }

    if (parsingContext) {
        return parsingContext;
    }

    const canvas = document.createElement("canvas");
    parsingContext = canvas.getContext("2d");
    return parsingContext;
};

const hexToRgb = (value: string): RGB | null => {
    const hex = value.slice(1);
    if (![3, 4, 6, 8].includes(hex.length)) {
        return null;
    }

    const normalized =
        hex.length === 3 || hex.length === 4
            ? hex
                  .split("")
                  .map((char) => char + char)
                  .join("")
            : hex;

    const rgbHex = normalized.slice(0, 6);

    const int = parseInt(rgbHex, 16);
    if (Number.isNaN(int)) {
        return null;
    }

    return [
        (int >> 16) & 255,
        (int >> 8) & 255,
        int & 255,
    ];
};

const rgbStringToRgb = (value: string): RGB | null => {
    const match = value
        .replace(/\s+/g, "")
        .match(/rgba?\(([\d.]+),([\d.]+),([\d.]+)(?:,[\d.]+)?\)/i);

    if (!match) {
        return null;
    }

    const [, r, g, b] = match;
    return [Number(r), Number(g), Number(b)];
};

const parseColorToRgb = (value: string): RGB | null => {
    const ctx = getParsingContext();
    if (!ctx) {
        return null;
    }

    try {
        ctx.fillStyle = value;
    } catch {
        return null;
    }

    const normalized = ctx.fillStyle;
    if (!normalized) {
        return null;
    }

    if (normalized.startsWith("#")) {
        return hexToRgb(normalized);
    }

    if (normalized.startsWith("rgb")) {
        return rgbStringToRgb(normalized);
    }

    return null;
};

const srgbChannelToLinear = (value: number) => {
    const normalized = value / 255;
    if (normalized <= 0.04045) {
        return normalized / 12.92;
    }

    return ((normalized + 0.055) / 1.055) ** 2.4;
};

const getRelativeLuminance = ([r, g, b]: RGB) => {
    const red = srgbChannelToLinear(r);
    const green = srgbChannelToLinear(g);
    const blue = srgbChannelToLinear(b);

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const syncBrandForeground = () => {
    if (typeof window === "undefined") {
        return;
    }

    const root = window.document.documentElement;
    const computedStyle = window.getComputedStyle(root);
    const brandValue = computedStyle.getPropertyValue("--brand").trim();

    if (!brandValue) {
        return;
    }

    const rgb = parseColorToRgb(brandValue);
    if (!rgb) {
        return;
    }

    const luminance = getRelativeLuminance(rgb);
    const isLight = luminance >= LUMINANCE_THRESHOLD;
    const foregroundColor = isLight ? DARK_TEXT : LIGHT_TEXT;

    root.style.setProperty("--brand-foreground", foregroundColor);
    root.dataset.brandTone = isLight ? "light" : "dark";
};
