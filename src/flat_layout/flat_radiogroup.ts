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
        this.radioGroupWrap = new RadioGroupWrap(question, controller);
    }
    public createItemBrick(rect: IRect, itemValue: ItemValue, index: number): IPdfBrick {
        return new RadioItemBrick(this.question, this.controller, rect,
            itemValue, index, this.radioGroupWrap);
    }
}

FlatRepository.getInstance().register('radiogroup', FlatRadiogroup);