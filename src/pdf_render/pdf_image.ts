import { IQuestion } from 'survey-core';
import { PdfBrick } from './pdf_brick';
import { DocController, IPoint } from '../doc_controller';

export class ImageBrick extends PdfBrick {
    public constructor(question: IQuestion, controller: DocController, protected image: string | Uint8Array,
        point: IPoint, protected targetWidth: number, protected targetHeight: number, protected imageWidth?: number, protected imageHeight?: number, protected imageId?: string) {
        super(question, controller, {
            xLeft: point.xLeft,
            xRight: point.xLeft + (targetWidth || 0),
            yTop: point.yTop,
            yBot: point.yTop + (targetHeight || 0)
        });
        this.imageWidth = this.imageWidth || this.targetWidth;
        this.imageHeight = this.imageHeight || this.targetHeight;
        this.isPageBreak = this.targetHeight === undefined;
    }
    public async renderInteractive(): Promise<void> {
        const xLeft = this.targetWidth > this.imageWidth ? this.xLeft + (this.targetWidth - this.imageWidth) / 2 : this.xLeft;
        const yTop = this.targetHeight > this.imageHeight ? this.yTop + (this.targetHeight - this.imageHeight) / 2 : this.yTop;
        await new Promise<void>((resolve) => {
            try {
                this.controller.doc.addImage(this.image, 'PNG', xLeft, yTop, Math.min(this.imageWidth, this.targetWidth), Math.min(this.imageHeight, this.targetHeight), this.imageId, 'MEDIUM');
            } finally {
                resolve();
            }
        });
    }
}