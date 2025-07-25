import { IPdfBrickOptions, PdfBrick } from './pdf_brick';
import { DocController } from '../doc_controller';
import { IPoint } from '../doc_controller';

export interface IImageBrickOptions extends IPdfBrickOptions {
    link: string;
    width: number;
    height: number;
}

export class ImageBrick extends PdfBrick {
    public constructor(controller: DocController, point: IPoint, protected options: IImageBrickOptions) {
        super(controller, {
            xLeft: point.xLeft,
            xRight: point.xLeft + (options.width || 0),
            yTop: point.yTop,
            yBot: point.yTop + (options.height || 0)
        });
        this.isPageBreak = this.options.height === undefined;
    }
    public async renderInteractive(): Promise<void> {
        await new Promise<void>((resolve) => {
            try {
                this.controller.doc.addImage(this.options.link, 'PNG', this.xLeft, this.yTop, this.options.width, this.options.height);
            } finally {
                resolve();
            }
        });
    }
}