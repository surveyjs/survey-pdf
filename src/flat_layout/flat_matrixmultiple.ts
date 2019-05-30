import { IQuestion, QuestionMatrixDropdownModelBase, MatrixDropdownColumn,
    MatrixDropdownRowModel, MatrixDropdownCell, LocalizableString } from 'survey-core';
import { IPoint, DocController } from "../doc_controller";
import { IFlatQuestion, FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatMatrixMultiple extends FlatQuestion {
    protected question: QuestionMatrixDropdownModelBase;
    public constructor(question: IQuestion, controller: DocController,
        protected isMultiple: boolean = true) {
        super(question, controller);
        this.question = <QuestionMatrixDropdownModelBase>question;
    }
    private async generateFlatsHeader(point: IPoint, isHorizontal: boolean): Promise<CompositeBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        if (!isHorizontal && !this.isMultiple) return composite;
        let count: number = isHorizontal
            ? this.question.visibleColumns.length
            : this.question.visibleRows.length;
        let rowNamesGain: number = this.isMultiple ? 1 : 0;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < count; i++) {
            this.controller.pushMargins();
            SurveyHelper.setColumnMargins(this.controller,
                count + rowNamesGain, i + rowNamesGain);
            currPoint.xLeft = this.controller.margins.left;
            let locText: LocalizableString = isHorizontal
                ? this.question.visibleColumns[i].locTitle
                : (<MatrixDropdownRowModel>this.question.visibleRows[i]).locText;
            composite.addBrick(await SurveyHelper.createBoldTextFlat(
                currPoint, this.question, this.controller, locText));
            this.controller.popMargins();
        }
        return composite;
    }
    private async generateFlatsRows(point: IPoint, isHorizontal: boolean,
        isWide: boolean): Promise<CompositeBrick[]> {
        let rowsFlats: CompositeBrick[] = [];
        let countInner: number = isHorizontal
            ? this.question.visibleColumns.length
            : this.question.visibleRows.length;
        let countOuter: number = isHorizontal
            ? this.question.visibleRows.length
            : this.question.visibleColumns.length;
        let rowNamesGain: number = this.isMultiple ? 1 : 0;
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < countOuter; i++) {
            let composite: CompositeBrick = new CompositeBrick();
            if (isWide) {
                this.controller.pushMargins();
                SurveyHelper.setColumnMargins(this.controller, countInner + rowNamesGain, 0);
                currPoint.xLeft = this.controller.margins.left
            }
            if (isHorizontal) {
                let row: MatrixDropdownRowModel = <MatrixDropdownRowModel>this.question.visibleRows[i];
                if (this.isMultiple) {
                    composite.addBrick(await SurveyHelper.createTextFlat(
                        currPoint, this.question, this.controller, row.locText, TextBrick));
                }
            }
            else {
                let column: MatrixDropdownColumn = this.question.visibleColumns[i];
                composite.addBrick(await SurveyHelper.createBoldTextFlat(
                    currPoint, this.question, this.controller, column.locTitle));
            }
            if (isWide) {
                this.controller.popMargins();
            }
            for (let j: number = 0; j < countInner; j++) {
                let cellI: number = isHorizontal ? i : j;
                let cellJ: number = isHorizontal ? j : i;
                let cell: MatrixDropdownCell = this.question.visibleRows[cellI].cells[cellJ];
                if (isWide) {
                    this.controller.pushMargins();
                    SurveyHelper.setColumnMargins(this.controller,
                        countInner + rowNamesGain, j + rowNamesGain);
                    currPoint.xLeft = this.controller.margins.left;
                }
                else {
                    currPoint.yTop = composite.yBot;
                    let locText: LocalizableString = isHorizontal
                        ? this.question.visibleColumns[cellJ].locTitle
                        : (<MatrixDropdownRowModel>this.question.visibleRows[cellI]).locText;
                    composite.addBrick(await SurveyHelper.createTextFlat(
                        currPoint, this.question, this.controller, locText, TextBrick));
                    currPoint.yTop = composite.yBot;
                }
                cell.question.titleLocation = 'hidden';
                let flatQuestion: IFlatQuestion = FlatRepository.getInstance().
                    create(cell.question, this.controller);
                composite.addBrick(...await flatQuestion.generateFlats(currPoint));
                if (isWide) {
                    this.controller.popMargins();
                }
            }
            currPoint.xLeft = point.xLeft;
            currPoint.yTop = composite.yBot;
            if (i !== countOuter - 1) {
                composite.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
                currPoint.yTop += SurveyHelper.EPSILON;
            }
            if (!composite.isEmpty) {
                rowsFlats.push(composite);
            }
        }
        return rowsFlats;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let cellWidth: number = SurveyHelper.getColumnWidth(
            this.controller, this.question.visibleColumns.length + 1);
        let isWide: boolean = cellWidth >=
            this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width;
        let currPoint: IPoint = SurveyHelper.clone(point);
        let rowsFlats: CompositeBrick[] = [];
        if (isWide) {
            let headers: CompositeBrick = await this.generateFlatsHeader(
                point, this.question.isColumnLayoutHorizontal);
            currPoint.xLeft = point.xLeft;
            currPoint.yTop = headers.xLeft !== 0 ? headers.yBot : point.yTop;
            headers.addBrick(SurveyHelper.createRowlineFlat(currPoint, this.controller));
            currPoint.yTop += SurveyHelper.EPSILON;
            rowsFlats.push(headers);
        }
        rowsFlats.push(...await this.generateFlatsRows(currPoint,
            this.question.isColumnLayoutHorizontal, isWide));
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('matrixdropdown', FlatMatrixMultiple);