import { IQuestion } from 'survey-core';
import { PdfBrick } from './pdf_brick';
import { IRect, DocController } from '../doc_controller';

export class HTMLBrick extends PdfBrick {
    private margins: { top: number, bottom: number };
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected html: string, isImage: boolean = false) {
        super(question, controller, rect);
        if (isImage) {
            this.margins = {
                top: 0.0,
                bottom: 0.0
            };
        }
        else {
            this.margins = {
                top: controller.margins.top,
                bottom: controller.margins.bot
            };
        }
    }
    public async renderInteractive(): Promise<void> {
        let oldFontSize: number = this.controller.fontSize;
        this.controller.fontSize = this.fontSize;
        await new Promise<void>((resolve) => {
            this.controller.doc.fromHTML(this.html, this.xLeft, this.yTop, {
                width: this.width, pagesplit: true,
            }, function () {
                [].slice.call(document.querySelectorAll('.sjs-pdf-hidden-html-div')).forEach(
                    function (el: HTMLDivElement) {
                        el.parentNode.removeChild(el);
                    }
                );
                resolve();
            }, this.margins);
        });
        this.controller.fontSize = oldFontSize;
    }
}