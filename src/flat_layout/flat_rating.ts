import { IQuestion, ItemValue, QuestionRatingModel, LocalizableString } from 'survey-core';
import { FlatRadiogroup } from './flat_radiogroup';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController, IRect } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { TextBrick } from '../pdf_render/pdf_text';

export class FlatRating extends FlatRadiogroup {
    protected questionRating: QuestionRatingModel;
    public constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.questionRating = <QuestionRatingModel>question;
    }
    protected async  generateFlatHorisontalComposite(point: IPoint, item: ItemValue, index: number, ): Promise<IPdfBrick> {
        let itemText: LocalizableString = SurveyHelper.getRatingItemText(
            this.questionRating, index, item.locText);
        this.controller.pushMargins();
        let halfWidth: number = this.controller.unitWidth / 2.0;
        this.controller.margins.left += halfWidth
        this.controller.margins.right += halfWidth;
        let textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft += halfWidth
        let compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.
            createBoldTextFlat(textPoint, this.questionRating, this.controller, itemText));
        this.controller.popMargins();
        let textWidth: number = compositeFlat.width;
        if (textWidth < SurveyHelper.getRatingMinWidth(this.controller)) {
            compositeFlat.xLeft += (SurveyHelper.getRatingMinWidth(
                this.controller) - textWidth) / 2.0 - halfWidth;
            textWidth = SurveyHelper.getRatingMinWidth(this.controller);
        }
        else {
            textWidth += this.controller.unitWidth;
        }
        let radioPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
        radioPoint.xLeft = point.xLeft;
        compositeFlat.addBrick(await this.generateFlatItem(SurveyHelper.createRect(
            radioPoint, textWidth, this.controller.unitHeight), item, index));
        return compositeFlat;
    }
    protected async generateFlatComposite(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        let compositeFlat: CompositeBrick = new CompositeBrick();
        let itemRect: IRect = SurveyHelper.createRect(point,
            this.controller.unitHeight, this.controller.unitHeight);
        let itemFlat: IPdfBrick = this.generateFlatItem(SurveyHelper.moveRect(
            SurveyHelper.scaleRect(itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE),
            point.xLeft), item, index);
        compositeFlat.addBrick(itemFlat);
        let textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + itemFlat.width;
        let itemText: LocalizableString = SurveyHelper.getRatingItemText(this.questionRating, index, item.locText);
        itemText == null || compositeFlat.addBrick(await SurveyHelper.createTextFlat(
            textPoint, this.question, this.controller, itemText, TextBrick));
        return compositeFlat;
    }
    protected async generateHorisontallyItems(point: IPoint) {
        let rowsFlats: CompositeBrick[] = [new CompositeBrick()];
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < this.questionRating.visibleRateValues.length; i++) {
            let itemFlat: IPdfBrick = await this.generateFlatHorisontalComposite(currPoint,
                this.questionRating.visibleRateValues[i], i);
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
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let isVertical: boolean = false;
        for (let i: number = 0; i < this.questionRating.visibleRateValues.length; i++) {
            let itemText: LocalizableString = SurveyHelper.getRatingItemText(
                this.questionRating, i, this.questionRating.visibleRateValues[i].locText);
            if (this.controller.measureText(itemText).width > this.controller.measureText(SurveyHelper.RATING_COLUMN_WIDTH).width) {
                isVertical = true;
            }
        }
        return isVertical ? this.generateVerticallyItems(point, this.questionRating.visibleRateValues) : this.generateHorisontallyItems(point);
    }
}

FlatRepository.getInstance().register('rating', FlatRating);