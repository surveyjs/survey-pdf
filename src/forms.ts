import FormMap from '../src/pdf_forms/map';
import { IFormAdapter } from './pdf_forms/adapters/adapter';
import { PdfLibAdapter } from './pdf_forms/adapters/pdf-lib';
import { FormAdaptersFactory } from './pdf_forms/registry';
export class Forms {
    private adapter: IFormAdapter
    constructor (adapterId: string) {
        this.adapter = FormAdaptersFactory.Instance.createAdapter(adapterId);
    }
    public template: string;
    public map: any;
    public data: any;
    public async save(filename: string) {
        const map = new FormMap(this.map);
        const plainData = map.mapData(this.data);
        const pdfBytes = await this.adapter.fillForm(this.template, plainData);
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
FormAdaptersFactory.Instance.registerAdapter('pdf-lib', PdfLibAdapter);