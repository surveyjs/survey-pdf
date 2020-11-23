import { IQuestion, QuestionCommentModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
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
            point, this.question, this.controller, this.question.rows, true)];
    }
}

FlatRepository.getInstance().register('comment', FlatComment);