import { IRect, IMargin, ISize, DocOptions, DocController } from '../doc_controller';
import { IPdfBrick, PdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { TextBoldBrick } from '../pdf_render/pdf_textbold';
import { SurveyHelper } from '../helper_survey';

/**
 * Horizontal alignment types in onRenderHeader and onRenderFooter events
 */
export enum HorizontalAlign {
    NotSet = 'notset',
    Left = 'left',
    Center = 'center',
    Right = 'right'
}
/**
 * Vertical alignment types in onRenderHeader and onRenderFooter events
 */
export enum VerticalAlign {
    NotSet = 'notset',
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom'
}
/**
 * Common options of rendering text and images in onRenderHeader and onRenderFooter events
 */
export interface IDrawRectOptions {
    /**
     * Specifies horizontal alignment of item, if set (center by default)
     */
    horizontalAlign?: HorizontalAlign;
    /**
     * Specifies vertical alignment of item, if set (middle by default)
     */
    verticalAlign?: VerticalAlign;
    /**
     * Specifies margins inside the drawing rectangle (used if alignment set, all zero by default)
     */
    margins?: IMargin;
    /**
     * Object with coordinates of text rectangle (used if alignment not set)
     */
    rect?: IRect;
}
/**
 * Options of rendering text in onRenderHeader and onRenderFooter events
 */
export interface IDrawTextOptions extends IDrawRectOptions {
    /**
     * String that will be drawn
     */
    text: string;
    /**
     * Font size of text (14 by default)
     */
    fontSize?: number;
    /**
     * Set true to make text bold (false by default)
     */
    isBold?: boolean;
}
/**
 * Options of rendering images in onRenderHeader and onRenderFooter events
 */
export interface IDrawImageOptions extends IDrawRectOptions {
    /**
     * Specifies image width (used if alignment set, canvas.rect's width by default)
     */
    width?: number;
    /**
     * Specifies image height (used if alignment set, canvas.rect's height by default)
     */
    height?: number;
    /**
     * String with base64 encoded image
     */
    base64: string;
}

/**
 * DrawCanvas object passed to onRenderHeader and onRenderFooter events
 */
export class DrawCanvas {
    public constructor(protected packs: IPdfBrick[],
        public controller: DocController,
        protected _rect: IRect,
        protected _countPages: number,
        protected _pageNumber: number) { }
    /**
     * Count of pages in the document
     */
    public get countPages(): number {
        return this._countPages;
    }
    /**
     * Page number from 1
     */
    public get pageNumber(): number {
        return this._pageNumber;
    }
    /**
     * Object with coordinates of the rectangle available for drawing
     * @see IRect
     */
    public get rect(): IRect {
        return this._rect;
    }
    private alignRect(rectOptions: IDrawRectOptions, itemSize: ISize): IRect {
        if (typeof rectOptions.margins === 'undefined') {
            rectOptions.margins = { left: 0.0, right: 0.0, top: 0.0, bot: 0.0 };
        }
        else {
            if (typeof rectOptions.margins.left === 'undefined') {
                rectOptions.margins.left = 0.0;
            }
            if (typeof rectOptions.margins.right === 'undefined') {
                rectOptions.margins.right = 0.0;
            }
            if (typeof rectOptions.margins.top === 'undefined') {
                rectOptions.margins.top = 0.0;
            }
            if (typeof rectOptions.margins.bot === 'undefined') {
                rectOptions.margins.bot = 0.0;
            }
        }
        if (typeof rectOptions.rect === 'undefined') {
            if (typeof rectOptions.horizontalAlign === 'undefined' ||
                rectOptions.horizontalAlign === HorizontalAlign.NotSet) {
                rectOptions.horizontalAlign = HorizontalAlign.Center;
            }
            if (typeof rectOptions.verticalAlign === 'undefined' ||
                rectOptions.verticalAlign === VerticalAlign.NotSet) {
                rectOptions.verticalAlign = VerticalAlign.Middle;
            }
        }
        const rect: IRect = SurveyHelper.clone(this.rect);
        if (typeof rectOptions.horizontalAlign !== 'undefined') {
            switch (rectOptions.horizontalAlign) {
                case HorizontalAlign.Left:
                    rect.xLeft = this.rect.xLeft + rectOptions.margins.left;
                    rect.xRight = Math.min(this.rect.xRight - rectOptions.margins.right,
                        this.rect.xLeft + rectOptions.margins.left + itemSize.width);
                    break;
                case HorizontalAlign.Center:
                    rect.xLeft = Math.max(this.rect.xLeft + rectOptions.margins.left,
                        (this.rect.xLeft + this.rect.xRight - itemSize.width) / 2.0);
                    rect.xRight = Math.min(this.rect.xRight - rectOptions.margins.right,
                        (this.rect.xLeft + this.rect.xRight + itemSize.width) / 2.0);
                    break;
                case HorizontalAlign.Right:
                    rect.xLeft = Math.max(this.rect.xLeft + rectOptions.margins.left,
                        this.rect.xRight - rectOptions.margins.right - itemSize.width);
                    rect.xRight = this.rect.xRight - rectOptions.margins.right;
                    break;
            }
        }
        else {
            rect.xLeft = rectOptions.rect.xLeft || this.rect.xLeft;
            rect.xRight = rectOptions.rect.xRight || this.rect.xRight;
        }
        if (typeof rectOptions.verticalAlign !== 'undefined') {
            switch (rectOptions.verticalAlign) {
                case VerticalAlign.Top:
                    rect.yTop = this.rect.yTop + rectOptions.margins.top;
                    rect.yBot = Math.min(this.rect.yBot - rectOptions.margins.bot,
                        this.rect.yTop + rectOptions.margins.top + itemSize.height);
                    break;
                case VerticalAlign.Middle:
                    rect.yTop = Math.max(this.rect.yTop + rectOptions.margins.top,
                        (this.rect.yTop + this.rect.yBot - itemSize.height) / 2.0);
                    rect.yBot = Math.min(this.rect.yBot - rectOptions.margins.bot,
                        (this.rect.yTop + this.rect.yBot + itemSize.height) / 2.0);
                    break;
                case VerticalAlign.Bottom:
                    rect.yTop = Math.max(this.rect.yTop + rectOptions.margins.top,
                        this.rect.yBot - rectOptions.margins.bot - itemSize.height);
                    rect.yBot = this.rect.yBot - rectOptions.margins.bot;
                    break;
            }
        }
        else {
            rect.yTop = rectOptions.rect.yTop || this.rect.yTop;
            rect.yBot = rectOptions.rect.yBot || this.rect.yBot;
        }
        return rect;
    }
    /**
     * Call this method to draw text
     * @param textOptions Set options of the drawn text
     */
    public drawText(textOptions: IDrawTextOptions): void {
        textOptions = SurveyHelper.clone(textOptions);
        if (typeof textOptions.fontSize === 'undefined') {
            textOptions.fontSize = DocOptions.FONT_SIZE;
        }
        if (typeof textOptions.isBold === 'undefined') {
            textOptions.isBold = false;
        }
        const textSize: ISize = this.controller.measureText(textOptions.text,
            textOptions.isBold ? 'bold' : 'normal', textOptions.fontSize);
        const textRect: IRect = this.alignRect(textOptions, textSize);
        if (!textOptions.isBold) {
            this.packs.push(new TextBrick(null, this.controller,
                textRect, textOptions.text));
        }
        else {
            this.packs.push(new TextBoldBrick(null, this.controller,
                textRect, textOptions.text));
        }
        (<PdfBrick>this.packs[this.packs.length - 1]).fontSize = textOptions.fontSize;
    }
    /**
     * Call this method to draw image
     * @param imageOptions
     */
    public async drawImage(imageOptions: IDrawImageOptions): Promise<void> {
        imageOptions = SurveyHelper.clone(imageOptions);
        if (typeof imageOptions.width === 'undefined') {
            imageOptions.width = this.rect.xRight - this.rect.xLeft;
        }
        if (typeof imageOptions.height === 'undefined') {
            imageOptions.height = this.rect.yBot - this.rect.yTop;
        }
        const imageSize: ISize = {
            width: imageOptions.width,
            height: imageOptions.height
        };
        const imageRect: IRect = this.alignRect(imageOptions, imageSize);
        this.packs.push(await SurveyHelper.createImageFlat(
            SurveyHelper.createPoint(imageRect, true, true),
            null, this.controller, imageOptions.base64,
            imageRect.xRight - imageRect.xLeft,
            imageRect.yBot - imageRect.yTop));
    }
}