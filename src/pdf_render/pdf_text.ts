import { IQuestion, } from 'survey-core';
import { IPoint, IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';

export class TextBrick extends PdfBrick {
    protected align: any;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected text: string) {
        super(question, controller, rect);
        this.align = {
            isInputRtl: false,
            isOutputRtl: controller.isRTL,
            align: controller.isRTL ? 'right': 'left',
            baseline: 'middle'
        };
    }
    private escapeText() {
        while (this.text.indexOf('\t') > -1) {
            this.text = this.text.replace('\t', Array(5).join(String.fromCharCode(160)));
        }
        return this.text;
    }
    public async renderInteractive(): Promise<void> {
        let alignPoint: IPoint = this.alignPoint(this);
        let oldFontSize: number = this.controller.fontSize;
        this.controller.fontSize = this.fontSize;
        let oldTextColor: string = this.controller.doc.getTextColor();
        this.controller.doc.setTextColor(this.textColor);
        this.controller.doc.text(this.escapeText(), alignPoint.xLeft, alignPoint.yTop, this.align);
        this.controller.doc.setTextColor(oldTextColor);
        this.controller.fontSize = oldFontSize;
    }
    protected alignPoint(rect: IRect): IPoint {
        return {
            xLeft: this.controller.isRTL ? rect.xRight : rect.xLeft,
            yTop: rect.yTop + (rect.yBot - rect.yTop) / 2.0
        };
    }
}