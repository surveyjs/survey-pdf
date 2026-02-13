import { IRect, ISize, DocController, IPoint } from '../doc_controller';
import { IPdfBrick, IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';
import { IInputStyle } from '../style/types';

export interface IRankingItemBrickOptions extends IPdfBrickOptions {
    mark: string;
}

export class RankingItemBrick extends PdfBrick {
    public constructor(controller: DocController,
        rect: IRect, protected options: IRankingItemBrickOptions, protected style: IInputStyle) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        const formScale = SurveyHelper.getRectBorderScale(this.contentRect, this.style.borderWidth ?? 0);
        const scaledRect = SurveyHelper.scaleRect(this.contentRect, formScale);
        const scaledRectWidth = scaledRect.xRight - scaledRect.xLeft;
        const scaledRectHeight = scaledRect.yBot - scaledRect.yTop;
        const scaledAcroformRect = SurveyHelper.createAcroformRect(scaledRect);
        if(this.style.backgroundColor) {
            this.controller.setFillColor(this.style.backgroundColor);
            this.controller.doc.rect(...scaledAcroformRect, 'F');
            this.controller.restoreFillColor();
        }
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.style);
        if(this.options.mark) {
            const markPoint: IPoint = SurveyHelper.createPoint(scaledRect, true, true);
            const textStyle = { ...this.style };
            const markSize: ISize = this.controller.measureText(this.options.mark, textStyle);
            markPoint.xLeft += scaledRectWidth / 2.0 - markSize.width / 2.0;
            markPoint.yTop += scaledRectHeight / 2.0 - markSize.height / 2.0;
            const markFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                markPoint, this.controller, this.options.mark, textStyle);
            await markFlat.render();
        } else {
            this.controller.setFillColor(this.style.fontColor);
            let rect = SurveyHelper.createRect(scaledRect, this.style.fontSize, this.style.fontSize / 7);
            rect = SurveyHelper.moveRect(rect, rect.xLeft + scaledRectWidth / 2.0 - (rect.xRight - rect.xLeft) / 2.0, rect.yTop + scaledRectHeight / 2.0 - (rect.yBot - rect.yTop) / 2.0);
            this.controller.doc.rect(...SurveyHelper.createAcroformRect(rect), 'F');
            this.controller.restoreFillColor();
        }
    }
}