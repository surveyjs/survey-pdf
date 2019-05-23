import { IQuestion, QuestionTextModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBoxBrick } from '../pdf_render/pdf_textbox';
import { SurveyHelper } from '../helper_survey';

export class FlatTextbox extends FlatQuestion {
    protected question: QuestionTextModel;
    public constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionTextModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let rect: IRect = SurveyHelper.createTextFieldRect(point, this.controller);
        return [new TextBoxBrick(this.question, this.controller, rect)];
    }
}

FlatRepository.getInstance().register('text', FlatTextbox);