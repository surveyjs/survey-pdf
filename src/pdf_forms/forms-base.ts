import FormMap from './map';
import { IPDFFormAdapter } from './adapters/adapter';

/**
 * An object that configures the [`PDFFormFiller`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfformfiller) plugin.
 *
 * Pass this object to the `PDFFormFiller` constructor:
 *
 * ```js
 * const form = new PDFFormFiller.PDFFormFiller(pdfFormFillerOptions);
 *
 * // In modular applications:
 * import { PDFFormFiller } from "survey-pdf/pdf-form-filler";
 * const form = new PDFFormFiller(pdfFormFillerOptions);
 * ```
 *
 * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
 *
 * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
 */
interface IPDFFormFillerOptions {
    /**
     * An object that maps survey fields to PDF form fields. Object keys are survey field names and object values are PDF form field IDs.
     *
     * The easiest way to build a field map is to access the data object with respondent answers using the `SurveyModel`'s `data` property and replace the values with the PDF form field IDs. To find the IDs, open your PDF document in any editor that allows viewing them. Note that certain field types, such as [Checkboxes](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/), [Dynamic Matrix](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/), and [Dynamic Panel](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/) require a different configuration. Refer to the following demos code examples.
     *
     * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
     *
     * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
     */
    fieldMap?: any;
    /**
     * An object with data used to populate the PDF document.
     *
     * Use the [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model)'s [`data`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data) property to access this data object.
     *
     * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
     *
     * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
     */
    data?: any;
    /**
     * A PDF document with interactive form fields that you want to fill.
     *
     * Because this document is passed on to a third-party library, the type of accepted values depends on this library.
     *
     * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
     *
     * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
     */
    pdfTemplate?: any;
    /**
     * An adapter that serves as a bridge between the `PDFFormFiller` plugin and a specific third-party library.
     *
     * SurveyJS PDF Generator provides adapters for [`pdf-lib`](https://pdf-lib.js.org/) and [PDF.js](https://mozilla.github.io/pdf.js/) out of the box. Pass the libraries to the `PDFLibAdapter` or `PDFJSAdapter` constructor and assign the resulting instance to the `pdfLibraryAdapter` property.
     *
     * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
     *
     * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
     */
    pdfLibraryAdapter?: IPDFFormAdapter;
}
/**
 * A base class for the `PDFFormFiller` plugin.
 */
export abstract class PDFFormFillerBase {
    constructor (options: IPDFFormFillerOptions = null) {
        if(options) {
            this.data = options.data;
            this.fieldMap = options.fieldMap;
            this.pdfTemplate = options.pdfTemplate;
            this.pdfLibraryAdapter = options.pdfLibraryAdapter;
        }
    }
    /**
     * A PDF document with interactive form fields that you want to fill.
     *
     * Because this document is passed on to a third-party library, the type of accepted values depends on this library.
     *
     * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
     *
     * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
     */
    public pdfTemplate: any;
    /**
     * An object that maps survey fields to PDF form fields. Object keys are survey field names and object values are PDF form field IDs.
     *
     * The easiest way to build a field map is to access the data object with respondent answers using the `SurveyModel`'s `data` property and replace the values with the PDF form field IDs. To find the IDs, open your PDF document in any editor that allows viewing them. Note that certain field types, such as [Checkboxes](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/), [Dynamic Matrix](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/), and [Dynamic Panel](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/) require a different configuration. Refer to the following demos code examples.
     *
     * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
     *
     * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
     */
    public fieldMap: any;
    /**
     * An object with data used to populate the PDF document.
     *
     * Use the [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model)'s [`data`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data) property to access this data object.
     *
     * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
     *
     * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
     */
    public data: any;
    /**
     * An adapter that serves as a bridge between the `PDFFormFiller` plugin and a specific third-party library.
     *
     * SurveyJS PDF Generator provides adapters for [`pdf-lib`](https://pdf-lib.js.org/) and [PDF.js](https://mozilla.github.io/pdf.js/) out of the box. Pass the libraries to the `PDFLibAdapter` or `PDFJSAdapter` constructor and assign the resulting instance to the `pdfLibraryAdapter` property.
     *
     * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
     *
     * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
     */
    public pdfLibraryAdapter: IPDFFormAdapter;

    protected async getPDFBytes() {
        const map = new FormMap(this.fieldMap);
        const plainData = map.mapData(this.data);
        return await this.pdfLibraryAdapter.fillForm(this.pdfTemplate, plainData);
    }
    /**
     * An asynchronous method that allows you to get PDF content in different formats.
     * @param type *(Optional)* One of `"blob"`, `"bloburl"`, `"dataurlstring"`. Do not specify this parameter if you want to get raw PDF content as a string value.
     */
    public async raw(type?: 'blob' | 'bloburl' | 'dataurlstring') {
        const pdfBytes = await this.getPDFBytes();
        if (!type) return pdfBytes;
        if (type == 'dataurlstring') return 'data:application/pdf;base64,' + btoa(String.fromCharCode.apply(null, pdfBytes));
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        if (type == 'blob') return blob;
        if (type == 'bloburl') return URL.createObjectURL(blob);
        return pdfBytes;
    }

    protected abstract saveToFile(pdfBytes:string, fileName: string): Promise<void>;
    /**
     * An asynchronous method that starts to download the filled PDF form in the web browser.
     *
     * [View pdf-lib Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdflib/ (linkStyle))
     *
     * [View PDF.js Demo](https://surveyjs.io/pdf-generator/examples/fill-in-pdf-form-fields-using-pdfjs/ (linkStyle))
     * @param fileName *(Optional)* A file name with the ".pdf" extension. Default value: `"FilledForm.pdf"`.
     */
    public async save(fileName: string = 'FilledForm.pdf') {
        const pdfBytes = await this.getPDFBytes();
        await this.saveToFile(pdfBytes, fileName);
    }
}