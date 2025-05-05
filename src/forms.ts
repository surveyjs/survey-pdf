import FormMap from '../src/pdf_forms/map';
import { IPDFFormAdapter as IPDFFormAdapter } from './pdf_forms/adapters/adapter';
import { PdfLibAdapter } from './pdf_forms/adapters/pdf-lib';
import { PdfJsAdapter } from './pdf_forms/adapters/pdfjs';
import { PDFFormAdapterFactory as PDFFormAdapterFactory } from './pdf_forms/registry';

interface IPDFFormFillerOptions{
    fieldMap: any;
    data: any;
    pdfTemplate: string;
}
export class PDFFormFiller {
    private adapter: IPDFFormAdapter
    constructor (options: IPDFFormFillerOptions) {
        this.data = options.data;
        this.fieldMap = options.fieldMap;
        this.pdfTemplate = options.pdfTemplate;
    }
    private async fillFormWithAnyAdapter(plainData: any) {
        const adapters = PDFFormAdapterFactory.Instance.getAdapterIdsList();
        for (let i = 0; i < adapters.length; i++) {
            const adapter = PDFFormAdapterFactory.Instance.createAdapter(adapters[0]);
            const data = await adapter.fillForm(this.pdfTemplate, plainData);
            if (data) return data;
        }
    }
    public pdfTemplate: string;
    public fieldMap: any;
    public data: any;
    public async raw() {
    }
    public async save(filename: string) {
        const map = new FormMap(this.fieldMap);
        const plainData = map.mapData(this.data);
        const pdfBytes = await this.fillFormWithAnyAdapter(plainData);
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