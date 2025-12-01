import { QuestionCommentModel, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatComment extends FlatQuestion<QuestionCommentModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller, SurveyHelper.mergeObjects({}, this.styles.input, shouldRenderReadOnly ? this.styles.inputReadOnly : undefined));
        return [await SurveyHelper.createCommentFlat(
            point, this.controller,
            {
                shouldRenderReadOnly,
                rows: this.question.rows,
                isReadOnly: this.question.isReadOnly,
                isMultiline: true,
                fieldName: this.question.id,
                placeholder: SurveyHelper.getLocString(this.question.locPlaceHolder),
                shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                value: this.question.value
            }, SurveyHelper.getPatchedTextAppearanceOptions(this.controller, appearance))];
    }
}

FlatRepository.getInstance().register('comment', FlatComment);