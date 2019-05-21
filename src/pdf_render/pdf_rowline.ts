import { IRect, DocController } from '../doc_controller';
import { IPdfBrick } from './pdf_brick';

export class RowlineBrick implements IPdfBrick {
    xLeft: number;
    xRight: number;
    yTop: number;
    yBot: number;
    constructor(protected controller: DocController,
        rect: IRect, protected color: string) {
        this.xLeft = rect.xLeft;
        this.xRight = rect.xRight;
        this.yTop = rect.yTop;
        this.yBot = rect.yBot;
    }
    async render(): Promise<void> {
        if (this.color !== null) {
            let oldDrawColor: string = this.controller.doc.getDrawColor();
            this.controller.doc.setDrawColor('#0000EE');
            this.controller.doc.line(this.xLeft, this.yTop, this.xRight, this.yTop);
            this.controller.doc.setDrawColor(oldDrawColor);
        }
    }
    unfold(): IPdfBrick[] {
        return [this];
    }
}