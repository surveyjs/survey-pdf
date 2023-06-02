import { IQuestion, QuestionDropdownModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DropdownBrick } from '../pdf_render/pdf_dropdown';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatDropdown extends FlatQuestion {
    protected question: QuestionDropdownModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionDropdownModel>question;
    }
    protected get shouldRenderAsComment(): boolean {
        return this.question.isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform';
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
        if (this.shouldRenderAsComment) {
            const rectWithDinamicBottom: IRect = await SurveyHelper.createReadOnlyTextFieldTextFlat(
                point, this.controller, this.question, SurveyHelper.getDropdownQuestionValue(this.question));
            rect.yBot = Math.max(rect.yBot, rectWithDinamicBottom.yBot + this.controller.unitHeight * SurveyHelper.VALUE_READONLY_PADDING_SCALE);
        }
        const compositeFlat: CompositeBrick = new CompositeBrick(
            new DropdownBrick(this.question, this.controller, rect));
        if (this.question.isOtherSelected) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            otherPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
            compositeFlat.addBrick(await SurveyHelper.createCommentFlat(
                otherPoint, this.question, this.controller, SurveyHelper.OTHER_ROWS_COUNT, false));
        }
        return [compositeFlat];
    }
}

FlatRepository.getInstance().register('dropdown', FlatDropdown);