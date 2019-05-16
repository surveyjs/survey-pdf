import { QuestionTextModel, IQuestion, SurveyElement } from 'survey-core';
import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { SurveyHelper } from '../helper_survey';

export class HTMLBrick extends PdfBrick {
    constructor(question: IQuestion, protected controller: DocController, rect: IRect, protected element: any) {
        super(question, controller, rect);
    }
    render(): void {
        let margins = {
            top: this.controller.margins.marginTop,
            bottom: this.controller.margins.marginBot,

        }
        this.controller.doc.fromHTML(this.element, this.xLeft, this.yTop, {
            width: this.xRight - this.xLeft,
            'pagesplit': true,
        }, function () { }, margins);
    }
}