import { ItemValue, QuestionRadiogroupModel } from 'survey-core';
import { IPoint, IRect } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { IRadioItemBrickAppearanceOptions, RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { FlatSelectBase } from './flat_selectbase';
import { SurveyHelper } from '../helper_survey';

export class FlatRadiogroup extends FlatSelectBase<QuestionRadiogroupModel> {
    private _radioGroupWrap: RadioGroupWrap;
    private get radioGroupWrap(): RadioGroupWrap {
        if(!this._radioGroupWrap) {
            this._radioGroupWrap = new RadioGroupWrap(
                this.controller, {
                    readOnly: this.question.isReadOnly,
                    fieldName: this.question.id,
                    updateOptions: (options) => {
                        this.survey.getUpdatedRadioGroupWrapOptions(options, this.question); }
                });
        }
        return this._radioGroupWrap;
    }
    protected isItemSelected(item: ItemValue, checked?: boolean): boolean {
        return (typeof checked === 'undefined') ?
            (item === this.question.otherItem ? this.question.isOtherSelected :
                (item.value === this.question.value ||
                    (typeof this.question.isItemSelected !== 'undefined' &&
                        this.question.isItemSelected(item)))) : checked;
    }
    public generateFlatItem(point: IPoint, item: ItemValue, index: number): IPdfBrick {
        const rect: IRect = SurveyHelper.createRect(point,
            this.styles.input.width, this.styles.input.height);
        const isChecked: boolean = this.isItemSelected(item);
        return new RadioItemBrick(this.controller, rect, this.radioGroupWrap, {
            index,
            checked: isChecked,
            shouldRenderReadOnly: this.radioGroupWrap.readOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
            updateOptions: options => this.survey.updateRadioItemAcroformOptions(options, this.question, { item }),
        }, SurveyHelper.getPatchedTextAppearanceOptions(this.controller, this.styles.input as IRadioItemBrickAppearanceOptions));
    }
}

FlatRepository.getInstance().register('radiogroup', FlatRadiogroup);
FlatRepository.getInstance().register('buttongroup', FlatRadiogroup);