import { IRect, ISize, DocController, IPoint } from '../doc_controller';
import { IPdfBrick, IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { IBorderAppearanceOptions, SurveyHelper } from '../helper_survey';
import { ITextAppearanceOptions } from './pdf_text';

export interface IRankingItemBrickOptions extends IPdfBrickOptions {
        mark: string;
}
export type IRankingItemBrickAppearanceOptions = ITextAppearanceOptions & IBorderAppearanceOptions;

export class RankingItemBrick extends PdfBrick {
    public constructor(controller: DocController,
        rect: IRect, protected options: IRankingItemBrickOptions, protected appearance: IRankingItemBrickAppearanceOptions) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this, this.appearance);
        const markPoint: IPoint = SurveyHelper.createPoint(this, true, true);
        const textOptions = {
            fontSize: this.appearance.fontSize,
            fontColor: this.appearance.fontColor,
            fontName: this.appearance.fontName,
            fontStyle: this.appearance.fontStyle
        };
        const markSize: ISize = this.controller.measureText(this.options.mark, textOptions);
        markPoint.xLeft += this.width / 2.0 - markSize.width / 2.0;
        markPoint.yTop += this.height / 2.0 - markSize.height / 2.0;
        const markFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            markPoint, this.controller, this.options.mark, textOptions);
        await markFlat.render();
    }
}