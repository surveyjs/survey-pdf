import { ItemValue, QuestionCheckboxModel, QuestionTagboxModel } from 'survey-core';
import { IPoint, IRect } from '../doc_controller';
import { FlatSelectBase } from './flat_selectbase';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CheckItemBrick, ICheckItemBrickAppearanceOptions } from '../pdf_render/pdf_checkitem';
import { SurveyHelper } from '../helper_survey';

export class FlatCheckbox<T extends QuestionCheckboxModel = QuestionCheckboxModel> extends FlatSelectBase<T> {
    public generateFlatItem(point: IPoint, item: ItemValue, index: number): IPdfBrick {
        const rect: IRect = SurveyHelper.createRect(point, this.styles.input.width, this.styles.input.height);
        const isReadOnly = this.question.isReadOnly || !item.isEnabled;
        const shouldRenderReadOnly = isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress;
        const isChecked = this.question.isItemSelected(item);
        return new CheckItemBrick(this.controller, rect,
            {
                shouldRenderReadOnly,
                readOnly: isReadOnly,
                checked: this.question.isItemSelected(item),
                fieldName: this.question.id + 'index' + index,
                updateOptions: (options) => {
                    this.survey.updateCheckItemAcroformOptions(options, this.question, { item });
                }
            }, SurveyHelper.getPatchedTextAppearanceOptions(this.controller,
                SurveyHelper.mergeObjects({}, this.styles.input,
                    shouldRenderReadOnly ? this.styles.inputReadOnly : {},
                    shouldRenderReadOnly && isChecked ? this.styles.inputReadOnlyChecked : {}
                )));
    }
}
export class FlatTagbox extends FlatCheckbox<QuestionTagboxModel> {
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