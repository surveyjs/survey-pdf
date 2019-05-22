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
    constructor(protected question: IQuestion,
        protected controller: DocController, rect: IRect) {
        this.xLeft = rect.xLeft;
        this.xRight = rect.xRight;
        this.yTop = rect.yTop;
        this.yBot = rect.yBot;
    }
    async render(): Promise<void> { }
    unfold(): IPdfBrick[] {
        return [this];
    }
    getQuestion<T extends IQuestion>(): T {
        return <T>this.question;
    }
}
