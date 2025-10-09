import { ITextAppearanceOptions } from '../helper_survey';
import { IPoint, IRect, DocController } from '../doc_controller';
import { IPdfBrickOptions, PdfBrick } from './pdf_brick';

export interface ITextBrickOptions extends IPdfBrickOptions {
    text: string;
}

export class TextBrick extends PdfBrick {
    protected align: any;
    public constructor(controller: DocController,
        rect: IRect, public options: ITextBrickOptions, public appearance: ITextAppearanceOptions) {
        super(controller, rect, options);
        this.align = {
            isInputRtl: false,
            isOutputRtl: controller.isRTL,
            align: controller.isRTL ? 'right': 'left',
            baseline: 'middle',
            lineHeightFactor: 1.15
        };
    }
    private escapeText() {
        while (this.options.text.indexOf('\t') > -1) {
            this.options.text = this.options.text.replace('\t', Array(5).join(String.fromCharCode(160)));
        }
        return this.options.text;
    }
    public async renderInteractive(): Promise<void> {
        const alignPoint: IPoint = this.alignPoint(this);
        const oldFontSize: number = this.controller.fontSize;
        const oldFontStyle: string = this.controller.fontStyle;
        const oldFontName: string = this.controller.fontName;
        const oldFontColor: string = this.controller.doc.getTextColor();
        this.controller.fontSize = this.appearance.fontSize;
        this.controller.fontStyle = this.appearance.fontStyle;
        this.controller.fontName = this.appearance.fontName;
        this.controller.doc.setTextColor(this.appearance.fontColor);
        this.controller.doc.text(this.escapeText(), alignPoint.xLeft, alignPoint.yTop, this.align);
        this.controller.doc.setTextColor(oldFontColor);
        this.controller.fontSize = oldFontSize;
        this.controller.fontStyle = oldFontStyle;
        this.controller.fontName = oldFontName;
    }
    protected alignPoint(rect: IRect): IPoint {
        return {
            xLeft: this.controller.isRTL ? rect.xRight : rect.xLeft,
            yTop: rect.yTop + (rect.yBot - rect.yTop) / 2.0
        };
    }
}