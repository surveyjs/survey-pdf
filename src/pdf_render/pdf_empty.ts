import { PdfBrick } from './pdf_brick';
import { IRect } from '../doc_controller';

export class EmptyBrick extends PdfBrick {
    constructor(rect: IRect) {
        super(null, null, rect);
    }
    public async render(): Promise<void> {
    }
}