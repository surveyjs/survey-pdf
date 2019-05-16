import { IQuestion, QuestionBooleanModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { BooleanItemBrick } from '../pdf_render/pdf_booleanitem'; ''
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatBoolean extends FlatQuestion {
    protected question: QuestionBooleanModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionBooleanModel>question;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        let height: number = SurveyHelper.measureText().height;
        let composite: CompositeBrick = new CompositeBrick(
            new BooleanItemBrick(this.question, this.controller,
                SurveyHelper.createRect(point, height, height)));
        let text: string = SurveyHelper.getLocString(this.question.locDisplayLabel);
        if (text) {
            composite.addBrick(SurveyHelper.createTextFlat(SurveyHelper.createPoint(
                composite, false, true), this.question, this.controller, text));
        }
        return [composite];
    }
}

FlatRepository.getInstance().register('boolean', FlatBoolean);