import { QuestionTextModel, IQuestion, SurveyElement } from 'survey-core';
import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { SurveyHelper } from '../helper_survey';

export class EmptyBrick extends PdfBrick {
    constructor(rect: IRect) {
        super(null, null, rect);
    }
    async render(): Promise<void> {
    }
}