import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';

export class ColoredBrick extends PdfBrick {
    public constructor(controller: DocController,
        rect: IRect, private color: string, private renderWidth?: number, private renderHeight?: number) {
        super(undefined, controller, rect);
    }
    public async renderInteractive(): Promise<void> {
        let oldFillColor: string = this.controller.doc.getFillColor();
        this.controller.doc.setFillColor(this.color || 'black');
        this.controller.doc.rect(this.xLeft, this.yTop,
            this.renderWidth ?? this.width, this.renderHeight ?? this.height, 'F');
        this.controller.doc.setFillColor(oldFillColor);
    }
}