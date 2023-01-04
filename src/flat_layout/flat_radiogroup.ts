import { IQuestion, ItemValue, QuestionRadiogroupModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IRect, DocController } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { FlatSelectBase } from './flat_selectbase';

export class FlatRadiogroup extends FlatSelectBase {
    protected question: QuestionRadiogroupModel;
    private radioGroupWrap: RadioGroupWrap;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionRadiogroupModel>question;
    }
    protected isItemSelected(item: ItemValue, checked?: boolean): boolean {
        return (typeof checked === 'undefined') ?
            (item === this.question.otherItem ? this.question.isOtherSelected :
                (item.value === this.question.value ||
                    (typeof this.question.isItemSelected !== 'undefined' &&
                        this.question.isItemSelected(item)))) : checked;
    }
    public generateFlatItem(rect: IRect, item: ItemValue,
        index: number, key?: string, checked?: boolean, context: any = {}): IPdfBrick {
        if (index === 0) {
            this.radioGroupWrap = new RadioGroupWrap(this.question.id + ((typeof key === 'undefined') ? '' : key),
                this.controller, { readOnly: this.question.isReadOnly, question: this.question, ...context });
            (<any>this.question).pdfRadioGroupWrap = this.radioGroupWrap;
        }
        else if (typeof this.radioGroupWrap === 'undefined') {
            this.radioGroupWrap = (<any>this.question).pdfRadioGroupWrap;
        }
        const isChecked: boolean = this.isItemSelected(item, checked);
        return new RadioItemBrick(this.controller, rect,
            { question: this.question, index: index, checked: isChecked, item: item }, this.radioGroupWrap);
    }
}

FlatRepository.getInstance().register('radiogroup', FlatRadiogroup);
FlatRepository.getInstance().register('buttongroup', FlatRadiogroup);