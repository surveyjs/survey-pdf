import { LocalizableString, QuestionBooleanModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper, ITextAppearanceOptions } from '../helper_survey';
import { IStyles } from '../styles';
import { CheckItemBrick, ICheckItemBrickAppearanceOptions } from '../pdf_render/pdf_checkitem';
import { IRadioItemBrickAppearanceOptions, RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
export class FlatBooleanCheckbox extends FlatQuestion<QuestionBooleanModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const isReadOnly = this.question.isReadOnly;
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller,SurveyHelper.mergeObjects({}, this.styles.input, this.styles.checkboxInput) as ICheckItemBrickAppearanceOptions & { width: number; height: number });
        const itemFlat: IPdfBrick = new CheckItemBrick(this.controller, SurveyHelper.createRect(point, appearance.width, appearance.height),
            {
                fieldName: this.question.id,
                readOnly: isReadOnly,
                updateOptions: (options) => this.survey.updateCheckItemAcroformOptions(options, this.question),
                shouldRenderReadOnly: isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
                checked: this.question.booleanValue
            },  appearance);
        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.styles.gapBetweenItemText;
        const locLabelText: LocalizableString = this.question.isIndeterminate ? null :
            this.question.booleanValue ? this.question.locLabelTrue : this.question.locLabelFalse;
        if (locLabelText !== null && locLabelText.renderedHtml !== null) {
            const textFlat = await SurveyHelper.createTextFlat(
                textPoint, this.controller, locLabelText, this.styles.label);
            SurveyHelper.alignVerticallyBricks('center', itemFlat, textFlat.unfold()[0]);
            textFlat.updateRect();
            compositeFlat.addBrick(textFlat);
        }
        return [compositeFlat];
    }
}
export class FlatBoolean extends FlatQuestion<QuestionBooleanModel> {
    private _radioGroupWrap: RadioGroupWrap;
    constructor(protected survey: SurveyPDF,
        question: QuestionBooleanModel, protected controller: DocController, styles: IStyles) {
        super(survey, question, controller, styles);
    }
    protected get radioGroupWrap() {
        if(!this._radioGroupWrap) {
            this._radioGroupWrap = new RadioGroupWrap(this.question.id,
                this.controller, { readOnly: this.question.isReadOnly, question: this.question });
        }
        return this._radioGroupWrap;
    }
    public generateFlatItem(point: IPoint, item: { value: string },
        index: number): IPdfBrick {
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller,SurveyHelper.mergeObjects({}, this.styles.input, this.styles.radioInput) as IRadioItemBrickAppearanceOptions & { width: number; height: number });
        const itemRect: IRect = SurveyHelper.createRect(point, appearance.width, appearance.height);
        const isChecked: boolean = this.question.value == item.value;
        return new RadioItemBrick(this.controller, itemRect, this.radioGroupWrap, {
            index,
            checked: isChecked,
            shouldRenderReadOnly: this.radioGroupWrap.readOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
        }, appearance);
    }
    protected async generateFlatComposite(point: IPoint, item: { value: string, locText: LocalizableString }, index: number): Promise<IPdfBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const textOptions: Partial<ITextAppearanceOptions> = this.styles.label;
        const itemFlat: IPdfBrick = this.generateFlatItem(point, item, index);

        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.styles.gapBetweenItemText;
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
            SurveyHelper.setColumnMargins(this.controller, 2, index, this.styles.gapBetweenColumns);
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
