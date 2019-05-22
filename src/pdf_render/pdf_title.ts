import { IQuestion } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextBrick } from './pdf_text';

export class TitleBrick extends TextBrick {
    constructor(question: IQuestion, controller: DocController,
        rect: IRect, text: string) {
        super(question, controller, rect, text);
    }
    async render(): Promise<void> {
        this.controller.fontStyle = 'bold';
        super.render();
        this.controller.fontStyle = 'normal';
    }
}