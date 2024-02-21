import { IQuestion, QuestionSignaturePadModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { EmptyBrick } from '../pdf_render/pdf_empty';
import { CompositeBrick } from '../pdf_render/pdf_composite';

export class FlatSignaturePad extends FlatQuestion {
    protected question: QuestionSignaturePadModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionSignaturePadModel>question;
    }

    public async generateBackgroundImage(point: IPoint): Promise<IPdfBrick> {
        return await SurveyHelper.createImageFlat(point, this.question, this.controller, { link: this.question.backgroundImage, width: SurveyHelper.pxToPt(<any>this.question.signatureWidth), height: SurveyHelper.pxToPt(<any>this.question.signatureHeight), objectFit: 'cover' }, true);
    }
    public async generateSign(point: IPoint): Promise<IPdfBrick> {
        const width = SurveyHelper.pxToPt(<any>this.question.signatureWidth);
        const height = SurveyHelper.pxToPt(<any>this.question.signatureHeight);
        if(this.question.value) {
            return await SurveyHelper.createImageFlat(point,
                this.question, this.controller, { link: this.question.value,
                    width: width,
                    height: height }, false
            );
        } else {
            return new EmptyBrick(SurveyHelper.createRect(point, width, height));
        }
    }

    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const compositeBrick = new CompositeBrick();
        if(this.question.backgroundImage) {
            compositeBrick.addBrick(await this.generateBackgroundImage(point));
        }
        compositeBrick.addBrick(await this.generateSign(point));
        return [compositeBrick];
    }
}

FlatRepository.getInstance().register('signaturepad', FlatSignaturePad);