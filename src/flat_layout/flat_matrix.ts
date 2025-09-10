import { IQuestion, QuestionMatrixModel, MatrixRowModel,
    QuestionRadiogroupModel, ItemValue, Serializer } from 'survey-core';
import { SurveyPDF } from '../survey';
import { DocController, IPoint, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick, PdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { IStyles } from '../styles';
import { RadioGroupWrap, RadioItemBrick } from '../pdf_render/pdf_radioitem';
import { CheckItemBrick } from '../pdf_render/pdf_checkitem';
import { ContainerBrick } from '../pdf_render/pdf_container';
import { EmptyBrick } from '../pdf_render/pdf_empty';

export class FlatMatrix extends FlatQuestion<QuestionMatrixModel> {
    protected question: QuestionMatrixModel;

    protected async generateFlatCell(point: IPoint, contentCallback: (point: IPoint, bricks: Array<IPdfBrick>) => Promise<void>) {
        const container: ContainerBrick = new ContainerBrick(this.controller, { ...point, width: SurveyHelper.getPageAvailableWidth(this.controller) }, {
            paddingBottom: this.styles.cellPaddingBottom,
            paddingTop: this.styles.cellPaddingTop,
            paddingLeft: this.styles.cellPaddingLeft,
            paddingRight: this.styles.cellPaddingRight,
            borderWidth: this.styles.cellBorderWidth,
            borderColor: this.styles.cellBorderColor,
        });
        await container.setup(async (point, bricks) => {
            await contentCallback(point, bricks);
        });
        return container;
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
                bricks.push(await SurveyHelper.createTextFlat(point, this.controller, this.question.visibleColumns[i].locText, { fontStyle: 'bold' }));
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
    protected async generateFlatsRows(point: IPoint, isVertical: boolean): Promise<IPdfBrick[]> {
        const cells: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let i: number = 0; i < this.question.visibleRows.length; i++) {
            const key: string = 'row' + i;
            const flatsRow: IPdfBrick[] = await new FlatMatrixRow(this.survey, this.question, this.controller, this.styles,
                this.question.visibleRows[i], i, key, i == 0, isVertical, this.rowTitleWidth, this.columnWidth, this.generateFlatCell.bind(this)).generateFlatsContent(currPoint);
            currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flatsRow));
            currPoint.yTop += this.styles.gapBetweenRows;
            cells.push(...flatsRow);
        }
        return cells;
    }
    private rowTitleWidth: number;
    private columnWidth: number;
    private calculateColumnsWidthes() {
        const availableWidth = SurveyHelper.getPageAvailableWidth(this.controller);
        const gapBetweenColumns = this.styles.gapBetweenColumns;
        if(this.question.hasRows && this.question.rowTitleWidth) {
            this.controller.pushMargins();
            this.rowTitleWidth = SurveyHelper.parseWidth(this.question.rowTitleWidth, availableWidth);
            this.controller.margins.left += (this.rowTitleWidth + gapBetweenColumns);
            this.columnWidth = SurveyHelper.getColumnWidth(this.controller, this.question.visibleColumns.length, gapBetweenColumns);
            this.controller.popMargins();
        } else {
            this.columnWidth = this.rowTitleWidth = SurveyHelper.getColumnWidth(this.controller, this.question.visibleColumns.length + (this.question.hasRows ? 1 : 0), gapBetweenColumns);
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
            currPoint.yTop += this.styles.gapBetweenRows;
            cells.push(...headers);
        }
        cells.push(...await this.generateFlatsRows(currPoint, isVertical));
        return cells;
    }
}

export class FlatMatrixRow {
    private radioGroupWrap: RadioGroupWrap;
    public constructor(protected survey: SurveyPDF,
        protected question: QuestionMatrixModel, protected controller: DocController, protected styles: IStyles, private row: MatrixRowModel, private rowIndex: number,
        private key: string, protected isFirst: boolean = false, protected isVertical: boolean = false, private rowTitleWidth: number, private columnWidth: number, private generateFlatCell: (point: IPoint, contentCallback: (point: IPoint, bricks: Array<IPdfBrick>) => Promise<void>) => Promise<ContainerBrick>) {
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return this.isVertical ?
            await this.generateFlatsVerticallyCells(point) :
            await this.generateFlatsHorizontallyCells(point);
    }

    protected generateFlatItem(rect: IRect, item: ItemValue,
        index: number, key: string, context: any = {}) {
        const fieldName = this.question.id + key;
        const isChecked: boolean = this.row.isChecked(item);
        const isReadOnly = this.question.isReadOnly;
        if(this.question.isMultiSelect) {
            return new CheckItemBrick(this.controller, rect, {
                fieldName: fieldName + 'index' + index,
                checked: isChecked,
                shouldRenderReadOnly: isReadOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
                readOnly: isReadOnly,
                updateOptions: (options) => {
                    this.survey.updateCheckItemAcroformOptions(options, this.question, item);
                }
            },
            {
                fontName: this.styles.checkmarkFont,
                fontColor: this.styles.inputFontColor,
                fontSize: this.styles.checkmarkFontSize,
                lineHeight: this.styles.checkmarkFontSize,
                checkMark: this.styles.checkmarkSymbol,
                fontStyle: 'normal',
                borderColor: this.styles.inputBorderColor,
                borderWidth: this.styles.inputBorderWidth,

            });
        } else {
            if (index === 0) {
                this.radioGroupWrap = new RadioGroupWrap(fieldName,
                    this.controller, { readOnly: this.question.isReadOnly, question: this.question, ...context });
                (<any>this.question).pdfRadioGroupWrap = this.radioGroupWrap;
            }
            else if (typeof this.radioGroupWrap === 'undefined') {
                this.radioGroupWrap = (<any>this.question).pdfRadioGroupWrap;
            }
            return new RadioItemBrick(this.controller, rect, this.radioGroupWrap,
                {
                    checked: isChecked,
                    index: index,
                    shouldRenderReadOnly: this.radioGroupWrap.readOnly && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress,
                    updateOptions: options => this.survey.updateRadioItemAcroformOptions(options, this.question, item),
                },
                {
                    fontName: this.styles.radiomarkFont,
                    fontSize: this.styles.radiomarkFontSize,
                    fontColor: this.styles.inputFontColor,
                    fontStyle: 'normal',
                    lineHeight: this.styles.radiomarkFontSize,
                    checkMark: this.styles.radiomarkSymbol,
                    borderColor: this.styles.inputBorderColor,
                    borderWidth: this.styles.inputBorderWidth,
                });
        }
    }

    protected async generateTextComposite(point: IPoint, column: ItemValue, index: number): Promise<IPdfBrick> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const itemRect = SurveyHelper.createRect(currPoint,
            SurveyHelper.getPageAvailableWidth(this.controller), this.styles.inputHeight);
        const radioFlat: IPdfBrick = this.generateFlatItem(itemRect, column, index, this.key, { row: this.row, rowIndex: this.rowIndex });
        currPoint.yTop = radioFlat.yBot + this.styles.gapBetweenItemText;
        const cellTextFlat = await SurveyHelper.createTextFlat(currPoint, this.controller,
            this.question.getCellDisplayLocText(this.row.name, column));
        return new CompositeBrick(radioFlat, cellTextFlat);
    }
    protected async generateItemComposite(point: IPoint, column: ItemValue, index: number): Promise<IPdfBrick> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const itemRect: IRect = SurveyHelper.createRect(currPoint,
            this.styles.inputWidth, this.styles.inputHeight);
        const radioFlat: IPdfBrick = this.generateFlatItem(SurveyHelper.moveRect(
            SurveyHelper.scaleRect(itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE), itemRect.xLeft), column, index, this.key, { row: this.row, rowIndex: this.rowIndex });
        currPoint.xLeft = radioFlat.xRight + this.styles.gapBetweenItemText;
        const radioText: IPdfBrick = await SurveyHelper.createTextFlat(currPoint,
            this.controller, column.locText);
        return new CompositeBrick(radioFlat, radioText);
    }
    protected async generateFlatsHorizontallyCells(point: IPoint) {
        const cells: ContainerBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        if (this.question.hasRows) {
            this.controller.pushMargins();
            currPoint.xLeft = this.controller.margins.left;
            this.controller.margins.right += (SurveyHelper.getPageAvailableWidth(this.controller) - this.rowTitleWidth);
            cells.push(
                await this.generateFlatCell(currPoint, async (point, bricks) => {
                    bricks.push(await SurveyHelper.createTextFlat(point, this.controller, this.row.locText));
                }));
            currPoint.xLeft += this.rowTitleWidth + this.styles.gapBetweenColumns;
            this.controller.popMargins();
        }
        for (let i: number = 0; i < this.question.visibleColumns.length; i++) {
            this.controller.pushMargins();
            this.controller.margins.left = point.xLeft;
            this.controller.margins.right += (SurveyHelper.getPageAvailableWidth(this.controller) - this.columnWidth);
            cells.push(await this.generateFlatCell(currPoint, async (point, bricks) => {
                if (this.question.hasCellText) {
                    bricks.push(await this.generateTextComposite(point, this.question.visibleColumns[i], i));
                }
                else {
                    const itemRect: IRect = SurveyHelper.createRect(point, this.styles.inputWidth, this.styles.inputHeight);
                    bricks.push(this.generateFlatItem(SurveyHelper.moveRect(
                        SurveyHelper.scaleRect(itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE), point.xLeft), this.question.visibleColumns[i], i, this.key, { row: this.row, rowIndex: this.rowIndex }));
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
    protected async generateFlatsVerticallyCells(point: IPoint): Promise<IPdfBrick[]> {
        const cells: IPdfBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        if (this.question.hasRows) {
            const rowTextFlat = await SurveyHelper.createTextFlat(currPoint,
                this.controller, this.row.locText);
            currPoint.yTop = rowTextFlat.yBot + this.styles.contentGapVertical;
            cells.push(rowTextFlat);
        }
        cells.push(...await this.generateVerticallyItems(currPoint, this.question.visibleColumns));
        const compositeBrick: CompositeBrick = new CompositeBrick(...cells);
        return [compositeBrick, SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(compositeBrick), this.controller)];
    }
    protected async generateVerticallyItems(point: IPoint, itemValues: ItemValue[]): Promise<IPdfBrick[]> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        for (let i: number = 0; i < itemValues.length; i++) {
            const itemFlat: IPdfBrick = await ((this.question.hasCellText) ? this.generateTextComposite : this.generateItemComposite).call(this, currPoint, itemValues[i], i);
            currPoint.yTop = itemFlat.yBot + this.styles.vertivalGapBetweenCells;
            flats.push(itemFlat);
        }
        return flats;
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