import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextFieldBrick } from './pdf_textfield';

export class CommentBrick extends TextFieldBrick {
    protected question: QuestionTextModel;
    constructor(question: IQuestion, protected controller: DocController, 
        rect: IRect, protected textFieldRect: IRect, protected textRect: IRect = null) {
        super(question, controller, rect);
        this.question = <QuestionTextModel>question;
        this.isMultiline = true;
    }
    render(): void {
        //render textRect if textRect != null
        let oldRect: IRect = this.rect;
        this.rect = this.textFieldRect;
        super.render();
        this.rect = oldRect;
    }
}