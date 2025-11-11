import { EventAsync } from '../event_handler/event_async';
import { IRect, DocController, ISize } from '../doc_controller';
import { IPdfBrick, TranslateXFunction, TranslateYFunction } from './pdf_brick';

export class RowlineBrick implements IPdfBrick {
    xLeft: number;
    xRight: number;
    yTop: number;
    yBot: number;
    public isPageBreak: boolean = false;
    public constructor(protected controller: DocController,
        rect: IRect, public color: string) {
        this.xLeft = rect.xLeft;
        this.xRight = rect.xRight;
        this.yTop = rect.yTop;
        this.yBot = rect.yBot;
    }
    protected _pageNumber: number;

    public get width(): number {
        return this.xRight - this.xLeft;
    }
    public get height(): number {
        return this.yBot - this.yTop;
    }
    public async render(): Promise<void> {
        await this.beforeRenderEvent.fire(this, {});
        if (this.color !== null) {
            this.controller.setDrawColor(this.color);
            this.controller.doc.line(this.contentRect.xLeft, this.yTop, this.contentRect.xRight, this.contentRect.yTop);
            this.controller.restoreDrawColor();
        }
    }
    public getPageNumber(): number {
        return this._pageNumber;
    }
    public setPageNumber(val: number): void {
        this._pageNumber = val;
    }
    private beforeRenderEvent: EventAsync<RowlineBrick, {}> = new EventAsync();
    addBeforeRenderCallback(func: (brick: IPdfBrick) => void): void {
        this.beforeRenderEvent.add(func);
    }
    public unfold(): IPdfBrick[] {
        return [this];
    }

    translateX(_: TranslateXFunction): void {}
    translateY(func: TranslateYFunction): void {
        const res = func(this.yTop, this.yBot);
        this.yTop = res.yTop;
        this.yBot = res.yBot;
    }
     private padding: { top: number, bottom: number } = { top: 0, bottom: 0 }
     public increasePadding(padding: { top: number, bottom: number }) {
         if(padding.top == 0 && padding.bottom == 0) return;
         Object.keys(this.padding).forEach((key: 'top' | 'bottom') => {
             this.padding[key] += padding[key];
         });
         this.yTop -= padding.top;
         this.yBot += padding.bottom;
         this._contentRect = undefined;
     }
    private _contentRect: IRect & ISize
    public get contentRect(): IRect & ISize {
        if(!this._contentRect) {
            const yTop = this.yTop += this.padding.top;
            const yBot = this.yBot -= this.padding.bottom;
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
    public updateRect(): void {}
    public get isEmpty(): boolean {
        return this.color === null;
    }
}