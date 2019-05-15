import { IQuestion } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextBoxBrick } from './pdf_textbox';

export class CommentBrick extends TextBoxBrick {
    constructor(question: IQuestion, protected controller: DocController,
        rect: IRect, isQuestion: boolean) {
        super(question, controller, rect, isQuestion, true);
    }
}