import {
    IQuestion, QuestionMatrixDropdownModelBase,
    QuestionMatrixDropdownRenderedTable, QuestionMatrixDropdownRenderedRow,
    QuestionMatrixDropdownRenderedCell
} from 'survey-core';
import { IPoint, DocController } from '../doc_controller';
import { IFlatQuestion, FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatMatrixMultiple extends FlatQuestion {
    public static readonly GAP_BETWEEN_ROWS = 0.5;
    protected question: QuestionMatrixDropdownModelBase;
    public constructor(question: IQuestion, controller: DocController,
        protected isMultiple: boolean = true) {
        super(question, controller);
        this.question = <QuestionMatrixDropdownModelBase>question;
    }
    private async generateFlatsCell(point: IPoint, cell: QuestionMatrixDropdownRenderedCell, isHeader: boolean): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        if (cell.hasQuestion) {
            cell.question.titleLocation = SurveyHelper.TITLE_LOCATION_MATRIX;
            let flatQuestion: IFlatQuestion = FlatRepository.getInstance().
                create(cell.question, this.controller);
            composite.addBrick(...await flatQuestion.generateFlats(point));
        }
        else if (cell.hasTitle) {
            isHeader ? composite.addBrick(await SurveyHelper.createBoldTextFlat(point,
                this.question, this.controller, cell.locTitle)) :
                composite.addBrick(await SurveyHelper.createTextFlat(point,
                    this.question, this.controller, cell.locTitle, TextBrick));
        }
        return composite;
    }
    private async generateFlatsRowHorisontal(point: IPoint, row: QuestionMatrixDropdownRenderedRow, colCount: number): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        let cells: QuestionMatrixDropdownRenderedCell[] = row.cells;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < Math.min(colCount, cells.length); i++) {
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, colCount, i);
            currPoint.xLeft = this.controller.margins.left;
            composite.addBrick(await this.generateFlatsCell(currPoint, cells[i],
                row == this.question.renderedTable.headerRow));
            this.controller.popMargins();
        }
        return composite;
    }
    private async generateFlatsRowVertical(point: IPoint, row: QuestionMatrixDropdownRenderedRow,
        colCount: number): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        let cells: QuestionMatrixDropdownRenderedCell[] = row.cells;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < Math.min(colCount, cells.length); i++) {
            if (this.question.renderedTable.showHeader && (!this.isMultiple || i > 0)) {
                composite.addBrick(await this.generateFlatsCell(currPoint,
                    this.question.renderedTable.headerRow.cells[i], false));
                currPoint.yTop = composite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
            }
            composite.addBrick(await this.generateFlatsCell(currPoint, cells[i], false));
            currPoint.yTop = composite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
        }
        return composite;
    }
    private async generateFlatsRows(point: IPoint, rows: QuestionMatrixDropdownRenderedRow[],
        colCount: number, isWide: boolean): Promise<CompositeBrick[]> {
        let currPoint: IPoint = SurveyHelper.clone(point);
        let rowsFlats: CompositeBrick[] = [];
        for (let i: number = 0; i < rows.length; i++) {
            let rowFlat: CompositeBrick;
            if (isWide) {
                rowFlat = await this.generateFlatsRowHorisontal(currPoint, rows[i], colCount);
            }
            else {
                rowFlat = await this.generateFlatsRowVertical(currPoint, rows[i], colCount);
            }
            if (i != rows.length - 1) {
                currPoint.yTop = rowFlat.yBot;
                rowFlat.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
            }
            rowsFlats.push(rowFlat);
            currPoint.yTop = rowFlat.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
        }
        return rowsFlats;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let table: QuestionMatrixDropdownRenderedTable = this.question.renderedTable;
        let rowsFlats: CompositeBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        let isVertical: boolean = this.question.columnLayout == 'vertical';
        let colCount: number = table.rows[0] ? table.rows[0].cells.length -
            (table.hasRemoveRow && !isVertical ? 1 : 0) :
            table.showHeader && table.headerRow ? table.headerRow.cells.length :
                table.showFooter && table.footerRow ? table.footerRow.cells.length : 0;
        if (colCount < 1) {
            return [new CompositeBrick(SurveyHelper.createRowlineFlat(point, this.controller))];
        }
        let rows: QuestionMatrixDropdownRenderedRow[] = [];
        let cellWidth: number = SurveyHelper.getColumnWidth(
            this.controller, colCount);
        let isWide: boolean = cellWidth >=
            this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        !table.showHeader || !isWide || rows.push(table.headerRow);
        rows.push(...table.rows);
        !table.hasRemoveRow || !isVertical || rows.pop();
        !table.showFooter || !isWide || rows.push(table.footerRow);
        rowsFlats.push(...await this.generateFlatsRows(currPoint, rows, colCount, isWide));
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('matrixdropdown', FlatMatrixMultiple);