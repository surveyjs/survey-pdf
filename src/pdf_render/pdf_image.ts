import { IQuestion } from 'survey-core';
import { PdfBrick } from './pdf_brick';
import { DocController } from '../doc_controller';
import { IPoint } from '../entries/pdf';

export class ImageBrick extends PdfBrick {
    public constructor(question: IQuestion, controller: DocController, protected image: string,
        point: IPoint, protected originalWidth: number, protected originalHeight: number) {
        super(question, controller, {
            xLeft: point.xLeft,
            xRight: point.xLeft + (originalWidth || 0),
            yTop: point.yTop,
            yBot: point.yTop + (originalHeight || 0)
        });
        this.isPageBreak = this.originalHeight === undefined;
    }
    public async renderInteractive(): Promise<void> {
        await new Promise<void>((resolve) => {
            this.controller.doc.addImage(this.image, this.xLeft, this.yTop, this.originalWidth || this.width, this.originalHeight || this.height);
            resolve();
        });
    }
}