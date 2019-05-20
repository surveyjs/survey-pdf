
import { resolve } from 'path';
import { IQuestion } from 'survey-core';
import { PdfBrick } from './pdf_brick';
import { IRect, DocController } from '../doc_controller';

export class HTMLBrick extends PdfBrick {
    private margins: { top: number, bottom: number };
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected html: string) {
        super(question, controller, rect);
        this.margins = {
            top: controller.margins.top,
            bottom: controller.margins.bot
        };
    }
    async render() {
        await new Promise((resolve) => {
            this.controller.doc.fromHTML(this.html, this.xLeft, this.yTop, {
                width: this.xRight - this.xLeft,
                'pagesplit': true,
            }, () => resolve(), this.margins)
        });
    }
}