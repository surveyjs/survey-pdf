import { IRect } from '../docController';
import { IQuestion } from 'survey-core';

export interface IPdfQuestion {
    render(): void;
}
export class PdfQuestion implements IPdfQuestion {
    private _question: IQuestion;
    private _rect: IRect;
    constructor(question: IQuestion, rect: IRect) {
        this._question = question;
        this._rect = rect;
    }
    get question(): IQuestion {
        return this._question;
    }
    get rect(): IRect {
        return this._rect;
    }
    render(): void {}
    getQuestion<T extends IQuestion>(): T {
        return <T>this.question;
    }
}