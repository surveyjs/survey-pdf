import { IVariablesManager } from './index';
import { parseColorCssFunction, rgbaToHex } from './color';
export class VariablesManager implements IVariablesManager {
    private variables?: { [index: string]: string };
    private hash?: { [index: string]: string | number };
    private computedStyle?: CSSStyleDeclaration;
    private container?: HTMLElement;
    setup(variables: { [index: string]: string }): void {
        this.variables = variables;
        this.hash = {};
        this.container = document.createElement('div');
        this.container.style.display = 'none';
        Object.keys(variables).forEach(property => {
            this.container?.style.setProperty(property, variables[property]);
        });
        this.computedStyle = getComputedStyle(this.container);
    }
    startCollectingVariables() {
        if(this.container && !this.container?.isConnected) {
            document.body.appendChild(this.container);
        }
    }
    stopCollectingVariables() {
        this.container?.remove();
    }
    private getVariable<T extends number | string>(name: string, calcCallback: (variableValue: string, container: HTMLElement) => T): T {
        if(!this.container || !this.variables || !this.hash || !this.computedStyle) {
            throw new Error('VariablesManager not initialized');
        }
        if(!this.hash[name]) {
            this.hash[name] = calcCallback(this.computedStyle.getPropertyValue(name), this.container);
        }
        return this.hash[name] as T;
    }
    getSizeVariable(name: string): number {
        return this.getVariable(name, (variableValue, container) => {
            container.style.width = variableValue;
            const val = getComputedStyle(container).width;
            if(val.match(/px$/)) {
                return Number.parseFloat(val) * 72.0 / 96.0;
            } else {
                return Number.parseFloat(val);
            }
        });

    }
    getColorVariable(name: string): string {
        return this.getVariable(name, (variableValue, container) => {
            container.style.color = variableValue;
            let val = getComputedStyle(container).color;
            val = parseColorCssFunction(val);
            return rgbaToHex(val) as string;
        });
    }
}