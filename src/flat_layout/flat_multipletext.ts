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
    public constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionMultipleTextModel>question;
    }
    private async generateFlatItem(point: IPoint, row_index: number, col_index: number,
        item: MultipleTextItemModel): Promise<IPdfBrick> {
        let colWidth: number = SurveyHelper.getPageAvailableWidth(this.controller);
        this.controller.pushMargins();
        this.controller.margins.right = this.controller.paperWidth -
            this.controller.margins.left - colWidth * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
        let compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.
            createBoldTextFlat(point, this.question, this.controller,
                item.locTitle));
        this.controller.popMargins();
        compositeFlat.addBrick(new MultipleTextBoxBrick(this.question, this.controller,
            SurveyHelper.createTextFieldRect({
                xLeft: point.xLeft +
                    colWidth * SurveyHelper.MULTIPLETEXT_TEXT_PERS, yTop: point.yTop
            },
                this.controller), row_index, col_index, item));
        return compositeFlat;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let rowsFlats: CompositeBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        let colWidth: number = SurveyHelper.getPageAvailableWidth(
            this.controller) / this.question.colCount;
        let rows = this.question.getRows();
        for (let i: number = 0; i < rows.length; i++) {
            rowsFlats.push(new CompositeBrick());
            let yBot: number = currPoint.yTop
            this.controller.pushMargins();
            let currMarginLeft: number = this.controller.margins.left;
            for (let j: number = 0; j < rows[i].length; j++) {
                this.controller.margins.left = currMarginLeft;
                this.controller.margins.right = this.controller.paperWidth -
                    currMarginLeft - colWidth;
                currMarginLeft = this.controller.paperWidth - this.controller.margins.right;
                currPoint.xLeft = this.controller.margins.left;
                let itemFlat: IPdfBrick = await this.generateFlatItem(
                    currPoint, i, j, rows[i][j]);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                yBot = Math.max(yBot, itemFlat.yBot);
            }
            this.controller.popMargins();
            currPoint.xLeft = point.xLeft;
            currPoint.yTop = yBot;
            rowsFlats[rowsFlats.length - 1].addBrick(
                SurveyHelper.createRowlineFlat(currPoint, this.controller));
            currPoint.yTop += SurveyHelper.EPSILON;

        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('multipletext', FlatMultipleText);