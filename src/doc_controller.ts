import { jsPDF, jsPDFOptions } from 'jspdf';
import { IHTMLRenderType } from './flat_layout/flat_html';
import { SurveyHelper } from './helper_survey';
import { LocalizableString } from 'survey-core';
// import Fonts from './fonts';
import setRadioAppearance from './jspdf_plugins/acroform';
import './jspdf_plugins/acroform.js';
import './jspdf_plugins/from_html.js';

export interface IPoint {
    /**
     * An X-coordinate for the left element edge.
     */
    xLeft: number;
    /**
     * A Y-coordinate for the top element edge.
     */
    yTop: number;
}
/**
 * An interface that describes a rectangle.
 */
export interface IRect extends IPoint {
    /**
     * An X-coordinate for the right element edge.
     */
    xRight: number;
    /**
     * A Y-coordinate for the bottom element edge.
     */
    yBot: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IMarginLR {
    /**
     * A left margin.
     */
    left?: number;
    /**
     * A right margin.
     */
    right?: number;
}
/**
 * An interface that describes margins.
 */
export interface IMargin extends IMarginLR {
    /**
     * A top margin.
     */
    top?: number;
    /**
     * A bottom margin.
     */
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
     * Possible values:
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
     * Possible values:
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
     * - Array<number> - custom page size in millimeters, for example, `[210, 297]`.
     *
     * @see orientation
     */
    format?: string | number[];

    /**
     * Font size in points.
     *
     * Default value: 14
     *
     * @see fontName
     */
    fontSize?: number;

    /**
     * Font name.
     *
     * Possible values:
     *
     * - `"Helvetica"` (default)
     * - `"Courier"`
     * - `"Times"`
     * - `"Symbol"`
     * - `"ZapfDingbats"`
     * - [Custom font name](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts#use-custom-font)
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/change-font-in-pdf-form/ (linkStyle))
     * @see fontSize
     */
    fontName?: string;

    base64Normal?: string;
    base64Bold?: string;
    /**
     * Specifies whether to apply a custom font to [HTML questions](https://surveyjs.io/form-library/examples/questiontype-html/).
     *
     * Default value: `false`
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/change-font-in-pdf-form/ (linkStyle))
     * @see htmlRenderAs
     */
    useCustomFontInHtml?: boolean;

    /**
     * Page margins. Set this property to an object with the following fields: `top`, `bot`, `left`, `right`.
     */
    margins?: IMargin;

    /**
     * Specifies how to render [HTML questions](https://surveyjs.io/Documentation/Library?id=questionhtmlmodel) into PDF.
     *
     * Possible values:
     *
     * - `"standard"` - Render HTML questions as selectable text.
     * - `"image"` - Render HTML questions as images.
     * - `"auto"` (default) - Select between the `"standard"` and `"image"` modes automatically based on the HTML content.
     *
     * You can override this property for an individual HTML question. Set the question's `renderAs` property to `"standard"` or `"image"` in the survey JSON schema.
     * @see useCustomFontInHtml
     */
    htmlRenderAs?: IHTMLRenderType;

    /**
     * Specifies how to render [Matrix](https://surveyjs.io/Documentation/Library?id=questionmatrixmodel), [Matrix Dropdown](https://surveyjs.io/Documentation/Library?id=questionmatrixdropdownmodel), and [Matrix Dynamic](https://surveyjs.io/Documentation/Library?id=questionmatrixdynamicmodel) questions into PDF.
     *
     * Possible values:
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
     * Possible values:
     *
     * - `"text"` - Render read-only questions as plain text and custom primitives.
     * - `"acroform"` - Use Adobe AcroForms to render questions that support them as interactive form elements switched to their native read-only state. Other questions are rendered in `"text"` mode.
     * - `"auto"` (default) - Prefer the `"text"` mode but use `"acroform"` for [File Upload](https://surveyjs.io/form-library/documentation/api-reference/file-model) questions and links.
     */
    readonlyRenderAs?: 'auto' | 'text' | 'acroform';

    textFieldRenderAs?: 'singleLine' | 'multiLine';

    /**
     * Specifies whether to compress the PDF document. Compressed documents do not support [custom fonts](https://surveyjs.io/Documentation/Pdf-Export?id=Customization-ChangeFonts#use-custom-font).
     *
     * Default value: `false`
     */
    compress?: boolean;

    /**
     * Specifies whether to apply the [`imageFit`](https://surveyjs.io/Documentation/Library?id=questionimagemodel#imageFit) property to exported [Image](https://surveyjs.io/Documentation/Library?id=questionimagemodel) questions.
     *
     * If you enable the `applyImageFit` property, the quality of images may be lower because they pass through several conversions. If `applyImageFit` is disabled, exported images fill the entire container and do not preserve their aspect ratio, but their quality remains the same because they are exported as is.
     */
    applyImageFit?: boolean;

    /**
     * Specifies whether the PDF document contains text in right-to-left languages.
     *
     * Default value: `false`
     */
    isRTL?: boolean;
    /**
     * Specifies whether to include only selected choices when PDF Generator renders a [Multi-Select Dropdown (Tag Box)](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/) question.
     *
     * Default value: `false` (include all choices)
     */
    tagboxSelectedChoicesOnly?: boolean;
}

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
    protected _compress: boolean;
    protected _applyImageFit: boolean;
    protected _useLegacyBooleanRendering: boolean
    protected _isRTL: boolean;
    protected _tagboxSelectedChoicesOnly: boolean;
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
        this._compress = options.compress || false;
        this._applyImageFit = options.applyImageFit || false;
        this._useLegacyBooleanRendering = options.useLegacyBooleanRendering || false;
        this._isRTL = options.isRTL || false;
        this._tagboxSelectedChoicesOnly = options.tagboxSelectedChoicesOnly || false;
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
    public get compress(): boolean {
        return this._compress;
    }
    public get applyImageFit(): boolean {
        return this._applyImageFit;
    }
    public get useLegacyBooleanRendering(): boolean {
        return this._useLegacyBooleanRendering;
    }
    public get isRTL(): boolean {
        return this._isRTL;
    }
    public get tagboxSelectedChoicesOnly(): boolean {
        return this._tagboxSelectedChoicesOnly;
    }
}

/**
 * The `DocController` object includes an API that allows you to configure the resulting PDF document. You can access this object within functions that handle the `SurveyPDF`'s [`onRender...`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderFooter) events.
 *
 * [View Demo](https://surveyjs.io/pdf-generator/examples/how-to-use-adorners-in-pdf-forms/ (linkStyle))
 */
export class DocController extends DocOptions {
    private _doc: jsPDF;
    private _helperDoc: jsPDF;
    private _fontStyle: string;
    private marginsStack: IMarginLR[];
    public constructor(options: IDocOptions = {}) {
        super(options);
        const jspdfOptions: jsPDFOptions = {
            orientation: this.orientation,
            unit: 'pt',
            format: this.format,
            compress: this.compress
        };
        this._doc = new jsPDF(jspdfOptions);
        if (typeof this.base64Normal !== 'undefined' && !SurveyHelper.isFontExist(this, this.fontName)) {
            DocController.addFont(this.fontName, this.base64Normal, 'normal');
            DocController.addFont(this.fontName, this.base64Bold, 'bold');
            this._doc = new jsPDF(jspdfOptions);
        }
        setRadioAppearance(this._doc);
        this._useCustomFontInHtml = options.useCustomFontInHtml && SurveyHelper.isFontExist(this, this.fontName);
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
    /**
     * The width of one character in pixels.
     */
    public get unitWidth(): number {
        return this.measureText().width;
    }
    /**
     * The heigth of one character in pixels.
     */
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
    /**
     * The width of a PDF page in pixels.
     */
    public get paperWidth(): number {
        return this.doc.internal.pageSize.width;
    }
    /**
     * The height of a PDF page in pixels.
     */
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
