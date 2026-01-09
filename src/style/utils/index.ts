export interface IVariablesManager {
    setup(variables: { [index: string] : string}): void;
    getSizeVariable(name: string): number;
    getColorVariable(name: string): string;
    startCollectingVariables(): void;
    stopCollectingVariables(): void;
}
let variablesManager: IVariablesManager;
export function registerVariablesManager(val: IVariablesManager) {
    variablesManager = val;
}
export function getVariablesManager(): IVariablesManager {
    return variablesManager;
}