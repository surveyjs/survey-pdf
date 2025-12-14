import { ItemValue, QuestionSelectBase, settings } from 'survey-core';
import { IPoint, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper, ITextAppearanceOptions, IInputAppearanceOptions } from '../helper_survey';
import { ChoiceItem } from 'survey-core';
import { IStyles } from 'src/styles';

export abstract class FlatSelectBase<T extends QuestionSelectBase = QuestionSelectBase> extends FlatQuestion<T> {
    public abstract generateFlatItem(point: IPoint, item: ItemValue, index: number, styles: IStyles): IPdfBrick;
    protected async generateItemComment(point: IPoint, item: ItemValue) {
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller, SurveyHelper.mergeObjects({}, this.styles.comment, shouldRenderReadOnly ? this.styles.commentReadOnly : undefined));
        const commentModel = this.question.getCommentTextAreaModel(item);
        return await SurveyHelper.createCommentFlat(
            point, this.controller, {
                shouldRenderReadOnly,
                fieldName: commentModel.id,
                rows: this.controller.otherRowsCount,
                value: commentModel.getTextValue(),
                shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                isReadOnly: this.question.isReadOnly,
                isMultiline: true,
            }, appearance);
    }
    public getStylesForItem(item: ItemValue): IStyles {
        const isChecked: boolean = this.question.isItemSelected(item);
        const shouldRenderReadOnly = this.question.isReadOnly || !item.isEnabled && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress;
        const styles = { input: SurveyHelper.mergeObjects({},
            this.styles.input,
            shouldRenderReadOnly ? this.styles.inputReadOnly : {},
            shouldRenderReadOnly && isChecked ? this.styles.inputReadOnlyChecked : {}), label: { ...this.styles.label } };
        return this.survey.getStylesForItem(this.question, item, styles);
    }
    protected async generateFlatComposite(point: IPoint, item: ItemValue | ChoiceItem, index: number): Promise<IPdfBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const styles = this.getStylesForItem(item);
        const itemFlat: IPdfBrick = this.generateFlatItem(point, item, index, styles.input);

        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.styles.gapBetweenItemText;

        if (item.locText.renderedHtml !== null) {
            const textFlat = await SurveyHelper.createTextFlat(
                textPoint, this.controller, item.locText, { ...styles.label });
            SurveyHelper.alignVerticallyBricks('center', itemFlat, textFlat.unfold()[0]);
            textFlat.updateRect();
            compositeFlat.addBrick(textFlat);
        }
        if(item.isCommentShowing) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat, true, false);
            otherPoint.yTop += this.styles.gapBetweenRows;
            compositeFlat.addBrick(await this.generateItemComment(otherPoint, item));
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
                / this.styles.columnMinWidth) || 1;
            if (visibleChoices.length < currentColCount) {
                currentColCount = visibleChoices.length;
            }
        }
        else if (colCount > 1) {
            currentColCount = (SurveyHelper.getColumnWidth(this.controller, colCount, this.styles.gapBetweenColumns) <
                this.styles.columnMinWidth) ? 1 : colCount;
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
            for (let colIndex = 0; colIndex < row.length; colIndex ++) {
                const item = row[colIndex];
                this.controller.pushMargins();
                SurveyHelper.setColumnMargins(this.controller, colCount, colIndex, this.styles.gapBetweenColumns);
                currPoint.xLeft = this.controller.margins.left;
                const itemFlat: IPdfBrick = await this.generateFlatComposite(
                    currPoint, item, visibleChoices.indexOf(item));
                rowFlat.addBrick(itemFlat);
                this.controller.popMargins();
            }
            const rowLineFlat: IPdfBrick = SurveyHelper.createRowlineFlat(
                SurveyHelper.createPoint(rowFlat), this.controller);
            currPoint.yTop = rowLineFlat.yBot + this.styles.gapBetweenRows;
            flats.push(rowFlat, rowLineFlat);
        }
        return flats;
    }

    protected generateVerticallyItems = async (point: IPoint, itemValues: ItemValue[], customGap?: number): Promise<IPdfBrick[]> => {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        for (let i: number = 0; i < itemValues.length; i++) {
            const itemFlat: IPdfBrick = await this.generateFlatComposite(currPoint, itemValues[i], i);
            currPoint.yTop = itemFlat.yBot + (customGap || this.styles.gapBetweenRows);
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
