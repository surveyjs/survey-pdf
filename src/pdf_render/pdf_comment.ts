import { IQuestion, settings } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { TextBoxBrick } from './pdf_textbox';

export class CommentBrick extends TextBoxBrick {
    public constructor(question: IQuestion, protected controller: DocController,
        rect: IRect, isQuestion: boolean, index: number = 0) {
        super(question, controller, rect, isQuestion, true, index);
    }
    protected shouldRenderFlatBorders(): boolean {
        if(this.isQuestion && this.question.getType() !== 'comment') return super.shouldRenderFlatBorders();
        return settings.readOnlyCommentRenderMode === 'textarea';
    }
}