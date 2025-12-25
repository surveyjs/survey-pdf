import {
    QuestionMatrixDropdownModelBase, QuestionMatrixDropdownRenderedTable,
    QuestionMatrixDropdownRenderedRow, QuestionMatrixDropdownRenderedCell, Serializer, PanelModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatSelectBase } from './flat_selectbase';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { BorderMode, SurveyHelper } from '../helper_survey';
import { ContainerBrick } from '../pdf_render/pdf_container';
import { EmptyBrick } from '../pdf_render/pdf_empty';
import { IQuestionMatrixDropdownStyle } from '../styles/types';

export class FlatMatrixMultiple<T extends QuestionMatrixDropdownModelBase = QuestionMatrixDropdownModelBase, S extends IQuestionMatrixDropdownStyle = IQuestionMatrixDropdownStyle> extends FlatQuestion<T, S> {
    constructor(protected survey: SurveyPDF, question: T, controller: DocController, styles: S,
        protected isMultiple: boolean = true) {
        super(survey, question, controller, styles);
    }
    private visibleRowsValue: QuestionMatrixDropdownRenderedRow[];
    private get visibleRows() {
        if(!this.visibleRowsValue) {
            this.visibleRowsValue = this.question.renderedTable.rows.filter(row => row.visible);
        }
        return this.visibleRowsValue;
    }
    private async generateFlatsCell(point: IPoint, cell: QuestionMatrixDropdownRenderedCell,
        location?: 'header' | 'footer', isWide: boolean = true): Promise<ContainerBrick> {
        let cellAppearanceOptions = this.styles.cell;
        if(cell.hasTitle && location !== 'header') {
            cellAppearanceOptions = SurveyHelper.mergeObjects({}, cellAppearanceOptions/* todo , this.styles.cellRowTitle*/);
            if(!isWide) {
                cellAppearanceOptions = SurveyHelper.mergeObjects({}, cellAppearanceOptions, this.styles.listSectionTitleContainer);
            }
        }
        if(cell.hasTitle && location === 'header') {
            cellAppearanceOptions = SurveyHelper.mergeObjects({}, cellAppearanceOptions/*todo, this.styles.cellColumnTitle*/);
            if(!isWide) {
                cellAppearanceOptions = SurveyHelper.mergeObjects({}, cellAppearanceOptions/*todo, this.styles.cellVerticalColumnTitle*/);
            }

        }
        const container: ContainerBrick = new ContainerBrick(this.controller, { ...point, width: SurveyHelper.getPageAvailableWidth(this.controller) }, cellAppearanceOptions);
        await container.setup(async (point, bricks) => {
            if (cell.hasQuestion) {
                if(location == 'footer' && !cell.question.isAnswered) {
                    bricks.push(new EmptyBrick(this.controller, { ...point, yBot: point.yTop, xRight: point.xLeft + SurveyHelper.getPageAvailableWidth(this.controller) }));
                }
                else if (isWide && cell.isChoice) {
                    const flatMultipleColumnsQuestion: FlatSelectBase = FlatRepository.getInstance().create(
                        this.survey, cell.question, this.controller, this.survey.getStylesForElement(cell.question), cell.question.getType()) as FlatSelectBase;
                    bricks.push(flatMultipleColumnsQuestion
                        .generateFlatItem(point, cell.item, cell.choiceIndex, flatMultipleColumnsQuestion.getStylesForItem(cell.item).input));
                }
                else {
                    cell.question.titleLocation = 'matrix';
                    const currPoint = SurveyHelper.clone(point);
                    if (!isWide && this.question.renderedTable.showHeader && (location !== 'header') && cell.cell?.column?.locTitle) {
                        container.addBrick(await SurveyHelper.createTextFlat(currPoint, this.controller, cell.cell.column.locTitle, SurveyHelper.mergeObjects({}, this.styles.columnTitle, this.styles.listItemTitle)));
                        currPoint.yTop = container.yBot + this.styles.spacing.listItemTitleContentGap;
                    }
                    bricks.push(...await SurveyHelper.generateQuestionFlats(
                        this.survey, this.controller, cell.question, currPoint, this.survey.getStylesForElement(cell.question)));
                }
            }
            else if (cell.hasTitle) {
                if (location == 'header') {
                    bricks.push(await SurveyHelper.createTextFlat(point, this.controller, cell.locTitle, { ...this.styles.columnTitle }));
                }
                else {
                    bricks.push(await SurveyHelper.createTextFlat(point, this.controller, cell.locTitle, SurveyHelper.mergeObjects({}, this.styles.rowTitle, isWide ? undefined : this.styles.listSectionTitle)));
                }
            } else {
                bricks.push(new EmptyBrick(this.controller, { ...point, yBot: point.yTop, xRight: point.xLeft + SurveyHelper.getPageAvailableWidth(this.controller) }));
            }
        });
        return container;
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
        const rowBricks: Array<ContainerBrick> = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        let lastRightMargin: number = this.controller.paperWidth - this.controller.margins.left +
            this.styles.spacing.tableColumnGap;
        this.controller.pushMargins();
        let cnt = 0;
        const rowLocation = this.getRowLocation(row);
        for (let i = 0; i < row.cells.length; i++) {
            if (this.ignoreCell(row.cells[i], i, rowLocation)) continue;
            this.controller.margins.left = this.controller.paperWidth - lastRightMargin +
                this.styles.spacing.tableColumnGap;
            this.controller.margins.right = this.controller.paperWidth -
                this.controller.margins.left - columnWidth[cnt];
            lastRightMargin = this.controller.margins.right;
            currPoint.xLeft = this.controller.margins.left;
            const cellContent: ContainerBrick = await this.generateFlatsCell(
                currPoint, row.cells[i], rowLocation);
            if (!cellContent.isEmpty) {
                rowBricks.push(cellContent);
            }
            cnt++;
        }
        const { yBot: rowYBot, yTop: rowYTop } = SurveyHelper.mergeRects(...rowBricks);
        const rowHeight = rowYBot - rowYTop;
        rowBricks.forEach(brick => {
            brick.fitToHeight(rowHeight);
        });
        this.controller.popMargins();
        return new CompositeBrick(...rowBricks);
    }
    private async generateFlatsRowVertical(point: IPoint, row: QuestionMatrixDropdownRenderedRow): Promise<CompositeBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        const currPoint: IPoint = SurveyHelper.clone(point);
        const rowLocation = this.getRowLocation(row);
        for (let i: number = 0; i < row.cells.length; i++) {
            if (this.ignoreCell(row.cells[i], i, rowLocation, false)) continue;
            composite.addBrick(await this.generateFlatsCell(currPoint, row.cells[i], rowLocation, false));
            currPoint.yTop = composite.yBot + this.styles.spacing.tableRowGap;
        }
        return composite;
    }
    private getColumnsAvalableWidth(colCount: number): number {
        return SurveyHelper.getPageAvailableWidth(this.controller) -
        (colCount - 1) * this.styles.spacing.tableColumnGap;
    }
    private calculateColumnWidth(rows: QuestionMatrixDropdownRenderedRow[], colCount: number): number[] {
        const availableWidth: number = this.getColumnsAvalableWidth(colCount);
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
        const heuristicWidth: number = this.styles.columnMinWidth;
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
        if(!rows || rows.length == 0) return;
        const columnWidths = this.calculateColumnWidth(rows, colCount);
        for (let i: number = 0; i < rows.length; i++) {
            let rowFlat: CompositeBrick = await this.generateOneRow(currPoint, rows[i],
                isWide, columnWidths);
            if (rowFlat.isEmpty && !(rows[i].row && rows[i].row.hasPanel)) continue;
            if(!rowFlat.isEmpty) {
                if (i !== rows.length - 1) {
                    currPoint.yTop = rowFlat.yBot;
                    rowFlat.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
                }
                rowsFlats.push(rowFlat);
                currPoint.yTop = rowFlat.yBot + this.styles.spacing.tableRowGap;
            }

            if (!!rows[i].row && rows[i].row.hasPanel) {
                rows[i].row.showDetailPanel();
                const currentDetailPanel: PanelModel = rows[i].row.detailPanel;
                for (let j = 0; j < currentDetailPanel.questions.length; j++) {
                    currentDetailPanel.questions[j].id += '_' + i;
                }
                const panelPoint = SurveyHelper.clone(currPoint);
                const currComposite: CompositeBrick = new CompositeBrick();
                if(this.isMultiple && isWide) {
                    this.controller.pushMargins();
                    panelPoint.xLeft+= columnWidths[0] + this.styles.spacing.tableColumnGap;
                    this.controller.margins.left = panelPoint.xLeft;
                }
                const panelBricks: IPdfBrick[] = await SurveyHelper.generatePanelFlats(this.survey, this.controller, currentDetailPanel, panelPoint, this.survey.getStylesForElement(currentDetailPanel));

                if(this.isMultiple && isWide) {
                    this.controller.popMargins();
                    const panelRect = SurveyHelper.mergeRects(...panelBricks);
                    const emptyBrick = new EmptyBrick(this.controller, { ...currPoint, xRight: currPoint.xLeft + columnWidths[0], yBot: currPoint.yTop + panelRect.yBot - panelRect.yTop }, { borderMode: BorderMode.Middle, color: this.styles.cell.backgroundColor, borderColor: this.styles.cell.borderColor, borderRadius: this.styles.cell.borderRadius, borderWidth: this.styles.cell.borderWidth });
                    currComposite.addBrick(emptyBrick);
                }
                currComposite.addBrick(...panelBricks);
                currPoint.yTop = currComposite.yBot + this.styles.spacing.tableRowGap;
                rowsFlats.push(currComposite);
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
        return this.question.renderAs !== 'list' && this.controller.matrixRenderAs !== 'list' && Math.floor(columnWidthSum) <= Math.floor(this.getColumnsAvalableWidth(colCount));
    }
    private getRowsToRender(table: QuestionMatrixDropdownRenderedTable, isVertical: boolean, isWide: boolean) {
        const rows: QuestionMatrixDropdownRenderedRow[] = [];
        const renderedRows = this.visibleRows.filter(row => !row.isDetailRow);
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