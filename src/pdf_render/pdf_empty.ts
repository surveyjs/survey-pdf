import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { SurveyHelper } from '../helper_survey';

export class EmptyBrick extends PdfBrick {
    private isBorderVisible: boolean = false;

    constructor(rect: IRect,
        protected controller: DocController = null,
        isBorderVisible: boolean = false) {
        super(null, controller, rect);
        this.isBorderVisible = isBorderVisible;
    }

    private resizeBorder(isIncrease: boolean): void {
        const coef: number = isIncrease ? 1 : -1;
        const borderPadding: number = this.controller.doc.getFontSize() * SurveyHelper.VALUE_READONLY_PADDING_SCALE;
        this.xLeft -= coef * borderPadding;
        this.xRight += coef * borderPadding;
        this.yBot += coef * borderPadding;
    }

    public async renderInteractive(): Promise<void> {
        if (this.isBorderVisible) {
            this.resizeBorder(true);
            SurveyHelper.renderFlatBorders(this.controller, this);
            this.resizeBorder(false);
        }
    }
}