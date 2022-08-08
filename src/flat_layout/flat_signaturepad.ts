import { IQuestion, QuestionSignaturePadModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatSignaturePad extends FlatQuestion {
    protected question: QuestionSignaturePadModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionSignaturePadModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let imageBrick = await SurveyHelper.createImageFlat(point,
            this.question, this.controller, this.question.value,
            SurveyHelper.pxToPt(<any>this.question.signatureWidth),
            SurveyHelper.pxToPt(<any>this.question.signatureHeight)
        );
        return [imageBrick];
    }
}

FlatRepository.getInstance().register('signaturepad', FlatSignaturePad);