import { IQuestion, QuestionFileModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatFile extends FlatQuestion {
    protected question: QuestionFileModel;
    constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionFileModel>question;
    }
    private generateFlatItem(point: IPoint, item: { name: string, type: string,
        content: string }): IPdfBrick {
        let compositeFlat: CompositeBrick = new CompositeBrick(SurveyHelper.createLinkFlat(
            point, this.question, this.controller, item.name, item.content));
        if (this.question.canPreviewImage(item)) {
            compositeFlat.addBrick(SurveyHelper.createImageFlat(SurveyHelper.
                createPoint(compositeFlat), this.question, this.controller,
                item.content, SurveyHelper.getPageAvailableWidth(this.controller)));
        }
        return compositeFlat;
    }
    private addLine(rowsFlats: CompositeBrick[], currPoint: IPoint,  index: number): void { 
        if (index !== this.question.previewValue.length - 1) {
            rowsFlats[rowsFlats.length - 1].addBrick(
                SurveyHelper.createRowlineFlat(currPoint, this.controller));
            currPoint.yTop += SurveyHelper.EPSILON;
            rowsFlats.push(new CompositeBrick());
        }
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        if (this.question.previewValue.length === 0) {
            return [SurveyHelper.createTextFlat(point, this.question, this.controller,
                'No file chosen', TextBrick)];
        }
        let rowsFlats: CompositeBrick[] = new Array<CompositeBrick>(new CompositeBrick());
        let imageWidth: number = SurveyHelper.getImagePickerAvailableWidth(
            this.controller) / SurveyHelper.IMAGEPICKER_COUNT;
        let currPoint: IPoint = SurveyHelper.clone(point);
        let yBot: number = currPoint.yTop;
        this.question.previewValue.forEach((item: { name: string, type: string,
            content: string }, index: number) => {
            let availableWidth: number = this.controller.paperWidth -
                this.controller.margins.right - currPoint.xLeft;
            if (this.question.canPreviewImage(item)) {
                if (availableWidth < imageWidth) {
                    currPoint.xLeft = point.xLeft;
                    currPoint.yTop = yBot;
                    this.addLine(rowsFlats, currPoint, index);
                }
                let oldMarginLeft: number = this.controller.margins.left;
                let oldMarginRight: number = this.controller.margins.right;
                this.controller.margins.left = currPoint.xLeft;
                this.controller.margins.right = this.controller.paperWidth -
                    this.controller.margins.left - imageWidth;
                let itemFlat: IPdfBrick = this.generateFlatItem(currPoint, item);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                currPoint.xLeft += itemFlat.xRight - itemFlat.xLeft;
                yBot = Math.max(yBot, itemFlat.yBot);
                this.controller.margins.left = oldMarginLeft;
                this.controller.margins.right = oldMarginRight;
            }
            else {
                if (availableWidth < SurveyHelper.measureText().width) {
                    currPoint.xLeft = point.xLeft;
                    currPoint.yTop = yBot;
                    this.addLine(rowsFlats, currPoint, index);
                }
                let itemFlat: IPdfBrick = this.generateFlatItem(currPoint, item);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                currPoint.xLeft += itemFlat.xRight - itemFlat.xLeft;
                yBot = Math.max(yBot, itemFlat.yBot);
            }
            currPoint.xLeft += SurveyHelper.measureText().width;
        });
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('file', FlatFile);