import { IQuestion, QuestionTextModel } from 'survey-core';
import { IPoint, IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';

export class TextBrick extends PdfBrick {
    protected question: QuestionTextModel;
    protected align: { align: string, baseline: string };
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected text: string) {
        super(question, controller, rect);
        this.question = <QuestionTextModel>question;
        this.align = {
            align: 'left',
            baseline: 'middle'
        };
    }
    public async render(): Promise<void> {
        let alignPoint = this.alignPoint(this);
        this.controller.doc.text(this.text, alignPoint.xLeft, alignPoint.yTop, this.align);
    }
    protected alignPoint(rect: IRect): IPoint {
        return {
            xLeft: rect.xLeft,
            yTop: rect.yTop + (rect.yBot - rect.yTop) / 2.0
        };
    }
}