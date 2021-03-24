import { IQuestion, QuestionRankingModel } from 'survey-core';
import { IRect, ISize, DocController, IPoint } from '../doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_brick';
import { TextBrick } from './pdf_text';
import { CheckItemBrick } from './pdf_checkitem';
import { SurveyHelper } from '../helper_survey';

export class RankingItemBrick extends PdfBrick {
    protected question: QuestionRankingModel;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected number: string) {
        super(question, controller, rect);
        this.question = <QuestionRankingModel>question;
        this.textColor = this.formBorderColor;
    }
    public async renderInteractive(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this);
        const numberPoint: IPoint = SurveyHelper.createPoint(this, true, true);
        const oldFontSize: number = this.controller.fontSize;
        this.controller.fontSize = oldFontSize *
            CheckItemBrick.CHECKMARK_READONLY_FONT_SIZE_SCALE;
        const numberSize: ISize = this.controller.measureText(this.number);
        numberPoint.xLeft += this.width / 2.0 - numberSize.width / 2.0;
        numberPoint.yTop += this.height / 2.0 - numberSize.height / 2.0;
        const numberFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            numberPoint, this.question, this.controller, this.number, TextBrick);
        (<any>numberFlat.unfold()[0]).textColor = this.textColor;
        this.controller.fontSize = oldFontSize;
        await numberFlat.render();
    }
}