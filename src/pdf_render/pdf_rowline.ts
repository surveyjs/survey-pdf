import { IRect, DocController } from '../doc_controller';
import { IPdfBrick, TranslateXFunction } from './pdf_brick';

export class RowlineBrick implements IPdfBrick {
    xLeft: number;
    xRight: number;
    yTop: number;
    yBot: number;
    public isPageBreak: boolean = false;
    public constructor(protected controller: DocController,
        rect: IRect, protected color: string) {
        this.xLeft = rect.xLeft;
        this.xRight = rect.xRight;
        this.yTop = rect.yTop;
        this.yBot = rect.yBot;
    }
    public get width(): number {
        return this.xRight - this.xLeft;
    }
    public get height(): number {
        return this.yBot - this.yTop;
    }
    public async render(): Promise<void> {
        if (this.color !== null) {
            let oldDrawColor: string = this.controller.doc.getDrawColor();
            this.controller.doc.setDrawColor(this.color);
            this.controller.doc.line(this.xLeft, this.yTop, this.xRight, this.yTop);
            this.controller.doc.setDrawColor(oldDrawColor);
        }
    }
    public unfold(): IPdfBrick[] {
        return [this];
    }
    translateX(_: TranslateXFunction): void {}
}