import { IQuestion, QuestionExpressionModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { SurveyHelper } from '../helper_survey';

export class FlatExpression extends FlatQuestion {
    protected question: QuestionExpressionModel;
    public constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionExpressionModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
        return [await SurveyHelper.createTextFlat(point, this.question, this.controller,
            this.question.displayValue, TextBrick)];
    }
}

FlatRepository.getInstance().register('expression', FlatExpression);