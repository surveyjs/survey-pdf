import { IQuestion, QuestionCheckboxModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { CheckItemBrick } from './pdf_checkitem';

export class CheckboxItemBrick extends CheckItemBrick {
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, item: ItemValue, index: number) {
        super(controller, rect,
            (<QuestionCheckboxModel>question).id + 'index' + index,
            { question: question, readOnly: question.isReadOnly || !item.isEnabled, item: item, checked: (<QuestionCheckboxModel>question).isItemSelected(item), index: index });
    }
}