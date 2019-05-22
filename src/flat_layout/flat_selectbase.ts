import { IQuestion, ItemValue, QuestionSelectBase, QuestionMatrixModel } from 'survey-core';
import { IPoint, IRect, DocController } from "../doc_controller";
import { FlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { TextBrick } from '../pdf_render/pdf_text';

export abstract class FlatSelectBase extends FlatQuestion {
    protected question: QuestionSelectBase;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionSelectBase>question;
    }

    abstract createItemBrick(rect: IRect, item: ItemValue, index: number): IPdfBrick;
    private async generateFlatsItem(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        let compositeFlat: CompositeBrick = new CompositeBrick();
        let height: number = SurveyHelper.measureText().height;
        let itemRect: IRect = SurveyHelper.createRect(point, height, height);
        compositeFlat.addBrick(this.createItemBrick(itemRect, item, index));
        let textPoint: IPoint = SurveyHelper.createPoint(itemRect, false, true);
        compositeFlat.addBrick(await SurveyHelper.createTextFlat(
            textPoint, this.question, this.controller, item.locText, TextBrick));
        if (item.value === this.question.otherItem.value) {
            compositeFlat.addBrick(SurveyHelper.createOtherFlat(
                SurveyHelper.createPoint(compositeFlat), this.question, this.controller, index));
        }
        return compositeFlat;
    }
    async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let currPoint: IPoint = SurveyHelper.clone(point);
        let flats: IPdfBrick[] = new Array();
        let index = 0;
        for (let item of this.question.visibleChoices) {
            let itemFlat: IPdfBrick = await this.generateFlatsItem(currPoint, item, index);
            currPoint.yTop = itemFlat.yBot;
            flats.push(itemFlat);
            index++;
        }
        return flats;
    }
}
