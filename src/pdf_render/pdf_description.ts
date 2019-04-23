import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextBrick } from './pdf_text';
import { SurveyHelper } from '../helper_survey';

export class DescriptionBrick extends TextBrick {
    protected question: QuestionTextModel;
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, text: string) {
        super(question, controller, rect, text);
    }
    render(): void {
        let oldFontSize = this.controller.fontSize;
        this.controller.fontSize = oldFontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        super.render();
        this.controller.fontSize = oldFontSize;
    }
}