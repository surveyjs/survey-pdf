import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { IBorderAppearanceOptions, SurveyHelper } from '../helper_survey';

export class EmptyBrick extends PdfBrick {
    constructor(controller: DocController, rect: IRect,
         protected appearance: IBorderAppearanceOptions = {}) {
        super(controller, rect);
    }

    public async renderInteractive(): Promise<void> {
        SurveyHelper.renderFlatBorders(this.controller, this.contentRect, this.appearance);
    }
}