import { QuestionExpressionModel, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { IQuestionExpressionStyle, IInputStyle } from '../style/types';

export class FlatExpression extends FlatQuestion<QuestionExpressionModel, IQuestionExpressionStyle> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return [await SurveyHelper.createCommentFlat(point, this.controller, {
            value: this.question.displayValue,
            isReadOnly: true,
            shouldRenderReadOnly: SurveyHelper.shouldRenderReadOnly(this.question, this.controller, true),
            fieldName: this.question.id,
            shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
        }, SurveyHelper.getPatchedTextStyle(this.controller, this.style.input as IInputStyle))];
    }
}

FlatRepository.getInstance().register('expression', FlatExpression);