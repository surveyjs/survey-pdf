import { IRect, DocController } from '../doc_controller';
import { IPdfBrickOptions, PdfBrick } from './pdf_brick';

export interface IColoredBrickOptions extends IPdfBrickOptions {
    color: string;
    renderWidth?: number;
    renderHeight?: number;
}

export class ColoredBrick extends PdfBrick {
    public constructor(controller: DocController, rect: IRect, protected options: IColoredBrickOptions) {
        super(controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        let oldFillColor: string = this.controller.doc.getFillColor();
        this.controller.doc.setFillColor(this.options.color || 'black');
        this.controller.doc.rect(this.xLeft, this.yTop,
            this.options.renderWidth ?? this.width, this.options.renderHeight ?? this.height, 'F');
        this.controller.doc.setFillColor(oldFillColor);
    }
}