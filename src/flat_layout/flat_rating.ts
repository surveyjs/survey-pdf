import { IQuestion, ItemValue, QuestionRatingModel, LocalizableString } from 'survey-core';
import { FlatRadiogroup } from './flat_radiogroup';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatRating extends FlatRadiogroup {
    protected questionRating: QuestionRatingModel;
    public constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.questionRating = <QuestionRatingModel>question;
    }
    private async  generateFlatItem(point: IPoint, index: number, item: ItemValue): Promise<IPdfBrick> {
        let itemText: LocalizableString = SurveyHelper.getRatingItemText(
            this.questionRating, index, item.locText);
        this.controller.pushMargins();
        this.controller.margins.left += this.controller.measureText().width / 2.0
        this.controller.margins.right += this.controller.measureText().width / 2.0;
        let textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft += this.controller.measureText().width / 2.0
        let compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.
            createBoldTextFlat(textPoint, this.questionRating, this.controller, itemText));
        this.controller.popMargins();
        let textWidth: number = compositeFlat.width;
        if (textWidth < SurveyHelper.getRatingMinWidth(this.controller)) {
            compositeFlat.xLeft += (SurveyHelper.getRatingMinWidth(this.controller) - textWidth) / 2.0;
            textWidth = SurveyHelper.getRatingMinWidth(this.controller);
        }
        else {
            textWidth += this.controller.measureText().width;
        }
        let radioPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
        radioPoint.xLeft = point.xLeft;
        compositeFlat.addBrick(this.createItemBrick(SurveyHelper.createRect(
            radioPoint, textWidth, this.controller.measureText().height), item, index));
        return compositeFlat;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let rowsFlats: CompositeBrick[] = [new CompositeBrick()];
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < this.questionRating.visibleRateValues.length; i++) {
            let itemFlat: IPdfBrick = await this.generateFlatItem(currPoint, i,
                this.questionRating.visibleRateValues[i]);
            rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
            let leftWidth: number = this.controller.paperWidth -
                this.controller.margins.right - itemFlat.xRight;
            if (SurveyHelper.getRatingMinWidth(this.controller) <= leftWidth + SurveyHelper.EPSILON) {
                currPoint.xLeft = itemFlat.xRight;
            }
            else {
                currPoint.xLeft = point.xLeft;
                currPoint.yTop = itemFlat.yBot;
                if (i !== this.questionRating.visibleRateValues.length - 1) {
                    rowsFlats[rowsFlats.length - 1].addBrick(
                        SurveyHelper.createRowlineFlat(currPoint, this.controller));
                    currPoint.yTop += SurveyHelper.EPSILON;
                    rowsFlats.push(new CompositeBrick());
                }
            }
        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('rating', FlatRating);