import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextFieldBrick } from './pdf_textfield';

export class CommentBrick extends TextFieldBrick {
    constructor(question: IQuestion, protected controller: DocController,
        rect: IRect, isQuestion: boolean) {
        super(question, controller, rect);
        this.isQuestion = isQuestion;
        this.isMultiline = true;
    }
}