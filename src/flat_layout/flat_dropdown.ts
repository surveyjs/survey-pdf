import { IQuestion, QuestionDropdownModel, settings } from 'survey-core';
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
    protected async generateItemComment(point: IPoint): Promise<IPdfBrick> {
        const commentModel = this.question.getCommentTextAreaModel(this.question.selectedItem);
        return await SurveyHelper.createCommentFlat(
            point, this.question, this.controller, {
                fieldName: commentModel.id,
                rows: SurveyHelper.OTHER_ROWS_COUNT,
                value: commentModel.getTextValue(),
                shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                isReadOnly: this.question.isReadOnly,
                isMultiline: true,
            }
        );
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const valueBrick = !this.shouldRenderAsComment ? new DropdownBrick(this.question, this.controller, SurveyHelper.createTextFieldRect(point, this.controller)) : await SurveyHelper.createCommentFlat(point, this.question, this.controller,
            {
                fieldName: this.question.id,
                shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
                value: this.question.readOnlyText || '',
                isReadOnly: this.question.isReadOnly,
                placeholder: SurveyHelper.getLocString(this.question.locPlaceholder)
            });
        const compositeFlat: CompositeBrick = new CompositeBrick(valueBrick);
        if (this.question.isShowingChoiceComment) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            otherPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
            compositeFlat.addBrick(await this.generateItemComment(otherPoint));
        }
        return [compositeFlat];
    }
}

FlatRepository.getInstance().register('dropdown', FlatDropdown);