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

export interface IDrawRectOptions {
    /**
     * Horizontal alignment within the rectangle that limits the drawing area.
     *
     * Possible values:
     *
     * - `"center"` (default)
     * - `"left"`
     * - `"right"`
     */
    horizontalAlign?: HorizontalAlign;
    /**
     * Vertical alignment within the rectangle that limits the drawing area.
     *
     * Possible values:
     *
     * - `"middle"` (default)
     * - `"top"`
     * - `"bottom"`
     */
    verticalAlign?: VerticalAlign;
    /**
     * The distance between the content and the borders of the rectangle. This property applies only if the content is aligned to the left/right or top/bottom.
     */
    margins?: IMargin;
    /**
     * An object with coordinates of the rectangle.
     */
    rect?: IRect;
}
/**
 * An object that configures rendering a piece of text.
 */
export interface IDrawTextOptions extends IDrawRectOptions {
    /**
     * A text string to be drawn.
     */
    text: string;
    /**
     * Font size in points.
     *
     * Default value: 14
     */
    fontSize?: number;
    /**
     * Enable this property to render the text string bold.
     *
     * Default value: `false`
     */
    isBold?: boolean;
}
/**
 * An object that configures rendering an image.
 */
export interface IDrawImageOptions extends IDrawRectOptions {
    /**
     * An image width in pixels. Defaults to the [rectangle width](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawimageoptions#rect).
     */
    width?: number;
    /**
     * An image height in pixels. Defaults to the [rectangle height](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawimageoptions#rect).
     */
    height?: number;
    /**
     * A string value with a base64-encoded image to be drawn.
     */
    base64: string;
}

/**
 * An object that describes a drawing area and enables you to draw an image or a piece of text within the area. You can access this object within functions that handle `SurveyPDF`'s [`onRenderHeader`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderHeader) and [`onRenderFooter`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderFooter) events.
 *
 * [View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))
 */
export class DrawCanvas {
    public constructor(protected packs: IPdfBrick[],
        public controller: DocController,
        protected _rect: IRect,
        protected _countPages: number,
        protected _pageNumber: number) { }
    /**
     * A total number of pages in the document.
     */
    public get pageCount(): number {
        return this._countPages;
    }
    public get countPages(): number {
        return this._countPages;
    }
    /**
     * The number of the page that contains the drawing area. Enumeration starts with 1.
     */
    public get pageNumber(): number {
        return this._pageNumber;
    }
    /**
     * An object with coordinates of a rectangle that limits the drawing area. This object contain the following fields: `xLeft`, `xRight`, `yTop`, `yBot`.
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
     * Draws a piece of text within the drawing area.
     * @param textOptions An [`IDrawTextOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawtextoptions) object that configures the drawing.
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
     * Draws an image within the drawing area.
     * @param imageOptions An [`IDrawImageOptions`](https://surveyjs.io/pdf-generator/documentation/api-reference/idrawimageoptions) object that configures drawing.
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
            null, this.controller, { link: imageOptions.base64,
                width: imageRect.xRight - imageRect.xLeft,
                height: imageRect.yBot - imageRect.yTop }));
    }
}