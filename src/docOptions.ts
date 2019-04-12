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
    private static PAPER_TO_LOGIC_SCALE_MAGIC: number = 595.28 / 210.0;
    private _doc: any;
    private _fontSize: number;
    private _xScale: number;
    private _yScale: number;
    private _paperWidth: number;
    private _paperHeight: number;
    private _margins: IMargin;
    constructor(options: IDocOptions) {
        this._fontSize = options.fontSize;
        this._xScale = options.xScale;
        this._yScale = options.yScale;
        this._paperWidth =
            typeof options.paperWidth === "undefined" ? 210 : options.paperWidth;
        this._paperHeight =
            typeof options.paperHeight === "undefined" ? 297 : options.paperHeight;
        this._margins = options.margins;
        let logicWidth: number =
            this._paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
        let logicHeight: number =
            this._paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
        // addCustomustomFonts(jsPDF);
        this._doc = new jsPDF({ format: [logicWidth, logicHeight] });
        this._doc.setFontSize(this._fontSize);
    }
    get doc(): any {
        return this._doc;
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
    get margins(): IMargin {
        return this._margins;
    }
    private addPage() {
        this.doc.addPage([
            this._paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC,
            this._paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC
        ]);
    }
    tryNewPageQuestion(boundaries: IRect[], isRender: boolean = true): boolean {
        let height = 0;
        boundaries.forEach((rect: IRect) => {
            height += rect.yBot - rect.yTop;
        });
        if (
            height <=
            this._paperHeight - this.margins.marginTop - this.margins.marginBot &&
            (boundaries.length > 1 ||
                this.tryNewPageElement(boundaries[0].yBot, false))
        ) {
            if (isRender) {
                this.addPage();
            }
            return true;
        }
        return false;
    }
    tryNewPageElement(yBot: number, isRender: boolean = true): boolean {
        if (yBot > this._paperHeight - this.margins.marginBot) {
            if (isRender) {
                this.addPage();
            }
            return true;
        }
        return false;
    }
}

