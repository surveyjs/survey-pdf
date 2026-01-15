import { IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { IRect, DocController } from '../doc_controller';
import { ITextStyle } from '../style/types';

export interface IHTMLOptions extends IPdfBrickOptions {
    html: string;
}

export class HTMLBrick extends PdfBrick {
    public constructor(controller: DocController,
        rect: IRect, protected options: IHTMLOptions, protected style: ITextStyle) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        const oldFontSize: number = this.controller.fontSize;
        const oldFontStyle: string = this.controller.fontStyle;
        const oldFontName: string = this.controller.fontName;
        this.controller.fontSize = this.style.fontSize;
        this.controller.fontStyle = this.style.fontStyle;
        this.controller.fontName = this.style.fontName;
        this.controller.setTextColor(this.style.fontColor);
        await new Promise<void>((resolve) => {
            this.controller.doc.fromHTML(this.options.html, this.contentRect.xLeft, this.contentRect.yTop, {
                width: this.contentRect.width, pagesplit: true,
            }, function () {
                [].slice.call(document.querySelectorAll('.sjs-pdf-hidden-html-div')).forEach(
                    function (el: HTMLDivElement) {
                        el.parentNode.removeChild(el);
                    }
                );
                resolve();
            }, {
                top: this.controller.margins.top,
                bottom: this.controller.margins.bot
            });
        });
        this.controller.restoreTextColor();
        this.controller.fontSize = oldFontSize;
        this.controller.fontStyle = oldFontStyle;
        this.controller.fontName = oldFontName;
        this.controller.fontSize = oldFontSize;
    }
}