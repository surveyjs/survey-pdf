import { ItemValue, LocalizableString, QuestionBooleanModel, QuestionRadiogroupModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { FlatRadiogroup } from './flat_radiogroup';
import { IStyles } from '../styles';
import { CheckItemBrick } from '../pdf_render/pdf_checkitem';

export class FlatBooleanCheckbox extends FlatQuestion<QuestionBooleanModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const height: number = this.controller.unitHeight;
        const isReadOnly = this.question.isReadOnly;
        const itemFlat: IPdfBrick = new CheckItemBrick(this.controller,
            SurveyHelper.moveRect(
                SurveyHelper.scaleRect(SurveyHelper.createRect(point, height, height),
                    SurveyHelper.SELECT_ITEM_FLAT_SCALE), point.xLeft), {
                fieldName: this.question.id,
                readOnly: isReadOnly,
                updateOptions: (options) => this.survey.updateCheckItemAcroformOptions(options, this.question),
                shouldRenderReadOnly: isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
                checked: this.question.booleanValue
            }, {
                fontName: this.styles.checkmarkFont,
                fontColor: this.styles.inputFontColor,
                fontSize: SurveyHelper.getScaledSize(this.controller, this.styles.checkmarkFontSizeScale),
                checkMark: this.styles.checkmarkSymbol,
                fontStyle: 'normal',
                borderColor: this.styles.inputBorderColor,
                borderWidth: SurveyHelper.getScaledSize(this.controller, this.styles.inputBorderWidthScale),
            });
        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + SurveyHelper.getScaledSize(this.controller, this.styles.gapBetweenItemText);
        const locLabelText: LocalizableString = this.question.isIndeterminate ? null :
            this.question.booleanValue ? this.question.locLabelTrue : this.question.locLabelFalse;
        if (locLabelText !== null && locLabelText.renderedHtml !== null) {
            compositeFlat.addBrick(await SurveyHelper.createTextFlat(
                textPoint, this.controller, locLabelText));
        }
        return [compositeFlat];
    }
}
export class FlatBoolean extends FlatRadiogroup {
    private items: Array<ItemValue>;
    constructor(protected survey: SurveyPDF,
        question: QuestionRadiogroupModel, protected controller: DocController, styles: IStyles) {
        super(survey, question, controller, styles);
        this.buildItems();
    }
    private buildItems() {
        const question = this.question as any as QuestionBooleanModel;
        const falseChoice = new ItemValue(question.valueFalse !== undefined ? question.valueFalse : false);
        const trueChoice = new ItemValue(question.valueTrue !== undefined ? question.valueTrue : true);
        falseChoice.locOwner = question;
        falseChoice.setLocText(question.locLabelFalse);
        trueChoice.locOwner = question;
        trueChoice.setLocText(question.locLabelTrue);
        this.items = [falseChoice, trueChoice];
    }
    protected getVisibleChoices(): Array<ItemValue> {
        return this.items;
    }
    protected getColCount(): number {
        return 0;
    }
}

FlatRepository.getInstance().register('boolean', FlatBoolean);
FlatRepository.getInstance().register('boolean-checkbox', FlatBooleanCheckbox);
