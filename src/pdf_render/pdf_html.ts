import { QuestionTextModel, IQuestion, SurveyElement } from 'survey-core';
import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { SurveyHelper } from '../helper_survey';

export class HTMLBrick extends PdfBrick {
    constructor(question: IQuestion, protected controller: DocController,
        public rect: IRect, protected element: any) {
        super(question, controller, rect);
    }
    render(): void {
        let margins = SurveyHelper.rectToHtmlMargins(this.rect, this.controller);
        this.controller.doc.fromHTML(this.element, margins.left, margins.top, {
            'pagesplit': true,
            width: margins.width
        }, margins);
    }
}