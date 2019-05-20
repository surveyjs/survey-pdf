import * as jsPDF from 'jspdf';
export interface IPoint {
    xLeft: number;
    yTop: number;
}
export interface IRect extends IPoint {
    xRight: number;
    yBot: number;
}
export interface IMargin {
    left: number;
    right: number;
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
    protected static MM_TO_PT = 72 / 25.4;
    protected static PAPER_TO_LOGIC_SCALE_MAGIC: number = 595.28 / 210.0;
    protected _fontSize: number;
    protected _paperWidth: number;
    protected _paperHeight: number;
    protected _margins: IMargin;
    constructor(options: IDocOptions) {
        this._fontSize = options.fontSize;
        this._paperWidth =
            typeof options.paperWidth === "undefined" ? 210 : options.paperWidth;
        this._paperHeight =
            typeof options.paperHeight === "undefined" ? 297 : options.paperHeight;
        this._margins = options.margins;
        Object.keys(this._margins).forEach((name: string) => {
            (<any>this._margins)[name] = (<any>this._margins)[name] * DocOptions.MM_TO_PT;
        });
    }
    get leftTopPoint(): IPoint {
        return {
            xLeft: this.margins.left,
            yTop: this.margins.right
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
    isNewPageQuestion(boundaries: IRect[]): boolean {
        let height = 0;
        boundaries.forEach((rect: IRect) => {
            height += rect.yBot - rect.yTop;
        });
        return height <= this._paperHeight - this.margins.top - this.margins.bot &&
            (boundaries.length > 1 || this.isNewPageElement(boundaries[0].yBot));
    }
    isNewPageElement(yBot: number): boolean {
        return yBot > this._paperHeight - this.margins.bot;
    }
}

export class DocController extends DocOptions {
    private _doc: any;
    private _fontStyle: string;
    constructor(options: IDocOptions) {
        super(options);
        let logicWidth: number =
            this._paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
        let logicHeight: number =
            this._paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
        this._doc = new jsPDF({ unit: 'pt', format: [logicWidth, logicHeight] });
        this._paperWidth = this._paperWidth * DocOptions.MM_TO_PT;
        this._paperHeight = this._paperHeight * DocOptions.MM_TO_PT;
        this._doc.setFontSize(this._fontSize);
    }
    get doc(): any {
        return this._doc;
    }
    get fontSize(): number {
        return this._fontSize;
    }
    get fontStyle(): string {
        return this._fontStyle;
    }
    set fontSize(fontSize: number) {
        this._fontSize = fontSize;
        this._doc.setFontSize(this._fontSize);
    }
    set fontStyle(fontStyle: string) {
        this._fontStyle = fontStyle;
        this._doc.setFontStyle(fontStyle);
    }
    public addPage() {
        this.doc.addPage([
            this._paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC / DocOptions.MM_TO_PT,
            this._paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC / DocOptions.MM_TO_PT
        ]);
    }
}
