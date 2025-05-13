import FormMap from './map';
import { IPDFFormAdapter } from './adapters/adapter';
import { writeFileSync } from 'fs';

interface IPDFFormFillerOptions{
    fieldMap: any;
    data: any;
    pdfTemplate: string;
    pdfLibraryAdapter: IPDFFormAdapter;
}
export abstract class PDFFormFillerBase {
    constructor (options: IPDFFormFillerOptions = null) {
        if(options) {
            this.data = options.data;
            this.fieldMap = options.fieldMap;
            this.pdfTemplate = options.pdfTemplate;
            this.pdfLibraryAdapter = options.pdfLibraryAdapter;
        }
    }
    public pdfTemplate: string;
    public fieldMap: any;
    public data: any;
    public pdfLibraryAdapter: IPDFFormAdapter;

    protected async getPDFBytes() {
        const map = new FormMap(this.fieldMap);
        const plainData = map.mapData(this.data);
        return await this.pdfLibraryAdapter.fillForm(this.pdfTemplate, plainData);
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

    protected abstract saveToFile(pdfBytes:string, fileName: string): Promise<void>;
    /**
     * An asynchronous method that starts download of the generated PDF file in the web browser.
     *
     * @param fileName *(Optional)* A file name with the ".pdf" extension. Default value: `"survey_result.pdf"`.
     */
    public async save(fileName: string = 'survey_result.pdf') {
        const pdfBytes = await this.getPDFBytes();
        await this.saveToFile(pdfBytes, fileName);
    }
}