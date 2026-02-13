import { ITextStyle } from '../style/types';
import { IPoint, IRect, DocController } from '../doc_controller';
import { IPdfBrickOptions, PdfBrick } from './pdf_brick';

export interface ITextBrickOptions extends IPdfBrickOptions {
    text: string;
}

export class TextBrick extends PdfBrick {
    protected align: any;
    public constructor(controller: DocController,
        rect: IRect, public options: ITextBrickOptions, public style: ITextStyle) {
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
        return this.options.text.replace(/\t/g, Array(5).join(String.fromCharCode(160)));
    }
    public async renderInteractive(): Promise<void> {
        const alignPoint: IPoint = this.alignPoint(this.contentRect);
        this.controller.setTextStyle(this.style);
        this.controller.doc.text(this.escapeText(), alignPoint.xLeft, alignPoint.yTop, this.align);
        this.controller.restoreTextStyle();
    }
    protected alignPoint(rect: IRect): IPoint {
        return {
            xLeft: this.controller.isRTL ? rect.xRight : rect.xLeft,
            yTop: rect.yTop + (rect.yBot - rect.yTop) / 2.0
        };
    }
}