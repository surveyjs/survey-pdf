import {
    IQuestion, QuestionMatrixDropdownModelBase, QuestionMatrixDropdownRenderedTable,
    QuestionMatrixDropdownRenderedRow, QuestionMatrixDropdownRenderedCell, Serializer, PanelModel, QuestionMatrixDynamicModel,
    LocalizableString
} from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { IFlatQuestion, FlatQuestion } from './flat_question';
import { FlatSelectBase } from './flat_selectbase';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { FlatSurvey } from './flat_survey';

export class FlatMatrixMultiple extends FlatQuestion {
    public static readonly GAP_BETWEEN_ROWS: number = 0.5;
    protected question: QuestionMatrixDropdownModelBase;
    public constructor(protected survey: SurveyPDF, question: IQuestion, controller: DocController,
        protected isMultiple: boolean = true) {
        super(survey, question, controller);
        this.question = <QuestionMatrixDropdownModelBase>question;
    }
    private visibleRowsValue: QuestionMatrixDropdownRenderedRow[];
    private get visibleRows() {
        if(!this.visibleRowsValue) {
            this.visibleRowsValue = this.question.renderedTable.rows.filter(row => row.visible);
        }
        return this.visibleRowsValue;
    }
    private async generateFlatsCellTitle(point: IPoint, locTitle: LocalizableString): Promise<CompositeBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        composite.addBrick(await SurveyHelper.createTextFlat(point,
            this.question, this.controller, locTitle, TextBrick));
        return composite;
    }
    private async generateFlatsCell(point: IPoint, cell: QuestionMatrixDropdownRenderedCell,
        location?: 'header' | 'footer', isWide: boolean = true): Promise<CompositeBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        if (cell.hasQuestion) {
            if(location == 'footer' && !cell.question.isAnswered) {}
            else if (isWide && cell.isChoice) {
                const flatMultipleColumnsQuestion: IFlatQuestion = FlatRepository.getInstance().create(
                    this.survey, cell.question, this.controller, cell.question.getType());
                const itemRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
                    SurveyHelper.createRect(point, this.controller.unitHeight, this.controller.unitHeight),
                    SurveyHelper.SELECT_ITEM_FLAT_SCALE), point.xLeft);
                composite.addBrick((<FlatSelectBase>flatMultipleColumnsQuestion)
                    .generateFlatItem(itemRect, cell.item, cell.choiceIndex));
            }
            else {
                cell.question.titleLocation = SurveyHelper.TITLE_LOCATION_MATRIX;
                composite.addBrick(...await SurveyHelper.generateQuestionFlats(
                    this.survey, this.controller, cell.question, point));
            }
        }
        else if (cell.hasTitle) {
            if (location == 'header') {
                composite.addBrick(await SurveyHelper.createBoldTextFlat(point,
                    this.question, this.controller, cell.locTitle));
            }
            else {
                composite.addBrick(await SurveyHelper.createTextFlat(point,
                    this.question, this.controller, cell.locTitle, TextBrick));
            }
        }
        return composite;
    }
    private get hasDetailPanel(): boolean {
        return this.visibleRows.some((renderedRow) => renderedRow.row && this.question.hasDetailPanel(renderedRow.row));
    }
    private ignoreCell(cell: QuestionMatrixDropdownRenderedCell, index: number, location?: 'header' | 'footer', isWide: boolean = true): boolean {
        if(!isWide && location == 'footer' && cell.hasQuestion && !cell.question.isAnswered) return true;
        return !(cell.hasQuestion || cell.hasTitle || (this.isMultiple && (this.hasDetailPanel ? index == 1 : index == 0)));
    }
    private getRowLocation(row: QuestionMatrixDropdownRenderedRow) {
        return row === this.question.renderedTable.headerRow ? 'header' : (this.question.renderedTable.footerRow === row ? 'footer' : undefined);
    }
    private async generateFlatsRowHorisontal(point: IPoint, row: QuestionMatrixDropdownRenderedRow, columnWidth: number[]): Promise<CompositeBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        const currPoint: IPoint = SurveyHelper.clone(point);
        let lastRightMargin: number = this.controller.paperWidth - this.controller.margins.left +
            this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
        this.controller.pushMargins();
        let cnt = 0;
        const rowLocation = this.getRowLocation(row);
        for (let i = 0; i < row.cells.length; i++) {
            if (this.ignoreCell(row.cells[i], i, rowLocation)) continue;
            this.controller.margins.left = this.controller.paperWidth - lastRightMargin +
                this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
            this.controller.margins.right = this.controller.paperWidth -
                this.controller.margins.left - columnWidth[cnt];
            lastRightMargin = this.controller.margins.right;
            currPoint.xLeft = this.controller.margins.left;
            const cellContent: CompositeBrick = await this.generateFlatsCell(
                currPoint, row.cells[i], rowLocation);
            if (!cellContent.isEmpty) {
                composite.addBrick(cellContent);
            }
            cnt++;
        }
        this.controller.popMargins();
        return composite;
    }
    private async generateFlatsRowVertical(point: IPoint, row: QuestionMatrixDropdownRenderedRow): Promise<CompositeBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        const currPoint: IPoint = SurveyHelper.clone(point);
        const rowLocation = this.getRowLocation(row);
        for (let i: number = 0; i < row.cells.length; i++) {
            if (this.ignoreCell(row.cells[i], i, rowLocation, false)) continue;
            if (this.question.renderedTable.showHeader && (!this.isMultiple || i > 0) && row.cells[i].cell?.column?.locTitle) {
                composite.addBrick(await this.generateFlatsCellTitle(currPoint, row.cells[i].cell.column.locTitle));
                currPoint.yTop = composite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
            }
            composite.addBrick(await this.generateFlatsCell(currPoint, row.cells[i], rowLocation, false));
            currPoint.yTop = composite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
        }
        return composite;
    }
    private getAvalableWidth(colCount: number): number {
        return SurveyHelper.getPageAvailableWidth(this.controller) -
        (colCount - 1) * this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
    }
    private calculateColumnWidth(rows: QuestionMatrixDropdownRenderedRow[], colCount: number): number[] {
        const availableWidth: number = this.getAvalableWidth(colCount);
        let remainWidth: number = availableWidth;
        let remainColCount: number = colCount;
        const columnWidth: number[] = [];
        const unsetCells: QuestionMatrixDropdownRenderedCell[] = [];
        let cells = rows[0].cells.filter((cell: QuestionMatrixDropdownRenderedCell, index: number) => !this.ignoreCell(cell, index));
        for (let i: number = 0; i < colCount; i++) {
            const width: number = SurveyHelper.parseWidth(cells[i].width,
                availableWidth, colCount) || 0.0;
            remainWidth -= width;
            if (width !== 0.0) {
                remainColCount--;
            } else {
                unsetCells.push(cells[i]);
            }
            columnWidth.push(width);
        }
        if (remainColCount === 0) return columnWidth;
        const heuristicWidth: number = this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        unsetCells.sort((cell1: QuestionMatrixDropdownRenderedCell, cell2: QuestionMatrixDropdownRenderedCell) => {
            let minWidth1 = SurveyHelper.parseWidth(cell1.minWidth, availableWidth, colCount) || 0.0;
            let minWidth2 = SurveyHelper.parseWidth(cell2.minWidth, availableWidth, colCount) || 0.0;
            return minWidth2 > minWidth1 ? 1 : -1;
        }).forEach((cell: QuestionMatrixDropdownRenderedCell) => {
            const equalWidth: number = remainWidth / remainColCount;
            const columnMinWidth: number = SurveyHelper.parseWidth(cell.minWidth, availableWidth, colCount) || 0.0;
            if(columnMinWidth > equalWidth && columnMinWidth > heuristicWidth) {
                remainWidth -= columnMinWidth;
                remainColCount--;
            }
            columnWidth[cells.indexOf(cell)] = Math.max(heuristicWidth, columnMinWidth, equalWidth);
        });
        return columnWidth;
    }
    private async generateOneRow(point: IPoint, row: QuestionMatrixDropdownRenderedRow, isWide: boolean, columnWidth: number[]): Promise<CompositeBrick> {
        if (isWide) {
            return await this.generateFlatsRowHorisontal(point, row, columnWidth);
        }
        return await this.generateFlatsRowVertical(point, row);
    }
    private async generateFlatsRows(point: IPoint, rows: QuestionMatrixDropdownRenderedRow[],
        colCount: number, isWide: boolean): Promise<CompositeBrick[]> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const rowsFlats: CompositeBrick[] = [];
        for (let i: number = 0; i < rows.length; i++) {
            let rowFlat: CompositeBrick = await this.generateOneRow(currPoint, rows[i],
                isWide, this.calculateColumnWidth(rows, colCount));
            if (rowFlat.isEmpty && !(rows[i].row && rows[i].row.hasPanel)) continue;
            if(!rowFlat.isEmpty) {
                if (i !== rows.length - 1) {
                    currPoint.yTop = rowFlat.yBot;
                    rowFlat.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
                }
                rowsFlats.push(rowFlat);
                currPoint.yTop = rowFlat.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
            }

            if (!!rows[i].row && rows[i].row.hasPanel) {
                rows[i].row.showDetailPanel();
                const currentDetailPanel: PanelModel = rows[i].row.detailPanel;
                for (let j = 0; j < currentDetailPanel.questions.length; j++) {
                    currentDetailPanel.questions[j].id += '_' + i;
                }
                const panelBricks: IPdfBrick[] = await FlatSurvey.generateFlatsPanel(
                    this.survey, this.controller, currentDetailPanel, currPoint);

                const currComposite: CompositeBrick = new CompositeBrick();
                currComposite.addBrick(...panelBricks);
                currPoint.yTop = currComposite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;

                rowsFlats.push(currComposite);
                if (i !== rows.length - 1 && this.question.renderedTable.showHeader && isWide) {
                    const header: CompositeBrick = await this.generateOneRow(currPoint, rows[0],
                        isWide, this.calculateColumnWidth(rows, colCount));
                    let currYTop = currComposite.yBot;
                    if(!header.isEmpty) {
                        currYTop = header.yBot;
                        rowsFlats.push(header);
                    }
                    currPoint.yTop = currYTop + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
                }
            }
        }
        return rowsFlats;
    }
    private calculateIsWide(table: QuestionMatrixDropdownRenderedTable, colCount: number) {
        const rows: QuestionMatrixDropdownRenderedRow[] = [];
        if(table.showHeader) {
            rows.push(table.headerRow);
        }
        rows.push(...this.visibleRows);
        if(rows.length === 0) return true;
        const columnWidthSum = this.calculateColumnWidth(rows, colCount).reduce((widthSum: number, width: number) => widthSum += width, 0);
        return this.question.renderAs !== 'list' && this.controller.matrixRenderAs !== 'list' && Math.floor(columnWidthSum) <= Math.floor(this.getAvalableWidth(colCount));
    }
    private getRowsToRender(table: QuestionMatrixDropdownRenderedTable, isVertical: boolean, isWide: boolean) {
        const rows: QuestionMatrixDropdownRenderedRow[] = [];
        const renderedRows = this.visibleRows;
        if (table.showHeader && isWide) rows.push(table.headerRow);
        rows.push(...renderedRows);
        if (table.hasRemoveRows && isVertical) rows.pop();
        if (table.showFooter) rows.push(table.footerRow);
        return rows;
    }
    private getColCount(table: QuestionMatrixDropdownRenderedTable, renderedRows: Array<QuestionMatrixDropdownRenderedRow>): number {
        if (!!renderedRows[0]) {
            return renderedRows[0].cells.filter((cell: QuestionMatrixDropdownRenderedCell, index: number) => !this.ignoreCell(cell, index)).length;
        } else {
            return table.showHeader && table.headerRow ? table.headerRow.cells.length :
                table.showFooter && table.footerRow ? table.footerRow.cells.length : 0;
        }
    }

    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let table: QuestionMatrixDropdownRenderedTable = this.question.renderedTable;
        let isVertical: boolean = this.question.columnLayout === 'vertical';
        let colCount: number = this.getColCount(table, this.visibleRows);
        if (colCount === 0 && !this.hasDetailPanel) {
            return [new CompositeBrick(SurveyHelper.createRowlineFlat(point, this.controller))];
        }
        const isWide = this.calculateIsWide(table, colCount);
        if(!isWide) {
            this.question.isMobile = true;
            isVertical = false;
            table = this.question.renderedTable;
            this.visibleRowsValue = undefined;
            colCount = this.getColCount(table, this.visibleRows);
        }
        const rows = this.getRowsToRender(table, isVertical, isWide);
        return await this.generateFlatsRows(point, rows, colCount, isWide);
    }
}

Serializer.removeProperty('matrixdropdown', 'renderAs');
Serializer.addProperty('matrixdropdown', {
    name: 'renderAs',
    default: 'auto',
    visible: false,
    choices: ['auto', 'list']
});
FlatRepository.getInstance().register('matrixdropdown', FlatMatrixMultiple);