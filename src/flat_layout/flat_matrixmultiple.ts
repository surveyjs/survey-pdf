import {
    QuestionMatrixDropdownModelBase, PanelModel,
    Question,
    LocalizableString,
    MatrixDropdownCell,
    QuestionSelectBase,
    MatrixDropdownColumn,
    ItemValue,
    Serializer } from 'survey-core';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion, IFlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { ContainerBrick } from '../pdf_render/pdf_container';
import { EmptyBrick } from '../pdf_render/pdf_empty';
import { IAlignedTextStyle, IContainerStyle, IQuestionMatrixDropdownStyle } from '../style/types';
import { FlatSelectBase } from './flat_selectbase';
import { IFlatPanel } from './flat_panel';
interface IMatrixCellFlat {
    generateFlats(point: IPoint, width: number): Promise<ContainerBrick>;
    getColSpan(): number;
}
interface IMatrixCellStyle {
    container: IContainerStyle;
}
interface IMatrixFlatBaseOptions {
    style: IMatrixCellStyle;
    colSpan?: number;
}
abstract class MatrixCellBaseFlat<T extends IMatrixFlatBaseOptions = IMatrixFlatBaseOptions> {
    constructor(protected controller: DocController, protected options: T) {}
    getColSpan(): number {
        return this.options.colSpan ?? 1;
    }
    public async generateFlats(point: IPoint, width: number): Promise<ContainerBrick> {
        const container: ContainerBrick = new ContainerBrick(this.controller, { ...point, width }, this.options.style.container);
        await container.setup(async (point, bricks) => {
            bricks.push(...await this.generateContentFlats(point));
        });
        return container;
    }
    abstract generateContentFlats(point: IPoint): Promise<Array<IPdfBrick>>;
}
interface IMatrixCellQuestionOptions<T extends Question = Question, S extends IFlatQuestion = IFlatQuestion> extends IMatrixFlatBaseOptions {
    question: T;
    flatQuestionFabric: (quesiton: T) => S;
}
class MatrixCellQuestionFlat<T extends IMatrixCellQuestionOptions = IMatrixCellQuestionOptions> extends MatrixCellBaseFlat<T> {
    public getColSpan() {
        return 1;
    }
    async generateContentFlats(point: IPoint): Promise<Array<IPdfBrick>> {
        const { question, flatQuestionFabric: flatQuestionFabric } = this.options;
        question.titleLocation = 'matrix';
        const questionFlatRenderer: IFlatQuestion = flatQuestionFabric(question);
        return await questionFlatRenderer.generateFlats(point);
    }
}
interface IMatrixCellChoiceOptions extends IMatrixCellQuestionOptions<QuestionSelectBase, FlatSelectBase> {
    item: ItemValue;
    index: number;
}
export class MatrixCellChoiceFlat extends MatrixCellBaseFlat <IMatrixCellChoiceOptions> {
    async generateContentFlats(point: IPoint): Promise<Array<IPdfBrick>> {
        const { question, flatQuestionFabric } = this.options;
        const questionFlatRenderer = flatQuestionFabric(question);
        return [questionFlatRenderer.generateFlatItem(point, this.options.item, this.options.index, questionFlatRenderer.getItemStyle(this.options.item).input)];
    }
}
interface IMatrixCellTextStyle extends IMatrixCellStyle {
    text: IAlignedTextStyle;
}
interface IMatrixCellTextOptions extends IMatrixFlatBaseOptions {
    locText: LocalizableString;
    style: IMatrixCellTextStyle;
}
class MatrixCellTextFlat extends MatrixCellBaseFlat<IMatrixCellTextOptions> {
    async generateContentFlats(point: IPoint): Promise<Array<IPdfBrick>> {
        return [await SurveyHelper.createTextFlat(point, this.controller, this.options.locText, this.options.style.text)];
    }
}
class MatrixCellEmptyFlat extends MatrixCellBaseFlat {
    async generateContentFlats(point: IPoint): Promise<Array<IPdfBrick>> {
        return [new EmptyBrick(this.controller, SurveyHelper.createRect(point, SurveyHelper.getPageAvailableWidth(this.controller), 0))];
    }
}

interface IMatrixCellPanelOptions extends IMatrixFlatBaseOptions {
    panel: PanelModel;
    flatPanelFabric: (panl: PanelModel) => IFlatPanel;
}
class MatrixCellPanelFlat extends MatrixCellBaseFlat<IMatrixCellPanelOptions> {
    async generateContentFlats(point: IPoint): Promise<Array<IPdfBrick>> {
        return await this.options.flatPanelFabric(this.options.panel).generateFlats(point);
    }
}
interface IMatrixCellQuestionListStyle extends IMatrixCellStyle {
    contentGap: number;
    title: IAlignedTextStyle;
}
interface IMatrixCellQuestionListOptions extends IMatrixCellQuestionOptions {
    style: IMatrixCellQuestionListStyle;
    locTitle: LocalizableString;
}
export class MatrixCellQuestionListFlat extends MatrixCellQuestionFlat<IMatrixCellQuestionListOptions> {
    async generateContentFlats(point: IPoint): Promise<Array<IPdfBrick>> {
        const bricks: Array<IPdfBrick> = [];
        const titleBrick = await SurveyHelper.createTextFlat(point, this.controller, this.options.locTitle, this.options.style.title);
        bricks.push(titleBrick);
        const contentPoint = SurveyHelper.createPoint(titleBrick, true, false);
        contentPoint.yTop += this.options.style.contentGap;
        bricks.push(...await super.generateContentFlats(contentPoint));
        return bricks;
    }
}

interface IMatrixColumnDescriptor {
    locTitle: LocalizableString;
    minWidth: string;
    width: string;
}

export class FlatMatrixMultiple<T extends QuestionMatrixDropdownModelBase = QuestionMatrixDropdownModelBase, S extends IQuestionMatrixDropdownStyle = IQuestionMatrixDropdownStyle> extends FlatQuestion<T, S> {
    protected getMatrixRows() {
        return this.controller.dynamicContent.conditionalMatrixRows ? this.question.allRows : this.question.visibleRows;
    }
    protected isMatrixColumnVisible(column: MatrixDropdownColumn): boolean {
        return column.visible && (this.controller.dynamicContent.conditionalMatrixColumns || column.isColumnVisible);
    }
    private getMatrixColumnDescriptors(): Array<IMatrixColumnDescriptor> {
        const columnDescriptors: Array<IMatrixColumnDescriptor> = [];
        for(const column of this.question.columns.filter(column => this.isMatrixColumnVisible(column)) as Array<MatrixDropdownColumn>) {
            if(column.showInMultipleColumns) {
                for(const item of this.getMultipleColumnChoices(column)) {
                    columnDescriptors.push({ minWidth: column.minWidth, width: column.width, locTitle: item.locTitle });
                }
            } else {
                columnDescriptors.push({ minWidth: column.minWidth, width: column.width, locTitle: column.locTitle });
            }
        }
        return columnDescriptors;
    }
    private getColumnsAvalableWidth(colCount: number): number {
        return SurveyHelper.getPageAvailableWidth(this.controller) -
        (colCount - 1) * this.style.spacing.tableColumnGap;
    }
    private getPredefinedTransposedColumnWidths(): Array<{ width: string, minWidth: string }> {
        const predefinedWidths: Array<{ width: string, minWidth: string }> = [];
        if(this.question.showHeader) {
            predefinedWidths.push({ minWidth: this.question.rowTitleWidth, width: this.question.rowTitleWidth });
        }
        for(const _ of this.getMatrixRows()) {
            predefinedWidths.push({ width: '', minWidth: '' });
        }
        return predefinedWidths;
    }
    private getPredefinedColumnWidts(): Array<{ width: string, minWidth: string }> {
        const predefinedWidths: Array<{ width: string, minWidth: string }> = [];
        if(this.question.hasRowText) {
            predefinedWidths.push({ minWidth: this.question.rowTitleWidth, width: this.question.rowTitleWidth });
        }
        for(const colDescriptor of this.getMatrixColumnDescriptors()) {
            predefinedWidths.push({ width: colDescriptor.width, minWidth: colDescriptor.minWidth });
        }
        return predefinedWidths;
    }
    private calculateColumnWidth(predefinedColumnWidths: Array<{ width: string, minWidth: string }>): number[] {
        const availableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        const columnWidth: number[] = [];
        const colCount = predefinedColumnWidths.length;
        let remainColCount: number = colCount;
        let remainWidth: number = this.getColumnsAvalableWidth(colCount);

        const unsetCells: Array<{ width: string, minWidth: string }> = [];
        const styleMinWidth: number = this.style.columnMinWidth;
        for (let i: number = 0; i < colCount; i++) {
            let width: number = Math.max(SurveyHelper.parseWidth(predefinedColumnWidths[i].width,
                availableWidth, colCount) || 0.0);
            if(width !== 0.0) {
                width = Math.max(width, styleMinWidth, SurveyHelper.parseWidth(predefinedColumnWidths[i].minWidth, availableWidth, colCount) || 0);
                remainWidth -= width;
                remainColCount--;
            } else {
                unsetCells.push(predefinedColumnWidths[i]);
            }
            columnWidth.push(width);
        }
        if (remainColCount === 0) return columnWidth;
        unsetCells.sort((cell1: { width: string, minWidth: string }, cell2: { width: string, minWidth: string }) => {
            let minWidth1 = SurveyHelper.parseWidth(cell1.minWidth, availableWidth, colCount) || 0.0;
            let minWidth2 = SurveyHelper.parseWidth(cell2.minWidth, availableWidth, colCount) || 0.0;
            return minWidth2 > minWidth1 ? 1 : -1;
        }).forEach((cell: { width: string, minWidth: string }) => {
            const equalWidth: number = remainWidth / remainColCount;
            const columnMinWidth: number = SurveyHelper.parseWidth(cell.minWidth, availableWidth, colCount) || 0.0;
            if(columnMinWidth > equalWidth && columnMinWidth > styleMinWidth) {
                remainWidth -= columnMinWidth;
                remainColCount--;
            }
            columnWidth[predefinedColumnWidths.indexOf(cell)] = Math.max(styleMinWidth, columnMinWidth, equalWidth);
        });
        return columnWidth;
    }
    private getMultipleColumnChoices(column: MatrixDropdownColumn): Array<ItemValue> {
        var choices = column.templateQuestion.choices;
        if (!!choices && Array.isArray(choices) && choices.length == 0)
            return [].concat(this.question.choices, column.getVisibleMultipleChoices());
        choices = column.getVisibleMultipleChoices();
        if (!choices || !Array.isArray(choices)) return null;
        return choices;
    }
    private buildTableCore(columnTitleStyle: IAlignedTextStyle, rowTitleStyle: IAlignedTextStyle, showDetailPanel: boolean = true, showFooter: boolean = false): Array<Array<IMatrixCellFlat>> {
        const table: Array<Array<IMatrixCellFlat>> = [];
        const flatQuestionFabric = (question: Question) => SurveyHelper.getFlatQuestion(this.survey, this.controller, question);
        const flatPanelFabric = (panel: PanelModel) => SurveyHelper.getFlatPanel(this.survey, this.controller, panel);
        const matrixRows = this.getMatrixRows();
        if(this.question.showHeader) {
            const headerRow = [];
            if (this.question.hasRowText) {
                headerRow.push(new MatrixCellEmptyFlat(this.controller, { style: { container: this.style.cell } }));
            }
            const contentCells = this.getMatrixColumnDescriptors().map(column => new MatrixCellTextFlat(this.controller, { style: { container: this.style.cell, text: columnTitleStyle }, locText: column.locTitle }));
            headerRow.push(...contentCells);
            table.push(headerRow);
        }
        const contentRows = [];
        for (const row of matrixRows) {
            const contentRow = [];
            if(this.question.hasRowText) {
                contentRow.push(new MatrixCellTextFlat(this.controller, { style: { container: this.style.cell, text: rowTitleStyle },
                    locText: row.locText
                }));
            }
            const contentCells = [];
            for(const cell of row.cells.filter(cell => this.isMatrixColumnVisible(cell.column))) {
                if(cell.column.showInMultipleColumns) {
                    let flatQuestionValue: FlatSelectBase = undefined;
                    for(const [index, item] of (cell.question.visibleChoices as ItemValue[]).entries()) {
                        contentCells.push(new MatrixCellChoiceFlat(this.controller,
                            {
                                style: { container: this.style.cell },
                                item, index, question: cell.question as QuestionSelectBase,
                                flatQuestionFabric: (question: QuestionSelectBase) => {
                                    if(!flatQuestionValue) {
                                        flatQuestionValue = flatQuestionFabric(question) as FlatSelectBase;
                                    }
                                    return flatQuestionValue;
                                }
                            }
                        ));
                    }
                } else {
                    contentCells.push(new MatrixCellQuestionFlat(this.controller, { style: { container: this.style.cell }, question: cell.question, flatQuestionFabric }));
                }
            }
            contentRow.push(...contentCells);
            contentRows.push(contentRow);
            if(row.hasPanel && showDetailPanel) {
                const panelRow = [];
                row.showDetailPanel();
                if(this.question.hasRowText) {
                    panelRow.push(new MatrixCellEmptyFlat(this.controller, { style: { container: this.style.cell } }));
                }
                panelRow.push(new MatrixCellPanelFlat(this.controller, { style: { container: {} }, panel: row.detailPanel, flatPanelFabric: flatPanelFabric, colSpan: this.getMatrixColumnDescriptors().length }));
                contentRows.push(panelRow);
            }
        }
        table.push(...contentRows);
        if(this.question.hasTotal) {
            const footerRow = [];
            if (this.question.hasRowText) {
                footerRow.push(new MatrixCellTextFlat(this.controller, { style: { container: this.style.cell, text: rowTitleStyle }, locText: this.question.getFooterText() }));
            }
            const contentCells = [];
            for(const cell of this.question.visibleTotalRow.cells.filter(cell => this.isMatrixColumnVisible(cell.column))) {
                if(cell.question.isAnswered) {
                    if(cell.column.showInMultipleColumns) {
                        for (const _ of this.getMultipleColumnChoices(cell.column)) {
                            contentCells.push(new MatrixCellQuestionFlat(this.controller, { style: { container: this.style.cell }, question: cell.question, flatQuestionFabric: flatQuestionFabric }));
                        }
                    }
                    else {
                        contentCells.push(new MatrixCellQuestionFlat(this.controller, { style: { container: this.style.cell }, question: cell.question, flatQuestionFabric: flatQuestionFabric }));
                    }
                } else {
                    contentCells.push(new MatrixCellEmptyFlat(this.controller, { style: { container: this.style.cell } }));

                }
            }
            footerRow.push(...contentCells);
            table.push(footerRow);
        }
        return table;
    }
    private buildTable(): Array<Array<IMatrixCellFlat>> {
        return this.buildTableCore(this.style.columnTitle, this.style.rowTitle);
    }
    private buildTransposedTable(): Array<Array<IMatrixCellFlat>> {
        const table = this.buildTableCore(this.style.rowTitle, this.style.columnTitle, false, false);
        return table.length > 0 ? table[0].map((_, colIndex) => table.map(row => row[colIndex])) : table;
    }
    private buildListTable(): Array<Array<IMatrixCellFlat>> {
        const table: Array<Array<IMatrixCellFlat>> = [];
        const createQuestionCell = (cell: MatrixDropdownCell) => {
            const flatQuestionFabric = (question: Question) => SurveyHelper.getFlatQuestion(this.survey, this.controller, question);
            if(this.question.showHeader) {
                return new MatrixCellQuestionListFlat(this.controller,
                    { style: { container: this.style.cell, contentGap: this.style.spacing.listItemTitleContentGap, title: SurveyHelper.mergeObjects({}, this.style.columnTitle, this.style.listItemTitle) },
                        question: cell.question, locTitle: cell.column.locTitle, flatQuestionFabric });
            }
            return new MatrixCellQuestionFlat(this.controller, { style: { container: this.style.cell }, question: cell.question, flatQuestionFabric });
        };
        for (const row of this.getMatrixRows()) {
            const cells = [];
            if(this.question.hasRowText) {
                cells.push(new MatrixCellTextFlat(this.controller,
                    { style: { container: SurveyHelper.mergeObjects({}, this.style.cell, this.style.listSectionTitleContainer), text: SurveyHelper.mergeObjects({}, this.style.rowTitle, this.style.listSectionTitle) },
                        locText: row.locText
                    }));
            }
            for(const cell of row.cells.filter(cell => this.isMatrixColumnVisible(cell.column))) {
                cells.push(createQuestionCell(cell));
            }
            table.push(cells);
        }
        if(this.question.hasTotal) {
            const cells = [];
            if(this.question.hasRowText && !this.question.getFooterText().isEmpty) {
                cells.push(new MatrixCellTextFlat(this.controller,
                    { style: {
                        container: SurveyHelper.mergeObjects({}, this.style.cell, this.style.listSectionTitleContainer),
                        text: SurveyHelper.mergeObjects({}, this.style.rowTitle, this.style.listSectionTitle)
                    },
                    locText: this.question.getFooterText()
                    }));
            }
            for(const cell of this.question.visibleTotalRow.cells.filter(cell => this.isMatrixColumnVisible(cell.column))) {
                if(cell.question.isAnswered) {
                    cells.push(createQuestionCell(cell));
                }
            }
            table.push(cells);
        }
        return table;
    }
    private calculateIsList(columnWidths: Array<number>, colCount: number) {
        return this.question.renderAs === 'list' || this.controller.matrixRenderAs === 'list' || Math.floor(columnWidths.reduce((widthSum: number, width: number) => widthSum += width, 0)) > Math.floor(this.getColumnsAvalableWidth(colCount));
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const predefinedColumnWidths = this.question.transposeData ? this.getPredefinedTransposedColumnWidths() : this.getPredefinedColumnWidts();
        let columnWidths = this.calculateColumnWidth(predefinedColumnWidths);
        const isList = this.calculateIsList(columnWidths, predefinedColumnWidths.length);
        const table = isList ? this.buildListTable() : this.question.transposeData ? this.buildTransposedTable() : this.buildTable();
        let currPoint = SurveyHelper.clone(point);
        const rows: Array<IPdfBrick> = [];
        for (const [rowIndex, row] of table.entries()) {
            const rowBricks: Array<ContainerBrick> = [];
            for(const [colIndex, cell] of row.entries()) {
                let columnWidth = isList ? SurveyHelper.getPageAvailableWidth(this.controller): columnWidths.slice(colIndex, colIndex + cell.getColSpan()).reduce((sum, width) => sum += width, 0);
                const container = await row[colIndex].generateFlats(currPoint, columnWidth);
                rowBricks.push(container);
                currPoint = SurveyHelper.createPoint(container, isList, !isList);
                if(isList) {
                    currPoint.yTop += this.style.spacing.tableRowGap;
                } else {
                    currPoint.xLeft += this.style.spacing.tableColumnGap;
                }
            }
            const { yBot: rowYBot, yTop: rowYTop } = SurveyHelper.mergeRects(...rowBricks);
            const rowHeight = rowYBot - rowYTop;
            if(!isList) {
                for(const brick of rowBricks) {
                    brick.fitToHeight(rowHeight);
                }
            }
            const rowFlat = new CompositeBrick(...rowBricks);
            if(rowFlat.isEmpty) continue;
            currPoint = SurveyHelper.createPoint(rowFlat, true, false);
            if(rowIndex !== table.length - 1) {
                rowFlat.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
            }
            currPoint.yTop = rowFlat.yBot + this.style.spacing.tableRowGap;
            rows.push(rowFlat);
        }
        return rows;
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
