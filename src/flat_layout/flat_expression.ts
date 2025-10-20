import { QuestionExpressionModel, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { IInputAppearanceOptions, SurveyHelper } from '../helper_survey';

export class FlatExpression extends FlatQuestion<QuestionExpressionModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return [await SurveyHelper.createCommentFlat(point, this.question, this.controller, {
            value: this.question.displayValue,
            isReadOnly: true,
            fieldName: this.question.id,
            shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
        }, SurveyHelper.getPatchedTextAppearanceOptions(this.controller, this.styles.input as IInputAppearanceOptions))];
    }
}

FlatRepository.getInstance().register('expression', FlatExpression);