import { IQuestion, QuestionImageModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController, ISize } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatImage extends FlatQuestion {
    protected question: QuestionImageModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionImageModel>question;
    }
    private async getCorrectImageSize(): Promise<ISize> {
        return await SurveyHelper.getCorrectedImageSize(this.controller, { imageWidth: this.question.imageWidth, imageHeight: this.question.imageHeight, imageLink: this.question.imageLink });
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const imageSize = await this.getCorrectImageSize();
        return [await SurveyHelper.createImageFlat(point, this.question,
            this.controller, { link: this.question.imageLink, width: imageSize.width, height: imageSize.height })];
    }
}

FlatRepository.getInstance().register('image', FlatImage);