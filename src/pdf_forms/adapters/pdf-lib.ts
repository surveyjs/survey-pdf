import { IFormAdapter } from './adapter';
export class PdfLibAdapter implements IFormAdapter {
    public async fillForm(template: string, data: any) {
        const PDFLib = (window as any).PDFLib;
        if(!PDFLib) {
            throw new Error('PDF-LIB is not loaded!');
        }
        const { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown } = PDFLib;
        const pdfDoc = await PDFDocument.load(template);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        fields.forEach((field: any) => {
            const fieldName = field.getName();
            const value = data[fieldName];
            if(value === null || value === undefined) return;
            if (field instanceof PDFTextField) {
                field.setText(value);
            }
            else if (field instanceof PDFCheckBox) {
                if (value) field.check(); else field.uncheck();
            }
            else if (field instanceof PDFRadioGroup || field instanceof PDFDropdown) {
                field.select(value.toString());
            }
        });

        return await pdfDoc.save();
    }
}
