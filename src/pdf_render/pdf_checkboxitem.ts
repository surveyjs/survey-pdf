import { IQuestion, QuestionCheckboxModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { CheckItemBrick } from './pdf_checkitem';

export class CheckboxItemBrick extends CheckItemBrick {
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, item: ItemValue) {
        super(question, controller, rect,
            (<QuestionCheckboxModel>question).id, item.value,
            question.isReadOnly || !item.isEnabled,
            (<QuestionCheckboxModel>question).isItemSelected(item));
    }
}