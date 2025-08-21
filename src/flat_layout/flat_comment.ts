import { QuestionCommentModel, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

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
            }, {
                fontName: this.controller.fontName,
                fontColor: this.styles.textColor,
                fontSize: SurveyHelper.getScaledFontSize(this.controller, this.styles.inputFontSizeScale),
                fontStyle: 'normal',
                borderColor: SurveyHelper.FORM_BORDER_COLOR,
                borderWidth: SurveyHelper.getScaledSize(this.controller, this.styles.borderScale),
            })];
    }
}

FlatRepository.getInstance().register('comment', FlatComment);