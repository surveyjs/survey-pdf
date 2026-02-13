import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { BorderRect, IBorderExtendedStyle, SurveyHelper } from '../helper_survey';

export interface IEmptyBrickStyle extends IBorderExtendedStyle {
    color?: string;
}

export class EmptyBrick extends PdfBrick {
    constructor(controller: DocController, rect: IRect,
        protected style: IEmptyBrickStyle = {}) {
        super(controller, rect);
    }

    public async renderInteractive(): Promise<void> {
        if(this.style.color) {
            this.controller.setFillColor(this.style.color);
            const { lines, point } = SurveyHelper.getRoundedShape(this.contentRect, { ...this.style, borderRect: BorderRect.All });
            this.controller.doc.lines(lines, point.xLeft, point.yTop, [1, 1], 'F');
            this.controller.restoreFillColor();
        }
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.style);
    }
}