import { IQuestion, QuestionFileModel, surveyLocalization } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, ISize, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatFile extends FlatQuestion<QuestionFileModel> {
    public static readonly IMAGE_GAP_SCALE: number = 0.195;
    public static readonly TEXT_MIN_SCALE: number = 5.0;
    public static DEFAULT_IMAGE_FIT: string = 'contain';
    private async generateFlatItem(point: IPoint, item: {
        name: string, type: string, content: string, imageSize?: ISize,
    }): Promise<IPdfBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.createLinkFlat(
            point, this.question, this.controller, item.name === undefined ? 'image' : item.name, item.content));
        if (SurveyHelper.canPreviewImage(this.question, item, item.content)) {
            const imagePoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            imagePoint.yTop += this.controller.unitHeight * FlatFile.IMAGE_GAP_SCALE;
            compositeFlat.addBrick(await SurveyHelper.createImageFlat(imagePoint, this.question, this.controller, { link: item.content, width: item.imageSize.width, height: item.imageSize.height, objectFit: FlatFile.DEFAULT_IMAGE_FIT }));
        }
        return compositeFlat;
    }
    private addLine(rowsFlats: CompositeBrick[], currPoint: IPoint, index: number, previewValue: Array<any>): void {
        if (index !== previewValue.length - 1) {
            rowsFlats[rowsFlats.length - 1].addBrick(
                SurveyHelper.createRowlineFlat(currPoint, this.controller));
            currPoint.yTop += SurveyHelper.EPSILON;
            rowsFlats.push(new CompositeBrick());
        }
    }

    private async getImagePreviewContentWidth(item: { name: string, type: string, content: string, imageSize?: ISize }) {
        return Math.max(item.imageSize.width, FlatFile.TEXT_MIN_SCALE * this.controller.unitWidth);
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const previewValue = this.question.showPreview ? this.question.previewValue : this.question.value;
        if (!previewValue || previewValue.length === 0) {
            return [await SurveyHelper.createTextFlat(point, this.question,
                this.controller, this.question.noFileChosenCaption)];
        }
        const rowsFlats: CompositeBrick[] = [new CompositeBrick()];
        const currPoint: IPoint = SurveyHelper.clone(point);
        let yBot: number = currPoint.yTop;
        for (let i: number = 0; i < previewValue.length; i++) {
            let item: { name: string, type: string, content: string, imageSize?: ISize } = { ...previewValue[i] };
            const canPreviewImage = SurveyHelper.canPreviewImage(this.question, item, item.content);
            if (canPreviewImage) {
                item.imageSize = await SurveyHelper.getCorrectedImageSize(this.controller, { imageWidth: this.question.imageWidth, imageHeight: this.question.imageHeight, imageLink: previewValue[i].content, defaultImageWidth: 200, defaultImageHeight: 150 });
            }
            const availableWidth: number = this.controller.paperWidth -
                this.controller.margins.right - currPoint.xLeft;
            if (canPreviewImage) {
                const compositeWidth = await this.getImagePreviewContentWidth(item);
                if (availableWidth < compositeWidth) {
                    currPoint.xLeft = point.xLeft;
                    currPoint.yTop = yBot;
                    this.addLine(rowsFlats, currPoint, i, previewValue);
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
                    this.addLine(rowsFlats, currPoint, i, previewValue);
                }
                const itemFlat: IPdfBrick = await this.generateFlatItem(currPoint, item);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                currPoint.xLeft += itemFlat.xRight - itemFlat.xLeft;
                yBot = Math.max(yBot, itemFlat.yBot);
            }
            currPoint.xLeft += this.controller.unitWidth;
        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('file', FlatFile);