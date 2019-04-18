import { IPoint, IRect, DocController } from '../doc_controller';
import { IQuestion } from 'survey-core';

export interface IPdfBrick {
    render(): void;
}
export class PdfBrick implements IPdfBrick {
    private _rect: IRect;
    constructor(protected question: IQuestion, protected controller: DocController,
        rect: IRect) {
        this._rect = rect;
    }
    get rect(): IRect {
        return this._rect;
    }
    set rect(rect: IRect) {
        this._rect = rect;
    }
    rendertText(rect: IRect, text: string) {
        let alignPoint = this.alignPoint(rect);
        this.controller.doc.text(text, alignPoint.xLeft, alignPoint.yTop, {
            align: "left",
            baseline: "middle"
        });
    }
    render(): void {}
    private alignPoint(rect: IRect): IPoint {
        return {
            xLeft: rect.xLeft,
            yTop: rect.yTop + (rect.yBot - rect.yTop) / 2.0
        };
    }
    getQuestion<T extends IQuestion>(): T {
        return <T>this.question;
    }
}