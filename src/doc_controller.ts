import * as jsPDF from 'jspdf';
import { SurveyHelper } from './helper_survey';
import { LocalizableString } from 'survey-core';
export interface IPoint {
    xLeft: number;
    yTop: number;
}
export interface IRect extends IPoint {
    xRight: number;
    yBot: number;
}
export interface IMarginLR {
    left: number;
    right: number;
}
export interface IMargin extends IMarginLR {
    top: number;
    bot: number;
}
export interface IDocOptions {
    orientation?: 'p' | 'l';
    format?: string | number[];
    fontSize?: number;
    margins: IMargin;
}

export class DocOptions implements IDocOptions {
    protected static MM_TO_PT = 72 / 25.4;
    protected _fontSize: number;
    protected _margins: IMargin;
    protected _format: string | number[];
    protected _orientation: 'l' | 'p';
    public constructor(options: IDocOptions) {
        this._orientation = options.orientation || 'p';
        this._format = options.format || 'a4';
        if (Array.isArray(this._format)) {
            this._format = this._format.map(f => f * DocOptions.MM_TO_PT);
        }
        this._fontSize = options.fontSize || 12;
        this._margins = SurveyHelper.clone(options.margins);
        Object.keys(this._margins).forEach((name: string) => {
            (<any>this._margins)[name] = (<any>this._margins)[name] * DocController.MM_TO_PT;
        });
    }
    get leftTopPoint(): IPoint {
        return {
            xLeft: this.margins.left,
            yTop: this.margins.top
        }
    }
    get fontSize(): number {
        return this._fontSize;
    }
    get margins(): IMargin {
        return this._margins;
    }
    get format(): string | number[] {
        return this._format;
    }
    get orientation(): 'l' | 'p' {
        return this._orientation;
    }
}

export class DocController extends DocOptions {
    public static readonly MM_TO_PT = 72.0 / 25.4;
    protected static readonly PAPER_TO_LOGIC_SCALE_MAGIC: number = 595.28 / 210.0;
    private _doc: any;
    private _helperDoc: any;
    private _fontStyle: string;
    private marginsStack: IMarginLR[];

    public constructor(options: IDocOptions) {
        super(options);
        this._doc = new jsPDF({ orientation: this.orientation, unit: 'pt', format: this.format });
        this._helperDoc = new jsPDF({ orientation: this.orientation, unit: 'pt', format: this.format });
        this._doc.setFontSize(this.fontSize);
        this._helperDoc.setFontSize(this._fontSize);
        this._fontStyle = 'normal';
        this.marginsStack = [];
    }
    get doc(): any {
        return this._doc;
    }

    get helperDoc(): any {
        return this._helperDoc;
    }
    get fontStyle(): string {
        return this._fontStyle;
    }
    get fontSize(): number {
        return this._fontSize;
    }
    set fontSize(fontSize: number) {
        this._fontSize = fontSize;
        this._doc.setFontSize(fontSize);
    }
    set fontStyle(fontStyle: string) {
        this._fontStyle = fontStyle;
        this._doc.setFontStyle(fontStyle);
    }
    public measureText(text: LocalizableString | string | number = 1, fontStyle: string = 'normal',
        fontSize: number = this._helperDoc.getFontSize()): { width: number, height: number } {
        let oldFontSize = this._helperDoc.getFontSize();
        this._helperDoc.setFontSize(fontSize);
        this._helperDoc.setFontStyle(fontStyle);
        let height: number = this._helperDoc.getLineHeight() / this._helperDoc.internal.scaleFactor;;
        let width: number = 0;
        if (typeof text === 'number') {
            width = height * text;
        }
        else {
            text = typeof text === 'string' ? text : SurveyHelper.getLocString(text);
            width = text.split('').reduce((sm: number, cr: string) =>
                sm + this._helperDoc.getTextWidth(cr), 0);
        }
        this._helperDoc.setFontSize(oldFontSize);
        this._helperDoc.setFontStyle('normal');
        return {
            width: width,
            height: height
        }
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
    get paperWidth(): number {
        return this.doc.internal.pageSize.width;
    }
    get paperHeight(): number {
        return this.doc.internal.pageSize.height;
    }
    public addPage(): void {
        this.doc.addPage();
    }
}
