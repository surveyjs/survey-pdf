import { ItemValue, QuestionCheckboxModel, QuestionTagboxModel } from 'survey-core';
import { IRect } from '../doc_controller';
import { FlatSelectBase } from './flat_selectbase';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CheckItemBrick } from '../pdf_render/pdf_checkitem';
import { SurveyHelper } from '../helper_survey';

export class FlatCheckbox<T extends QuestionCheckboxModel = QuestionCheckboxModel> extends FlatSelectBase<T> {
    public generateFlatItem(rect: IRect, item: ItemValue, index: number): IPdfBrick {
        const isReadOnly = this.question.isReadOnly || !item.isEnabled;
        return new CheckItemBrick(this.controller, rect,
            {
                shouldRenderReadOnly: isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
                readOnly: isReadOnly,
                checked: this.question.isItemSelected(item),
                fieldName: this.question.id + 'index' + index,
                updateOptions: (options) => {
                    this.survey.updateCheckItemAcroformOptions(options, this.question, item);
                }
            },
            {
                fontName: this.styles.checkmarkFont,
                fontColor: this.styles.formBorderColor,
                fontSize: SurveyHelper.getScaledFontSize(this.controller, this.styles.checkmarkFontSizeScale),
                checkMark: this.styles.checkmarkSymbol,
                fontStyle: 'normal'
            });
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