import { IQuestion, ItemValue, QuestionCheckboxModel, QuestionTagboxModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IRect, DocController } from '../doc_controller';
import { FlatSelectBase } from './flat_selectbase';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CheckboxItemBrick } from '../pdf_render/pdf_checkboxitem';

export class FlatCheckbox extends FlatSelectBase {
    protected question: QuestionCheckboxModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionCheckboxModel>question;
    }
    public generateFlatItem(rect: IRect, item: ItemValue, index: number): IPdfBrick {
        return new CheckboxItemBrick(this.question, this.controller, rect, item, index);
    }
}
export class FlatTagbox extends FlatCheckbox {
    protected question: QuestionTagboxModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionTagboxModel>question;
    }
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