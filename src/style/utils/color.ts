export function rgbaToHex(rgbaString: string) {
    const parts = rgbaString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([0-9.]+)?\)$/);
    if (!parts) {
        return null; // Invalid RGBA string format
    }
    const r = parseInt(parts[1]);
    const g = parseInt(parts[2]);
    const b = parseInt(parts[3]);
    const a = parts[4] ? parseFloat(parts[4]) : null;
    const toHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    const alphaHex = a ? toHex(Math.round(a * 255)) : '';
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
}
export function parseColorCssFunction(value: string): string {
    const regex = /color\s*\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/i;
    const match = value.match(regex);
    if (match) {
        const r = parseFloat(match[1]);
        const g = parseFloat(match[2]);
        const b = parseFloat(match[3]);
        const alpha = match[4] ? parseFloat(match[4]) : 1;

        const r255 = Math.round(r * 255);
        const g255 = Math.round(g * 255);
        const b255 = Math.round(b * 255);
        return `rgba(${r255}, ${g255}, ${b255}, ${alpha})`;
    } else {
        return value;
    }
}