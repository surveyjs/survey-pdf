import { IPoint, IRect, DocController } from '../doc_controller';
import { IQuestion } from 'survey-core';

export interface IPdfBrick extends IRect {
    render(): void;
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
    rendertText(rect: IRect, text: string) {
        let alignPoint = this.alignPoint(rect);
        this.controller.doc.text(text, alignPoint.xLeft, alignPoint.yTop, {
            align: 'left',
            baseline: 'middle'
        });
    }
    render(): void {}
    private alignPoint(rect: IRect): IPoint {
        return {
            xLeft: rect.xLeft,
            yTop: rect.yTop + (rect.yBot - rect.yTop) / 2.0
        };
    }
    //TO REVIEW
    getQuestion<T extends IQuestion>(): T {
        return <T>this.question;
    }
}