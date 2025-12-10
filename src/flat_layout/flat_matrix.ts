import { QuestionMatrixModel, MatrixRowModel,
    ItemValue, Serializer } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController, IPoint, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { IStyles } from '../styles';
import { IRadioItemBrickAppearanceOptions, RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { CheckItemBrick, ICheckItemBrickAppearanceOptions } from '../pdf_render/pdf_checkitem';
import { ContainerBrick } from '../pdf_render/pdf_container';
import { EmptyBrick } from '../pdf_render/pdf_empty';

export class FlatMatrix extends FlatQuestion<QuestionMatrixModel> {
    protected question: QuestionMatrixModel;
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const pageWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        const rowTitleWidth = this.question.hasRows ? (this.question.rowTitleWidth ? SurveyHelper.parseWidth(this.question.rowTitleWidth, pageWidth): this.styles.columnMinWidth) : 0;
        const availableWidth = pageWidth - rowTitleWidth;
        const isVertical = this.question.renderAs === 'list' || this.controller.matrixRenderAs === 'list' ||
        this.styles.columnMinWidth * this.question.visibleColumns.length + this.styles.gapBetweenColumns * (this.question.visibleColumns.length - 1) > availableWidth;
        return new (isVertical ? FlatMatrixContentVertical : FlatMatrixContentHorizontal)(this.controller, this.survey, this.question, this.styles).generateFlats(point);
    }
}

export abstract class FlatMatrixContent {
    constructor(protected controller: DocController, protected survey: SurveyPDF, protected question: QuestionMatrixModel, protected styles: IStyles) {
    }
    protected async generateFlatCell(point: IPoint, contentCallback: (point: IPoint, bricks: Array<IPdfBrick>) => Promise<void>) {
        const container: ContainerBrick = new ContainerBrick(this.controller, { ...point, width: SurveyHelper.getPageAvailableWidth(this.controller) }, this.styles.cell);
        await container.setup(async (point, bricks) => {
            await contentCallback(point, bricks);
        });
        return container;
    }
    protected async generateTextComposite(point: IPoint, options: { item: ItemValue, row: MatrixRowModel, rowIndex: number, itemIndex: number }): Promise<IPdfBrick> {
        const { item, row } = options;
        const currPoint: IPoint = SurveyHelper.clone(point);
        const radioFlat: IPdfBrick = this.generateFlatItem(currPoint, options);
        currPoint.yTop = radioFlat.yBot + this.styles.gapBetweenItemText;
        const cellTextFlat = await SurveyHelper.createTextFlat(currPoint, this.controller,
            this.question.getCellDisplayLocText(row.name, item));
        return new CompositeBrick(radioFlat, cellTextFlat);
    }
    private radioGroupWraps: {[index: string]: RadioGroupWrap } = {}
    private getRadioGroupWrap(fieldName: string, row: MatrixRowModel, rowIndex: number): RadioGroupWrap {
        if(!this.radioGroupWraps[fieldName]) {
            this.radioGroupWraps[fieldName] = new RadioGroupWrap(
                this.controller, {
                    readOnly: this.question.isReadOnly,
                    fieldName: fieldName,
                    updateOptions: (options) => { this.survey.getUpdatedRadioGroupWrapOptions(options, this.question, { row, rowIndex }); }
                });
        }
        return this.radioGroupWraps[fieldName];
    }
    public getInputAppearance(isReadOnly: boolean, isChecked: boolean, isMultiSelect: boolean):(ICheckItemBrickAppearanceOptions | IRadioItemBrickAppearanceOptions) & { width: number, height: number } {
        const inputType = isMultiSelect ? 'checkbox' : 'radio';
        const styles = SurveyHelper.mergeObjects({}, this.styles.input, this.styles[`${inputType}Input`]);
        if(isReadOnly) {
            SurveyHelper.mergeObjects(styles, this.styles.inputReadOnly, this.styles[`${inputType}InputReadOnly`]);
            if(isChecked) {
                SurveyHelper.mergeObjects(styles, this.styles.inputReadOnlyChecked, this.styles[`${inputType}InputReadOnlyChecked`]);
            }
        }
        return styles;
    }
    protected generateFlatItem(point: IPoint, options: { item: ItemValue, row: MatrixRowModel, rowIndex: number, itemIndex: number }) {
        const { item, row, itemIndex, rowIndex } = options;
        const fieldName = this.question.id + 'row' + rowIndex;
        const isChecked: boolean = row.isChecked(item);
        const isReadOnly = this.question.isReadOnly;
        const shouldRenderReadOnly = isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress;
        const appearance = SurveyHelper.getPatchedTextAppearanceOptions(this.controller, this.getInputAppearance(shouldRenderReadOnly, isChecked, this.question.isMultiSelect));
        const rect = SurveyHelper.createRect(point, appearance.width, appearance.height);
        if(this.question.isMultiSelect) {
            return new CheckItemBrick(this.controller, rect, {
                fieldName: fieldName + 'index' + itemIndex,
                checked: isChecked,
                shouldRenderReadOnly,
                readOnly: isReadOnly,
                updateOptions: (options) => {
                    this.survey.updateCheckItemAcroformOptions(options, this.question, { item, row, rowIndex });
                }
            }, appearance);
        } else {
            const radioGroupWrap = this.getRadioGroupWrap(fieldName, row, rowIndex);
            return new RadioItemBrick(this.controller, rect, radioGroupWrap,
                {
                    checked: isChecked,
                    index: itemIndex,
                    shouldRenderReadOnly: shouldRenderReadOnly,
                    updateOptions: options => this.survey.updateRadioItemAcroformOptions(options, this.question, { item, row, rowIndex }),
                }, appearance);
        }
    }
    protected getGapBetweenRows(): number {
        return this.styles.gapBetweenRows;
    }
    public async generateFlats(point: IPoint) {
        const cells: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < this.question.visibleRows.length; i++) {
            const flatsRow = await this.generateFlatsRow(currPoint, this.question.visibleRows[i], i);
            currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flatsRow));
            currPoint.yTop += this.getGapBetweenRows();
            cells.push(...flatsRow);
        }
        return cells;
    }
    protected abstract generateFlatsRow(point: IPoint, row: MatrixRowModel, rowIndex: number): Promise<Array<IPdfBrick>>;
}
export class FlatMatrixContentVertical extends FlatMatrixContent {
    protected async generateItemComposite(point: IPoint, options: { item: ItemValue, row: MatrixRowModel, rowIndex: number, itemIndex: number }): Promise<IPdfBrick> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const radioFlat: IPdfBrick = this.generateFlatItem(point, options);
        currPoint.xLeft = radioFlat.xRight + this.styles.verticalGapBetweenItemText;
        const radioText: IPdfBrick = await SurveyHelper.createTextFlat(currPoint,
            this.controller, options.item.locText, SurveyHelper.mergeObjects({}, this.styles.columnTitle, this.styles.verticalColumnTitle));
        SurveyHelper.alignVerticallyBricks('center', radioFlat, radioText.unfold()[0]);
        radioText.updateRect();
        return new CompositeBrick(radioFlat, radioText);
    }
    protected getGapBetweenRows(): number {
        return this.styles.verticalGapBetweenRows;
    }
    protected async generateFlatsRow(point: IPoint, row: MatrixRowModel, rowIndex: number): Promise<Array<IPdfBrick>> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const cell = await this.generateFlatCell(currPoint, async (point, bricks) => {
            const currPoint = SurveyHelper.clone(point);
            const rowTextFlat = await SurveyHelper.createTextFlat(point,
                this.controller, row.locText, SurveyHelper.mergeObjects({}, this.styles.rowTitle, this.styles.verticalRowTitle));
            bricks.push(rowTextFlat);
            currPoint.yTop = rowTextFlat.yBot + this.styles.verticalGapBetweenRowTitleQuestion;
            for (let i: number = 0; i < this.question.visibleColumns.length; i++) {
                const itemFlat: IPdfBrick = await ((this.question.hasCellText) ? this.generateTextComposite : this.generateItemComposite).call(this, currPoint, { item: this.question.visibleColumns[i], itemIndex: i, row, rowIndex });
                bricks.push(itemFlat);
                currPoint.yTop = itemFlat.yBot + this.styles.verticalGapBetweenItems;
            }
        });
        return [cell, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(cell), this.controller)];
    }
}
export class FlatMatrixContentHorizontal extends FlatMatrixContent {
    private columnWidth: number;
    private rowTitleWidth: number;
    private setup() {
        const availableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        if(this.question.rowTitleWidth) {
            this.rowTitleWidth = SurveyHelper.parseWidth(this.question.rowTitleWidth, availableWidth);
        } else {
            this.rowTitleWidth = SurveyHelper.getColumnWidth(this.controller, this.question.visibleColumns.length + (this.question.hasRows ? 1 : 0), this.styles.gapBetweenColumns);
        }
        this.controller.pushMargins();
        this.controller.margins.left += (this.rowTitleWidth + this.styles.gapBetweenColumns);
        this.columnWidth = SurveyHelper.getColumnWidth(this.controller, this.question.visibleColumns.length, this.styles.gapBetweenColumns);
        this.controller.popMargins();
    }
    protected async generateFlatsRow(point: IPoint, row: MatrixRowModel, rowIndex: number): Promise<Array<IPdfBrick>> {
        const cells: ContainerBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        if (this.question.hasRows) {
            this.controller.pushMargins();
            currPoint.xLeft = this.controller.margins.left;
            this.controller.margins.right += (SurveyHelper.getPageAvailableWidth(this.controller) - this.rowTitleWidth);
            cells.push(await this.generateFlatCell(currPoint, async (point, bricks) => {
                bricks.push(await SurveyHelper.createTextFlat(point, this.controller, row.locText, this.styles.rowTitle));
            }
            ));
            currPoint.xLeft += this.rowTitleWidth + this.styles.gapBetweenColumns;
            this.controller.popMargins();
        }
        for (let i: number = 0; i < this.question.visibleColumns.length; i++) {
            this.controller.pushMargins();
            this.controller.margins.left = point.xLeft;
            const options = { item: this.question.visibleColumns[i], itemIndex: i, rowIndex, row };
            this.controller.margins.right += (SurveyHelper.getPageAvailableWidth(this.controller) - this.columnWidth);
            cells.push(await this.generateFlatCell(currPoint, async (point, bricks) => {
                if (this.question.hasCellText) {
                    bricks.push(await this.generateTextComposite(point, options));
                }
                else {
                    bricks.push(this.generateFlatItem(point, options));
                }
            }));
            currPoint.xLeft += this.columnWidth + this.styles.gapBetweenColumns;
            this.controller.popMargins();
        }
        const rowRect = SurveyHelper.mergeRects(...cells);
        cells.forEach(cell => {
            cell.fitToHeight(rowRect.yBot - rowRect.yTop, true);
        });
        const compositeBrick = new CompositeBrick(...cells);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
    protected async generateFlatsHeader(point: IPoint): Promise<IPdfBrick[]> {
        const headers: ContainerBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        if(this.question.hasRows) {
            this.controller.margins.left = currPoint.xLeft;
            this.controller.margins.right += (SurveyHelper.getPageAvailableWidth(this.controller) - this.rowTitleWidth);
            headers.push(await this.generateFlatCell(currPoint, async (point, bricks) => {
                bricks.push(new EmptyBrick(this.controller, SurveyHelper.createRect(point, SurveyHelper.getPageAvailableWidth(this.controller), 1)));
            }));
            currPoint.xLeft += this.rowTitleWidth + this.styles.gapBetweenColumns;
        }
        for (let i: number = 0; i < this.question.visibleColumns.length; i++) {
            this.controller.pushMargins();
            this.controller.margins.left = currPoint.xLeft;
            this.controller.margins.right += (SurveyHelper.getPageAvailableWidth(this.controller) - this.columnWidth);
            headers.push(await this.generateFlatCell(currPoint, async (point, bricks) => {
                bricks.push(await SurveyHelper.createTextFlat(point, this.controller, this.question.visibleColumns[i].locText, { ...this.styles.columnTitle }));
            }));
            currPoint.xLeft += this.columnWidth + this.styles.gapBetweenColumns;
            this.controller.popMargins();
        }
        const rowRect = SurveyHelper.mergeRects(...headers);
        headers.forEach(header => {
            header.fitToHeight(rowRect.yBot - rowRect.yTop, true);
        });
        const compositeBrick: CompositeBrick = new CompositeBrick(...headers);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
    public override async generateFlats(point: IPoint) {
        this.setup();
        const currPoint = SurveyHelper.clone(point);
        const headerFlats = await this.generateFlatsHeader(point);
        currPoint.yTop = SurveyHelper.mergeRects(...headerFlats).yBot + this.styles.gapBetweenRows;
        const rowsFlats = await super.generateFlats(currPoint);
        return [...headerFlats, ...rowsFlats];
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