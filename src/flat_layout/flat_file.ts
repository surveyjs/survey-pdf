import { IQuestion, QuestionFileModel, surveyLocalization } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatFile extends FlatQuestion {
    protected question: QuestionFileModel;
    public constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionFileModel>question;
    }
    private async generateFlatItem(point: IPoint, item: {
        name: string, type: string,
        content: string
    }): Promise<IPdfBrick> {
        let compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.createLinkFlat(
            point, this.question, this.controller, item.name, item.content));
        if (this.question.canPreviewImage(item)) {
            compositeFlat.addBrick(SurveyHelper.createImageFlat(SurveyHelper.
                createPoint(compositeFlat), this.question, this.controller,
                item.content, SurveyHelper.getPageAvailableWidth(this.controller)));
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
        let imageWidth: number = SurveyHelper.getImagePickerAvailableWidth(
            this.controller) / SurveyHelper.IMAGEPICKER_COUNT;
        let currPoint: IPoint = SurveyHelper.clone(point);
        let yBot: number = currPoint.yTop;
        for (let i: number = 0; i < this.question.previewValue.length; i++) {
            let item: { name: string, type: string, content: string } = this.question.previewValue[i];
            let availableWidth: number = this.controller.paperWidth -
                this.controller.margins.right - currPoint.xLeft;
            if (this.question.canPreviewImage(item)) {
                if (availableWidth < imageWidth) {
                    currPoint.xLeft = point.xLeft;
                    currPoint.yTop = yBot;
                    this.addLine(rowsFlats, currPoint, i);
                }
                this.controller.pushMargins(currPoint.xLeft,
                    this.controller.paperWidth - currPoint.xLeft - imageWidth);
                let itemFlat: IPdfBrick = await this.generateFlatItem(currPoint, item);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                currPoint.xLeft += itemFlat.xRight - itemFlat.xLeft;
                yBot = Math.max(yBot, itemFlat.yBot);
                this.controller.popMargins();
            }
            else {
                if (availableWidth < this.controller.measureText().width) {
                    currPoint.xLeft = point.xLeft;
                    currPoint.yTop = yBot;
                    this.addLine(rowsFlats, currPoint, i);
                }
                let itemFlat: IPdfBrick = await this.generateFlatItem(currPoint, item);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                currPoint.xLeft += itemFlat.xRight - itemFlat.xLeft;
                yBot = Math.max(yBot, itemFlat.yBot);
            }
            currPoint.xLeft += this.controller.measureText().width;
        };
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('file', FlatFile);