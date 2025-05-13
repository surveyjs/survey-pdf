import { PDFFormFillerBase } from './forms-base';
import { writeFile } from 'fs';

export class PDFFormFiller extends PDFFormFillerBase {
    public async saveToFile(pdfBytes: string, fileName: string) {
        return new Promise<void>((resolve, reject) => {
            writeFile(fileName, pdfBytes, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}