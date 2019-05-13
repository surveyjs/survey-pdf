import { IQuestion, ItemValue, QuestionRadiogroupModel, MatrixRowModel, QuestionMatrixModel } from 'survey-core';
import { FlatRepository } from './flat_repository';
import { IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { FlatSelectBase } from './flat_selectbase';

export class FlatRadiogroup extends FlatSelectBase {
    protected question: QuestionRadiogroupModel | QuestionMatrixModel;
    private radioGroupWrap: RadioGroupWrap;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionRadiogroupModel>question;
    }
    createItemBrick(rect: IRect, itemValue: ItemValue, index: number, key?: string, checked?: boolean): IPdfBrick {
        if (index === 0) {
            this.radioGroupWrap = new RadioGroupWrap(this.question.id + ((typeof key === 'undefined') ? '' : key),
                this.controller, this.question.readOnly);
        }

        let isChecked = (typeof checked === 'undefined') ? this.question.value == itemValue.value : checked;
        return new RadioItemBrick(this.question, this.controller, rect,
            index, isChecked, this.radioGroupWrap);
    }
}

FlatRepository.getInstance().register('radiogroup', FlatRadiogroup);