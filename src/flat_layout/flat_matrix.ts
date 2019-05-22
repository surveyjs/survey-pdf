import { IQuestion, QuestionMatrixModel, MatrixRowModel, QuestionRadiogroupModel } from 'survey-core';
import { DocController, IPoint, IRect } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { FlatRepository } from './flat_repository';
import { FlatQuestion } from './flat_question';
import { SurveyHelper } from '../helper_survey';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { FlatRadiogroup } from './flat_radiogroup';
import { TextBrick } from '../pdf_render/pdf_text';


export class FlatMatrix extends FlatQuestion {
    protected question: QuestionMatrixModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(<QuestionRadiogroupModel>question, controller);
        this.question = <QuestionMatrixModel>question;
    }
    protected async generateFlatsHeader(point: IPoint): Promise<IPdfBrick[]> {
        let headers: IPdfBrick[] = new Array<IPdfBrick>();
        let oldLeftMargin = this.controller.margins.left;
        let oldRightMargin = this.controller.margins.right;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < this.question.visibleColumns.length; i++) {
            let columnNumber = this.question.hasRows ? i + 1 : i;
            SurveyHelper.setColumnMargins(this.question, this.controller, columnNumber);
            currPoint.xLeft = this.controller.margins.left;
            headers.push(await SurveyHelper.createBoldTextFlat(currPoint,
                this.question, this.controller, this.question.visibleColumns[i].locText));
            this.controller.margins.left = oldLeftMargin;
            this.controller.margins.right = oldRightMargin;
        }
        let compositeBrick = new CompositeBrick(...headers);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
    protected async generateFlatsRows(point: IPoint, isVertical: boolean): Promise<IPdfBrick[]> {
        let cells: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < this.question.visibleRows.length; i++) {
            let key = 'row' + i;
            let flatsRow = await new FlatMatrixRow(this.question, this.controller, this.question.visibleRows[i],
                key, i == 0, isVertical).generateFlatsContent(currPoint);
            currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flatsRow));
            cells.push(...flatsRow);
        }
        return cells;
    }
    async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let cellWidth = SurveyHelper.getColumnWidth(this.question, this.controller);
        let isVertical = cellWidth < SurveyHelper.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        let currPoint: IPoint = SurveyHelper.clone(point);
        let cells: IPdfBrick[] = new Array<IPdfBrick>();
        if (!isVertical && this.question.showHeader) {
            let headers: IPdfBrick[] = await this.generateFlatsHeader(currPoint);
            currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...headers));
            cells.push(...headers);
        }
        cells.push(...await this.generateFlatsRows(currPoint, isVertical));
        return cells;
    }
}

export class FlatMatrixRow extends FlatRadiogroup {
    protected questionMatrix: QuestionMatrixModel;
    constructor(question: IQuestion, protected controller: DocController, private row: MatrixRowModel,
        private key: string, protected isFirst: boolean = false, protected isVertical: boolean = false) {
        super(question, controller);
        this.questionMatrix = <QuestionMatrixModel>question;
    }
    async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        if (!this.row) return null;
        let currPoint: IPoint = SurveyHelper.clone(point);
        let cells: IPdfBrick[] = [];
        if (this.isVertical) {
            cells.push(...await this.generateFlatsVerticallyCells(currPoint))
        }
        else {
            cells.push(...await this.generateFlatsHorizontallyCells(currPoint));
        }
        return cells;

    }
    async generateFlatsHorizontallyCells(point: IPoint) {
        let cells: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        let oldLeftMargin = this.controller.margins.left;
        let oldRightMargin = this.controller.margins.right;
        if (this.questionMatrix.hasRows) {
            SurveyHelper.setColumnMargins(this.questionMatrix, this.controller, 0);
            currPoint.xLeft = this.controller.margins.left
            cells.push(await SurveyHelper.createTextFlat(currPoint, this.questionMatrix, this.controller, this.row.locText, TextBrick));
            this.controller.margins.left = oldLeftMargin;
            this.controller.margins.right = oldRightMargin;
        }
        for (let i: number = 0; i < this.questionMatrix.visibleColumns.length; i++) {
            let column = this.questionMatrix.visibleColumns[i];
            let checked = this.row.value == column.value;
            let columnNumber = this.questionMatrix.hasRows ? i + 1 : i;
            SurveyHelper.setColumnMargins(this.questionMatrix, this.controller, columnNumber);
            currPoint.xLeft = this.controller.margins.left;
            if (this.questionMatrix.hasCellText) {
                cells.push(await SurveyHelper.createTextFlat(currPoint, this.questionMatrix, this.controller,
                    this.questionMatrix.getCellDisplayLocText(this.row.name, column), TextBrick));
            }
            else {
                let height: number = SurveyHelper.measureText().height;
                let itemRect: IRect = SurveyHelper.createRect(currPoint, height, height);
                cells.push(this.createItemBrick(itemRect, column, i, this.key, checked));
            }
            this.controller.margins.left = oldLeftMargin;
            this.controller.margins.right = oldRightMargin;
        }
        let compositeBrick = new CompositeBrick(...cells);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }

    async generateFlatsVerticallyCells(point: IPoint): Promise<IPdfBrick[]> {
        let currPoint: IPoint = SurveyHelper.clone(point);
        let cells: IPdfBrick[] = [];
        if (this.questionMatrix.hasRows) {
            let rowTextFlat = await SurveyHelper.createTextFlat(currPoint, this.questionMatrix,
                this.controller, this.row.locText, TextBrick);
            currPoint.yTop = rowTextFlat.yBot;
            cells.push(rowTextFlat);
        }
        for (let i: number = 0; i < this.questionMatrix.visibleColumns.length; i++) {
            let column = this.questionMatrix.visibleColumns[i];
            let checked = this.row.value == column.value;
            if (this.questionMatrix.hasCellText) {
                let cellTextFlat = await SurveyHelper.createTextFlat(currPoint, this.questionMatrix, this.controller,
                    this.questionMatrix.getCellDisplayLocText(this.row.name, column), TextBrick);
                currPoint.yTop = cellTextFlat.yBot;
                cells.push(cellTextFlat);
            }
            else {
                let oldfMarginLeft = this.controller.margins.left;
                let height: number = SurveyHelper.measureText().height;
                let itemRect: IRect = SurveyHelper.createRect(currPoint, height, height);
                let radioItem: IPdfBrick = this.createItemBrick(itemRect, column, i, this.key, checked);
                currPoint = SurveyHelper.createPoint(radioItem, false, true);
                this.controller.margins.left = this.controller.margins.left + height;
                let radioText: IPdfBrick = await SurveyHelper.createTextFlat(currPoint, this.questionMatrix,
                    this.controller, column.locText, TextBrick);
                let compositeBrick: CompositeBrick = new CompositeBrick(radioItem, radioText);
                currPoint = SurveyHelper.createPoint(compositeBrick);
                cells.push(compositeBrick);
                this.controller.margins.left = oldfMarginLeft;
            }
        }
        let compositeBrick = new CompositeBrick(...cells);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
}

FlatRepository.getInstance().register('matrix', FlatMatrix);
