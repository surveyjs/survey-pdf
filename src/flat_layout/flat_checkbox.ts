import { IQuestion, ItemValue, QuestionCheckboxModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { CheckItemBrick } from '../pdf_render/pdf_checkitem';
import { TextBrick } from '../pdf_render/pdf_text';
import { CommentBrick } from '../pdf_render/pdf_comment';
import { SurveyHelper } from '../helper_survey';
import { CompositeBrick } from '../pdf_render/pdf_composite';

export class FlatCheckbox extends FlatQuestion {
    protected question: QuestionCheckboxModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionCheckboxModel>question;
    }
    private generateFlatItem(point: IPoint, itemValue: ItemValue, index: number): IPdfBrick {
        let height: number = this.controller.measureText().height;
        let itemRect: IRect = SurveyHelper.createRect(point, height, height);
        let compositeFlat: CompositeBrick = new CompositeBrick(new CheckItemBrick(
            this.question, this.controller, itemRect, itemValue, index));
        let textPoint: IPoint = SurveyHelper.createPoint(itemRect, false, true);
        compositeFlat.addBrick(SurveyHelper.createTextFlat(
            textPoint, this.question, this.controller, itemValue.text, TextBrick));
        if (itemValue.value === this.question.otherItem.value) {
            let otherPoint: IPoint = SurveyHelper.createPoint(itemRect);
            let otherRect: IRect = SurveyHelper.createTextFieldRect(otherPoint, this.controller, 2);
            compositeFlat.addBrick(new CommentBrick(this.question, this.controller, otherRect, false));
        }
        return compositeFlat;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
        let flats: IPdfBrick[] = new Array();
        this.question.visibleChoices.forEach((itemValue: ItemValue, index: number) => {
            let itemFlat: IPdfBrick = this.generateFlatItem(currPoint, itemValue, index);
            currPoint.yTop = itemFlat.yBot;
            flats.push(itemFlat);
        });
        return flats;
    }
}

FlatRepository.getInstance().register('checkbox', FlatCheckbox);