import { IQuestion, QuestionMatrixDropdownModelBase, MatrixDropdownColumn,
    MatrixDropdownRowModel, MatrixDropdownCell, LocalizableString } from 'survey-core';
import { IPoint, IRect, DocController } from "../doc_controller";
import { IFlatQuestion, FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatMatrixMultiple extends FlatQuestion {
    protected question: QuestionMatrixDropdownModelBase;
    public constructor(question: IQuestion, controller: DocController) {
        super(question, controller);
        this.question = <QuestionMatrixDropdownModelBase>question;
    }
    private async generateFlatsHeader(point: IPoint, isHorizontal: boolean): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        let count: number = isHorizontal
            ? this.question.visibleColumns.length
            : this.question.visibleRows.length;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i = 0; i < count; i++) {
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, count + 1, i + 1);
            currPoint.xLeft = this.controller.margins.left;
            let locText: LocalizableString = isHorizontal
                ? this.question.visibleColumns[i].locTitle
                : (<MatrixDropdownRowModel>this.question.visibleRows[i]).locText;
            composite.addBrick(await SurveyHelper.createBoldTextFlat(
                currPoint, this.question, this.controller, locText));
            this.controller.popMargins();
        }
        currPoint.xLeft = point.xLeft;
        currPoint.yTop = count !== 0 ? composite.yBot : point.yTop;
        composite.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
        return composite;
    }
    private async generateFlatsRows(point: IPoint, isHorizontal: boolean): Promise<CompositeBrick[]> {
        let rowsFlats: CompositeBrick[] = [];
        let countInner: number = isHorizontal
            ? this.question.visibleColumns.length
            : this.question.visibleRows.length;
        let countOuter: number = isHorizontal
            ? this.question.visibleRows.length
            : this.question.visibleColumns.length;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i = 0; i < countOuter; i++) {
            rowsFlats.push(new CompositeBrick());
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller, countInner + 1, 0);
            currPoint.xLeft = this.controller.margins.left
            if (isHorizontal) {
                let row: any = this.question.visibleRows[i];
                if (true) {// has row names
                    rowsFlats[rowsFlats.length - 1].addBrick(await SurveyHelper.createTextFlat(
                        currPoint, this.question, this.controller, row.locText, TextBrick));
                }
            }
            else {
                let column: MatrixDropdownColumn = this.question.visibleColumns[i];
                rowsFlats[rowsFlats.length - 1].addBrick(await SurveyHelper.createBoldTextFlat(
                    currPoint, this.question, this.controller, column.locTitle));
            }
            this.controller.popMargins();
            for (let j = 0; j < countInner; j++) {
                let cellI: number = isHorizontal ? i : j;
                let cellJ: number = isHorizontal ? j : i;
                let cell: MatrixDropdownCell = this.question.visibleRows[cellI].cells[cellJ];
                this.controller.pushMargins();
                SurveyHelper.setColumnMargins(this.controller, countInner + 1, j + 1);
                currPoint.xLeft = this.controller.margins.left;
                cell.question.titleLocation = 'hidden';
                let flatQuestion: IFlatQuestion = FlatRepository.getInstance().
                    create(cell.question, this.controller);
                rowsFlats[rowsFlats.length - 1].addBrick(
                    ...await flatQuestion.generateFlats(currPoint));
                this.controller.popMargins();
            }
            currPoint.xLeft = point.xLeft;
            currPoint.yTop = rowsFlats[rowsFlats.length - 1].yBot;
            if (i !== countOuter - 1) {
                rowsFlats[rowsFlats.length - 1].addBrick(
                    SurveyHelper.createRowlineFlat(currPoint, this.controller));
                currPoint.yTop += SurveyHelper.EPSILON;
            }
        }
        return rowsFlats;
    }
    private async generateFlatsRowsVertical(point: IPoint): Promise<CompositeBrick[]> {
        return null;
    }
    private async generateFlatsColumnsAsRowsVertical(point: IPoint): Promise<CompositeBrick[]> {
        return null;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let cellWidth: number = SurveyHelper.getColumnWidth(
            this.controller, this.question.visibleColumns.length + 1);
        let isHorizontal: boolean = cellWidth >=
            this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        let currPoint: IPoint = SurveyHelper.clone(point);
        let rowsFlats: CompositeBrick[] = [];
        if (isHorizontal) {
            let headers: CompositeBrick = await this.generateFlatsHeader(
                point, this.question.isColumnLayoutHorizontal);
            currPoint = SurveyHelper.createPoint(headers);
            currPoint.xLeft = point.xLeft;
            rowsFlats.push(headers);
        }
        if (isHorizontal) {
            rowsFlats.push(...await this.generateFlatsRows(currPoint,
                this.question.isColumnLayoutHorizontal));
        }
        else {
            rowsFlats.push(...this.question.isColumnLayoutHorizontal
                ? await this.generateFlatsRowsVertical(currPoint)
                : await this.generateFlatsColumnsAsRowsVertical(currPoint));
        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('matrixdropdown', FlatMatrixMultiple);