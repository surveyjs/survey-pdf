import { IQuestion, ItemValue, QuestionCheckboxModel } from 'survey-core';
import { FlatRepository } from './flat_repository';
import { IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { FlatSelectBase } from './flat_selectbase';

export class FlatRadiogroup extends FlatSelectBase {
    protected question: QuestionCheckboxModel;
    private radioGroupWrap: RadioGroupWrap;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionCheckboxModel>question;
    }
    createItemBrick(rect: IRect, item: ItemValue, index: number): IPdfBrick {
        if (index === 0) {
            this.radioGroupWrap = new RadioGroupWrap(this.question.id, this.controller, this.question.readOnly);
        }
        return new RadioItemBrick(this.question, this.controller, rect,
            item.value, this.question.value == item.value,
            this.radioGroupWrap, index === 0);
    }
}

FlatRepository.getInstance().register('radiogroup', FlatRadiogroup);