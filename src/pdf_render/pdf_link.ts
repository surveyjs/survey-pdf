import { ITextBrickOptions, TextBrick } from './pdf_text';
import { IRect, DocController } from '../doc_controller';
import { ITextStyle } from '../style/types';
import { SurveyHelper } from '../helper_survey';

export interface ILinkOptions extends ITextBrickOptions {
    link: string;
    readOnlyShowLink: boolean;
}

export class LinkBrick extends TextBrick {
    private static readonly SCALE_FACTOR_MAGIC: number = 0.955;
    public constructor(controller: DocController, rect: IRect, public options: ILinkOptions, public style: ITextStyle) {
        super(controller, rect, options, style);
    }
    public async renderInteractive(): Promise<void> {
        this.controller.setTextStyle(SurveyHelper.mergeObjects({}, this.style, { fontColor: '#FFFFFF00' }));
        let descent: number = this.controller.unitHeight *
            (this.controller.doc.getLineHeightFactor() -
                LinkBrick.SCALE_FACTOR_MAGIC);
        let yTopLink: number = this.contentRect.yTop +
            (this.contentRect.yBot - this.contentRect.yTop) - descent;
        this.controller.doc.textWithLink(this.options.text, this.contentRect.xLeft,
            yTopLink, { url: this.options.link });
        this.controller.restoreTextStyle();
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