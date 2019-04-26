import { IQuestion, QuestionCommentModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { CommentBrick } from '../pdf_render/pdf_comment';
import { SurveyHelper } from '../helper_survey';

export class FlatComment extends FlatQuestion {
    protected question: QuestionCommentModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionCommentModel>question;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        let rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller, this.question.rows);
        return [new CommentBrick(this.question, this.controller, rect, true)];
    }
}

FlatRepository.getInstance().register('comment', FlatComment);