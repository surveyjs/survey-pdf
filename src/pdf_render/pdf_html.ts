import { IQuestion } from 'survey-core';
import { PdfBrick } from './pdf_brick';
import { IRect, DocController } from '../doc_controller';

export class HTMLBrick extends PdfBrick {
    private margins: { top: number, bottom: number };
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected html: string) {
        super(question, controller, rect);
        this.margins = {
            top: controller.margins.top,
            bottom: controller.margins.bot
        };
    }
    public async render(): Promise<void> {
        await new Promise((resolve) => {
            this.controller.doc.fromHtml(this.html, this.xLeft, this.yTop, {
                width: this.width,
                'pagesplit': true,
            }, () => resolve(), this.margins)
        });
    }
}