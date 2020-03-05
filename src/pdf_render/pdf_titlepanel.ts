import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextBoldBrick } from './pdf_textbold';
import { SurveyHelper } from '../helper_survey';

export class TitlePanelBrick extends TextBoldBrick {
    protected question: QuestionTextModel;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, text: string) {
        super(question, controller, rect, text);
    }
    public async renderInteractive(): Promise<void> {
        let oldFontSize = this.controller.fontSize;
        this.controller.fontSize = oldFontSize * SurveyHelper.TITLE_PANEL_FONT_SIZE_SCALE;
        await super.renderInteractive();
        this.controller.fontSize = oldFontSize;
    }
}