import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { BorderRect, IBorderAppearanceOptions, SurveyHelper } from '../helper_survey';

export interface IEmptyBrickAppearanceOptions extends IBorderAppearanceOptions {
    color?: string;
}

export class EmptyBrick extends PdfBrick {
    constructor(controller: DocController, rect: IRect,
         protected appearance: IEmptyBrickAppearanceOptions = {}) {
        super(controller, rect);
    }

    public async renderInteractive(): Promise<void> {
        if(this.appearance.color) {
            this.controller.setFillColor(this.appearance.color);
            const { lines, point } = SurveyHelper.getRoundedShape(this.contentRect, { ...this.appearance, borderRect: BorderRect.All });
            this.controller.doc.lines(lines, point.xLeft, point.yTop, [1, 1], 'F');
            this.controller.restoreFillColor();
        }
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.appearance);
    }
}