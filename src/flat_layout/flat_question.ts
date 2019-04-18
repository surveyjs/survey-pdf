import { IPoint, IRect, DocController } from "../docController";
import { IQuestion, Question, QuestionTextModel, LocalizableString } from 'survey-core';
import { IPdfBrick, PdfBrick } from '../pdf_render/pdf_brick'
import { TitleBrick } from '../pdf_render/pdf_title';
import { DescriptionBrick } from '../pdf_render/pdf_description';
import { CommentBrick } from '../pdf_render/pdf_comment';

export interface IFlatQuestion {
    generateFlatsContent(point: IPoint): IPdfBrick[];
    generateFlats(point: IPoint): IPdfBrick[];
}

export class FlatQuestion implements IFlatQuestion {
    static DESCRIPTION_FONT_SIZE_SCALE_MAGIC: number = 2.0 / 3.0;
    constructor(
        protected question: IQuestion,
        protected controller: DocController
    ) {}
    private generateFlatsTitle(point: IPoint): IPdfBrick {
        let question: Question = this.getQuestion<Question>();
        this.controller.fontStyle = 'bold';
        let number: string = question.no != '' ? question.no + ' . ' : '';
        let rect: IRect = this.measureTextRect(point,
            number + this.getLocString(question.locTitle));
        this.controller.fontStyle = 'normal';
        return new TitleBrick(this.question, this.controller, rect);
    }
    private generateFlatsDescription(point: IPoint): IPdfBrick {
        let question: Question = this.getQuestion<Question>();
        if (question.description == '') return null;
        let oldFontSize: number = this.controller.fontSize;
        this.controller.fontSize = oldFontSize *
            FlatQuestion.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        let rect: IRect = this.measureTextRect(point,
            this.getLocString(question.locDescription));
        this.controller.fontSize = oldFontSize;
        return new DescriptionBrick(this.question, this.controller, rect);
    }
    private generateFlatsComment(point: IPoint): IPdfBrick {
        let question: Question = this.getQuestion<Question>();
        let rectText: IRect = this.measureTextRect(point,
            this.getLocString(question.locCommentText));
        let rectTextField: IRect = this.measureTextFieldRect(point, 3);
        let rect: IRect = this.mergeRects(rectText, rectTextField);
        return new CommentBrick(this.question, this.controller,
            rect, rectTextField, rectText);
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        return null;
    }
    generateFlats(point: IPoint): IPdfBrick[] {
        return null;
    }
    measureTextRect(point: IPoint, text: string): IRect {
        let { width, height } = this.controller.measureText(text);
        return this.createRect(point, width, height);
    }
    measureTextFieldRect(point: IPoint, lines: number = 1): IRect {
        let question: QuestionTextModel = this.getQuestion<QuestionTextModel>();
        let width: number = this.controller.paperWidth - point.xLeft -
            this.controller.margins.marginRight;
        let height: number = this.controller.measureText(question.title).height * lines;
        return this.createRect(point, width, height);   
    }
    mergeRects(...rects: IRect[]): IRect {
        let resultRect: IRect = {
            xLeft: rects[0].xLeft,
            xRight: rects[0].xRight,
            yTop: rects[0].yTop,
            yBot: rects[0].yBot
        };
        rects.forEach((rect: IRect) => {
            resultRect.xLeft = Math.min(resultRect.xLeft, rect.xLeft),
            resultRect.xRight = Math.max(resultRect.xRight, rect.xRight),
            resultRect.yTop = Math.min(resultRect.yTop, rect.yTop),
            resultRect.yBot = Math.min(resultRect.yBot, rect.yBot)
        });
        return resultRect;
    }
    createRect(point: IPoint, width: number, height: number): IRect {
        return {
            xLeft: point.xLeft,
            xRight: point.xLeft + width,
            yTop: point.yTop,
            yBot: point.yTop + height
        };
    }
    getLocString(locObj: LocalizableString): string {
        return locObj.renderedHtml;
    }
    getQuestion<T extends IQuestion>(): T {
        return <T>this.question;
    }
}