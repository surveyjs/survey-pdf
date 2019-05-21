import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';

export class TextBrick extends PdfBrick {
    protected question: QuestionTextModel;
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected text: string) {
        super(question, controller, rect);
        this.question = <QuestionTextModel>question;
    }
    async render() {
        this.rendertText(this, this.text);
    }
}