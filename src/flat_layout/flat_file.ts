import { IQuestion, QuestionFileModel, surveyLocalization } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, ISize, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatFile extends FlatQuestion {
    public static readonly IMAGE_GAP_SCALE: number = 0.195;
    public static readonly TEXT_MIN_SCALE: number = 5;
    protected question: QuestionFileModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionFileModel>question;
    }
    private async generateFlatItem(point: IPoint, item: {
        name: string, type: string, content: string
    }): Promise<IPdfBrick> {
        let compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.createLinkFlat(
            point, this.question, this.controller, item.name, item.content));
        if (await SurveyHelper.canPreviewImage(this.question, item, item.content)) {
            let imageSize: ISize = await SurveyHelper.getImageSize(item.content);
            if (this.question.imageWidth) {
                imageSize.width = SurveyHelper.parseWidth(this.question.imageWidth,
                    SurveyHelper.getPageAvailableWidth(this.controller));
            }
            if (this.question.imageHeight) {
                imageSize.height = SurveyHelper.parseWidth(this.question.imageHeight,
                    SurveyHelper.getPageAvailableWidth(this.controller));
            }
            let imagePoint: IPoint = SurveyHelper.createPoint(compositeFlat);
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
        let rowsFlats: CompositeBrick[] = [new CompositeBrick()];
        let currPoint: IPoint = SurveyHelper.clone(point);
        let yBot: number = currPoint.yTop;
        for (let i: number = 0; i < this.question.previewValue.length; i++) {
            let item: { name: string, type: string, content: string } = this.question.previewValue[i];
            let availableWidth: number = this.controller.paperWidth -
                this.controller.margins.right - currPoint.xLeft;
            if (await SurveyHelper.canPreviewImage(this.question, item, item.content)) {
                let compositeWidth: number = Math.max((
                    await SurveyHelper.getImageSize(item.content)).width,
                    FlatFile.TEXT_MIN_SCALE * this.controller.unitWidth);
                if (availableWidth < compositeWidth) {
                    currPoint.xLeft = point.xLeft;
                    currPoint.yTop = yBot;
                    this.addLine(rowsFlats, currPoint, i);
                }
                this.controller.pushMargins(currPoint.xLeft,
                    this.controller.paperWidth - currPoint.xLeft - compositeWidth);
                let itemFlat: IPdfBrick = await this.generateFlatItem(currPoint, item);
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
                let itemFlat: IPdfBrick = await this.generateFlatItem(currPoint, item);
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