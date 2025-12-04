import { QuestionDropdownModel, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DropdownBrick } from '../pdf_render/pdf_dropdown';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { IInputAppearanceOptions, SurveyHelper } from '../helper_survey';

export class FlatDropdown extends FlatQuestion<QuestionDropdownModel> {
    protected async generateItemComment(point: IPoint): Promise<IPdfBrick> {
        const commentModel = this.question.getCommentTextAreaModel(this.question.selectedItem);
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller, SurveyHelper.mergeObjects({}, this.styles.comment, shouldRenderReadOnly ? this.styles.commentReadOnly : undefined));
        return await SurveyHelper.createCommentFlat(
            point, this.controller, {
                shouldRenderReadOnly,
                fieldName: commentModel.id,
                rows: this.controller.otherRowsCount,
                value: commentModel.getTextValue(),
                shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                isReadOnly: this.question.isReadOnly,
                isMultiline: true,
            }, SurveyHelper.getPatchedTextAppearanceOptions(this.controller, appearance)
        );
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller, SurveyHelper.mergeObjects({}, this.styles.input, shouldRenderReadOnly ? this.styles.inputReadOnly : undefined));
        const valueBrick = !shouldRenderReadOnly ? new DropdownBrick(this.controller, SurveyHelper.createTextFieldRect(point, this.controller, 1, appearance.lineHeight), {
            fieldName: this.question.id,
            value: this.question.readOnlyText,
            isReadOnly: this.question.isReadOnly,
            optionsCaption: this.question.optionsCaption,
            showOptionsCaption: this.question.showOptionsCaption,
            items: this.question.visibleChoices.map(item => SurveyHelper.getLocString(item.locText))
        }, appearance) : await SurveyHelper.createCommentFlat(point, this.controller,
            {
                fieldName: this.question.id,
                shouldRenderReadOnly: shouldRenderReadOnly,
                shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
                value: this.question.readOnlyText || '',
                isReadOnly: this.question.isReadOnly,
                placeholder: SurveyHelper.getLocString(this.question.locPlaceholder)
            }, appearance);
        const compositeFlat: CompositeBrick = new CompositeBrick(valueBrick);
        if (this.question.isShowingChoiceComment) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            otherPoint.yTop += this.styles.gapBetweenRows;
            compositeFlat.addBrick(await this.generateItemComment(otherPoint));
        }
        return [compositeFlat];
    }
}

FlatRepository.getInstance().register('dropdown', FlatDropdown);