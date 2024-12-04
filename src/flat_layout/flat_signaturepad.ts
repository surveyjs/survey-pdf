import { IQuestion, QuestionSignaturePadModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController, IRect, ISize } from '../doc_controller';
import { IPdfBrick, PdfBrick } from '../pdf_render/pdf_brick';
import { IBorderDescription, SurveyHelper } from '../helper_survey';
import { EmptyBrick } from '../pdf_render/pdf_empty';
import { CompositeBrick } from '../pdf_render/pdf_composite';

export class FlatSignaturePad extends FlatQuestion {
    protected question: QuestionSignaturePadModel;
    public static BORDER_STYLE: 'dashed' | 'solid' | 'none' = 'dashed';
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionSignaturePadModel>question;
    }

    public async generateBackgroundImage(point: IPoint): Promise<IPdfBrick> {
        return await SurveyHelper.createImageFlat(point, this.question, this.controller, { link: this.question.backgroundImage, width: SurveyHelper.pxToPt(<any>this.question.signatureWidth), height: SurveyHelper.pxToPt(<any>this.question.signatureHeight), objectFit: 'cover' }, true);
    }
    private getSignImageUrl() {
        return this.question.storeDataAsText || !this.question.loadedData ? this.question.value : this.question.loadedData;
    }
    public async generateSign(point: IPoint): Promise<IPdfBrick> {
        const width = SurveyHelper.pxToPt(<any>this.question.signatureWidth);
        const height = SurveyHelper.pxToPt(<any>this.question.signatureHeight);
        let brick: PdfBrick;
        if(this.question.value) {
            brick = await SurveyHelper.createImageFlat(point,
                this.question, this.controller, { link: this.getSignImageUrl(),
                    width: width,
                    height: height }, false
            ) as PdfBrick;
        } else {
            brick = new EmptyBrick(SurveyHelper.createRect(point, width, height));
        }
        if(FlatSignaturePad.BORDER_STYLE !== 'none') {
            brick.afterRenderCallback = () => {
                const borderOptions: IBorderDescription = {
                    height: brick.width,
                    width: brick.width,
                    yTop: brick.yTop,
                    yBot: brick.yBot,
                    xLeft: brick.xLeft,
                    xRight: brick.xRight,
                    formBorderColor: brick.formBorderColor,
                    rounded: false,
                    outside: true,
                    dashStyle: FlatSignaturePad.BORDER_STYLE == 'dashed' ? {
                        dashArray: [5],
                        dashPhase: 0
                    } : undefined
                };
                SurveyHelper.renderFlatBorders(this.controller, borderOptions);
            };
        }

        return brick;
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