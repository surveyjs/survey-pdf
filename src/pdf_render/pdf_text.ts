import { IQuestion, } from 'survey-core';
import { IPoint, IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class TextBrick extends PdfBrick {
    protected align: { align: string, baseline: string };
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected text: string, protected fontSize?: number,
        protected textColor?: string) {
        super(question, controller, rect);
        this.align = {
            align: 'left',
            baseline: 'middle'
        };
        if (typeof fontSize === 'undefined') {
            this.fontSize = controller.fontSize;
        }
        if (typeof textColor === 'undefined') {
            this.textColor = SurveyHelper.TEXT_COLOR;
        }
    }
    public async renderInteractive(): Promise<void> {
        let alignPoint: IPoint = this.alignPoint(this);
        let oldFontSize: number = this.controller.fontSize;
        this.controller.fontSize = this.fontSize;
        let oldTextColor: string = this.controller.doc.getTextColor();
        this.controller.doc.setTextColor(this.textColor);
        this.controller.doc.text(this.text, alignPoint.xLeft, alignPoint.yTop, this.align);
        this.controller.doc.setTextColor(oldTextColor);
        this.controller.fontSize = oldFontSize;
    }
    protected alignPoint(rect: IRect): IPoint {
        return {
            xLeft: rect.xLeft,
            yTop: rect.yTop + (rect.yBot - rect.yTop) / 2.0
        };
    }
}