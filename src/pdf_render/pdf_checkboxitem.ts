import { IQuestion, QuestionCheckboxModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { CheckItemBrick } from './pdf_checkitem';

export class CheckboxItemBrick extends CheckItemBrick {
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, itemValue: ItemValue) {
        super(question, controller, rect,
            (<QuestionCheckboxModel>question).id + 'value' + itemValue.value,
            question.isReadOnly || !itemValue.isEnabled,
            (<QuestionCheckboxModel>question).isItemSelected(itemValue));
    }
}