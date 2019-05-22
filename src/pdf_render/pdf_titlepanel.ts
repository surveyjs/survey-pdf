import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TitleBrick } from './pdf_title';
import { SurveyHelper } from '../helper_survey';

export class TitlePanelBrick extends TitleBrick {
    protected question: QuestionTextModel;
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, text: string) {
        super(question, controller, rect, text);
    }
    async render(): Promise<void> {
        let oldFontSize = this.controller.fontSize;
        this.controller.fontSize = oldFontSize * SurveyHelper.TITLE_PANEL_FONT_SIZE_SCALE_MAGIC;
        super.render();
        this.controller.fontSize = oldFontSize;
    }
}