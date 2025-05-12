import { PDFFormFillerBase } from './forms-base';

export class PDFFormFiller extends PDFFormFillerBase {
    public async save(fileName: string = 'survey_result.pdf') {
        const pdfBytes = await this.getPDFBytes();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }
}