import { IRect, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';

export interface IDrawTextOptions {
    /**
     * String that will be drawn (restricted html support)
     */
    text: string;
    /**
     * Object with coordinates of text rectangle
     */
    rect: IRect;
    /**
     * Font size of text (14 by default)
     */
    fontSize?: number;
    /**
     * Set true to make text bold (false by default)
     */
    isBold?: boolean;
}
export interface IDrawImageOptions {
    /**
     * String with base64 encoded image
     */
    base64: string;
    /**
     * Object with coordinates of image rectangle
     */
    rect: IRect;
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
    /**
     * Call this method to draw text 
     * @param textOptions Set options of the drawn text
     */
    public drawText(textOptions: IDrawTextOptions): void {
        if (typeof textOptions.fontSize === 'undefined') {
            textOptions.fontSize = DrawCanvas.DEFAULT_FONT_SIZE;
        }
        if (typeof textOptions.isBold === 'undefined') {
            textOptions.isBold = false;
        }
        this.packs.push(new TextBrick(null, this.controller,
            textOptions.rect, textOptions.text));
    }
    /**
     * Call this method to draw image
     * @param imageOptions 
     */
    public drawImage(imageOptions: IDrawImageOptions): void {

    }
}