import { IQuestion } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextBrick } from './pdf_text';
import { SurveyHelper } from '../helper_survey';

export class DescriptionBrick extends TextBrick {
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, text: string) {
        super(question, controller, rect, text, controller.fontSize);
    }
}