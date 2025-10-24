import { EventAsync } from '../event_handler/event_async';
import { IRect, ISize, DocController } from '../doc_controller';

export type TranslateXFunction = (xLeft: number, xRight : number) => { xLeft: number, xRight: number};
export type TranslateYFunction = (yTop: number, yBot : number) => { yTop: number, yBot: number};
export interface IPdfBrick extends IRect, ISize {
    render(): Promise<void>;
    unfold(): IPdfBrick[];
    translateX(func: TranslateXFunction): void;
    translateY(func: TranslateYFunction): void;
    isPageBreak: boolean;
    addBeforeRenderCallback(func: (brick: IPdfBrick) => void): void;
    setPageNumber(number: number): void;
    getPageNumber(): number;
    updateRect(): void;
    increasePadding(val: { top: number, bottom: number }): void;
}
/**
 * An object that describes a PDF brick&mdash;a simple element with specified content, size, and location. Bricks are fundamental elements used to construct a PDF document.
 *
 * You can access `PdfBrick` objects within functions that handle `SurveyPDF`'s [`onRenderQuestion`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderQuestion), [`onRenderPanel`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderPanel), and [`onRenderPage`](https://surveyjs.io/pdf-generator/documentation/api-reference/surveypdf#onRenderPage) events.
 *
 * [View Demo](https://surveyjs.io/pdf-generator/examples/add-markup-to-customize-pdf-forms/ (linkStyle))
 */

export interface IPdfBrickOptions {
    shouldRenderReadOnly?: boolean;
}

export class PdfBrick implements IPdfBrick {
    protected _xLeft: number;
    protected _xRight: number;
    protected _yTop: number;
    protected _yBot: number;
    protected _pageNumber: number;

    /**
     * An X-coordinate for the left brick edge.
     */
    public get xLeft(): number {
        return this._xLeft;
    }
    public set xLeft(val: number) {
        this.setXLeft(val);
    }
    /**
     * An X-coordinate for the right brick edge.
     */
    public get xRight(): number {
        return this._xRight;
    }
    public set xRight(val: number) {
        this.setXRight(val);
    }
    /**
     * A Y-coordinate for the top brick edge.
     */
    public get yTop(): number {
        return this._yTop;
    }
    public set yTop(val: number) {
        this.setYTop(val);
    }
    /**
     * A Y-coordinate for the bottom brick edge.
     */
    public get yBot(): number {
        return this._yBot;
    }
    public set yBot(val: number) {
        this.setYBottom(val);
    }
    public isPageBreak: boolean = false;
    public constructor(protected controller: DocController, rect: IRect, protected options: IPdfBrickOptions = {}) {
        this.xLeft = rect.xLeft;
        this.xRight = rect.xRight;
        this.yTop = rect.yTop;
        this.yBot = rect.yBot;
    }
    translateY(func: TranslateYFunction): void {
        const res = func(this.yTop, this.yBot);
        this.yTop = res.yTop;
        this.yBot = res.yBot;
    }
    translateX(func: TranslateXFunction): void {
        const res = func(this.xLeft, this.xRight);
        this.xLeft = res.xLeft;
        this.xRight = res.xRight;
    }
    /**
     * The brick's width in pixels.
     */
    public get width(): number {
        return this.xRight - this.xLeft;
    }
    /**
     * The brick's height in pixels.
     */
    public get height(): number {
        return this.yBot - this.yTop;
    }
    protected getShouldRenderReadOnly(): boolean {
        return this.options.shouldRenderReadOnly;
    }
    public afterRenderCallback: () => void;
    public async render(): Promise<void> {
        await this.beforeRenderEvent.fire(this, {});
        if (this.getShouldRenderReadOnly()) {
            await this.renderReadOnly();
        }
        else await this.renderInteractive();
        this.afterRenderCallback && this.afterRenderCallback();
    }
    public async renderInteractive(): Promise<void> { }
    public async renderReadOnly(): Promise<void> {
        await this.renderInteractive();
    }
    /**
     * Allows you to get a flat array of nested PDF bricks.
     * @returns A flat array of nested PDF bricks.
     */
    public unfold(): IPdfBrick[] {
        return [this];
    }
    protected getCorrectedText(val: string): string {
        return this.controller.isRTL ? (val || '').split('').reverse().join(''): val;
    }
    protected setXLeft(val: number): void {
        this._xLeft = val;
        this.resetContentRect();
    }
    protected setXRight(val: number): void {
        this._xRight = val;
        this.resetContentRect();
    }
    protected setYTop(val: number): void {
        this._yTop = val;
        this.resetContentRect();
    }
    protected setYBottom(val: number): void {
        this._yBot = val;
        this.resetContentRect();
    }
    public getPageNumber(): number {
        return this._pageNumber;
    }
    public setPageNumber(val: number): void {
        this._pageNumber = val;
    }
    private beforeRenderEvent: EventAsync<PdfBrick, {}> = new EventAsync();
    addBeforeRenderCallback(func: (brick: IPdfBrick) => void): void {
        this.beforeRenderEvent.add(func);
    }
    private padding: { top: number, bottom: number } = { top: 0, bottom: 0 }
    public increasePadding(padding: { top: number, bottom: number }) {
        if(padding.top == 0 && padding.bottom == 0) return;
        Object.keys(this.padding).forEach((key: 'top' | 'bottom') => {
            this.padding[key] += padding[key];
        });
        this._yTop -= padding.top;
        this._yBot += padding.bottom;
        this.resetContentRect();
    }
    private _contentRect: IRect & ISize
    public get contentRect(): IRect & ISize {
        if(!this._contentRect) {
            const yBot = this.yBot -= this.padding.bottom;
            const yTop = this.yTop += this.padding.top;
            this._contentRect = {
                yBot, yTop,
                xLeft: this.xLeft,
                xRight: this.xRight,
                width: this.width,
                height: yBot - yTop
            };
        }
        return this._contentRect;
    }
    private resetContentRect() {
        this._contentRect = undefined;
    }
    public updateRect(): void {}
}