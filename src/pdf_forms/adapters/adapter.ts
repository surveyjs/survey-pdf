export interface IFormAdapter {
    fillForm(templateUrl: string, data: any): Promise<Uint8Array>;
}
