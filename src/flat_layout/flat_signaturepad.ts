import { IQuestion, QuestionSignaturePadModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { EmptyBrick } from '../pdf_render/pdf_empty';

export class FlatSignaturePad extends FlatQuestion {
    protected question: QuestionSignaturePadModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionSignaturePadModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const width = SurveyHelper.pxToPt(<any>this.question.signatureWidth);
        const height = SurveyHelper.pxToPt(<any>this.question.signatureHeight);
        let imageBrick: IPdfBrick;
        if(this.question.value) {
            imageBrick = await SurveyHelper.createImageFlat(point,
                this.question, this.controller, this.question.value,
                width,
                height
            );
        } else {
            imageBrick = new EmptyBrick(SurveyHelper.createRect(point, width, height));

        }
        return [imageBrick];
    }
}

FlatRepository.getInstance().register('signaturepad', FlatSignaturePad);