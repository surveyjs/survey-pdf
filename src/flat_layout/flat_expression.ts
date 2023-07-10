import { IQuestion, QuestionExpressionModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextFieldBrick } from '../pdf_render/pdf_textfield';
import { SurveyHelper } from '../helper_survey';

export class FlatExpression extends FlatQuestion {
    protected question: QuestionExpressionModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionExpressionModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return [await SurveyHelper.createCommentFlat(point, this.question, this.controller, true, { value: this.question.displayValue, readOnly: true })];
    }
}

FlatRepository.getInstance().register('expression', FlatExpression);