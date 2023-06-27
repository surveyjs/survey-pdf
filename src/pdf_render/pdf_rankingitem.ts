import { IQuestion, QuestionRankingModel } from 'survey-core';
import { IRect, ISize, DocController, IPoint } from '../doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_brick';
import { TextBrick } from './pdf_text';
import { CheckItemBrick } from './pdf_checkitem';
import { SurveyHelper } from '../helper_survey';

export class RankingItemBrick extends PdfBrick {
    protected question: QuestionRankingModel;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected mark: string) {
        super(question, controller, rect);
        this.question = <QuestionRankingModel>question;
        this.textColor = this.formBorderColor;
    }
    public async renderInteractive(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this);
        const markPoint: IPoint = SurveyHelper.createPoint(this, true, true);
        const oldFontSize: number = this.controller.fontSize;
        this.controller.fontSize = oldFontSize *
            CheckItemBrick.CHECKMARK_READONLY_FONT_SIZE_SCALE;
        const markSize: ISize = this.controller.measureText(this.mark);
        markPoint.xLeft += this.width / 2.0 - markSize.width / 2.0;
        markPoint.yTop += this.height / 2.0 - markSize.height / 2.0;
        const markFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            markPoint, this.question, this.controller, this.mark, TextBrick);
        (<any>markFlat.unfold()[0]).textColor = this.textColor;
        this.controller.fontSize = oldFontSize;
        await markFlat.render();
    }
}