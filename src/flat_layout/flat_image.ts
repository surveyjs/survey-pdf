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
    private isSizeEmpty(val: any) {
        return !val || val === 'auto';
    }
    private async getCorrectImageSize(): Promise<ISize> {
        let widthPt: number = SurveyHelper.pxToPt(<any>this.question.imageWidth);
        let heightPt: number = SurveyHelper.pxToPt(<any>this.question.imageHeight);
        if(this.isSizeEmpty(this.question.imageWidth) || this.isSizeEmpty(this.question.imageHeight)) {
            const imageSize = await SurveyHelper.getImageSize(this.question.imageLink);
            if(!this.isSizeEmpty(this.question.imageWidth)) {
                if(imageSize && imageSize.width) {
                    heightPt = imageSize.height * widthPt / imageSize.width;
                } else {
                    heightPt = 0;
                }
            }
            if(!this.isSizeEmpty(this.question.imageHeight)) {
                if(imageSize && imageSize.height) {
                    widthPt = imageSize.width * heightPt / imageSize.height;
                } else {
                    widthPt = 0;
                }
            }
        }
        return { width: widthPt, height: heightPt };
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const imageSize = await this.getCorrectImageSize();
        return [await SurveyHelper.createImageFlat(point, this.question,
            this.controller, this.question.imageLink, imageSize.width, imageSize.height)];
    }
}

FlatRepository.getInstance().register('image', FlatImage);