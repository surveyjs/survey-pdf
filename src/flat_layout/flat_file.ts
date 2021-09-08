import { IQuestion, QuestionFileModel, surveyLocalization } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, ISize, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatFile extends FlatQuestion {
    public static readonly IMAGE_GAP_SCALE: number = 0.195;
    public static readonly TEXT_MIN_SCALE: number = 5.0;
    protected question: QuestionFileModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionFileModel>question;
    }
    private async generateFlatItem(point: IPoint, item: {
        name: string, type: string, content: string
    }): Promise<IPdfBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.createLinkFlat(
            point, this.question, this.controller, item.name === undefined ? 'image' : item.name, item.content));
        if (SurveyHelper.canPreviewImage(this.question, item, item.content)) {
            const imageSize: ISize = {width: 0, height: 0};
            // await SurveyHelper.getImageSize(item.content); 
            if (this.question.imageWidth) {
                imageSize.width = SurveyHelper.parseWidth(this.question.imageWidth,
                    SurveyHelper.getPageAvailableWidth(this.controller));
            }
            if (this.question.imageHeight) {
                imageSize.height = SurveyHelper.parseWidth(this.question.imageHeight,
                    SurveyHelper.getPageAvailableWidth(this.controller));
            }
            const imagePoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            imagePoint.yTop += this.controller.unitHeight *
                FlatFile.IMAGE_GAP_SCALE;
            compositeFlat.addBrick(SurveyHelper.createImageFlat(
                imagePoint, this.question, this.controller, item.content,
                imageSize.width, imageSize.height));
        }
        return compositeFlat;
    }
    private addLine(rowsFlats: CompositeBrick[], currPoint: IPoint, index: number): void {
        if (index !== this.question.previewValue.length - 1) {
            rowsFlats[rowsFlats.length - 1].addBrick(
                SurveyHelper.createRowlineFlat(currPoint, this.controller));
            currPoint.yTop += SurveyHelper.EPSILON;
            rowsFlats.push(new CompositeBrick());
        }
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        if (this.question.previewValue.length === 0) {
            return [await SurveyHelper.createTextFlat(point, this.question,
                this.controller, surveyLocalization.getString('noFileChosen'), TextBrick)];
        }
        const rowsFlats: CompositeBrick[] = [new CompositeBrick()];
        const currPoint: IPoint = SurveyHelper.clone(point);
        let yBot: number = currPoint.yTop;
        for (let i: number = 0; i < this.question.previewValue.length; i++) {
            const item: { name: string, type: string, content: string } = this.question.previewValue[i];
            const availableWidth: number = this.controller.paperWidth -
                this.controller.margins.right - currPoint.xLeft;
            if (SurveyHelper.canPreviewImage(this.question, item, item.content)) {
                let imageWidth = 0;
                if (this.question.imageWidth !== undefined) {
                    imageWidth = SurveyHelper.parseWidth(this.question.imageWidth,
                            SurveyHelper.getPageAvailableWidth(this.controller));
                } else {
                    imageWidth = (await SurveyHelper.getImageSize(item.content)).width;
                }
                const compositeWidth: number = Math.max(imageWidth, 
                    FlatFile.TEXT_MIN_SCALE * this.controller.unitWidth);
                if (availableWidth < compositeWidth) {
                    currPoint.xLeft = point.xLeft;
                    currPoint.yTop = yBot;
                    this.addLine(rowsFlats, currPoint, i);
                }
                this.controller.pushMargins(currPoint.xLeft,
                    this.controller.paperWidth - currPoint.xLeft - compositeWidth);
                const itemFlat: IPdfBrick = await this.generateFlatItem(currPoint, item);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                currPoint.xLeft += itemFlat.width;
                yBot = Math.max(yBot, itemFlat.yBot);
                this.controller.popMargins();
            }
            else {
                if (availableWidth < this.controller.unitWidth) {
                    currPoint.xLeft = point.xLeft;
                    currPoint.yTop = yBot;
                    this.addLine(rowsFlats, currPoint, i);
                }
                const itemFlat: IPdfBrick = await this.generateFlatItem(currPoint, item);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                currPoint.xLeft += itemFlat.xRight - itemFlat.xLeft;
                yBot = Math.max(yBot, itemFlat.yBot);
            }
            currPoint.xLeft += this.controller.unitWidth;
        };
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('file', FlatFile);