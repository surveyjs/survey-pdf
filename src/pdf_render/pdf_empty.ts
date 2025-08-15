import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { IBorderAppearanceOptions, SurveyHelper } from '../helper_survey';

export type IEmptyBrickAppearancOptions = ({ isBorderVisible: true } & IBorderAppearanceOptions) | { isBorderVisible?: false };

export class EmptyBrick extends PdfBrick {

    constructor(controller: DocController, rect: IRect,
         protected appearance: IEmptyBrickAppearancOptions = {}) {
        super(controller, rect);
    }

    private resizeBorder(isIncrease: boolean): void {
        const coef: number = isIncrease ? 1 : -1;
        const borderPadding: number = this.controller.doc.getFontSize() * SurveyHelper.VALUE_READONLY_PADDING_SCALE;
        this.xLeft -= coef * borderPadding;
        this.xRight += coef * borderPadding;
        this.yBot += coef * borderPadding;
    }

    public async renderInteractive(): Promise<void> {
        if (this.appearance.isBorderVisible) {
            this.resizeBorder(true);
            SurveyHelper.renderFlatBorders(this.controller, this, this.appearance);
            this.resizeBorder(false);
        }
    }
}