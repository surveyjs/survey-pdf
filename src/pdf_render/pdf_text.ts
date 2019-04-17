import { IRect } from '../docController';
import { IQuestion } from 'survey-core';
import { PdfQuestion } from "./pdf_question";

export class PdfText extends PdfQuestion {
    constructor(question: IQuestion, rect: IRect) {
        super(question, rect);
    }
    render(): void {

    }
}