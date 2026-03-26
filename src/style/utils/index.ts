export interface IVariablesManager {
    setup(variables: { [index: string] : string}): void;
    getSizeVariable(name: string): number;
    getColorVariable(name: string): string;
    startCollectingVariables(): void;
    stopCollectingVariables(): void;
}
let variablesManagerCreator: () => IVariablesManager;
export function registerVariablesManagerCreator(creator: () => IVariablesManager) {
    variablesManagerCreator = creator;
}
export function createVariablesManager(): IVariablesManager {
    return variablesManagerCreator();
}