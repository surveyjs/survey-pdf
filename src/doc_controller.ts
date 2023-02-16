import { jsPDF, jsPDFOptions } from 'jspdf';
import { IHTMLRenderType } from './flat_layout/flat_html';
import { SurveyHelper } from './helper_survey';
import { LocalizableString } from 'survey-core';
// import Fonts from './fonts';
import setRadioAppearance from './jspdf_plugins/acroform';
import './jspdf_plugins/acroform.js';
import './jspdf_plugins/from_html.js';

export interface IPoint {
    xLeft: number;
    yTop: number;
}
export interface IRect extends IPoint {
    xRight: number;
    yBot: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IMarginLR {
    left?: number;
    right?: number;
}
export interface IMargin extends IMarginLR {
    top?: number;
    bot?: number;
}
/**
 * PDF document configuration. Pass it as the second argument to the `SurveyPDF` constructor:
 *
 * ```js
 * const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);
 * 
 * // In modular applications:
 * import { SurveyPDF } from "survey-pdf";
 * const surveyPdf = new SurveyPDF(surveyJson, pdfDocOptions);
 * ```
 */
export interface IDocOptions {
    /**
     * Page orientation.
     * 
     * Accepted values:
     *
     * - `"p"` (default) - Portrait orientation.
     * - `"l"` - Landscape orientation.
     *
     * @see format
     */
    orientation?: 'p' | 'l';

    /**
     * Page format.
     * 
     * Accepted values:
     *
     * - `"a0"` - `"a10"` (`"a4"` is default)
     * - `"b0"` - `"b10"`
     * - `"c0"` - `"c10"`
     * - `"dl"`
     * - `"letter"`
     * - `"government-letter"`
     * - `"legal"`
     * - `"junior-legal"`
     * - `"ledger"`
     * - `"tabloid"`
     * - `"credit-card"`
     * - Array<Number> - custom page size in millimeters, for example, `[210.0, 297.0]`.
     *
     * @see orientation
     */
    format?: string | number[];

    /**
     * Font size in points.
     *
     * @see fontName
     */
    fontSize?: number;

    /**
     * Font name.
     * 
     * Accepted values:
     *
     * - `"Helvetica"` (default)
     * - `"Courier"`
     * - `"Times"`
     * - `"Symbol"`
     * - `"ZapfDingbats"`
     * - `"Segoe"` (requires [additional configuration](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts))
     * - [Custom font name](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts#use-custom-font)
     *
     * @see fontSize
     */
    fontName?: string;

    base64Normal?: string;
    base64Bold?: string;
    useCustomFontInHtml?: boolean;

    /**
     * Page margins. Set this property to an object with the following fields: `top`, `bottom`, `left`, `right`.
     */
    margins?: IMargin;

    commercial?: boolean;

    /**
     * Removes watermarks from the exported document.
     *
     * > You can enable this property only if you have a SurveyJS PDF Generator [commercial license](https://surveyjs.io/pricing). It is illegal to enable this property without a license.
     */
    haveCommercialLicense?: boolean;

    /**
     * Specifies how to render [HTML questions](https://surveyjs.io/Documentation/Library?id=questionhtmlmodel) into PDF.
     * 
     * Accepted values:
     *
     * - `"standard"` - Render HTML questions as selectable text.
     * - `"image"` - Render HTML questions as images.
     * - `"auto"` (default) - Select between the `"standard"` and `"image"` modes automatically based on the HTML content.
     *
     * You can override this property for an individual HTML question. Set the question's `renderAs` property to `"standard"` or `"image"` in the survey JSON schema.
     */
    htmlRenderAs?: IHTMLRenderType;

    /**
     * Specifies how to render [Matrix](https://surveyjs.io/Documentation/Library?id=questionmatrixmodel), [Matrix Dropdown](https://surveyjs.io/Documentation/Library?id=questionmatrixdropdownmodel), and [Matrix Dynamic](https://surveyjs.io/Documentation/Library?id=questionmatrixdynamicmodel) questions into PDF.
     *
     * Accepted values:
     *
     * - `"list"` - Render matrix-like questions as lists.
     * - `"auto"` (default) - Render matrix-like questions as tables if they fit into the available space. Otherwise, render the questions as lists.
     *
     * You can override this property for an individual matrix-like question. Set the question's `renderAs` property to `"list"` in the survey JSON schema.
     */
    matrixRenderAs?: 'auto' | 'list';
    useLegacyBooleanRendering?: boolean;
    /**
     * Specifies how to render read-only questions.
     * 
     * Accepted values:
     *
     * - `"text"` - Render read-only questions as plain text and custom primitives.
     * - `"acroform"` - Use Acrobat Forms (AcroForms) to render questions that support them. Other questions are rendered in `"text"` mode.
     * - `"auto"` (default) - Prefer the `"text"` mode but use `"acroform"` for File question type and links.
     */
    readonlyRenderAs?: 'auto' | 'text' | 'acroform';

    textFieldRenderAs?: 'singleLine' | 'multiLine';

    /**
     * Specifies whether to compress the PDF document. Compressed documents do not support [custom fonts](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts#use-custom-font).
     */
    compress?: boolean;

    /**
     * Specifies whether to apply the [imageFit](https://surveyjs.io/Documentation/Library?id=questionimagemodel#imageFit) property to exported [Image](https://surveyjs.io/Documentation/Library?id=questionimagemodel) questions.
     * 
     * If you enable the `applyImageFit` property, the quality of images may be lower because they pass through several conversions. If `applyImageFit` is disabled, exported images fill the entire container and do not preserve their aspect ratio, but their quality remains the same because they are exported as is.
     */
    applyImageFit?: boolean;
}
/**
 * Contains a set of options that affect the appearance of a PDF document rendered by SurveyPDF.
 */
export class DocOptions implements IDocOptions {
    public static readonly MM_TO_PT = 72 / 25.4;
    public static readonly FONT_SIZE = 14;
    protected _orientation: 'l' | 'p';
    protected _format: string | number[];
    protected _fontSize: number;
    protected _fontName: string;
    public static SEGOE_NORMAL: string;
    public static SEGOE_BOLD: string;
    protected _base64Normal: string = undefined;
    protected _base64Bold: string = undefined;
    protected _useCustomFontInHtml: boolean;
    protected _margins: IMargin;
    protected _htmlRenderAs: IHTMLRenderType;
    protected _matrixRenderAs: 'auto' | 'list';
    protected _readonlyRenderAs: 'auto' | 'text' | 'acroform';
    protected _textFieldRenderAs: 'singleLine' | 'multiLine';
    protected _compress: boolean;
    protected _applyImageFit: boolean;
    protected _useLegacyBooleanRendering: boolean
    public constructor(options: IDocOptions) {
        if (typeof options.orientation === 'undefined') {
            if (typeof options.format === 'undefined' ||
                options.format[0] < options.format[1]) {
                this._orientation = 'p';
            }
            else this._orientation = 'l';
        }
        else this._orientation = options.orientation;
        this._format = options.format || 'a4';
        if (Array.isArray(this._format)) {
            this._format = this._format.map(f => f * DocOptions.MM_TO_PT);
        }
        this._fontSize = options.fontSize || DocOptions.FONT_SIZE;
        if(!options.fontName) {
            if(!DocOptions.SEGOE_BOLD && !DocOptions.SEGOE_NORMAL) {
                this._fontName = SurveyHelper.STANDARD_FONT;
            } else {
                this._fontName = 'segoe';
            }
        } else {
            this._fontName = options.fontName;
        }
        if ((typeof options.fontName !== 'undefined' &&
            (typeof options.base64Normal !== 'undefined' ||
                typeof options.base64Bold !== 'undefined'))) {
            this._base64Normal = options.base64Normal || options.base64Bold;
            this._base64Bold = options.base64Bold || options.base64Normal;
        }
        else if (this.fontName === 'segoe') {
            // this._base64Normal = Fonts.SEGOE_NORMAL;
            // this._base64Bold = Fonts.SEGOE_BOLD;
            this._base64Normal = DocOptions.SEGOE_NORMAL;
            this._base64Bold = DocOptions.SEGOE_BOLD;
        }
        this._useCustomFontInHtml = options.useCustomFontInHtml && typeof options.base64Normal !== 'undefined';
        this._margins = SurveyHelper.clone(options.margins);
        if (typeof this._margins === 'undefined') {
            this._margins = {};
        }
        if (typeof this._margins.top === 'undefined') {
            this._margins.top = 10.0;
        }
        if (typeof this._margins.bot === 'undefined') {
            this._margins.bot = 10.0;
        }
        if (typeof this._margins.left === 'undefined') {
            this._margins.left = 10.0;
        }
        if (typeof this._margins.right === 'undefined') {
            this._margins.right = 10.0;
        }
        Object.keys(this._margins).forEach((name: string) => {
            (<any>this._margins)[name] = (<any>this._margins)[name] * DocOptions.MM_TO_PT;
        });
        this._htmlRenderAs = options.htmlRenderAs || 'auto';
        this._matrixRenderAs = options.matrixRenderAs || 'auto';
        this._readonlyRenderAs = options.readonlyRenderAs || 'auto';
        this._textFieldRenderAs = options.textFieldRenderAs || 'singleLine';
        this._compress = options.compress || false;
        this._applyImageFit = options.applyImageFit || false;
        this._useLegacyBooleanRendering = options.useLegacyBooleanRendering || false;
    }
    public get leftTopPoint(): IPoint {
        return {
            xLeft: this.margins.left,
            yTop: this.margins.top
        };
    }
    public get fontSize(): number {
        return this._fontSize;
    }
    public get fontName(): string {
        return this._fontName;
    }
    public get base64Normal(): string {
        return this._base64Normal;
    }
    public get base64Bold(): string {
        return this._base64Bold;
    }
    public get useCustomFontInHtml(): boolean {
        return this._useCustomFontInHtml;
    }
    public get margins(): IMargin {
        return this._margins;
    }
    public get format(): string | number[] {
        return this._format;
    }
    public get orientation(): 'l' | 'p' {
        return this._orientation;
    }
    public get htmlRenderAs(): IHTMLRenderType {
        return this._htmlRenderAs;
    }
    public get matrixRenderAs(): 'auto' | 'list' {
        return this._matrixRenderAs;
    }
    public get readonlyRenderAs(): 'auto' | 'text' | 'acroform' {
        return this._readonlyRenderAs;
    }
    public get textFieldRenderAs(): 'singleLine' | 'multiLine' {
        return this._textFieldRenderAs;
    }
    public get compress(): boolean {
        return this._compress;
    }
    public get applyImageFit(): boolean {
        return this._applyImageFit;
    }
    public get useLegacyBooleanRendering(): boolean {
        return this._useLegacyBooleanRendering;
    }
}

export class DocController extends DocOptions {
    private _doc: jsPDF;
    private _helperDoc: jsPDF;
    private _fontStyle: string;
    private marginsStack: IMarginLR[];
    public constructor(options: IDocOptions = {}) {
        super(options);
        const jspdfOptions: jsPDFOptions = {
            orientation: this.orientation,
            unit: 'pt', format: this.format, compress: this.compress
        };
        this._doc = new jsPDF(jspdfOptions);
        if (typeof this.base64Normal !== 'undefined' && !SurveyHelper.isFontExist(this, this.fontName)) {
            DocController.addFont(this.fontName, this.base64Normal, 'normal');
            DocController.addFont(this.fontName, this.base64Bold, 'bold');
            this._doc = new jsPDF(jspdfOptions);
        }
        setRadioAppearance(this._doc);
        this._helperDoc = new jsPDF(jspdfOptions);
        this._doc.setFont(this.fontName);
        this._helperDoc.setFont(this.fontName);
        this._doc.setFontSize(this.fontSize);
        this._helperDoc.setFontSize(this.fontSize);
        this._fontStyle = 'normal';
        this.marginsStack = [];
    }
    public static customFonts: { [name: string]: { normal: string, bold: string, italic: string, bolditalic: string } } = {};
    public static addFont(fontName: string, base64: string, fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic') {
        let font = DocController.customFonts[fontName];
        if (!font) {
            font = <any>{};
            DocController.customFonts[fontName] = font;
        }
        font[fontStyle] = base64;
        const addFontCallback: () => void = function () {
            const customFont = DocController.customFonts[fontName];
            if (!!customFont && !!customFont[fontStyle]) {
                const fontFile: string = `${fontName}-${fontStyle}.ttf`;
                this.addFileToVFS(fontFile, customFont[fontStyle]);
                this.addFont(fontFile, fontName, fontStyle);
            }
        };
        (<any>jsPDF).API.events.push(['addFonts', addFontCallback]);
    }
    public get doc(): any {
        return this._doc;
    }
    public get helperDoc(): any {
        return this._helperDoc;
    }
    public get fontName(): string {
        return this._fontName;
    }
    public set fontName(fontName: string) {
        this._fontName = fontName;
        this._doc.setFont(fontName);
        this._helperDoc.setFont(fontName);
    }
    public get fontSize(): number {
        return this._fontSize;
    }
    public set fontSize(fontSize: number) {
        this._fontSize = fontSize;
        this._doc.setFontSize(fontSize);
        this._helperDoc.setFontSize(fontSize);
    }
    public get fontStyle(): string {
        return this._fontStyle;
    }
    public set fontStyle(fontStyle: string) {
        this._fontStyle = fontStyle;
        this._doc.setFont(this._fontName, fontStyle);
        this._helperDoc.setFont(this._fontName, fontStyle);
    }
    public measureText(text: string | LocalizableString | number = 1, fontStyle: string = this._fontStyle,
        fontSize: number = this._fontSize): ISize {
        const oldFontSize: number = this._helperDoc.getFontSize();
        this._helperDoc.setFontSize(fontSize);
        this._helperDoc.setFont(this._fontName, fontStyle);
        const height: number = this._helperDoc.getLineHeight() / this._helperDoc.internal.scaleFactor;
        let width: number = 0.0;
        if (typeof text === 'number') {
            width = height * text;
        }
        else {
            text = typeof text === 'string' ? text : SurveyHelper.getLocString(text);
            width = text.split('').reduce((sm: number, cr: string) =>
                sm + this._helperDoc.getTextWidth(cr), 0.0);
        }
        this._helperDoc.setFontSize(oldFontSize);
        this._helperDoc.setFont(this._fontName, 'normal');
        return {
            width: width,
            height: height
        };
    }
    public get unitWidth(): number {
        return this.measureText().width;
    }
    public get unitHeight(): number {
        return this.measureText().height;
    }
    public pushMargins(left?: number, right?: number): void {
        this.marginsStack.push({ left: this.margins.left, right: this.margins.right });
        if (typeof left !== 'undefined') this.margins.left = left;
        if (typeof right !== 'undefined') this.margins.right = right;
    }
    public popMargins(): void {
        const margins: IMarginLR = this.marginsStack.pop();
        this.margins.left = margins.left;
        this.margins.right = margins.right;
    }
    public get paperWidth(): number {
        return this.doc.internal.pageSize.width;
    }
    public get paperHeight(): number {
        return this.doc.internal.pageSize.height;
    }
    public getNumberOfPages(): number {
        return this.doc.getNumberOfPages();
    }
    public addPage(): void {
        this.doc.addPage();
    }
    public setPage(index: number): void {
        this.doc.setPage(index + 1);
    }
}
