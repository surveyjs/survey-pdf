// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { calc } from '@csstools/css-calc';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { color } from '@csstools/css-color-parser';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { parseComponentValue } from '@csstools/css-parser-algorithms';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { serializeRGB } from '@csstools/css-color-parser';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { tokenize } from '@csstools/css-tokenizer';

export function getVariable<T>(variables: {[index: string]: string}, hash: {[index: string]: T}, name: string, processFunc: (str: string) => T): T {
    if (!name) return name as T;
    if (!variables[name]) return undefined;
    if (hash[name]) return hash[name];
    let value = variables[name];
    const replaceVars = (str: string) => {
        let match;
        const regex = /var\(((?:[^()]*|\((?:[^()]*|\((?:[^()]*|\((?:[^()])*\))*\))*\))*)\)/;
        while ((match = str.match(regex)) != null) {
            let [variableName, defaultValue]= match[1].split(',').map(val => val.trim());
            let variable = getVariable(variables, hash, variableName, processFunc);
            if(defaultValue) {
                defaultValue = replaceVars(defaultValue);
            }
            str = str.replace(regex, (variable ?? defaultValue ?? '').toString());
        }
        return str;
    };
    value = replaceVars(value);
    const processedValue = processFunc ? processFunc(value) : value as T;
    hash[name] = processedValue;
    return processedValue;
}

function rgbaToHex(rgbaString: string) {
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
export function getColorVariable(variables: {[index: string]: string}, hash: {[index: string]: any}, name: string): string {
    return getVariable<string>(variables, hash, name, (val: string) => {
        const hwbComponentValue = parseComponentValue(tokenize({ css: val }));
        const colorData = color(hwbComponentValue);
        if (colorData) {
            const rgbComponentValue = serializeRGB(colorData);
            return rgbaToHex(rgbComponentValue.toString());
        }
        return calc(val);
    });
}
export function getSizeVariable(variables: {[index: string]: string}, hash: {[index: string]: any}, name: string): number {
    return getVariable(variables, hash, name, (val: string) => {
        if(typeof val == 'undefined') {
            return 0;
        }
        val = calc(val);
        if(val.match(/px$/)) {
            return Number.parseFloat(val) * 72.0 / 96.0;
        } else {
            return Number.parseFloat(val);
        }
    }) ?? 0;
}