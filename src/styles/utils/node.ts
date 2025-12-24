import { calcFromComponentValues } from '@csstools/css-calc';
import { color, serializeRGB } from '@csstools/css-color-parser';
import { ComponentValue, parseComponentValue, parseListOfComponentValues, FunctionNode } from '@csstools/css-parser-algorithms';
import { tokenizer, stringify, CSSToken, tokenize } from '@csstools/css-tokenizer';
import { IVariablesManager } from './index';
import { rgbaToHex } from './color';

export class VariablesManager implements IVariablesManager {
    private hash: {[index: string]: string};
    private colorHash: {[index: string]: string};
    private variables: {[index: string]: string} | undefined;
    setup(variables: { [index: string]: string }): void {
        this.hash = {};
        this.colorHash = {};
        this.variables = variables;
    }
    private tokenizeString(css: string): Array<CSSToken> {
        const t = tokenizer({ css });
        const tokens = [];
        while (!t.endOfFile()) {
            tokens.push(t.nextToken());
        }
        tokens.push(t.nextToken());
        return tokens;
    }
    private splitComponentValuesByTopLevelComma(tokens: ComponentValue[]) {
        const parts = [];
        let curr = [];
        for (const tok of tokens) {
            if (tok.type == 'token' && tok.value[0] == 'comma-token') {
                parts.push(curr);
                curr = [];
            } else {
                curr.push(tok);
            }
        }
        parts.push(curr);
        return parts;
    }
    private getVariable(name: string): string {
        if (!name) return name;
        if(!this.variables || !this.hash) return undefined as string;
        if (!this.variables[name]) return undefined as string;
        if (this.hash[name]) return this.hash[name];
        let value = this.variables[name];
        const componentValues = parseListOfComponentValues(this.tokenizeString(value));
        const replaceVars = (componentValues: ComponentValue[], depth = 0) => {
            if (depth > 50) return componentValues;
            const out: ComponentValue[] = [];
            for (const componentValue of componentValues) {
                if (componentValue.type === 'function') {
                    const functionComponentValue = (componentValue as unknown as FunctionNode);
                    const lowerName = ((functionComponentValue as unknown as FunctionNode).getName()).toLowerCase();
                    if (lowerName === 'var') {
                        const inner = functionComponentValue.value || [];
                        const parts = this.splitComponentValuesByTopLevelComma(inner);
                        const nameTokens = parts[0] || [];
                        const fallbackTokens = parts.length > 1 ? parts[1] : null;
                        const variableName = nameTokens.map((x) => stringify(...x.tokens())).join('').trim();
                        let replacementTokens: ComponentValue[] = [];
                        const variableValue = this.getVariable(variableName);
                        if (!!variableValue) {
                            const componentValue = parseListOfComponentValues(this.tokenizeString(variableValue));
                            replacementTokens = componentValue;
                        } else if (fallbackTokens && fallbackTokens.length > 0) {
                            replacementTokens = replaceVars(fallbackTokens, depth + 1);
                        } else {
                            replacementTokens = [];
                        }
                        out.push(...replacementTokens);
                        continue;
                    } else {
                        const inner = functionComponentValue.value || [];
                        const resolvedInner = replaceVars(inner, depth + 1);
                        out.push(new FunctionNode(functionComponentValue.name, functionComponentValue.endToken, resolvedInner));
                        continue;
                    }
                } else {
                    out.push(componentValue);
                }
            }
            return out;
        };
        const replacedComponentValues = replaceVars(componentValues);
        const processedValue = calcFromComponentValues([replacedComponentValues])[0].map((componentValue) => stringify(...componentValue.tokens())).join('');
        this.hash[name] = processedValue;
        return processedValue;
    }
    public getSizeVariable(name: string): number {
        const valueString = this.getVariable(name);
        if(!valueString) {
            return 0;
        }
        if(valueString.match(/px$/)) {
            return Number.parseFloat(valueString) * 72.0 / 96.0;
        } else {
            return Number.parseFloat(valueString);
        }
    }
    public getColorVariable(name: string): string {
        const valueString = this.getVariable(name);
        if(!this.colorHash[valueString]) {
            const hwbComponentValue = parseComponentValue(tokenize({ css: valueString })) as ComponentValue;
            const colorData = color(hwbComponentValue);
            if (colorData) {
                const rgbComponentValue = serializeRGB(colorData);
                this.colorHash[valueString] = rgbaToHex(rgbComponentValue.toString()) as string;
            } else {
                this.colorHash[valueString] = '#000000';
            }
        }
        return this.colorHash[valueString];
    }
    startCollectingVariables() {}
    stopCollectingVariables() {}
}