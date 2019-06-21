import { IQuestion, QuestionExpressionModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { TextFieldBrick } from '../pdf_render/pdf_textfield';

export class FlatExpression extends FlatQuestion {
    protected question: QuestionExpressionModel;
    public constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionExpressionModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
        return [new TextFieldBrick(this.question, this.controller, rect, true,
            this.question.id, ' ' + this.question.displayValue, '', true, false, 'text')];
    }
}

FlatRepository.getInstance().register('expression', FlatExpression);