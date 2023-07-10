import { IQuestion, ItemValue, QuestionCheckboxBase } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export abstract class FlatSelectBase extends FlatQuestion {
    protected question: QuestionCheckboxBase;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionCheckboxBase>question;
    }
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
                textPoint, this.question, this.controller, item.locText, TextBrick));
        }
        if (item === this.question.otherItem && (item.value === this.question.value ||
            (typeof this.question.isOtherSelected !== 'undefined' && this.question.isOtherSelected))) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
            otherPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
            compositeFlat.addBrick(await SurveyHelper.createCommentFlat(
                otherPoint, this.question, this.controller, false, { index, rows: SurveyHelper.OTHER_ROWS_COUNT }));
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
        }
        return (currentColCount == 1) ? await this.generateVerticallyItems(point, visibleChoices) :
            await this.generateHorisontallyItems(point, currentColCount);

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
    protected async generateHorisontallyItems(point: IPoint, colCount: number): Promise<IPdfBrick[]> {
        const visibleChoices = this.getVisibleChoices();
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        let row: CompositeBrick = new CompositeBrick();
        for (let i: number = 0; i < visibleChoices.length; i++) {
            this.controller.pushMargins(this.controller.margins.left, this.controller.margins.right);
            SurveyHelper.setColumnMargins(this.controller, colCount, i % colCount);
            currPoint.xLeft = this.controller.margins.left;
            const itemFlat: IPdfBrick = await this.generateFlatComposite(
                currPoint, visibleChoices[i], i);
            row.addBrick(itemFlat);
            this.controller.popMargins();
            if (i % colCount === colCount - 1 || i === visibleChoices.length - 1) {
                const rowLineFlat: IPdfBrick = SurveyHelper.createRowlineFlat(
                    SurveyHelper.createPoint(row), this.controller);
                currPoint.yTop = rowLineFlat.yBot +
                    SurveyHelper.GAP_BETWEEN_ROWS * this.controller.unitHeight;
                flats.push(row, rowLineFlat);
                row = new CompositeBrick();
            }
        }
        return flats;
    }
}
