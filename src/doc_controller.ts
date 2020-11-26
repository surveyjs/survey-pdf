import * as jsPDF from 'jspdf';
import { SurveyHelper } from './helper_survey';
import { LocalizableString } from 'survey-core';
import Fonts from './fonts';
import setRadioAppearance from './jspdf_plugins/acroform';
import './jspdf_plugins/acroform.js';

export interface IPoint {
    xLeft: number;
    yTop: number;
}
export interface IRect extends IPoint {
    xRight: number;
    yBot: number;
}
export interface ISize {
    width: number,
    height: number
}
export interface IMarginLR {
    left?: number;
    right?: number;
}
export interface IMargin extends IMarginLR {
    top?: number;
    bot?: number;
}
export interface IDocOptions {
    orientation?: 'p' | 'l';
    format?: string | number[];
    fontSize?: number;
    fontName?: string;
    base64Normal?: string;
    base64Bold?: string;
    margins?: IMargin;
    commercial?: boolean;
    haveCommercialLicense?: boolean;
    htmlRenderAs?: 'auto' | 'standard' | 'image';
    matrixRenderAs?: 'auto' | 'list';
    readonlyRenderAs?: 'auto' | 'text' | 'acroform';
    compress?: boolean;
}
export class DocOptions implements IDocOptions {
    public static readonly MM_TO_PT = 72 / 25.4;
    public static readonly FONT_SIZE = 14;
    protected _fontSize: number;
    protected _margins: IMargin;
    protected _format: string | number[];
    protected _orientation: 'l' | 'p';
    protected _fontName: string;
    protected _htmlRenderAs: 'auto' | 'standard' | 'image';
    protected _matrixRenderAs: 'auto' | 'list';
    protected _readonlyRenderAs: 'auto' | 'text' | 'acroform';
    protected _compress: boolean;
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
        this._fontName = options.fontName || 'segoe';
        this._fontSize = options.fontSize || DocOptions.FONT_SIZE;
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
    }
    public get leftTopPoint(): IPoint {
        return {
            xLeft: this.margins.left,
            yTop: this.margins.top
        }
    }
    public get fontName(): string {
        return this._fontName;
    }
    public get fontSize(): number {
        return this._fontSize;
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
    public get htmlRenderAs(): 'auto' | 'standard' | 'image' {
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
}

export class DocController extends DocOptions {
    private _doc: any;
    private _helperDoc: any;
    private _fontStyle: string;
    private marginsStack: IMarginLR[];
    public constructor(options?: IDocOptions) {
        super(options || {});
        if ((options.fontName && (options.base64Normal || options.base64Bold))) {
            this.addFont(this.fontName, options.base64Normal || options.base64Bold, 'normal');
            this.addFont(this.fontName, options.base64Bold || options.base64Normal, 'bold');
        }
        else if (this.fontName === 'segoe') {
            this.addFont(this.fontName, Fonts.SEGOE_NORMAL, 'normal');
            this.addFont(this.fontName, Fonts.SEGOE_BOLD, 'bold');
        }
        this._doc = new jsPDF({ putOnlyUsedFonts: false, orientation: this.orientation,
            unit: 'pt', format: this.format, compress: this.compress });
        setRadioAppearance(this._doc);
        this._helperDoc = new jsPDF({ putOnlyUsedFonts: false,
            orientation: this.orientation, unit: 'pt', format: this.format });
        this._doc.setFont(this.fontName);
        this._helperDoc.setFont(this.fontName);
        this._doc.setFontSize(this.fontSize);
        this._helperDoc.setFontSize(this.fontSize);
        this._fontStyle = 'normal';
        this.marginsStack = [];
    }
    private addFont(fontName: string, base: string, fontStyle: string) {
        var callAddFont = function () {
            let fontFile: string = `${fontName}-${fontStyle}.ttf`
            this.addFileToVFS(fontFile, base);
            this.addFont(fontFile, fontName, fontStyle);//, 'WinAnsiEncoding', true);
        };
        (<any>jsPDF).API.events.push(['addFonts', callAddFont]);
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
    public get fontSize(): number {
        return this._fontSize;
    }
    public get fontStyle(): string {
        return this._fontStyle;
    }
    public set fontName(fontName: string) {
        this._fontName = fontName;
        this._doc.setFont(fontName);
        this._helperDoc.setFont(fontName);
    }
    public set fontSize(fontSize: number) {
        this._fontSize = fontSize;
        this._doc.setFontSize(fontSize);
        this._helperDoc.setFontSize(fontSize);
    }
    public set fontStyle(fontStyle: string) {
        this._fontStyle = fontStyle;
        this._doc.setFontStyle(fontStyle);
        this._helperDoc.setFontStyle(fontStyle);
    }
    public measureText(text: string | LocalizableString | number = 1, fontStyle: string = this._fontStyle,
        fontSize: number = this._fontSize): ISize {
        let oldFontSize = this._helperDoc.getFontSize();
        this._helperDoc.setFontSize(fontSize);
        this._helperDoc.setFontStyle(fontStyle);
        let height: number = this._helperDoc.getLineHeight() / this._helperDoc.internal.scaleFactor;;
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
        this._helperDoc.setFontStyle('normal');
        return {
            width: width,
            height: height
        }
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
        let margins: IMarginLR = this.marginsStack.pop();
        this.margins.left = margins.left;
        this.margins.right = margins.right;
    }
    public get paperWidth(): number {
        return this.doc.internal.pageSize.width;
    }
    public get paperHeight(): number {
        return this.doc.internal.pageSize.height;
    }
    public addPage(): void {
        this.doc.addPage();
    }
}
