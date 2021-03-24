import { IQuestion, ItemValue, QuestionRankingModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { RankingItemBrick } from '../pdf_render/pdf_rankingitem';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatRanking extends FlatQuestion {
    protected question: QuestionRankingModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionRankingModel>question;
    }
    protected async generateFlatComposite(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        const itemRect: IRect = SurveyHelper.createRect(point,
            this.controller.unitWidth, this.controller.unitHeight);
        const itemScaledRect: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
            itemRect, SurveyHelper.SELECT_ITEM_FLAT_SCALE), point.xLeft);
        const itemFlat: IPdfBrick = new RankingItemBrick(this.question, this.controller,
            itemScaledRect, this.question.getNumberByIndex(index));
        const textPoint: IPoint = SurveyHelper.clone(point);
        textPoint.xLeft = itemFlat.xRight + this.controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
        const textFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            textPoint, this.question, this.controller, item.locText, TextBrick);
        return new CompositeBrick(itemFlat, textFlat);
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const currPoint: IPoint = SurveyHelper.clone(point);
        const flats: IPdfBrick[] = [];
        for (let i: number = 0; i < this.question.rankingChoices.length; i++) {
            const itemFlat: IPdfBrick = await this.generateFlatComposite(currPoint, this.question.rankingChoices[i], i);
            currPoint.yTop = itemFlat.yBot + SurveyHelper.GAP_BETWEEN_ROWS * this.controller.unitHeight;
            flats.push(itemFlat);
        }
        return flats;
    }
}

FlatRepository.getInstance().register('ranking', FlatRanking);