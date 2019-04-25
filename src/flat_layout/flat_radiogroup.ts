import { IQuestion, Question, ItemValue, QuestionCheckboxModel } from 'survey-core';
import { FlatRepository } from './flat_repository';
import { IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { FlatSelectBase } from './flat_selectbase';

export class FlatRadiogroup extends FlatSelectBase {
    protected question: QuestionCheckboxModel;
    private radioGroup: any;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionCheckboxModel>question;
        this.radioGroup = new controller.doc.AcroFormRadioButton();
        this.radioGroup.value = (<Question>question).id;
        this.radioGroup.readOnly = this.question.isReadOnly;
        controller.doc.addField(this.radioGroup);
    }
    public createItemBrick(question: IQuestion, controller: DocController,
        rect: IRect, itemValue: ItemValue, index: number): IPdfBrick {
        return new RadioItemBrick(this.question, this.controller, rect,
            itemValue, index, this.radioGroup, true);
    }
}

FlatRepository.getInstance().register('radiogroup', FlatRadiogroup);