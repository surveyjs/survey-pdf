import { IRect, DocController } from '../doc_controller';
import { IQuestion } from 'survey-core';

export interface IPdfBrick extends IRect {
    render(): Promise<void>;
    unfold(): IPdfBrick[];
}
export class PdfBrick implements IPdfBrick {
    xLeft: number;
    xRight: number;
    yTop: number;
    yBot: number;
    public constructor(protected question: IQuestion,
        protected controller: DocController, rect: IRect) {
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
    public async render(): Promise<void> { }
    public unfold(): IPdfBrick[] {
        return [this];
    }
}
