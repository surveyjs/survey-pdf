import { IQuestion, QuestionTextModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { FlatRepository } from './flat_repository';
import { TextFieldBrick } from '../pdf_render/pdf_textfield';
import { SurveyHelper } from '../helper_survey';

export class FlatTextbox extends FlatQuestion {
    protected question: QuestionTextModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionTextModel>question;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        let rect: IRect = SurveyHelper.measureTextFieldRect(point, this.controller);
        return [new TextFieldBrick(this.question, this.controller, rect)];
    }
}

FlatRepository.getInstance().register("text", FlatTextbox);