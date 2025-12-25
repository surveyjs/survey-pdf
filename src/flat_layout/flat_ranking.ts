import { ItemValue, QuestionRankingModel } from 'survey-core';
import { IPoint } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { RankingItemBrick } from '../pdf_render/pdf_rankingitem';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { ColoredBrick } from '../pdf_render/pdf_coloredbrick';
import { IQuestionRankingStyle } from '../styles/types';

export class FlatRanking extends FlatQuestion<QuestionRankingModel, IQuestionRankingStyle> {
    protected async generateFlatComposite(point: IPoint, item: ItemValue, index: number, unrankedItem: boolean = false): Promise<IPdfBrick> {
        const itemFlat: IPdfBrick = new RankingItemBrick(this.controller,
            SurveyHelper.createRect(point, this.styles.input.width, this.styles.input.height),
            {
                mark: this.question.getNumberByIndex(index) || ''
            },
            SurveyHelper.getPatchedTextAppearanceOptions(this.controller, this.styles.input));
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.styles.spacing.choiceTextGap;
        const textFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            textPoint, this.controller, item.locText, this.styles.choiceText);
        SurveyHelper.alignVerticallyBricks('center', itemFlat, textFlat.unfold()[0]);
        return new CompositeBrick(itemFlat, textFlat);
    }
    public async generateChoicesColumn(point: IPoint, choices: ItemValue[], unrankedChoices: boolean = false): Promise<IPdfBrick[]> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        for (let i: number = 0; i < choices.length; i++) {
            const itemFlat: IPdfBrick = await this.generateFlatComposite(currPoint, choices[i], i, unrankedChoices);
            currPoint.yTop = itemFlat.yBot + this.styles.spacing.choiceGap;
            flats.push(itemFlat);
        }
        return flats;
    }
    public async generateSelectToRankItemsVertically(point: IPoint): Promise<IPdfBrick[]> {
        const currPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        if(this.question.rankingChoices.length !== 0) {
            flats.push(...await this.generateChoicesColumn(currPoint, this.question.rankingChoices));
            currPoint.yTop = flats[flats.length - 1].yBot + 2 * this.styles.spacing.choiceGap;
        }
        const separatorRect = SurveyHelper.createRect({
            xLeft: currPoint.xLeft,
            yTop: currPoint.yTop - this.styles.spacing.choiceGap - 0.5,
        }, this.controller.paperWidth - this.controller.margins.right - currPoint.xLeft, this.styles.selectToRankAreaSeparator.width);
        flats.push(new ColoredBrick(this.controller, separatorRect, { color: this.styles.selectToRankAreaSeparator.color }));

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
                    SurveyHelper.setColumnMargins(this.controller, colCount, colIndex, this.styles.spacing.choiceColumnGap);
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
            const gapBetweenRows = this.styles.spacing.choiceGap;
            row.addBrick(new ColoredBrick(this.controller, separatorRect,
                {
                    color: this.styles.selectToRankAreaSeparator.color,
                    renderWidth: this.styles.selectToRankAreaSeparator.width,
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