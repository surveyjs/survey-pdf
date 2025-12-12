// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { calc } from '@csstools/css-calc';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { color } from '@csstools/css-color-parser';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { ComponentValue, parseComponentValue } from '@csstools/css-parser-algorithms';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { serializeRGB } from '@csstools/css-color-parser';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { tokenize } from '@csstools/css-tokenizer';
import { IVariablesManager } from './index';
import { rgbaToHex } from './color';
export class VariablesManager implements IVariablesManager {
    private hash: {[index: string]: number | string} | undefined;
    private variables: {[index: string]: string} | undefined;
    setup(variables: { [index: string]: string }): void {
        this.hash = {};
        this.variables = variables;
    }
    private getVariable<T>(name: string, processFunc: (str: string) => T): T {
        if (!name) return name as T;
        if(!this.variables || !this.hash) return undefined as T;
        if (!this.variables[name]) return undefined as T;
        if (this.hash[name]) return this.hash[name] as T;
        let value = this.variables[name];
        const replaceVars = (str: string) => {
            let match;
            const regex = /var\(((?:[^()]*|\((?:[^()]*|\((?:[^()]*|\((?:[^()])*\))*\))*\))*)\)/;
            while ((match = str.match(regex)) != null) {
                let [variableName, defaultValue]= match[1].split(',').map(val => val.trim());
                let variable = this.getVariable(variableName, processFunc);
                if(defaultValue) {
                    defaultValue = replaceVars(defaultValue);
                }
                str = str.replace(regex, (variable ?? defaultValue ?? '').toString());
            }
            return str;
        };
        value = replaceVars(value);
        const processedValue = processFunc ? processFunc(value) : value as T;
        this.hash[name] = processedValue as string | number;
        return processedValue;
    }
    public getSizeVariable(name: string): number {
        return this.getVariable(name, (val: string) => {
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
    public getColorVariable(name: string): string {
        return this.getVariable<string>(name, (val: string) => {
            const hwbComponentValue = parseComponentValue(tokenize({ css: val })) as ComponentValue;
            const colorData = color(hwbComponentValue);
            if (colorData) {
                const rgbComponentValue = serializeRGB(colorData);
                return rgbaToHex(rgbComponentValue.toString()) as string;
            }
            return calc(val);
        });
    }
    startCollectingVariables() {}
    stopCollectingVariables() {}
}