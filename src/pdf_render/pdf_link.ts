import { ITextBrickOptions, TextBrick } from './pdf_text';
import { ITextAppearanceOptions } from '../helper_survey';
import { IRect, DocController } from '../doc_controller';

export interface ILinkOptions extends ITextBrickOptions {
    link: string;
    readOnlyShowLink: boolean;
}

export class LinkBrick extends TextBrick {
    private static readonly SCALE_FACTOR_MAGIC: number = 0.955;
    public constructor(controller: DocController, rect: IRect, public options: ILinkOptions, public appearance: ITextAppearanceOptions) {
        super(controller, rect, options, appearance);
    }
    public async renderInteractive(): Promise<void> {
        const oldFontSize: number = this.controller.fontSize;
        const oldFontStyle: string = this.controller.fontStyle;
        const oldFontName: string = this.controller.fontName;
        this.controller.fontSize = this.appearance.fontSize;
        this.controller.fontStyle = this.appearance.fontStyle;
        this.controller.fontName = this.appearance.fontName;
        this.controller.setTextColor('#FFFFFF00');
        let descent: number = this.controller.unitHeight *
            (this.controller.doc.getLineHeightFactor() -
                LinkBrick.SCALE_FACTOR_MAGIC);
        let yTopLink: number = this.contentRect.yTop +
            (this.contentRect.yBot - this.contentRect.yTop) - descent;
        this.controller.doc.textWithLink(this.options.text, this.contentRect.xLeft,
            yTopLink, { url: this.options.link });
        this.controller.restoreTextColor();
        this.controller.fontSize = oldFontSize;
        this.controller.fontStyle = oldFontStyle;
        this.controller.fontName = oldFontName;
        await super.renderInteractive();
    }
    public async renderReadOnly(): Promise<void> {
        if (this.options.readOnlyShowLink) {
            super.renderInteractive();
        } else {
            this.renderInteractive();
        }
    }
}