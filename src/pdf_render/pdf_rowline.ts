import { IRect } from '../doc_controller';
import { IPdfBrick } from './pdf_brick';

export class RowlineBrick implements IPdfBrick {
    xLeft: number;
    xRight: number;
    yTop: number;
    yBot: number;
    constructor(rect: IRect) {
        this.xLeft = rect.xLeft;
        this.xRight = rect.xRight;
        this.yTop = rect.yTop;
        this.yBot = rect.yBot;
    }
    render(): void { }
    unfold(): IPdfBrick[] {
        return [this];
    }
}