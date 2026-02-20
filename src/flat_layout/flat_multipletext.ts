import { QuestionMultipleTextModel, MultipleTextItemModel } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion, IFlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { ContainerBrick } from '../pdf_render/pdf_container';
import { SurveyHelper } from '../helper_survey';
import { FlatTextbox } from './flat_textbox';
import { IQuestionMultipleTextStyle } from '../style/types';

export class FlatMultipleText extends FlatQuestion<QuestionMultipleTextModel, IQuestionMultipleTextStyle> {
    private getVisibleRows() {
        return this.question.getRows().filter(row => row.isVisible);
    }
    private async generateFlatCell(point: IPoint, callback: (point: IPoint, bricks: Array<IPdfBrick>) => Promise<void>): Promise<ContainerBrick> {
        const container = new ContainerBrick(this.controller, { ...point, width: SurveyHelper.getPageAvailableWidth(this.controller) }, this.style.itemCell);
        await container.setup(callback);
        return container;
    }
    private async generateFlatItemCells(point: IPoint, item: MultipleTextItemModel): Promise<Array<ContainerBrick>> {
        const colWidth: number = SurveyHelper.getPageAvailableWidth(this.controller);
        const bricks: Array<ContainerBrick> = [];
        this.controller.pushMargins();
        this.controller.margins.right = this.controller.paperWidth - this.controller.margins.left - colWidth * this.style.itemTitleWidthPercentage;
        bricks.push(await this.generateFlatCell(point, async (point: IPoint, bricks: Array<IPdfBrick>) => {
            bricks.push(await SurveyHelper.
                createTextFlat(point, this.controller, item.locTitle, { ... this.style.itemTitle }));
        }));
        this.controller.popMargins();

        this.controller.pushMargins();
        this.controller.margins.left = point.xLeft + colWidth * this.style.itemTitleWidthPercentage + this.style.spacing.itemTitleGap;
        bricks.push(await this.generateFlatCell({ xLeft: this.controller.margins.left, yTop: point.yTop }, async (point: IPoint, bricks: Array<IPdfBrick>) => {
            const flatMultipleTextItemQuestion: IFlatQuestion = FlatRepository.getInstance().create(
                this.survey, item.editor, this.controller, this.survey.getElementStyle(item.editor), 'text');
            bricks.push(...await (<FlatTextbox>flatMultipleTextItemQuestion).generateFlatsContent(point));
        }));
        this.controller.popMargins();
        return bricks;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const rowsFlats: IPdfBrick[] = [];
        const currPoint: IPoint = SurveyHelper.clone(point);
        const rows = this.getVisibleRows();
        for (let i: number = 0; i < rows.length; i++) {
            this.controller.pushMargins();
            const currentRowFlats: Array<ContainerBrick> = [];
            for (let j: number = 0; j < rows[i].cells.length; j++) {
                this.controller.pushMargins();
                SurveyHelper.setColumnMargins(this.controller, this.question.colCount, j, this.style.spacing.itemColumnGap);
                currPoint.xLeft = this.controller.margins.left;
                currentRowFlats.push(...await this.generateFlatItemCells(currPoint, rows[i].cells[j].item));
                this.controller.popMargins();
            }
            this.controller.popMargins();
            currPoint.xLeft = point.xLeft;
            const rowRect = SurveyHelper.mergeRects(...currentRowFlats);
            currentRowFlats.forEach((flat) => { flat.fitToHeight(rowRect.yBot - rowRect.yTop); });
            currPoint.yTop = rowRect.yBot;
            rowsFlats.push(...currentRowFlats, SurveyHelper.createRowlineFlat(currPoint, this.controller));
            currPoint.yTop += this.style.spacing.itemGap;
        }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('multipletext', FlatMultipleText);