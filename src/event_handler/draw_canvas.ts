import { IRect, IMargin, ISize, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { TitleBrick } from '../pdf_render/pdf_title';
import { SurveyHelper } from '../helper_survey';

export enum HorizontalAlign {
    notset = 0,
    left = 1,
    center = 2,
    right = 3,
    justify = 4
}
export enum VerticalAlign {
    notset = 0,
    top = 1,
    middle = 2,
    bottom = 3,
    justify = 4
}
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
export interface IDrawTextOptions extends IDrawRectOptions {
    /**
     * String that will be drawn (restricted html support)
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
export interface IDrawImageOptions extends IDrawRectOptions {
    /**
     * String with base64 encoded image
     */
    base64: string;
}
export class DrawCanvas {
    public static readonly DEFAULT_FONT_SIZE: number = 14;
    public constructor(protected packs: IPdfBrick[],
        protected controller: DocController,
        protected _rect: IRect,
        protected _pageNumber: number) {}
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
    private initMargins(rectOptions: IDrawRectOptions): void {
        if (typeof rectOptions.margins === 'undefined') {
            rectOptions.margins = {
                left: 0,
                right: 0,
                top: 0,
                bot: 0
            }
        }
    }
    private alignRect(rectOptions: IDrawRectOptions, itemSize: ISize): IRect {
        if (typeof rectOptions.rect === 'undefined') {
            if (typeof rectOptions.horizontalAlign === 'undefined' ||
                rectOptions.horizontalAlign === HorizontalAlign.notset) {
                rectOptions.horizontalAlign = HorizontalAlign.center;
            }
            if (typeof rectOptions.verticalAlign === 'undefined' ||
                rectOptions.verticalAlign === VerticalAlign.notset) {
                rectOptions.verticalAlign = VerticalAlign.middle;
            }
        }
        let textRect: IRect = SurveyHelper.clone(this.rect);
        if (typeof rectOptions.horizontalAlign !== 'undefined') {
            switch (rectOptions.horizontalAlign) {
                case HorizontalAlign.left:
                    textRect.xLeft = this.rect.xLeft + rectOptions.margins.left;
                    textRect.xRight = Math.min(this.rect.xRight - rectOptions.margins.right,
                        this.rect.xLeft + rectOptions.margins.left + itemSize.width);
                    break;
                case HorizontalAlign.center:
                    textRect.xLeft = Math.max(this.rect.xLeft + rectOptions.margins.left,
                        (this.rect.xRight - this.rect.xLeft - itemSize.width) / 2.0);
                    textRect.xRight = Math.min(this.rect.xRight - rectOptions.margins.right,
                        (this.rect.xRight - this.rect.xLeft + itemSize.width) / 2.0); 
                    break;
                case HorizontalAlign.right:
                    textRect.xLeft = Math.max(this.rect.xLeft + rectOptions.margins.left,
                        this.rect.xRight - rectOptions.margins.right - itemSize.width);
                    textRect.xRight = this.rect.xRight - rectOptions.margins.right;
                    break;
            }
        }
        else {
            textRect.xLeft = rectOptions.rect.xLeft;
            textRect.xRight = rectOptions.rect.xRight;
        }
        if (typeof rectOptions.verticalAlign !== 'undefined') {
            switch (rectOptions.verticalAlign) {
                case VerticalAlign.top:
                    textRect.yTop = this.rect.yTop + rectOptions.margins.top;
                    textRect.yBot = Math.min(this.rect.yBot - rectOptions.margins.bot,
                        this.rect.yTop + rectOptions.margins.top + itemSize.height);
                    break;
                case VerticalAlign.middle:
                    textRect.yTop = Math.max(this.rect.yTop + rectOptions.margins.top,
                        (this.rect.yBot - this.rect.yTop - itemSize.height) / 2.0);
                    textRect.yBot = Math.min(this.rect.yBot - rectOptions.margins.bot,
                        (this.rect.yBot - this.rect.yTop + itemSize.height) / 2.0); 
                    break;
                case VerticalAlign.bottom:
                    textRect.yTop = Math.max(this.rect.yTop + rectOptions.margins.top,
                        this.rect.yBot - rectOptions.margins.bot - itemSize.height);
                    textRect.yBot = this.rect.yBot - rectOptions.margins.bot;
                    break;
            }
        }
        else {
            textRect.yTop = rectOptions.rect.yTop;
            textRect.yBot = rectOptions.rect.yBot;
        }
        return textRect;
    }
    /**
     * Call this method to draw text 
     * @param textOptions Set options of the drawn text
     */
    public drawText(textOptions: IDrawTextOptions): void {
        textOptions = SurveyHelper.clone(textOptions);
        if (typeof textOptions.fontSize === 'undefined') {
            textOptions.fontSize = DrawCanvas.DEFAULT_FONT_SIZE;
        }
        if (typeof textOptions.isBold === 'undefined') {
            textOptions.isBold = false;
        }
        let textSize: ISize = this.controller.measureText(textOptions.text,
            textOptions.isBold ? 'bold' : 'normal', textOptions.fontSize);
        this.initMargins(textOptions);
        let textRect: IRect = this.alignRect(textOptions, textSize);
        if (!textOptions.isBold) {
            this.packs.push(new TextBrick(null, this.controller,
                textRect, textOptions.text, textOptions.fontSize));
        }
        else {
            this.packs.push(new TitleBrick(null, this.controller,
                textRect, textOptions.text, textOptions.fontSize));
        }
    }
    /**
     * Call this method to draw image
     * @param imageOptions 
     */
    public drawImage(imageOptions: IDrawImageOptions): void {
        this.initMargins(imageOptions);
        let imageSize: ISize = {
            width: imageOptions.margins.right - imageOptions.margins.left,
            height: imageOptions.margins.bot - imageOptions.margins.top
        };
        let imageRect: IRect = this.alignRect(imageOptions, imageSize);
        this.packs.push(SurveyHelper.createImageFlat(
            SurveyHelper.createPoint(imageRect, true, true),
            null, this.controller, imageOptions.base64,
            imageRect.xRight - imageRect.xLeft,
            imageRect.yBot - imageRect.yTop));
    }
}