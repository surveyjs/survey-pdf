import { IQuestion, QuestionExpressionModel, settings } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatExpression extends FlatQuestion {
    protected question: QuestionExpressionModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionExpressionModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return [await SurveyHelper.createCommentFlat(point, this.question, this.controller, {
            value: this.question.displayValue,
            isReadOnly: true,
            fieldName: this.question.id,
            shouldRenderBorders: settings.readOnlyTextRenderMode === 'input',
        })];
    }
}

FlatRepository.getInstance().register('expression', FlatExpression);