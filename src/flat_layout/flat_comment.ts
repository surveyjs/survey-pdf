import { QuestionCommentModel, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { IInputAppearanceOptions, SurveyHelper } from '../helper_survey';

export class FlatComment extends FlatQuestion<QuestionCommentModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return [await SurveyHelper.createCommentFlat(
            point, this.question, this.controller,
            {
                rows: this.question.rows,
                isReadOnly: this.question.isReadOnly,
                isMultiline: true,
                fieldName: this.question.id,
                placeholder: SurveyHelper.getLocString(this.question.locPlaceHolder),
                shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                value: this.question.value
            }, SurveyHelper.getPatchedTextAppearanceOptions(this.controller, this.styles.input as IInputAppearanceOptions))];
    }
}

FlatRepository.getInstance().register('comment', FlatComment);