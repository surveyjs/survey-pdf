import { IQuestion, QuestionMatrixDropdownModelBase, MatrixDropdownCell } from 'survey-core';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IFlatQuestion, FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatMatrixMultiple extends FlatQuestion {
    protected question: QuestionMatrixDropdownModelBase;
    public constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionMatrixDropdownModelBase>question;
    }
    private async generateFlatsHeader(point: IPoint): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        let colCount: number = this.question.visibleColumns.length;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i = 0; i < colCount; i++) {
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, colCount + 1, i + 1);
            currPoint.xLeft = this.controller.margins.left;
            composite.addBrick(await SurveyHelper.createBoldTextFlat(
                currPoint, this.question, this.controller,
                this.question.visibleColumns[i].locTitle));
            this.controller.popMargins();
        }
        currPoint.xLeft = point.xLeft;
        currPoint.yTop = composite.yBot;
        composite.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
        return composite;
    }
    private async generateFlatsRowsAsHeaders(point: IPoint): Promise<CompositeBrick> {
        return null;
    }
    private async generateFlatsRows(point: IPoint): Promise<CompositeBrick[]> {
        let rowsFlats: CompositeBrick[] = [];
        let colCount: number = this.question.visibleColumns.length;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i = 0; i < this.question.visibleRows.length; i++) {
            rowsFlats.push(new CompositeBrick());
            let row: any = this.question.visibleRows[i];
            if (true) {// has row names
                this.controller.pushMargins();
                SurveyHelper.setColumnMargins(this.controller, colCount + 1, 0);
                currPoint.xLeft = this.controller.margins.left
                rowsFlats[rowsFlats.length - 1].addBrick(await SurveyHelper.createTextFlat(
                    currPoint, this.question, this.controller, row.locText, TextBrick));
                this.controller.popMargins();
            }
            for (let j = 0; j < this.question.visibleRows[i].cells.length; j++) {
                let cell: MatrixDropdownCell = this.question.visibleRows[i].cells[j];
                this.controller.pushMargins();
                SurveyHelper.setColumnMargins(this.controller, colCount + 1, j + 1);
                currPoint.xLeft = this.controller.margins.left;
                cell.question.titleLocation = 'hidden';
                let flatQuestion: IFlatQuestion = FlatRepository.getInstance().
                    create(cell.question, this.controller);
                rowsFlats[rowsFlats.length - 1].addBrick(
                    ...await flatQuestion.generateFlats(currPoint));
                this.controller.popMargins();
            }
            currPoint.xLeft = point.xLeft;
            currPoint.yTop = rowsFlats[rowsFlats.length - 1].yBot;
            if (i !== this.question.visibleRows.length - 1) {
                rowsFlats[rowsFlats.length - 1].addBrick(
                    SurveyHelper.createRowlineFlat(currPoint, this.controller));
                currPoint.yTop += SurveyHelper.EPSILON;
            }
        }
        return rowsFlats;
    }
    private async generateFlatsColumnsAsRows(point: IPoint): Promise<CompositeBrick[]> {
        return null;
    }
    private async generateFlatsRowsVertical(point: IPoint): Promise<CompositeBrick[]> {
        return null;
    }
    private async generateFlatsColumnsAsRowsVertical(point: IPoint): Promise<CompositeBrick[]> {
        return null;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let cellWidth: number = SurveyHelper.getColumnWidth(this.controller, this.question.visibleColumns.length + 1);
        let isHorizontal: boolean = cellWidth >= this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        let currPoint: IPoint = SurveyHelper.clone(point);
        let rowsFlats: CompositeBrick[] = [];
        if (isHorizontal) {
            let headers: CompositeBrick = 
                this.question.isColumnLayoutHorizontal
                ? await this.generateFlatsHeader(point)
                : await this.generateFlatsRowsAsHeaders(point);
            currPoint = SurveyHelper.createPoint(headers);
            currPoint.xLeft = point.xLeft;
            rowsFlats.push(headers);
        }
        if (isHorizontal) {
            rowsFlats.push(...this.question.isColumnLayoutHorizontal
                ? await this.generateFlatsRows(currPoint)
                : await this.generateFlatsColumnsAsRows(currPoint));
        }
        else {
            rowsFlats.push(...this.question.isColumnLayoutHorizontal
                ? await this.generateFlatsRowsVertical(currPoint)
                : await this.generateFlatsColumnsAsRowsVertical(currPoint));
        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('matrixdropdown', FlatMatrixMultiple);