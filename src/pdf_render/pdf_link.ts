import { ITextAppearanceOptions, ITextBrickOptions, TextBrick } from './pdf_text';
import { SurveyHelper } from '../helper_survey';
import { IRect, DocController } from '../doc_controller';

export interface ILinkOptions extends ITextBrickOptions {
    link: string;
    readOnlyShowLink: boolean;
}

export interface ILinkBrickAppearanceOptions extends ITextAppearanceOptions {}

export class LinkBrick extends TextBrick {
    private static readonly SCALE_FACTOR_MAGIC: number = 0.955;
    public constructor(controller: DocController, rect: IRect, public options: ILinkOptions, public appearance: ILinkBrickAppearanceOptions) {
        super(controller, rect, options, appearance);
    }
    public async renderInteractive(): Promise<void> {
        const oldFontSize: number = this.controller.fontSize;
        const oldFontStyle: string = this.controller.fontStyle;
        const oldFontName: string = this.controller.fontName;
        this.controller.fontSize = this.appearance.fontSize;
        this.controller.fontStyle = this.appearance.fontStyle;
        this.controller.fontName = this.appearance.fontName;
        let oldTextColor: string = this.controller.doc.getTextColor();
        this.controller.doc.setTextColor('#FFFFFF');
        let descent: number = this.controller.unitHeight *
            (this.controller.doc.getLineHeightFactor() -
                LinkBrick.SCALE_FACTOR_MAGIC);
        let yTopLink: number = this.yTop +
            (this.yBot - this.yTop) - descent;
        this.controller.doc.textWithLink(this.options.text, this.xLeft,
            yTopLink, { url: this.options.link });
        await super.renderInteractive();
        this.controller.doc.setTextColor(oldTextColor);
        this.controller.fontSize = oldFontSize;
        this.controller.fontStyle = oldFontStyle;
        this.controller.fontName = oldFontName;
    }
    public async renderReadOnly(): Promise<void> {
        if (this.options.readOnlyShowLink) {
            super.renderInteractive();
        } else {
            this.renderInteractive();
        }
    }
}