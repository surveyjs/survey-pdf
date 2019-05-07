import { IQuestion, QuestionMatrixModel, MatrixRowModel, QuestionCheckboxModel } from 'survey-core';
import { DocController, IPoint, IRect } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { FlatRepository } from './flat_repository';
import { FlatQuestion } from './flat_question';
import { SurveyHelper } from '../helper_survey';
import { TextBrick } from '../pdf_render/pdf_text';
import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { CompositeBrick } from '../pdf_render/pdf_composite';


export class FlatMatrix extends FlatQuestion {
    protected question: QuestionMatrixModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionMatrixModel>question;
    }
    protected generateFlatsHeader(point: IPoint): IPdfBrick[] {
        let headers: IPdfBrick[] = [];
        let currPoint: IPoint = Object.assign({}, point);
        this.question.visibleColumns.forEach((column: any, index: number) => {
            let columText = SurveyHelper.getLocString(column.locText);
            let oldLeftMargin = this.controller.margins.marginLeft;
            let oldRightMargin = this.controller.margins.marginRight;
            let columnNumber = (this.question.hasRows) ? index + 1 : index;
            SurveyHelper.setColumnMargins(this.question, this.controller, columnNumber);
            currPoint.xLeft = this.controller.margins.marginLeft;
            headers.push(SurveyHelper.createBoldTextFlat(currPoint,
                this.question, this.controller, columText));
            this.controller.margins.marginLeft = oldLeftMargin;
            this.controller.margins.marginRight = oldRightMargin;
        });
        return [new CompositeBrick(...headers), SurveyHelper.createRowlineFlat(currPoint, this.controller)];;
    }
    protected generateFlatsRows(point: IPoint, isVertical: boolean): IPdfBrick[] {
        let cells: IPdfBrick[] = [];
        let currPoint: IPoint = Object.assign({}, point);
        this.question.visibleRows.forEach((row: any, index: number) => {
            let key = "row" + index;
            let flatsRow = new FlatMatrixRow(this.question, this.controller, row, key, index == 0, isVertical).generateFlatsContent(currPoint);
            currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flatsRow));
            cells.push(...flatsRow);
        });
        return cells;
    }
    public generateFlatsContent(point: IPoint): IPdfBrick[] {
        if (!this.question) return null;
        let currPoint: IPoint = Object.assign({}, point);
        let cells: IPdfBrick[] = [];
        let isVertical = false;
        let cellWidth = SurveyHelper.getColumnWidth(this.question, this.controller);
        if (cellWidth < SurveyHelper.measureText(10).width) {
            isVertical = true;
        }
        if (!isVertical && this.question.showHeader) {
            let headers: IPdfBrick[] = this.generateFlatsHeader(currPoint);
            currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...headers));
            cells.push(...headers);
        }
        cells.push(...this.generateFlatsRows(currPoint, isVertical));
        return cells;

    }
}

export class FlatMatrixRow extends FlatQuestion {
    protected question: QuestionMatrixModel;
    constructor(question: IQuestion, protected controller: DocController, private row: MatrixRowModel,
        private key: string, protected isFirst: boolean = false, protected isVertical: boolean = false) {
        super(question, controller);
        this.question = <QuestionMatrixModel>question;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        if (!this.row) return null;
        let currPoint: IPoint = Object.assign({}, point);
        let cells: IPdfBrick[] = [];
        if (this.isVertical) {
            cells.push(...this.generateFlatsVerticallyCells(currPoint))
        }
        else {
            cells.push(...this.generateFlatsHorizontallyCells(currPoint));
        }
        return cells;

    }
    generateFlatsHorizontallyCells(point: IPoint): IPdfBrick[] {
        let cells: IPdfBrick[] = [];
        let currPoint: IPoint = Object.assign({}, point);
        let radioGroupWrap: RadioGroupWrap = new RadioGroupWrap(this.question.id + this.key, this.controller);
        if (this.question.hasRows) {
            let oldLeftMargin = this.controller.margins.marginLeft;
            let oldRightMargin = this.controller.margins.marginRight;
            SurveyHelper.setColumnMargins(this.question, this.controller, 0);
            currPoint.xLeft = this.controller.margins.marginLeft
            cells.push(SurveyHelper.createTextFlat(currPoint, this.question, this.controller, SurveyHelper.getLocString(this.row.locText), TextBrick));
            this.controller.margins.marginLeft = oldLeftMargin;
            this.controller.margins.marginRight = oldRightMargin;
        }
        this.question.visibleColumns.forEach((column, index) => {
            let checked = this.row.value == column.value;
            let oldLeftMargin = this.controller.margins.marginLeft;
            let oldRightMargin = this.controller.margins.marginRight;
            let columnNumber = this.question.hasRows ? index + 1 : index;
            SurveyHelper.setColumnMargins(this.question, this.controller, columnNumber);
            currPoint.xLeft = this.controller.margins.marginLeft;
            if (this.question.hasCellText) {
                cells.push(SurveyHelper.createTextFlat(currPoint, this.question, this.controller,
                    SurveyHelper.getLocString(this.question.getCellDisplayLocText(this.row.name, column)), TextBrick));
            }
            else {
                let height: number = SurveyHelper.measureText().height;
                let itemRect: IRect = SurveyHelper.createRect(currPoint, height, height);
                cells.push(new RadioItemBrick(this.question, this.controller, itemRect, column.value,
                    checked, radioGroupWrap, index == 0));
            }
            this.controller.margins.marginLeft = oldLeftMargin;
            this.controller.margins.marginRight = oldRightMargin;
        });
        return [new CompositeBrick(...cells), SurveyHelper.createRowlineFlat(currPoint, this.controller)];
    }

    generateFlatsVerticallyCells(point: IPoint): IPdfBrick[] {
        let radioGroupWrap: RadioGroupWrap = new RadioGroupWrap(this.question.id + this.key, this.controller);
        let currPoint: IPoint = Object.assign({}, point);
        let cells: IPdfBrick[] = [];
        if (this.question.hasRows) {
            let rowTextFlat = SurveyHelper.createTextFlat(currPoint, this.question,
                this.controller, SurveyHelper.getLocString(this.row.locText), TextBrick);
            currPoint.yTop = rowTextFlat.yBot;
            cells.push(rowTextFlat);
        }
        this.question.visibleColumns.forEach((column, index) => {
            let checked = this.row.value == column.value;
            if (this.question.hasCellText) {
                let cellTextFlat = SurveyHelper.createTextFlat(currPoint, this.question, this.controller,
                    SurveyHelper.getLocString(this.question.getCellDisplayLocText(this.row.name, column)), TextBrick);
                currPoint.yTop = cellTextFlat.yBot;
                cells.push(cellTextFlat);
            }
            else {
                let height: number = SurveyHelper.measureText().height;
                let itemRect: IRect = SurveyHelper.createRect(currPoint, height, height);
                let radioItem: IPdfBrick = new RadioItemBrick(this.question, this.controller, itemRect, column.value,
                    checked, radioGroupWrap, index == 0);
                currPoint = SurveyHelper.createPoint(radioItem, false, true);
                let radioText: IPdfBrick = SurveyHelper.createTextFlat(currPoint, this.question, this.controller, SurveyHelper.getLocString(column.locText), TextBrick);
                currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(radioItem, radioText));
                cells.push(radioItem, radioText);
            }
        });
        return [new CompositeBrick(...cells), SurveyHelper.createRowlineFlat(currPoint, this.controller)];
    }
}

FlatRepository.getInstance().register('matrix', FlatMatrix);
