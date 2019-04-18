import { IRect, DocController } from '../docController';
import { IQuestion } from 'survey-core';
import { PdfBrick } from './pdf_brick';

export class DescriptionBrick extends PdfBrick {
    constructor(protected question: IQuestion, protected controller: DocController,
        rect: IRect) {
        super(question, controller, rect);
    }
    render(): void {

    }
}