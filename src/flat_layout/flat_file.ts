import { IQuestion, QuestionFileModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatFile extends FlatQuestion {
    protected question: QuestionFileModel;
    constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionFileModel>question;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        return null;
    }
}

FlatRepository.getInstance().register('file', FlatFile);