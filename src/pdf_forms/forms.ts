import { PDFFormFillerBase } from './forms-base';

/**
 * A plugin that enables you to fill interactive fields in existing PDF forms.
 *
 * This plugin requires a third-party library, such as [`pdf-lib`](https://pdf-lib.js.org/) or [PDF.js](https://mozilla.github.io/pdf.js/):
 *
 * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/map-survey-responses-to-pdf-fields-using-pdflib/ (linkStyle))
 *
 * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-with-dynamic-survey-data-using-pdfjs/ (linkStyle))
 */
export class PDFFormFiller extends PDFFormFillerBase {
    protected async saveToFile(pdfBytes: string, fileName: string) {
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