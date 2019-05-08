import { IQuestion, ItemValue, QuestionSelectBase } from 'survey-core';
import { IPoint, IRect, DocController } from "../doc_controller";
import { FlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { TextBrick } from '../pdf_render/pdf_text';
import { CommentBrick } from '../pdf_render/pdf_comment';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export abstract class FlatSelectBase extends FlatQuestion {
    protected question: QuestionSelectBase;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionSelectBase>question;
    }
    protected abstract createItemBrick(rect: IRect, itemValue: ItemValue, index?: number): IPdfBrick;
    private generateFlatsItem(point: IPoint, itemValue: ItemValue, index: number): IPdfBrick {
        let compositeFlat: CompositeBrick = new CompositeBrick();
        let height: number = SurveyHelper.measureText().height;
        let itemRect: IRect = SurveyHelper.createRect(point, height, height);
        compositeFlat.addBrick(this.createItemBrick(itemRect, itemValue, index));
        let textPoint: IPoint = SurveyHelper.createPoint(itemRect, false, true);
        compositeFlat.addBrick(SurveyHelper.createTextFlat(
            textPoint, this.question, this.controller, itemValue.text, TextBrick));
        if (itemValue.value === this.question.otherItem.value) {
            compositeFlat.addBrick(SurveyHelper.createOtherFlat(
                SurveyHelper.createPoint(itemRect), this.question, this.controller));
        }
        return compositeFlat;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
        let flats: IPdfBrick[] = new Array();
        this.question.visibleChoices.forEach((itemValue: ItemValue, index: number) => {
            let itemFlat: IPdfBrick = this.generateFlatsItem(currPoint, itemValue, index);
            currPoint.yTop = itemFlat.yBot;
            flats.push(itemFlat);
        });
        return flats;
    }
}
