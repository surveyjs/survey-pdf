export interface IPDFFormAdapter {
    fillForm(template: string, data: any): Promise<string>;
}
