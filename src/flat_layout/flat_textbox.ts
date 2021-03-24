import { IQuestion, QuestionTextModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBoxBrick } from '../pdf_render/pdf_textbox';
import { SurveyHelper } from '../helper_survey';

export class FlatTextbox extends FlatQuestion {
    protected question: QuestionTextModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionTextModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
        return [new TextBoxBrick(this.question, this.controller, rect)];
    }
}

FlatRepository.getInstance().register('text', FlatTextbox);