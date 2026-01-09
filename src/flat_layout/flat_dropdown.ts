import { QuestionDropdownModel, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DropdownBrick } from '../pdf_render/pdf_dropdown';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { IQuestionDropdownStyle } from '../style/types';

export class FlatDropdown extends FlatQuestion<QuestionDropdownModel, IQuestionDropdownStyle> {
    protected async generateItemComment(point: IPoint): Promise<IPdfBrick> {
        const commentModel = this.question.getCommentTextAreaModel(this.question.selectedItem);
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const style = SurveyHelper.getPatchedTextStyle(this.controller, SurveyHelper.mergeObjects({}, this.style.comment, shouldRenderReadOnly ? this.style.commentReadOnly : undefined));
        return await SurveyHelper.createCommentFlat(
            point, this.controller, {
                shouldRenderReadOnly,
                fieldName: commentModel.id,
                rows: this.controller.otherRowsCount,
                value: commentModel.getTextValue(),
                shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                isReadOnly: this.question.isReadOnly,
                isMultiline: true,
            }, SurveyHelper.getPatchedTextStyle(this.controller, style)
        );
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const style = SurveyHelper.getPatchedTextStyle(this.controller, SurveyHelper.mergeObjects({}, this.style.input, shouldRenderReadOnly ? this.style.inputReadOnly : undefined));
        const valueBrick = !shouldRenderReadOnly ? new DropdownBrick(this.controller, SurveyHelper.createTextFieldRect(point, this.controller, 1, style.lineHeight), {
            fieldName: this.question.id,
            value: this.question.readOnlyText,
            isReadOnly: this.question.isReadOnly,
            optionsCaption: this.question.optionsCaption,
            showOptionsCaption: this.question.showOptionsCaption,
            items: this.question.visibleChoices.map(item => SurveyHelper.getLocString(item.locText))
        }, style) : await SurveyHelper.createCommentFlat(point, this.controller,
            {
                fieldName: this.question.id,
                shouldRenderReadOnly: shouldRenderReadOnly,
                shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
                value: this.question.readOnlyText || '',
                isReadOnly: this.question.isReadOnly,
                placeholder: SurveyHelper.getLocString(this.question.locPlaceholder)
            }, style);
        const compositeFlat: CompositeBrick = new CompositeBrick(valueBrick);
        if (this.question.isShowingChoiceComment) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            otherPoint.yTop += this.style.spacing.contentCommentGap;
            compositeFlat.addBrick(await this.generateItemComment(otherPoint));
        }
        return [compositeFlat];
    }
}

FlatRepository.getInstance().register('dropdown', FlatDropdown);