import { IQuestion, QuestionBooleanModel, LocalizableString } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { BooleanItemBrick } from '../pdf_render/pdf_booleanitem'; ''
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { TextBrick } from '../pdf_render/pdf_text';

export class FlatBoolean extends FlatQuestion {
    protected question: QuestionBooleanModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionBooleanModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let height: number = this.controller.measureText().height;
        let composite: CompositeBrick = new CompositeBrick(
            new BooleanItemBrick(this.question, this.controller,
                SurveyHelper.createRect(point, height, height)));
        let text: LocalizableString = this.question.locDisplayLabel;
        if (text.renderedHtml) {
            composite.addBrick(await SurveyHelper.createTextFlat(SurveyHelper.createPoint(
                composite, false, true), this.question, this.controller, text, TextBrick));
        }
        return [composite];
    }
}

FlatRepository.getInstance().register('boolean', FlatBoolean);