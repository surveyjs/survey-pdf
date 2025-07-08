import { IQuestion, ItemValue, QuestionCheckboxModel, QuestionTagboxModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IRect, DocController } from '../doc_controller';
import { FlatSelectBase } from './flat_selectbase';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CheckboxItemBrick } from '../pdf_render/pdf_checkboxitem';

export class FlatCheckbox<T extends QuestionCheckboxModel = QuestionCheckboxModel> extends FlatSelectBase<T> {
    public generateFlatItem(rect: IRect, item: ItemValue, index: number): IPdfBrick {
        return new CheckboxItemBrick(this.question, this.controller, rect, item, index);
    }
}
export class FlatTagbox extends FlatCheckbox<QuestionTagboxModel> {
    protected getVisibleChoices(): Array<ItemValue> {
        if(this.controller.tagboxSelectedChoicesOnly) {
            return this.question.selectedChoices;
        } else {
            return super.getVisibleChoices();
        }
    }
}
FlatRepository.getInstance().register('tagbox', FlatTagbox);
FlatRepository.getInstance().register('checkbox', FlatCheckbox);