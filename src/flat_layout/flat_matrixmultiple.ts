import {
    IQuestion, QuestionMatrixDropdownModelBase, LocalizableString,
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
import { RowlineBrick } from '../pdf_render/pdf_rowline';

export class FlatMatrixMultiple extends FlatQuestion {
    public static readonly GAP_BETWEEN_ROWS = 0.5;
    protected question: QuestionMatrixDropdownModelBase;
    public constructor(question: IQuestion, controller: DocController,
        protected isMultiple: boolean = true) {
        super(question, controller);
        this.question = <QuestionMatrixDropdownModelBase>question;
    }
    private async generateFlatsHeader(point: IPoint): Promise<CompositeBrick> {
        let table = this.question.renderedTable;
        let composite: CompositeBrick = new CompositeBrick();
        if (!table.showHeader) return composite;
        let cells = table.headerRow.cells;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < cells.length; i++) {
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller,
                cells.length, i);
            currPoint.xLeft = this.controller.margins.left;
            let locText: LocalizableString = cells[i].locTitle;
            composite.addBrick(await SurveyHelper.createBoldTextFlat(
                currPoint, this.question, this.controller, locText));
            this.controller.popMargins();
        }
        return composite;
    }
    private async generateFlatsCell(point: IPoint, cell: QuestionMatrixDropdownRenderedCell): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        if (cell.hasQuestion) {
            cell.question.titleLocation = SurveyHelper.TITLE_LOCATION_MATRIX;
            let flatQuestion: IFlatQuestion = FlatRepository.getInstance().
                create(cell.question, this.controller);
            composite.addBrick(...await flatQuestion.generateFlats(point));
        }
        else if (cell.hasTitle) {
            composite.addBrick(await SurveyHelper.createTextFlat(point,
                this.question, this.controller, cell.locTitle, TextBrick))
        }
        return composite;
    }
    private async generateFlatsRowHorisontal(point: IPoint, row: QuestionMatrixDropdownRenderedRow): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        let cells: QuestionMatrixDropdownRenderedCell[] = row.cells;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < cells.length; i++) {
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, cells.length, i);
            currPoint.xLeft = this.controller.margins.left;
            composite.addBrick(await this.generateFlatsCell(currPoint, cells[i]));
            this.controller.popMargins();
        }
        return composite;
    }
    private async generateFlatsRowVertical(point: IPoint, row: QuestionMatrixDropdownRenderedRow): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        let cells: QuestionMatrixDropdownRenderedCell[] = row.cells;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < cells.length; i++) {
            if (this.question.renderedTable.showHeader && i > 0) {
                composite.addBrick(await this.generateFlatsCell(currPoint,
                    this.question.renderedTable.headerRow.cells[i]));
                currPoint.yTop = composite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
            }
            composite.addBrick(await this.generateFlatsCell(currPoint, cells[i]));
            currPoint.yTop = composite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
        }
        return composite;
    }
    private async generateFlatsRows(point: IPoint, isWide: boolean): Promise<CompositeBrick[]> {
        let currPoint: IPoint = SurveyHelper.clone(point);
        let rowsFlats: CompositeBrick[] = [];
        let rows: QuestionMatrixDropdownRenderedRow[] = this.question.renderedTable.rows.slice(0);
        !this.question.hasFooter || rows.push(this.question.renderedTable.footerRow);
        for (let i: number = 0; i < rows.length; i++) {
            let rowFlat: CompositeBrick;
            if (isWide) {
                rowFlat = await this.generateFlatsRowHorisontal(currPoint, rows[i]);
            }
            else {
                rowFlat = await this.generateFlatsRowVertical(currPoint, rows[i]);
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
        let colCount: number = table.rows[0].cells.length;
        let cellWidth: number = SurveyHelper.getColumnWidth(
            this.controller, colCount);
        let isWide: boolean = cellWidth >=
            this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        let currPoint: IPoint = SurveyHelper.clone(point);
        let rowsFlats: CompositeBrick[] = [];
        if (isWide) {
            let headers: CompositeBrick =
                await this.generateFlatsHeader(point);
            currPoint.xLeft = point.xLeft;
            currPoint.yTop = headers.isEmpty ? point.yTop : (headers.yBot + this.controller.unitHeight * FlatMatrixMultiple.GAP_BETWEEN_ROWS);
            headers.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
            currPoint.yTop += SurveyHelper.EPSILON;
            rowsFlats.push(headers);
        }
        rowsFlats.push(...await this.generateFlatsRows(currPoint, isWide));
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('matrixdropdown', FlatMatrixMultiple);