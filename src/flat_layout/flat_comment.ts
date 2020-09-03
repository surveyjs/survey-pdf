import { IQuestion, QuestionCommentModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CommentBrick } from '../pdf_render/pdf_comment';
import { SurveyHelper } from '../helper_survey';

export class FlatComment extends FlatQuestion {
    protected question: QuestionCommentModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionCommentModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let rect: IRect = SurveyHelper.createTextFieldRect(
            point, this.controller, this.question.rows);
        if (this.question.isReadOnly) {
            let textFlat: IPdfBrick = await SurveyHelper.
                createReadOnlyTextFieldTextFlat(point,
                    this.controller, this.question, this.question.value || '', false);
            let padding: number = this.controller.unitWidth *
                SurveyHelper.VALUE_READONLY_PADDING_SCALE;
            if (textFlat.yBot + padding > rect.yBot) {
                rect.yBot = textFlat.yBot + padding;
            }
        }
        return [new CommentBrick(this.question, this.controller, rect, true)];
    }
}

FlatRepository.getInstance().register('comment', FlatComment);