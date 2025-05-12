import { PDFFormFillerBase } from './forms-base';
import { writeFile } from 'fs';

export class PDFFormFiller extends PDFFormFillerBase {
    public async save(fileName: string = 'survey_result.pdf') {
        const pdfBytes = await this.getPDFBytes();
        return new Promise<void>((resolve, reject) => {
            writeFile(fileName, pdfBytes, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}