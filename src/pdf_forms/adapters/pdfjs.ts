import { IPDFFormAdapter } from './adapter';
export class PdfJsAdapter implements IPDFFormAdapter {
    public async fillForm(template: string, data: any) {
        const pdfjsLib = (window as any).pdfjsLib;
        if(!pdfjsLib) return null;
        const doc = await pdfjsLib.getDocument(template).promise;
        const page = await doc.getPage(1);
        const annotations = await page.getAnnotations();
        annotations.forEach((field: any) => {
            if (field.fieldType == undefined) return;
            const value = data[field.fieldName];
            if (value) {
                if(field.radioButton && field.buttonValue != value) {
                    return;
                }
                doc.annotationStorage.setValue(field.id, { value });
            }
        });

        return await doc.saveDocument();
    }
}
