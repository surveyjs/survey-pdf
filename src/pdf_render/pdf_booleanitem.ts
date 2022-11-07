import { IQuestion, QuestionBooleanModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { CheckItemBrick } from './pdf_checkitem';

export class BooleanItemBrick extends CheckItemBrick {
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect) {
        super(controller, rect,
            (<QuestionBooleanModel>question).id,
            { question: question, readOnly: question.isReadOnly, checked: (<QuestionBooleanModel>question).checkedValue });
    }
}