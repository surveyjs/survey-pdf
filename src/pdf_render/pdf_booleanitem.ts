import { IQuestion, QuestionBooleanModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { CheckItemBrick } from './pdf_checkitem';

export class BooleanItemBrick extends CheckItemBrick {
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect) {
        super(question, controller, rect,
            (<QuestionBooleanModel>question).id,
            question.isReadOnly,
            (<QuestionBooleanModel>question).value === true ||
            (<QuestionBooleanModel>question).defaultValue == 'true');
    }
}