import { ItemValue, QuestionSelectBase, settings } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { ChoiceItem } from 'survey-core';
import { ISelectBaseStyle, ISelectionInputStyle, ITextStyle } from '../style/types';

export abstract class FlatSelectBase<T extends QuestionSelectBase = QuestionSelectBase, S extends ISelectBaseStyle = ISelectBaseStyle> extends FlatQuestion<T, S> {
    public abstract generateFlatItem(point: IPoint, item: ItemValue, index: number, style: ISelectionInputStyle): IPdfBrick;
    protected async generateItemComment(point: IPoint, item: ItemValue) {
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const style = SurveyHelper.getPatchedTextStyle(this.controller, SurveyHelper.mergeObjects({}, this.style.comment, shouldRenderReadOnly ? this.style.commentReadOnly : undefined));
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
            }, style);
    }
    public getItemStyle(item: ItemValue): { choiceText: ITextStyle, input: ISelectionInputStyle } {
        const isChecked: boolean = this.question.isItemSelected(item);
        const shouldRenderReadOnly = this.question.isReadOnly || !item.isEnabled && SurveyHelper.getReadonlyRenderAs(this.question, this.controller) !== 'acroform' || this.controller.compress;
        const style = { input: SurveyHelper.mergeObjects({},
            this.style.input,
            shouldRenderReadOnly ? this.style.inputReadOnly : {},
            shouldRenderReadOnly && isChecked ? this.style.inputReadOnlyChecked : {}), choiceText: { ...this.style.choiceText } };
        return this.survey.getItemStyle(this.question, item, style);
    }
    protected async generateFlatComposite(point: IPoint, item: ItemValue | ChoiceItem, index: number): Promise<IPdfBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        const style = this.getItemStyle(item);
        const itemFlat: IPdfBrick = this.generateFlatItem(point, item, index, style.input);

        compositeFlat.addBrick(itemFlat);
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.style.spacing.choiceTextGap;

        if (item.locText.renderedHtml !== null) {
            const textFlat = await SurveyHelper.createTextFlat(
                textPoint, this.controller, item.locText, { ...style.choiceText });
            SurveyHelper.alignVerticallyBricks('center', itemFlat, textFlat.unfold()[0]);
            textFlat.updateRect();
            compositeFlat.addBrick(textFlat);
        }
        if(item.hasElements && (this.question.isItemSelected(item) || this.controller.dynamicContent.choiceNestedContent)) {
            const panelPoint: IPoint = SurveyHelper.createPoint(compositeFlat, true, false);
            panelPoint.yTop += this.style.spacing.choiceGap;
            compositeFlat.addBrick(...await SurveyHelper.generatePanelFlats(this.survey, this.controller, item.panel, panelPoint));
        }
        if(item.showCommentArea && (this.question.isItemSelected(item) || this.question.isOtherItem(item) || this.controller.dynamicContent.choiceComments)) {
            const otherPoint: IPoint = SurveyHelper.createPoint(compositeFlat, true, false);
            otherPoint.yTop += this.style.spacing.choiceGap;
            compositeFlat.addBrick(await this.generateItemComment(otherPoint, item));
        }
        return compositeFlat;
    }
    protected getVisibleChoices(): Array<ItemValue> {
        let choices = [...this.question.visibleChoices];
        if(this.controller.dynamicContent.conditionalChoices) {
            const oldValue = this.question['filteredChoicesValue'];
            this.question['filteredChoicesValue'] = undefined;
            this.question['updateVisibleChoices']();
            choices = [...this.question.visibleChoices];
            this.question['filteredChoicesValue'] = oldValue;
            this.question['updateVisibleChoices']();
        }
        return choices;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const colCount = this.question.colCount;
        const visibleChoices = this.getVisibleChoices();
        let currentColCount: number = colCount;
        if (colCount == 0) {
            currentColCount = Math.floor(SurveyHelper.getPageAvailableWidth(this.controller)
                / this.style.columnMinWidth) || 1;
            if (visibleChoices.length < currentColCount) {
                currentColCount = visibleChoices.length;
            }
        }
        else if (colCount > 1) {
            currentColCount = (SurveyHelper.getColumnWidth(this.controller, colCount, this.style.spacing.choiceColumnGap) <
                this.style.columnMinWidth) ? 1 : colCount;
            if(currentColCount == colCount) {
                return await this.generateColumns(point);
            }
        }
        return (currentColCount == 1) ? await this.generateVerticallyItems(point, visibleChoices) :
            await this.generateHorisontallyItems(point, currentColCount);

    }

    protected async generateTable(point: IPoint, table: Array<Array<ItemValue>>) {
        const visibleChoices = this.getVisibleChoices();
        const colCount = (table ?? []).length;
        const flats: IPdfBrick[] = [];
        for(let [colIndex, column] of table.entries()) {
            const currPoint: IPoint = SurveyHelper.clone(point);
            for(let item of column) {
                this.controller.pushMargins();
                SurveyHelper.setColumnMargins(this.controller, colCount, colIndex, this.style.spacing.choiceColumnGap);
                currPoint.xLeft = this.controller.margins.left;
                const itemFlat: IPdfBrick = await this.generateFlatComposite(
                    currPoint, item, visibleChoices.indexOf(item));
                flats.push(itemFlat);
                this.controller.popMargins();
                currPoint.yTop = itemFlat.yBot + this.style.spacing.choiceGap;
            }
        }
        return flats;
    }

    protected generateVerticallyItems = async (point: IPoint, itemValues: ItemValue[], customGap?: number): Promise<IPdfBrick[]> => {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        for (let i: number = 0; i < itemValues.length; i++) {
            const itemFlat: IPdfBrick = await this.generateFlatComposite(currPoint, itemValues[i], i);
            currPoint.yTop = itemFlat.yBot + (customGap || this.style.spacing.choiceGap);
            flats.push(itemFlat);
        }
        return flats;
    };

    protected async generateColumns(point: IPoint): Promise<IPdfBrick[]> {
        const columns = this.question.columns;
        return await this.generateTable(point, columns);
    }
    protected async generateHorisontallyItems(point: IPoint, colCount: number): Promise<IPdfBrick[]> {
        const columns: Array<Array<ItemValue>> = [];
        const visibleChoices = this.getVisibleChoices();
        for(const [index, item] of visibleChoices.entries()) {
            const rowIndex = Math.floor(index / colCount);
            const colIndex = index % colCount;
            if(!columns[colIndex]) columns[colIndex] = [];
            columns[colIndex][rowIndex] = item;
        }
        return await this.generateTable(point, columns);
    }
}
