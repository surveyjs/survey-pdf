import { IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { IRect, DocController } from '../doc_controller';
import { ITextAppearanceOptions } from '../helper_survey';

export interface IHTMLOptions extends IPdfBrickOptions {
    html: string;
    isImage?: boolean;
}

export interface IHTMLAppearanceOptions extends ITextAppearanceOptions {}

export class HTMLBrick extends PdfBrick {
    private margins: { top: number, bottom: number };
    public constructor(controller: DocController,
        rect: IRect, protected options: IHTMLOptions, protected appearance: IHTMLAppearanceOptions) {
        super(controller, rect);
        if (options.isImage) {
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
        const oldFontSize: number = this.controller.fontSize;
        const oldFontStyle: string = this.controller.fontStyle;
        const oldFontName: string = this.controller.fontName;
        const oldFontColor: string = this.controller.doc.getTextColor();
        this.controller.fontSize = this.appearance.fontSize;
        this.controller.fontStyle = this.appearance.fontStyle;
        this.controller.fontName = this.appearance.fontName;
        this.controller.doc.setTextColor(this.appearance.fontColor);
        await new Promise<void>((resolve) => {
            this.controller.doc.fromHTML(this.options.html, this.xLeft, this.yTop, {
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
        this.controller.doc.setTextColor(oldFontColor);
        this.controller.fontSize = oldFontSize;
        this.controller.fontStyle = oldFontStyle;
        this.controller.fontName = oldFontName;
        this.controller.fontSize = oldFontSize;
    }
}