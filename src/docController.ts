import * as jsPDF from "jspdf";

export interface IPoint {
    xLeft: number;
    yTop: number;
}
export interface IRect {
    xLeft: number;
    xRight: number;
    yTop: number;
    yBot: number;
}
export interface IMargin {
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBot: number;
}
export interface IDocOptions {
    fontSize: number;
    xScale: number;
    yScale: number;
    paperWidth?: number;
    paperHeight?: number;
    margins: IMargin;
}

export class DocOptions implements IDocOptions {
    protected static PAPER_TO_LOGIC_SCALE_MAGIC: number = 595.28 / 210.0;
    protected _fontSize: number;
    protected _xScale: number;
    protected _yScale: number;
    protected _paperWidth: number;
    protected _paperHeight: number;
    protected _margins: IMargin;
    constructor(options: IDocOptions) {
        this._fontSize = options.fontSize;
        this._xScale = options.xScale;
        this._yScale = options.yScale;
        this._paperWidth =
            typeof options.paperWidth === "undefined" ? 210 : options.paperWidth;
        this._paperHeight =
            typeof options.paperHeight === "undefined" ? 297 : options.paperHeight;
        this._margins = options.margins;
    }
    get fontSize(): number {
        return this._fontSize;
    }
    get xScale(): number {
        return this._xScale;
    }
    get yScale(): number {
        return this._yScale;
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
        return height <= this._paperHeight - this.margins.marginTop - this.margins.marginBot &&
            (boundaries.length > 1 || this.isNewPageElement(boundaries[0].yBot));
    }
    isNewPageElement(yBot: number): boolean {
        return yBot > this._paperHeight - this.margins.marginBot;
    }
    measureText(text: number | string = 1) {
        let length = typeof text === "string" ? text.length : text; 
        return {
            width: length * this.fontSize * this.xScale,
            height: this.fontSize * this.yScale
        }
    }
}

export class DocController extends DocOptions {
    private _doc: any;
    constructor(options: IDocOptions) {
        super(options);
        let logicWidth: number =
            this._paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
        let logicHeight: number =
            this._paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
        this._doc = new jsPDF({ format: [logicWidth, logicHeight] });
        // addCustomustomFonts(jsPDF);
        this._doc.setFontSize(this._fontSize);
    }
    get doc(): any {
        return this._doc;
    }
    public addPage() {
        this.doc.addPage([
            this._paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC,
            this._paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC
        ]);
    }
}
