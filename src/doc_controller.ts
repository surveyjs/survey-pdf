import * as jsPDF from 'jspdf';
import { LocalizableString } from 'survey-core';
import { SurveyHelper } from './helper_survey';

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
    fontSize: number;
    paperWidth?: number;
    paperHeight?: number;
    margins: IMargin;
}

export class DocOptions implements IDocOptions {
    protected _fontSize: number;
    protected _paperWidth: number;
    protected _paperHeight: number;
    protected _margins: IMargin;
    public constructor(options: IDocOptions) {
        this._fontSize = options.fontSize;
        this._paperWidth =
            typeof options.paperWidth === 'undefined' ? 210.0 : options.paperWidth;
        this._paperHeight =
            typeof options.paperHeight === 'undefined' ? 297.0 : options.paperHeight;
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
    get paperWidth(): number {
        return this._paperWidth;
    }
    get paperHeight(): number {
        return this._paperHeight;
    }
    get margins(): IMargin {
        return this._margins;
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
        let logicWidth: number =
            this._paperWidth * DocController.PAPER_TO_LOGIC_SCALE_MAGIC;
        let logicHeight: number =
            this._paperHeight * DocController.PAPER_TO_LOGIC_SCALE_MAGIC;
        this._doc = new jsPDF({ unit: 'pt', format: [logicWidth, logicHeight] });
        this._helperDoc = new jsPDF({ unit: 'pt', format: [logicWidth, logicHeight] });
        this._doc.setFontSize(this._fontSize);
        this._helperDoc.setFontSize(this._fontSize);
        this._paperWidth = this._paperWidth * DocController.MM_TO_PT;
        this._paperHeight = this._paperHeight * DocController.MM_TO_PT;
        this._fontStyle = 'normal';
        this.marginsStack = [];
    }
    get doc(): any {
        return this._doc;
    }
    get helperDoc(): any {
        return this._helperDoc;
    }
    get fontSize(): number {
        return this._fontSize;
    }
    get fontStyle(): string {
        return this._fontStyle;
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
        fontSize: number = this._helperDoc.getFontSize()) : { width: number, height: number} {
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
    public addPage(): void {
        this.doc.addPage([
            this._paperWidth * DocController.PAPER_TO_LOGIC_SCALE_MAGIC / DocController.MM_TO_PT,
            this._paperHeight * DocController.PAPER_TO_LOGIC_SCALE_MAGIC / DocController.MM_TO_PT
        ]);
    }
}
