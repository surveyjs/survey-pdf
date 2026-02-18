import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { IBorderExtendedStyle, SurveyHelper } from '../helper_survey';

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
            const { lines: docLines, point } = SurveyHelper.getDocLinesFromShape(SurveyHelper.getRoundedShape(this.contentRect, this.style));
            this.controller.doc.lines(docLines, ...point, [1, 1], 'F', true);
            this.controller.restoreFillColor();
        }
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.style);
    }
}