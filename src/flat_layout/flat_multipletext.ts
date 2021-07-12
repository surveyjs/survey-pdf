import { IQuestion, QuestionMultipleTextModel, MultipleTextItemModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion, IFlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { FlatTextbox } from './flat_textbox';

export class FlatMultipleText extends FlatQuestion {
    public static readonly ROWS_GAP_SCALE: number = 0.195;
    protected question: QuestionMultipleTextModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionMultipleTextModel>question;
    }
    private async generateFlatItem(point: IPoint, row_index: number, col_index: number,
        item: MultipleTextItemModel): Promise<IPdfBrick> {
        const colWidth: number = SurveyHelper.getPageAvailableWidth(this.controller);
        this.controller.pushMargins();
        this.controller.margins.right = this.controller.paperWidth -
            this.controller.margins.left - colWidth * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
        const compositeFlat: CompositeBrick = new CompositeBrick(await SurveyHelper.
            createBoldTextFlat(point, this.question, this.controller, item.locTitle));
        this.controller.popMargins();

        const flatMultipleTextItemQuestion: IFlatQuestion = FlatRepository.getInstance().create(
            this.survey, item.editor, this.controller, 'text');
        const itemPoint: IPoint = SurveyHelper.createTextFieldRect({
            xLeft: point.xLeft + colWidth * SurveyHelper.MULTIPLETEXT_TEXT_PERS, yTop: point.yTop },
            this.controller);
        compositeFlat.addBrick(...await (<FlatTextbox>flatMultipleTextItemQuestion).generateFlatsContent(itemPoint));   

        return compositeFlat;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const rowsFlats: CompositeBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        const rows = this.question.getRows();
        for (let i: number = 0; i < rows.length; i++) {
            rowsFlats.push(new CompositeBrick());
            let yBot: number = currPoint.yTop
            this.controller.pushMargins();
            for (let j: number = 0; j < rows[i].length; j++) {
                this.controller.pushMargins();
                SurveyHelper.setColumnMargins(this.controller, rows[i].length, j);
                currPoint.xLeft = this.controller.margins.left;
                const itemFlat: IPdfBrick = await this.generateFlatItem(
                    currPoint, i, j, rows[i][j]);
                rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
                yBot = Math.max(yBot, itemFlat.yBot);
                this.controller.popMargins();
            }
            this.controller.popMargins();
            currPoint.xLeft = point.xLeft;
            currPoint.yTop = yBot;
            rowsFlats[rowsFlats.length - 1].addBrick(
                SurveyHelper.createRowlineFlat(currPoint, this.controller));
            currPoint.yTop += SurveyHelper.EPSILON;
            currPoint.yTop += this.controller.unitHeight * FlatMultipleText.ROWS_GAP_SCALE;
        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('multipletext', FlatMultipleText);