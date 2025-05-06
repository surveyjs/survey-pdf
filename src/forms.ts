import FormMap from '../src/pdf_forms/map';
import { PdfLibAdapter } from './pdf_forms/adapters/pdf-lib';
import { PdfJsAdapter } from './pdf_forms/adapters/pdfjs';
import { PDFFormAdapterFactory as PDFFormAdapterFactory } from './pdf_forms/registry';

interface IPDFFormFillerOptions{
    fieldMap: any;
    data: any;
    pdfTemplate: string;
}
export class PDFFormFiller {
    constructor (options: IPDFFormFillerOptions = null) {
        if(options) {
            this.data = options.data;
            this.fieldMap = options.fieldMap;
            this.pdfTemplate = options.pdfTemplate;
        }
    }
    private async fillFormWithAnyAdapter(plainData: any) {
        const adapters = PDFFormAdapterFactory.Instance.getAdapterIdsList();
        for (let i = 0; i < adapters.length; i++) {
            const adapter = PDFFormAdapterFactory.Instance.createAdapter(adapters[i]);
            const data = await adapter.fillForm(this.pdfTemplate, plainData);
            if (data) return data;
        }
        return null;
    }
    public pdfTemplate: string;
    public fieldMap: any;
    public data: any;

    private async getPDFBytes() {
        const map = new FormMap(this.fieldMap);
        const plainData = map.mapData(this.data);
        return await this.fillFormWithAnyAdapter(plainData);
    }
    /**
     * An asynchronous method that allows you to get PDF content in different formats.
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/convert-pdf-form-blob-base64-raw-pdf-javascript/ (linkStyle))
     *
     * @param type *(Optional)* One of `"blob"`, `"bloburl"`, `"dataurlstring"`. Do not specify this parameter if you want to get raw PDF content as a string value.
     *
     */
    public async raw(type?: 'blob' | 'bloburl' | 'dataurlstring') {
        const pdfBytes = await this.getPDFBytes();
        if (!type) return pdfBytes;
        if (type == 'dataurlstring') return 'data:text/plain;base64,' + btoa(pdfBytes);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        if (type == 'blob') return blob;
        if (type == 'bloburl') return URL.createObjectURL(blob);
        return pdfBytes;
    }
    /**
     * An asynchronous method that starts download of the generated PDF file in the web browser.
     *
     * @param fileName *(Optional)* A file name with the ".pdf" extension. Default value: `"survey_result.pdf"`.
     */
    public async save(filename: string = 'survey_result.pdf') {
        const pdfBytes = await this.getPDFBytes();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
    }
}
PDFFormAdapterFactory.Instance.registerAdapter('pdf-lib', PdfLibAdapter);
PDFFormAdapterFactory.Instance.registerAdapter('pdfjs', PdfJsAdapter);