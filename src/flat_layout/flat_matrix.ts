import { IQuestion, QuestionMatrixModel, MatrixRowModel, QuestionRadiogroupModel, ItemValue } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController, IPoint, IRect } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { FlatRepository } from './flat_repository';
import { FlatQuestion } from './flat_question';
import { SurveyHelper } from '../helper_survey';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { FlatRadiogroup } from './flat_radiogroup';
import { TextBrick } from '../pdf_render/pdf_text';

export class FlatMatrix extends FlatQuestion {
    public static readonly GAP_BETWEEN_ROWS: number = 0.5;
    protected question: QuestionMatrixModel;
    constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, <QuestionRadiogroupModel>question, controller);
        this.question = <QuestionMatrixModel>question;
    }
    protected async generateFlatsHeader(point: IPoint): Promise<IPdfBrick[]> {
        let headers: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        let colCount: number = this.question.visibleColumns.length + (this.question.hasRows ? 1 : 0)
        for (let i: number = 0; i < this.question.visibleColumns.length; i++) {
            let column = this.question.hasRows ? i + 1 : i;
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, colCount, column);
            currPoint.xLeft = this.controller.margins.left;
            headers.push(await SurveyHelper.createBoldTextFlat(currPoint,
                this.question, this.controller, this.question.visibleColumns[i].locText));
            this.controller.popMargins();
        }
        let compositeBrick: CompositeBrick = new CompositeBrick(...headers);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
    protected async generateFlatsRows(point: IPoint, isVertical: boolean): Promise<IPdfBrick[]> {
        let cells: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < this.question.visibleRows.length; i++) {
            let key: string = 'row' + i;
            let flatsRow: IPdfBrick[] = await new FlatMatrixRow(this.survey, this.question, this.controller,
                this.question.visibleRows[i], key, i == 0, isVertical).generateFlatsContent(currPoint);
            currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flatsRow));
            currPoint.yTop += this.controller.unitHeight * FlatMatrix.GAP_BETWEEN_ROWS;
            cells.push(...flatsRow);
        }
        return cells;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let cellWidth: number = SurveyHelper.getColumnWidth(this.controller, this.question.visibleColumns.length + (this.question.hasRows ? 1 : 0));
        let isVertical: boolean = this.controller.matrixRenderAs === 'list' ||
            cellWidth < this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        let currPoint: IPoint = SurveyHelper.clone(point);
        let cells: IPdfBrick[] = [];
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
        question: IQuestion, protected controller: DocController, private row: MatrixRowModel,
        private key: string, protected isFirst: boolean = false, protected isVertical: boolean = false) {
        super(survey, question, controller);
        this.questionMatrix = <QuestionMatrixModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return this.isVertical ?
            await this.generateFlatsVerticallyCells(point) :
            await this.generateFlatsHorizontallyCells(point);
    }
    protected async generateTextComposite(point: IPoint, column: ItemValue, index: number): Promise<IPdfBrick> {
        let currPoint: IPoint = SurveyHelper.clone(point);
        let checked: boolean = this.row.value == column.value;
        let itemRect = SurveyHelper.createRect(currPoint,
            SurveyHelper.getPageAvailableWidth(this.controller), this.controller.unitHeight);
        let radioFlat: IPdfBrick = this.generateFlatItem(itemRect, column, index, this.key, checked);
        currPoint.yTop = radioFlat.yBot + this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        let cellTextFlat = await SurveyHelper.createTextFlat(currPoint, this.questionMatrix, this.controller,
            this.questionMatrix.getCellDisplayLocText(this.row.name, column), TextBrick);
        return new CompositeBrick(radioFlat, cellTextFlat);
    }
    protected async generateItemCompoiste(point: IPoint, column: ItemValue, index: number): Promise<IPdfBrick> {
        let currPoint: IPoint = SurveyHelper.clone(point);
        let checked: boolean = this.row.value == column.value;
        let itemRect: IRect = SurveyHelper.createRect(currPoint,
            this.controller.unitHeight, this.controller.unitHeight);
        let radioFlat: IPdfBrick = this.generateFlatItem(SurveyHelper.moveRect(
            SurveyHelper.scaleRect(itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE), itemRect.xLeft), column, index, this.key, checked);
        currPoint.xLeft = radioFlat.xRight + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        let radioText: IPdfBrick = await SurveyHelper.createTextFlat(currPoint, this.questionMatrix,
            this.controller, column.locText, TextBrick);
        return new CompositeBrick(radioFlat, radioText);
    }
    protected async generateFlatsHorizontallyCells(point: IPoint) {
        let cells: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        let colCount: number = this.question.visibleColumns.length + (this.question.hasRows ? 1 : 0)
        if (this.questionMatrix.hasRows) {
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, colCount, 0);
            currPoint.xLeft = this.controller.margins.left;
            cells.push(await SurveyHelper.createTextFlat(currPoint, this.questionMatrix, this.controller, this.row.locText, TextBrick));
            this.controller.popMargins();
        }
        for (let i: number = 0; i < this.questionMatrix.visibleColumns.length; i++) {
            let column: ItemValue = this.questionMatrix.visibleColumns[i];
            let checked: boolean = this.row.value == column.value;
            let columnNumber: number = this.questionMatrix.hasRows ? i + 1 : i;
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, colCount, columnNumber);
            currPoint.xLeft = this.controller.margins.left;
            if (this.questionMatrix.hasCellText) {
                cells.push(await this.generateTextComposite(currPoint, column, i));
            }
            else {
                let itemRect: IRect = SurveyHelper.createRect(currPoint, this.controller.unitHeight, this.controller.unitHeight);
                cells.push(this.generateFlatItem(SurveyHelper.moveRect(
                    SurveyHelper.scaleRect(itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE), currPoint.xLeft), column, i, this.key, checked));
            }
            this.controller.popMargins();
        }
        let compositeBrick = new CompositeBrick(...cells);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
    protected async generateFlatsVerticallyCells(point: IPoint): Promise<IPdfBrick[]> {
        let cells: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        if (this.questionMatrix.hasRows) {
            let rowTextFlat = await SurveyHelper.createTextFlat(currPoint, this.questionMatrix,
                this.controller, this.row.locText, TextBrick);
            currPoint.yTop = rowTextFlat.yBot + FlatQuestion.CONTENT_GAP_VERT_SCALE * this.controller.unitHeight;
            cells.push(rowTextFlat);
        }
        this.generateFlatComposite = (this.questionMatrix.hasCellText) ? this.generateTextComposite : this.generateItemCompoiste;
        cells.push(...await this.generateVerticallyItems(currPoint, this.questionMatrix.visibleColumns));
        let compositeBrick: CompositeBrick = new CompositeBrick(...cells);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
}

FlatRepository.getInstance().register('matrix', FlatMatrix);