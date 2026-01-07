import { ItemValue, QuestionRadiogroupModel } from 'survey-core';
import { IPoint, IRect } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { IRadioItemBrickAppearanceOptions, RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { FlatSelectBase } from './flat_selectbase';
import { SurveyHelper } from '../helper_survey';
import { IQuestionRadiogroupStyle, ISelectionInputStyle } from '../styles/types';

export class FlatRadiogroup extends FlatSelectBase<QuestionRadiogroupModel, IQuestionRadiogroupStyle> {
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
    public generateFlatItem(point: IPoint, item: ItemValue, index: number, styles: ISelectionInputStyle): IPdfBrick {
        const rect: IRect = SurveyHelper.createRect(point, styles.width, styles.height);
        return new RadioItemBrick(this.controller, rect, this.radioGroupWrap, {
            index,
            checked: this.question.isItemSelected(item),
            shouldRenderReadOnly: this.radioGroupWrap.readOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
            updateOptions: options => this.survey.updateRadioItemAcroformOptions(options, this.question, { item }),
        }, SurveyHelper.getPatchedTextAppearanceOptions(this.controller, { ...styles } as IRadioItemBrickAppearanceOptions));
    }
}

FlatRepository.getInstance().register('radiogroup', FlatRadiogroup);
FlatRepository.getInstance().register('buttongroup', FlatRadiogroup);