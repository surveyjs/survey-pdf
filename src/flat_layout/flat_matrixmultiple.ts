import {
    IQuestion, QuestionMatrixDropdownModelBase, QuestionMatrixDropdownRenderedTable,
    QuestionMatrixDropdownRenderedRow, QuestionMatrixDropdownRenderedCell, Serializer, PanelModel
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
    private async generateFlatsCell(point: IPoint, cell: QuestionMatrixDropdownRenderedCell,
        isHeader: boolean): Promise<CompositeBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        if (cell.hasQuestion) {
            if (cell.cell.column.isShowInMultipleColumns) {
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
            if (isHeader) {
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
    private async generateFlatsRowHorisontal(point: IPoint, row: QuestionMatrixDropdownRenderedRow,
        colCount: number, columnWidth: number[]): Promise<CompositeBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        const currPoint: IPoint = SurveyHelper.clone(point);
        let lastRightMargin: number = this.controller.paperWidth - this.controller.margins.left +
            this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
        this.controller.pushMargins();
        for (let i: number = 0; i < Math.min(colCount, row.cells.length); i++) {
            this.controller.margins.left = this.controller.paperWidth - lastRightMargin +
                this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
            this.controller.margins.right = this.controller.paperWidth -
                this.controller.margins.left - columnWidth[i];
            lastRightMargin = this.controller.margins.right;
            currPoint.xLeft = this.controller.margins.left;
            const cellContent: CompositeBrick = await this.generateFlatsCell(
                currPoint, row.cells[i], row === this.question.renderedTable.headerRow);
            if (!cellContent.isEmpty) composite.addBrick(cellContent);
        }
        this.controller.popMargins();
        return composite;
    }
    private async generateFlatsRowVertical(point: IPoint, row: QuestionMatrixDropdownRenderedRow,
        colCount: number): Promise<CompositeBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        const currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < Math.min(colCount, row.cells.length); i++) {
            if (this.question.renderedTable.showHeader && (!this.isMultiple || i > 0)) {
                composite.addBrick(await this.generateFlatsCell(currPoint,
                    this.question.renderedTable.headerRow.cells[i], false));
                currPoint.yTop = composite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
            }
            composite.addBrick(await this.generateFlatsCell(currPoint, row.cells[i], false));
            currPoint.yTop = composite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
        }
        return composite;
    }
    private calculateColumnWidth(rows: QuestionMatrixDropdownRenderedRow[], colCount: number): number[] {
        const availableWidth: number = SurveyHelper.getPageAvailableWidth(this.controller) -
            (colCount - 1) * this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
        let remainWidth: number = availableWidth;
        let remainColCount: number = colCount;
        const columnWidth: number[] = [];
        for (let i: number = 0; i < colCount; i++) {
            const width: number = SurveyHelper.parseWidth(rows[0].cells[i].width,
                availableWidth, colCount) || 0.0;
            remainWidth -= width;
            if (width !== 0.0) remainColCount--;
            columnWidth.push(width);
        }
        if (remainColCount === 0) return columnWidth;
        const heuristicWidth: number = this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        const columnMinWidth: number = SurveyHelper.parseWidth(
            rows[0].cells[0].minWidth, remainWidth, colCount) || 0.0;
        const equalWidth: number = remainWidth / remainColCount;
        const width: number = Math.max(heuristicWidth, columnMinWidth, equalWidth);
        for (let i: number = 0; i < columnWidth.length; i++) {
            if (columnWidth[i] === 0.0) columnWidth[i] = width;
        }
        return columnWidth;
    }
    private async generateOneRow(point: IPoint, row: QuestionMatrixDropdownRenderedRow,
        colCount: number, isWide: boolean, columnWidth: number[]): Promise<CompositeBrick> {
        if (isWide) {
            return await this.generateFlatsRowHorisontal(point, row, colCount, columnWidth);
        }
        return await this.generateFlatsRowVertical(point, row, colCount);
    }
    private async generateFlatsRows(point: IPoint, rows: QuestionMatrixDropdownRenderedRow[],
        colCount: number, isWide: boolean): Promise<CompositeBrick[]> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const rowsFlats: CompositeBrick[] = [];
        for (let i: number = 0; i < rows.length; i++) {
            let rowFlat: CompositeBrick = await this.generateOneRow(currPoint, rows[i], colCount,
                isWide, this.calculateColumnWidth(rows, colCount));
            if (rowFlat.isEmpty) continue;
            if (i !== rows.length - 1) {
                currPoint.yTop = rowFlat.yBot;
                rowFlat.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
            }
            rowsFlats.push(rowFlat);
            currPoint.yTop = rowFlat.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;

            if (this.question.detailPanelMode !== 'none' && i > 0) {
                const currentDetailPanel: PanelModel = this.question.detailPanelValue;
                for (let j = 0; j < currentDetailPanel.questions.length; j++) {
                    currentDetailPanel.questions[j].id += '_' + i;
                }
                const panelBricks: IPdfBrick[] = await FlatSurvey.generateFlatsPanel(
                    this.survey, this.controller, currentDetailPanel, currPoint);

                const currComposite: CompositeBrick = new CompositeBrick();
                currComposite.addBrick(...panelBricks);
                currPoint.yTop = currComposite.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;

                rowsFlats.push(currComposite);
                if (i !== rows.length - 1) {
                    const header: CompositeBrick = await this.generateOneRow(currPoint, rows[0], colCount,
                        isWide, this.calculateColumnWidth(rows, colCount));
                    currPoint.yTop = header.yBot + FlatMatrixMultiple.GAP_BETWEEN_ROWS * this.controller.unitHeight;
                    rowsFlats.push(header);
                }
            }
        }
        return rowsFlats;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const table: QuestionMatrixDropdownRenderedTable = this.question.renderedTable;
        const isVertical: boolean = this.question.columnLayout === 'vertical';
        const colCount: number = table.rows[0] ? table.rows[0].cells.length -
            (table.hasRemoveRows && !isVertical ? 1 : 0) :
            table.showHeader && table.headerRow ? table.headerRow.cells.length :
                table.showFooter && table.footerRow ? table.footerRow.cells.length : 0;
        if (colCount === 0) {
            return [new CompositeBrick(SurveyHelper.createRowlineFlat(point, this.controller))];
        }
        const rows: QuestionMatrixDropdownRenderedRow[] = [];
        const cellWidth: number = SurveyHelper.getColumnWidth(this.controller, colCount);
        const isWide: boolean = this.question.renderAs !== 'list' &&
            this.controller.matrixRenderAs !== 'list' &&
            cellWidth >= this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        if (table.showHeader && isWide) rows.push(table.headerRow);
        rows.push(...table.rows);
        if (table.hasRemoveRows && isVertical) rows.pop();
        if (table.showFooter && isWide) rows.push(table.footerRow);
        return await this.generateFlatsRows(point, rows, colCount, isWide);
    }
}

Serializer.removeProperty('matrixdropdown', 'renderAs');
Serializer.addProperty('matrixdropdown', {
    name: 'renderAs',
    default: 'auto',
    choices: ['auto', 'list']
});
FlatRepository.getInstance().register('matrixdropdown', FlatMatrixMultiple);