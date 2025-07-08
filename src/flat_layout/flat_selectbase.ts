import { IQuestion, ItemValue, QuestionCheckboxBase, QuestionSelectBase, settings } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export abstract class FlatSelectBase<T extends QuestionSelectBase = QuestionSelectBase> extends FlatQuestion<T> {
    public abstract generateFlatItem(rect: IRect, item: ItemValue, index: number): IPdfBrick;
    protected async generateFlatComposite(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const itemRect: IRect = SurveyHelper.createRect(point,
            this.controller.unitWidth, this.controller.unitHeight);
        const itemFlat: IPdfBrick = this.generateFlatItem(SurveyHelper.moveRect(
            SurveyHelper.scaleRect(itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE),
            point.xLeft), item, index);
        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        if (item.locText.renderedHtml !== null) {
            compositeFlat.addBrick(await SurveyHelper.createTextFlat(
                textPoint, this.question, this.controller, item.locText));
        }
        if (item === this.question.otherItem && (item.value === this.question.value ||
            (typeof this.question.isOtherSelected !== 'undefined' && this.question.isOtherSelected))) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            otherPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
            compositeFlat.addBrick(await SurveyHelper.createCommentFlat(
                otherPoint, this.question, this.controller, {
                    fieldName: this.question.id + '_comment' + index,
                    rows: SurveyHelper.OTHER_ROWS_COUNT,
                    value: this.question.comment !== undefined && this.question.comment !== null ? this.question.comment : '',
                    shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                    isReadOnly: this.question.isReadOnly,
                    isMultiline: true,
                }));
        }
        return compositeFlat;
    }
    protected getVisibleChoices(): Array<ItemValue> {
        return this.question.visibleChoices;
    }
    protected getColCount(): number {
        return this.question.colCount;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const colCount = this.getColCount();
        const visibleChoices = this.getVisibleChoices();
        let currentColCount: number = colCount;
        if (colCount == 0) {
            currentColCount = Math.floor(SurveyHelper.getPageAvailableWidth(this.controller)
                / this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width) || 1;
            if (visibleChoices.length < currentColCount) {
                currentColCount = visibleChoices.length;
            }
        }
        else if (colCount > 1) {
            currentColCount = (SurveyHelper.getColumnWidth(this.controller, colCount) <
                this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width) ? 1 : colCount;
            if(currentColCount == colCount) {
                return await this.generateColumns(point);
            }
        }
        return (currentColCount == 1) ? await this.generateVerticallyItems(point, visibleChoices) :
            await this.generateHorisontallyItems(point, currentColCount);

    }

    protected async generateRows(point: IPoint, rows: Array<Array<ItemValue>>) {
        const visibleChoices = this.getVisibleChoices();
        const currPoint: IPoint = SurveyHelper.clone(point);
        const colCount = (rows[0] ?? []).length;
        const flats: IPdfBrick[] = [];
        for (let row of rows) {
            const rowFlat: CompositeBrick = new CompositeBrick();
            this.controller.pushMargins(this.controller.margins.left, this.controller.margins.right);
            for (let colIndex = 0; colIndex < row.length; colIndex ++) {
                const item = row[colIndex];
                this.controller.pushMargins(this.controller.margins.left, this.controller.margins.right);
                SurveyHelper.setColumnMargins(this.controller, colCount, colIndex);
                currPoint.xLeft = this.controller.margins.left;
                const itemFlat: IPdfBrick = await this.generateFlatComposite(
                    currPoint, item, visibleChoices.indexOf(item));
                rowFlat.addBrick(itemFlat);
                this.controller.popMargins();
            }
            const rowLineFlat: IPdfBrick = SurveyHelper.createRowlineFlat(
                SurveyHelper.createPoint(rowFlat), this.controller);
            currPoint.yTop = rowLineFlat.yBot +
                    SurveyHelper.GAP_BETWEEN_ROWS * this.controller.unitHeight;
            flats.push(rowFlat, rowLineFlat);
        }
        return flats;
    }

    protected async generateVerticallyItems(point: IPoint, itemValues: ItemValue[]): Promise<IPdfBrick[]> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        for (let i: number = 0; i < itemValues.length; i++) {
            const itemFlat: IPdfBrick = await this.generateFlatComposite(currPoint, itemValues[i], i);
            currPoint.yTop = itemFlat.yBot + SurveyHelper.GAP_BETWEEN_ROWS * this.controller.unitHeight;
            flats.push(itemFlat);
        }
        return flats;
    }

    protected async generateColumns(point: IPoint): Promise<IPdfBrick[]> {
        const columns = this.question.columns;
        const rowsCount = columns.reduce((max, column) => Math.max(max, column.length), 0);
        const rows: Array<Array<ItemValue>> = [];
        for (let i = 0; i < rowsCount; i++) {
            const row = [];
            for (let column of columns) {
                if(column[i]) {
                    row.push(column[i]);
                }
            }
            rows.push(row);
        }
        return await this.generateRows(point, rows);
    }
    protected async generateHorisontallyItems(point: IPoint, colCount: number): Promise<IPdfBrick[]> {
        const rows: Array<Array<ItemValue>> = [];
        const visibleChoices = this.getVisibleChoices();
        visibleChoices.forEach((item, index) => {
            const rowIndex = Math.floor(index / colCount);
            const colIndex = index % colCount;
            if(!rows[rowIndex]) rows[rowIndex] = [];
            rows[rowIndex][colIndex] = item;
        });
        return await this.generateRows(point, rows);
    }
}
