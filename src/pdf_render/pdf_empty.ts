import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { IBorderAppearanceOptions, SurveyHelper } from '../helper_survey';

export interface IEmptyBrickAppearanceOptions extends IBorderAppearanceOptions {
    backgroundColor?: string;
}

export class EmptyBrick extends PdfBrick {
    constructor(controller: DocController, rect: IRect,
         protected appearance: IEmptyBrickAppearanceOptions = {}) {
        super(controller, rect);
    }

    public async renderInteractive(): Promise<void> {
        if(this.appearance.backgroundColor) {
            this.controller.setFillColor(this.appearance.backgroundColor);
            this.controller.doc.rect(...SurveyHelper.createAcroformRect(this.contentRect), 'F');
            this.controller.restoreFillColor();
        }
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.appearance);
    }
}