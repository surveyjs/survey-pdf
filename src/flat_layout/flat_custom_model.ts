import { QuestionCustomModel } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';

export class FlatCustomModel extends FlatQuestion<QuestionCustomModel> {
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const flat = FlatRepository.getInstance().create(this.survey, this.question, this.controller, this.survey.getElementStyle(this.question), this.question.getType());
        return flat.generateFlatsContent(point);
    }
}

FlatRepository.getInstance().register('custom_model', FlatCustomModel);