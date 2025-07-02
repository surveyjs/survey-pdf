import { IQuestion, QuestionMatrixModel, MatrixRowModel,
    QuestionRadiogroupModel, ItemValue, Serializer } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController, IPoint, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRadiogroup } from './flat_radiogroup';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatMatrix extends FlatQuestion {
    public static readonly GAP_BETWEEN_ROWS: number = 0.5;
    protected question: QuestionMatrixModel;
    constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, <QuestionRadiogroupModel>question, controller);
        this.question = <QuestionMatrixModel>question;
    }
    protected async generateFlatsHeader(point: IPoint): Promise<IPdfBrick[]> {
        const headers: IPdfBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        if(this.question.hasRows) {
            currPoint.xLeft += this.rowTitleWidth + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
        }
        for (let i: number = 0; i < this.question.visibleColumns.length; i++) {
            this.controller.pushMargins();
            this.controller.margins.left = currPoint.xLeft;
            this.controller.margins.right += (SurveyHelper.getPageAvailableWidth(this.controller) - this.columnWidth);
            headers.push(await SurveyHelper.createBoldTextFlat(currPoint,
                this.question, this.controller, this.question.visibleColumns[i].locText));
            currPoint.xLeft += this.columnWidth + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
            this.controller.popMargins();
        }
        const compositeBrick: CompositeBrick = new CompositeBrick(...headers);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
    protected async generateFlatsRows(point: IPoint, isVertical: boolean): Promise<IPdfBrick[]> {
        const cells: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < this.question.visibleRows.length; i++) {
            const key: string = 'row' + i;
            const flatsRow: IPdfBrick[] = await new FlatMatrixRow(this.survey, this.question, this.controller,
                this.question.visibleRows[i], i, key, i == 0, isVertical, this.rowTitleWidth, this.columnWidth).generateFlatsContent(currPoint);
            currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flatsRow));
            currPoint.yTop += this.controller.unitHeight * FlatMatrix.GAP_BETWEEN_ROWS;
            cells.push(...flatsRow);
        }
        return cells;
    }
    private rowTitleWidth: number;
    private columnWidth: number;
    private calculateColumnsWidthes() {
        const availableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        if(this.question.hasRows && this.question.rowTitleWidth) {
            this.controller.pushMargins();
            this.rowTitleWidth = SurveyHelper.parseWidth(this.question.rowTitleWidth, availableWidth);
            this.controller.margins.left += (this.rowTitleWidth + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS);
            this.columnWidth = SurveyHelper.getColumnWidth(this.controller, this.question.visibleColumns.length);
            this.controller.popMargins();
        } else {
            this.columnWidth = this.rowTitleWidth = SurveyHelper.getColumnWidth(this.controller, this.question.visibleColumns.length + (this.question.hasRows ? 1 : 0));
        }
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        this.calculateColumnsWidthes();
        const isVertical: boolean = this.question.renderAs === 'list' || this.controller.matrixRenderAs === 'list' ||
            this.columnWidth < this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        let currPoint: IPoint = SurveyHelper.clone(point);
        const cells: IPdfBrick[] = [];
        if (!isVertical && this.question.showHeader && this.question.visibleColumns.length != 0) {
            let headers: IPdfBrick[] = await this.generateFlatsHeader(currPoint);
            currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...headers));
            currPoint.yTop += FlatMatrix.GAP_BETWEEN_ROWS * this.controller.unitHeight;
            cells.push(...headers);
        }
        cells.push(...await this.generateFlatsRows(currPoint, isVertical));
        return cells;
    }
}

export class FlatMatrixRow extends FlatRadiogroup {
    protected questionMatrix: QuestionMatrixModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController, private row: MatrixRowModel, private rowIndex: number,
        private key: string, protected isFirst: boolean = false, protected isVertical: boolean = false, private rowTitleWidth: number, private columnWidth: number) {
        super(survey, question, controller);
        this.questionMatrix = <QuestionMatrixModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return this.isVertical ?
            await this.generateFlatsVerticallyCells(point) :
            await this.generateFlatsHorizontallyCells(point);
    }
    protected async generateTextComposite(point: IPoint, column: ItemValue, index: number): Promise<IPdfBrick> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const checked: boolean = this.row.value == column.value;
        const itemRect = SurveyHelper.createRect(currPoint,
            SurveyHelper.getPageAvailableWidth(this.controller), this.controller.unitHeight);
        const radioFlat: IPdfBrick = this.generateFlatItem(itemRect, column, index, this.key, checked, { row: this.row, rowIndex: this.rowIndex });
        currPoint.yTop = radioFlat.yBot + this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const cellTextFlat = await SurveyHelper.createTextFlat(currPoint, this.questionMatrix, this.controller,
            this.questionMatrix.getCellDisplayLocText(this.row.name, column), TextBrick);
        return new CompositeBrick(radioFlat, cellTextFlat);
    }
    protected async generateItemCompoiste(point: IPoint, column: ItemValue, index: number): Promise<IPdfBrick> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const checked: boolean = this.row.value == column.value;
        const itemRect: IRect = SurveyHelper.createRect(currPoint,
            this.controller.unitHeight, this.controller.unitHeight);
        const radioFlat: IPdfBrick = this.generateFlatItem(SurveyHelper.moveRect(
            SurveyHelper.scaleRect(itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE), itemRect.xLeft), column, index, this.key, checked, { row: this.row, rowIndex: this.rowIndex });
        currPoint.xLeft = radioFlat.xRight + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const radioText: IPdfBrick = await SurveyHelper.createTextFlat(currPoint, this.questionMatrix,
            this.controller, column.locText, TextBrick);
        return new CompositeBrick(radioFlat, radioText);
    }
    protected async generateFlatsHorizontallyCells(point: IPoint) {
        const cells: IPdfBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        if (this.questionMatrix.hasRows) {
            this.controller.pushMargins();
            currPoint.xLeft = this.controller.margins.left;
            this.controller.margins.right += (SurveyHelper.getPageAvailableWidth(this.controller) - this.rowTitleWidth);
            cells.push(await SurveyHelper.createTextFlat(currPoint, this.questionMatrix, this.controller, this.row.locText, TextBrick));
            currPoint.xLeft += this.rowTitleWidth + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
            this.controller.popMargins();
        }
        for (let i: number = 0; i < this.questionMatrix.visibleColumns.length; i++) {
            const column: ItemValue = this.questionMatrix.visibleColumns[i];
            const checked: boolean = this.row.value == column.value;
            this.controller.pushMargins();
            this.controller.margins.left = currPoint.xLeft;
            this.controller.margins.right += (SurveyHelper.getPageAvailableWidth(this.controller) - this.columnWidth);
            if (this.questionMatrix.hasCellText) {
                cells.push(await this.generateTextComposite(currPoint, column, i));
            }
            else {
                const itemRect: IRect = SurveyHelper.createRect(currPoint, this.controller.unitHeight, this.controller.unitHeight);
                cells.push(this.generateFlatItem(SurveyHelper.moveRect(
                    SurveyHelper.scaleRect(itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft), column, i, this.key, checked, { row: this.row, rowIndex: this.rowIndex }));
            }
            currPoint.xLeft += this.columnWidth + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS;
            this.controller.popMargins();
        }
        const compositeBrick = new CompositeBrick(...cells);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
    protected async generateFlatsVerticallyCells(point: IPoint): Promise<IPdfBrick[]> {
        const cells: IPdfBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        if (this.questionMatrix.hasRows) {
            const rowTextFlat = await SurveyHelper.createTextFlat(currPoint, this.questionMatrix,
                this.controller, this.row.locText, TextBrick);
            currPoint.yTop = rowTextFlat.yBot + FlatQuestion.CONTENT_GAP_VERT_SCALE * this.controller.unitHeight;
            cells.push(rowTextFlat);
        }
        this.generateFlatComposite = (this.questionMatrix.hasCellText) ? this.generateTextComposite : this.generateItemCompoiste;
        cells.push(...await this.generateVerticallyItems(currPoint, this.questionMatrix.visibleColumns));
        const compositeBrick: CompositeBrick = new CompositeBrick(...cells);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
}

Serializer.removeProperty('matrix', 'renderAs');
Serializer.addProperty('matrix', {
    name: 'renderAs',
    default: 'auto',
    visible: false,
    choices: ['auto', 'list']
});
FlatRepository.getInstance().register('matrix', FlatMatrix);