import { IQuestion, ItemValue, LocalizableString, QuestionBooleanModel, QuestionRadiogroupModel, SurveyModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { BooleanItemBrick } from '../pdf_render/pdf_booleanitem';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { FlatRadiogroup } from './flat_radiogroup';

export class FlatBooleanCheckbox extends FlatQuestion {
    protected question: QuestionBooleanModel;
    constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionBooleanModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const height: number = this.controller.unitHeight;
        const itemFlat: IPdfBrick = new BooleanItemBrick(this.question, this.controller,
            SurveyHelper.moveRect(
                SurveyHelper.scaleRect(SurveyHelper.createRect(point, height, height),
                    SurveyHelper.SELECT_ITEM_FLAT_SCALE), point.xLeft));
        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const locLabelText: LocalizableString = this.question.isIndeterminate ? null :
            this.question.checkedValue ? this.question.locLabelTrue : this.question.locLabelFalse;
        if (locLabelText !== null && locLabelText.renderedHtml !== null) {
            compositeFlat.addBrick(await SurveyHelper.createTextFlat(
                textPoint, this.question, this.controller, locLabelText, TextBrick));
        }
        return [compositeFlat];
    }
}
export class FlatBoolean extends FlatRadiogroup {
    private items: Array<ItemValue>;
    constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.buildItems();
    }
    private buildItems() {
        const question = <QuestionBooleanModel>(<any>this.question);
        const falseChoice = new ItemValue((<QuestionBooleanModel>question).valueFalse !== undefined ? (<QuestionBooleanModel>question).valueFalse : false);
        const trueChoice = new ItemValue((<QuestionBooleanModel>question).valueTrue !== undefined ? (<QuestionBooleanModel>question).valueTrue : true);
        falseChoice.locOwner = question;
        falseChoice.setLocText((<QuestionBooleanModel>question).locLabelFalse);
        trueChoice.locOwner = question;
        trueChoice.setLocText((<QuestionBooleanModel>question).locLabelTrue);
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
