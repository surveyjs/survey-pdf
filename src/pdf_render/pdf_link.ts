import { Question } from 'survey-core';
import { TextBrick } from './pdf_text';
import { SurveyHelper } from '../helper_survey';

export class LinkBrick extends TextBrick {
    private static readonly SCALE_FACTOR_MAGIC: number = 0.955;
    public static readonly COLOR: string = '#0000EE';
    public constructor(textFlat: TextBrick, protected link: string) {
        super((<LinkBrick>textFlat).question,
            (<LinkBrick>textFlat).controller,
            textFlat, (<LinkBrick>textFlat).text);
        this.textColor = LinkBrick.COLOR;
    }
    public async renderInteractive(): Promise<void> {
        let oldTextColor: string = this.controller.doc.getTextColor();
        this.controller.doc.setTextColor(SurveyHelper.BACKGROUND_COLOR);
        let descent: number = this.controller.unitHeight *
            (this.controller.doc.getLineHeightFactor() -
                LinkBrick.SCALE_FACTOR_MAGIC);
        let yTopLink: number = this.yTop +
            (this.yBot - this.yTop) - descent;
        this.controller.doc.textWithLink(this.text, this.xLeft,
            yTopLink, { url: this.link });
        await super.renderInteractive();
        this.controller.doc.setTextColor(oldTextColor);
    }
    public async renderReadOnly(): Promise<void> {
        if (SurveyHelper.getReadonlyRenderAs(<Question>this.question,
            this.controller) !== 'text') {
            return this.renderInteractive();
        }
        await super.renderInteractive();
    }
}