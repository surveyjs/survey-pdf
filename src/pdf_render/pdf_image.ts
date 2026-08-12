import { IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { DocController, IRect } from '../doc_controller';

export interface IImageBrickOptions extends IPdfBrickOptions {
    link: string | Uint8Array;
    width: number;
    height: number;
    imageId?: string;
}

export class ImageBrick extends PdfBrick {
    public constructor(controller: DocController, rect: IRect, protected options: IImageBrickOptions) {
        super(controller, rect);
        this.isPageBreak = this.options.height === undefined;
    }
    public async renderInteractive(): Promise<void> {
        const imageWidth = this.options.width || this.contentRect.width;
        const imageHeight = this.options.height || this.contentRect.height;
        const targetWidth = this.contentRect.width;
        const targetHeight = this.contentRect.height;
        const xLeft = targetWidth > imageWidth ? this.contentRect.xLeft + (targetWidth - imageWidth) / 2 : this.contentRect.xLeft;
        const yTop = targetHeight > imageHeight ? this.contentRect.yTop + (targetHeight - imageHeight) / 2 : this.contentRect.yTop;
        await new Promise<void>((resolve) => {
            try {
                this.controller.doc.addImage(this.options.link, 'PNG', xLeft, yTop, Math.min(imageWidth, targetWidth), Math.min(imageHeight, targetHeight), this.options.imageId, 'MEDIUM');
            } finally {
                resolve();
            }
        });
    }
}