import { IQuestion, QuestionCommentModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatComment extends FlatQuestion {
    protected question: QuestionCommentModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionCommentModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return [await SurveyHelper.createCommentFlat(
            point, this.question, this.controller, true, { rows: this.question.rows })];
    }
}

FlatRepository.getInstance().register('comment', FlatComment);