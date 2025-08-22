import { ItemValue, QuestionRadiogroupModel } from 'survey-core';
import { IRect } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { FlatSelectBase } from './flat_selectbase';
import { SurveyHelper } from '../helper_survey';

export class FlatRadiogroup extends FlatSelectBase<QuestionRadiogroupModel> {
    protected question: QuestionRadiogroupModel;
    private radioGroupWrap: RadioGroupWrap;
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
        return new RadioItemBrick(this.controller, rect, this.radioGroupWrap, {
            index,
            checked: isChecked,
            shouldRenderReadOnly: this.radioGroupWrap.readOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
            updateOptions: options => this.survey.updateRadioItemAcroformOptions(options, this.question, item),
        },
        {
            fontName: this.styles.inputFont,
            fontSize: SurveyHelper.getScaledSize(this.controller, this.styles.inputFontSizeScale),
            fontColor: this.styles.inputFontColor,
            fontStyle: 'normal',
            checkMark: this.styles.inputSymbol,
            borderColor: this.styles.inputBorderColor,
            borderWidth: SurveyHelper.getScaledSize(this.controller, this.styles.inputBorderWidthScale),
        });
    }
}

FlatRepository.getInstance().register('radiogroup', FlatRadiogroup);
FlatRepository.getInstance().register('buttongroup', FlatRadiogroup);