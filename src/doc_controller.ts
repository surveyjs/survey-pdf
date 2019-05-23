import * as jsPDF from 'jspdf';
import { SurveyHelper } from './helper_survey';
export interface IPoint {
    xLeft: number;
    yTop: number;
}
export interface IRect extends IPoint {
    xRight: number;
    yBot: number;
}
interface IMarginLR {
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
            (<any>this._margins)[name] = (<any>this._margins)[name] * DocOptions.MM_TO_PT;
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
    private _doc: any;
    private _fontStyle: string;
    private marginsStack: IMarginLR[];

    public constructor(options: IDocOptions) {
        super(options);
        this._doc = new jsPDF({ orientation: this.orientation, unit: 'pt', format: this.format });
        this._doc.setFontSize(this.fontSize);
        this.marginsStack = [];
    }
    get doc(): any {
        return this._doc;
    }
    get fontStyle(): string {
        return this._fontStyle;
    }
    get fontSize(): number {
        return this._fontSize;
    }
    set fontSize(fontSize: number) {
        this._fontSize = fontSize;
        this._doc.setFontSize(this._fontSize);
    }
    set fontStyle(fontStyle: string) {
        this._fontStyle = fontStyle;
        this._doc.setFontStyle(fontStyle);
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
