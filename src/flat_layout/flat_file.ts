import { QuestionFileModel } from 'survey-core';
import { IPoint, ISize } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatFile extends FlatQuestion<QuestionFileModel> {
    private async generateFlatItem(point: IPoint, item: {
        name: string, type: string, content: string, imageSize?: ISize,
    }): Promise<IPdfBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.createLinkFlat(
            point, this.controller, {
                text: item.name === undefined ? 'image' : item.name,
                link: item.content,
                readOnlyShowLink: SurveyHelper.getReadonlyRenderAs(this.question, this.controller) === 'text',
                shouldRenderReadOnly: SurveyHelper.shouldRenderReadOnly(this.question, this.controller),
            }, {
                fontColor: '#0000EE'
            }));
        if (SurveyHelper.canPreviewImage(this.question, item, item.content)) {
            const imagePoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            imagePoint.yTop += this.styles.imageGap;
            compositeFlat.addBrick(await SurveyHelper.createImageFlat(imagePoint, this.question, this.controller, { link: item.content, width: item.imageSize.width, height: item.imageSize.height, objectFit: this.styles.defaultImageFit }));
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
        return Math.max(item.imageSize.width, this.styles.textMin);
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const previewValue = this.question.showPreview ? this.question.previewValue : this.question.value;
        if (!previewValue || previewValue.length === 0) {
            return [await SurveyHelper.createTextFlat(point,
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