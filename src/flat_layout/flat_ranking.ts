import { ItemValue, QuestionRankingModel } from 'survey-core';
import { IPoint, IRect } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { RankingItemBrick } from '../pdf_render/pdf_rankingitem';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { ColoredBrick } from '../pdf_render/pdf_coloredbrick';
import { CheckItemBrick } from '../pdf_render/pdf_checkitem';

export class FlatRanking extends FlatQuestion<QuestionRankingModel> {
    protected async generateFlatComposite(point: IPoint, item: ItemValue, index: number, unrankedItem: boolean = false): Promise<IPdfBrick> {
        const itemRect: IRect = SurveyHelper.createRect(point,
            this.controller.unitWidth, this.controller.unitHeight);
        const itemScaledRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE), point.xLeft);
        const itemFlat: IPdfBrick = new RankingItemBrick(this.controller,
            itemScaledRect,
            {
                mark: unrankedItem ? '-' : this.question.getNumberByIndex(index)
            },
            {
                fontStyle: 'normal',
                fontColor: this.styles.inputFontColor,
                fontName: this.controller.fontName,
                fontSize: SurveyHelper.getScaledSize(this.controller, this.styles.inputFontSizeScale),
                lineHeight: SurveyHelper.getScaledSize(this.controller, this.styles.inputFontSizeScale),
                borderColor: this.styles.inputBorderColor,
                borderWidth: SurveyHelper.getScaledSize(this.controller, this.styles.inputBorderWidthScale),
            });
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + SurveyHelper.getScaledSize(this.controller, this.styles.gapBetweenItemText);
        const textFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            textPoint, this.controller, item.locText);
        return new CompositeBrick(itemFlat, textFlat);
    }
    public async generateChoicesColumn(point: IPoint, choices: ItemValue[], unrankedChoices: boolean = false): Promise<IPdfBrick[]> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        for (let i: number = 0; i < choices.length; i++) {
            const itemFlat: IPdfBrick = await this.generateFlatComposite(currPoint, choices[i], i, unrankedChoices);
            currPoint.yTop = itemFlat.yBot + SurveyHelper.getScaledSize(this.controller, this.styles.gapBetweenRows);
            flats.push(itemFlat);
        }
        return flats;
    }
    public async generateSelectToRankItemsVertically(point: IPoint): Promise<IPdfBrick[]> {
        const currPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        if(this.question.rankingChoices.length !== 0) {
            flats.push(...await this.generateChoicesColumn(currPoint, this.question.rankingChoices));
            currPoint.yTop = flats[flats.length - 1].yBot + 2 * SurveyHelper.getScaledSize(this.controller, this.styles.gapBetweenRows);
        }
        const separatorRect = SurveyHelper.createRect({
            xLeft: currPoint.xLeft,
            yTop: currPoint.yTop - SurveyHelper.getScaledSize(this.controller, this.styles.gapBetweenRows) - 0.5,
        }, this.controller.paperWidth - this.controller.margins.right - currPoint.xLeft, 1);
        flats.push(new ColoredBrick(this.controller, separatorRect, { color: this.styles.inputFontColor, }));

        flats.push(...await this.generateChoicesColumn(currPoint, this.question.unRankingChoices, true));
        return flats;
    }
    public async generateSelectToRankItemsHorizontally(point: IPoint): Promise<IPdfBrick[]> {
        const colCount = 2;
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        const rowsCount = Math.max(this.question.unRankingChoices.length, this.question.rankingChoices.length);
        let row: CompositeBrick = new CompositeBrick();
        for (let i: number = 0; i < rowsCount; i++) {
            let colIndex = 0;
            for (let item of [this.question.unRankingChoices[i], this.question.rankingChoices[i]]) {
                if(!!item) {
                    this.controller.pushMargins(this.controller.margins.left, this.controller.margins.right);
                    SurveyHelper.setColumnMargins(this.controller, colCount, colIndex, this.styles.gapBetweenColumns);
                    currPoint.xLeft = this.controller.margins.left;
                    const itemFlat: IPdfBrick = await this.generateFlatComposite(
                        currPoint, item, i, colIndex == 0);
                    row.addBrick(itemFlat);
                    this.controller.popMargins();
                }
                colIndex++;
            }
            const rowLineFlat: IPdfBrick = SurveyHelper.createRowlineFlat(
                SurveyHelper.createPoint(row), this.controller);
            flats.push(row, rowLineFlat);
            const separatorRect = SurveyHelper.createRect({
                xLeft: this.controller.margins.left + SurveyHelper.getPageAvailableWidth(this.controller) / 2 - 0.5,
                yTop: currPoint.yTop,
            }, 0, 0);
            const gapBetweenRows = SurveyHelper.getScaledSize(this.controller, this.styles.gapBetweenRows);
            row.addBrick(new ColoredBrick(this.controller, separatorRect,
                {
                    color: this.styles.inputBorderColor,
                    renderWidth: 1,
                    renderHeight: rowLineFlat.yBot - currPoint.yTop + (i !== rowsCount - 1 ? gapBetweenRows : 0)
                }
            ));

            currPoint.yTop = rowLineFlat.yBot + gapBetweenRows;
            row = new CompositeBrick();
        }
        return flats;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        if(!this.question.selectToRankEnabled) {
            return this.generateChoicesColumn(point, this.question.rankingChoices);
        }
        else if(this.question.selectToRankAreasLayout == 'vertical') {
            return this.generateSelectToRankItemsVertically(point);
        }
        else {
            return this.generateSelectToRankItemsHorizontally(point);
        }
    }
}

FlatRepository.getInstance().register('ranking', FlatRanking);