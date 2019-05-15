import { IQuestion, QuestionMultipleTextModel, MultipleTextItemModel } from 'survey-core';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { MultipleTextBoxBrick } from '../pdf_render/pdf_multipletextbox';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatMultipleText extends FlatQuestion {
    protected question: QuestionMultipleTextModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionMultipleTextModel>question;
    }
    private generateFlatItem(point: IPoint, row_index: number, col_index: number,
         item: MultipleTextItemModel): IPdfBrick {
        let colWidth: number = SurveyHelper.getPageAvailableWidth(this.controller);
        let oldMarginRight: number = this.controller.margins.right;
        this.controller.margins.right = this.controller.paperWidth -
            this.controller.margins.left - colWidth * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
        let compositeFlat: CompositeBrick = new CompositeBrick(SurveyHelper.
            createBoldTextFlat(point, this.question, this.controller,
                SurveyHelper.getLocString(item.locTitle)));
        this.controller.margins.right = oldMarginRight;
        compositeFlat.addBrick(new MultipleTextBoxBrick(this.question, this.controller,
            SurveyHelper.createTextFieldRect({ xLeft: point.xLeft +
                colWidth * SurveyHelper.MULTIPLETEXT_TEXT_PERS, yTop: point.yTop },
                this.controller), row_index, col_index, item));
        return compositeFlat;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        let rowsFlats: CompositeBrick[] = new Array<CompositeBrick>();
        let currPoint: IPoint = SurveyHelper.clone(point);
        let colWidth: number = SurveyHelper.getPageAvailableWidth(
            this.controller) / this.question.colCount;
        this.question.getRows().forEach((row: MultipleTextItemModel[], row_index: number) => {
            rowsFlats.push(new CompositeBrick());
            let yBot: number = currPoint.yTop
            let oldMarginLeft: number = this.controller.margins.left;
            let oldMarginRight: number = this.controller.margins.right;
            let currMarginLeft: number = this.controller.margins.left;
            row.forEach((item: MultipleTextItemModel, col_index: number) => {
                this.controller.margins.left = currMarginLeft;
                this.controller.margins.right = this.controller.paperWidth -
                    currMarginLeft - colWidth;
                currMarginLeft = this.controller.paperWidth - this.controller.margins.right;
                currPoint.xLeft = this.controller.margins.left;
                let itemFlat: IPdfBrick = this.generateFlatItem(currPoint, row_index, col_index, item);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                yBot = Math.max(yBot, itemFlat.yBot);
            });
            this.controller.margins.left = oldMarginLeft;
            this.controller.margins.right = oldMarginRight;
            currPoint.xLeft = point.xLeft;
            currPoint.yTop = yBot;
            rowsFlats[rowsFlats.length - 1].addBrick(
                SurveyHelper.createRowlineFlat(currPoint, this.controller));
            currPoint.yTop += SurveyHelper.EPSILON;
        });
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('multipletext', FlatMultipleText);