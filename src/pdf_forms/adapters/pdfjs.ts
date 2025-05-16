import { IPDFFormAdapter } from './adapter';
export class PDFJSAdapter implements IPDFFormAdapter {
    constructor (private pdfLibrary: any) { }
    public async fillForm(template: string, data: any) {
        const pdfjsLib = this.pdfLibrary;
        const doc = await pdfjsLib.getDocument(template).promise;
        const numPages = doc.numPages;

        // Process all pages
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await doc.getPage(pageNum);
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
        }

        return await doc.saveDocument();
    }
}
