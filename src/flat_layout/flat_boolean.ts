import { LocalizableString, QuestionBooleanModel } from 'survey-core';
import { IPoint, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { CheckItemBrick } from '../pdf_render/pdf_checkitem';
import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { IQuestionBooleanStyle, ISelectionInputStyle, ITextStyle } from '../style/types';
export class FlatBooleanCheckbox extends FlatQuestion<QuestionBooleanModel, IQuestionBooleanStyle> {
    public getInputStyle(isReadOnly: boolean, isChecked: boolean): ISelectionInputStyle {
        const style = SurveyHelper.mergeObjects({}, this.style.input, this.style.checkboxInput);
        if(isReadOnly) {
            SurveyHelper.mergeObjects(style, this.style.inputReadOnly, this.style.checkboxInputReadOnly);
            if(isChecked) {
                SurveyHelper.mergeObjects(style, this.style.inputReadOnlyChecked, this.style.checkboxInputReadOnlyChecked);
            }
        }
        return style;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const isReadOnly = this.question.isReadOnly;
        const shouldRenderReadOnly = isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress;
        const style = SurveyHelper.getPatchedTextStyle(this.controller, this.getInputStyle(isReadOnly, this.question.booleanValue));
        const itemFlat: IPdfBrick = new CheckItemBrick(this.controller, SurveyHelper.createRect(point, style.width, style.height),
            {
                fieldName: this.question.id,
                readOnly: isReadOnly,
                updateOptions: (options) => this.survey.updateCheckItemAcroformOptions(options, this.question),
                shouldRenderReadOnly,
                checked: this.question.booleanValue
            }, style);
        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.style.spacing.choiceTextGap;
        const locLabelText: LocalizableString = this.question.isIndeterminate ? null :
            this.question.booleanValue ? this.question.locLabelTrue : this.question.locLabelFalse;
        if (locLabelText !== null && locLabelText.renderedHtml !== null) {
            const textFlat = await SurveyHelper.createTextFlat(
                textPoint, this.controller, locLabelText, this.style.choiceText);
            SurveyHelper.alignVerticallyBricks('center', itemFlat, textFlat.unfold()[0]);
            textFlat.updateRect();
            compositeFlat.addBrick(textFlat);
        }
        return [compositeFlat];
    }
}
export class FlatBoolean extends FlatQuestion<QuestionBooleanModel, IQuestionBooleanStyle> {
    private _radioGroupWrap: RadioGroupWrap;
    public getInputStyle(isReadOnly: boolean, isChecked: boolean): ISelectionInputStyle {
        const style = SurveyHelper.mergeObjects({}, this.style.input, this.style.radioInput);
        if(isReadOnly) {
            SurveyHelper.mergeObjects(style, this.style.inputReadOnly, this.style.radioInputReadOnly);
            if(isChecked) {
                SurveyHelper.mergeObjects(style, this.style.inputReadOnlyChecked, this.style.radioInputReadOnlyChecked);
            }
        }
        return style;
    }
    protected get radioGroupWrap() {
        if(!this._radioGroupWrap) {
            this._radioGroupWrap = new RadioGroupWrap(
                this.controller, {
                    readOnly: this.question.isReadOnly,
                    fieldName: this.question.id,
                    updateOptions: (options) => { this.survey.getUpdatedRadioGroupWrapOptions(options, this.question); }
                });
        }
        return this._radioGroupWrap;
    }
    public generateFlatItem(point: IPoint, item: { value: string },
        index: number): IPdfBrick {
        const isChecked: boolean = this.question.value == item.value;
        const shouldRenderReadOnly = this.radioGroupWrap.readOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress;
        const style = SurveyHelper.getPatchedTextStyle(this.controller, this.getInputStyle(shouldRenderReadOnly, isChecked));
        const itemRect: IRect = SurveyHelper.createRect(point, style.width, style.height);
        return new RadioItemBrick(this.controller, itemRect, this.radioGroupWrap, {
            index,
            checked: isChecked,
            shouldRenderReadOnly
        }, style);
    }
    protected async generateFlatComposite(point: IPoint, item: { value: string, locText: LocalizableString }, index: number): Promise<IPdfBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const textOptions: Partial<ITextStyle> = this.style.choiceText;
        const itemFlat: IPdfBrick = this.generateFlatItem(point, item, index);

        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.style.spacing.choiceTextGap;
        if (item.locText.renderedHtml !== null) {
            const textFlat = await SurveyHelper.createTextFlat(
                textPoint, this.controller, item.locText, textOptions);
            SurveyHelper.alignVerticallyBricks('center', itemFlat, textFlat.unfold()[0]);
            textFlat.updateRect();
            compositeFlat.addBrick(textFlat);
        }
        return compositeFlat;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const currPoint = SurveyHelper.clone(point);
        const rowFlat: CompositeBrick = new CompositeBrick();
        const items = [
            {
                locText: this.question.locLabelFalse,
                value: this.question.valueFalse !== undefined ? this.question.valueFalse : false
            },
            {
                locText: this.question.locLabelTrue,
                value: this.question.valueTrue !== undefined ? this.question.valueTrue : true
            }
        ];
        let index = 0;
        for(let item of items) {
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, 2, index, this.style.spacing.choiceColumnGap);
            currPoint.xLeft = this.controller.margins.left;
            const itemFlat: IPdfBrick = await this.generateFlatComposite(
                currPoint, item, index);
            rowFlat.addBrick(itemFlat);
            this.controller.popMargins();
            index++;
        }
        const rowLineFlat: IPdfBrick = SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(rowFlat), this.controller);
        return [rowFlat, rowLineFlat];
    }
}

FlatRepository.getInstance().register('boolean', FlatBoolean);
FlatRepository.getInstance().register('boolean-checkbox', FlatBooleanCheckbox);
