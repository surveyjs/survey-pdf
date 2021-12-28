import { PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';
import { IQuestion } from 'survey-core';

export class CustomBrick extends PdfBrick {

    constructor(question: IQuestion, controller: DocController, private renderFunc: (doc: any, question: any, xLeft: number, yTop: number) => IRect) {
        super(question, controller, renderFunc(controller.helperDoc, question, 0, 0));
    }
    public async renderInteractive(): Promise<void> {
        await new Promise<void>((resolve) => {
            this.renderFunc(this.controller.doc, this.question, this.xLeft, this.yTop);
            resolve();
        });
    }
}