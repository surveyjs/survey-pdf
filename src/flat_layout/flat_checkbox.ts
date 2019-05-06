import { IQuestion, ItemValue, QuestionCheckboxModel } from 'survey-core';
import { IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { CheckboxItemBrick } from '../pdf_render/pdf_checkboxitem';
import { FlatSelectBase } from './flat_selectbase';
import { FlatRepository } from './flat_repository';

export class FlatCheckbox extends FlatSelectBase {
    protected question: QuestionCheckboxModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionCheckboxModel>question;
    }
    public createItemBrick(rect: IRect, itemValue: ItemValue): IPdfBrick {
        return new CheckboxItemBrick(this.question, this.controller, rect, itemValue);
    }
}

FlatRepository.getInstance().register('checkbox', FlatCheckbox);