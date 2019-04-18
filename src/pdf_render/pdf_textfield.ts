import { IRect, DocController } from '../doc_controller';
import { IQuestion } from 'survey-core';
import { PdfBrick } from './pdf_brick';

export class TextFieldBrick extends PdfBrick {
    protected isMultiline: boolean;
    constructor(protected question: IQuestion,
        protected controller: DocController, rect: IRect) {
        super(question, controller, rect);
        this.isMultiline = false;
    }
    render(): void {
        //if (this.isMultiline)
    }
}