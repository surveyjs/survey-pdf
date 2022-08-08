import { IQuestion, QuestionCustomModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';

export class FlatCustomModel extends FlatQuestion {
    constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const flat = FlatRepository.getInstance().create(this.survey, this.question, this.controller, this.question.getType());
        return flat.generateFlatsContent(point);
    }
}

FlatRepository.getInstance().register('custom_model', FlatCustomModel);