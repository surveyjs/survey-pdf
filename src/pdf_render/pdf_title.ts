import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';

export class TitleBrick extends PdfBrick {
    protected question: QuestionTextModel;
    constructor(question: IQuestion, protected controller: DocController,
        rect: IRect, protected text: string) {
        super(question, controller, rect);
        this.question = <QuestionTextModel>question;
    }
    render(): void {
        this.controller.fontStyle = 'bold';
        this.rendertText(this, this.text);
        this.controller.fontStyle = 'normal';
    }
}