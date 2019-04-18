import { IPoint, IRect, DocController } from "../doc_controller";
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
    protected question: Question;
    constructor(question: IQuestion, protected controller: DocController) {
        this.question = <Question>question;
    }
    private generateFlatTitle(point: IPoint): IPdfBrick {
        this.controller.fontStyle = 'bold';
        let number: string = this.question.no != '' ? this.question.no + ' . ' : '';
        let rect: IRect = this.measureTextRect(point,
            number + this.getLocString(this.question.locTitle));
        this.controller.fontStyle = 'normal';
        return new TitleBrick(this.question, this.controller, rect);
    }
    private generateFlatDescription(point: IPoint): IPdfBrick {
        if (this.getLocString(this.question.locDescription) == '') return null;
        let oldFontSize: number = this.controller.fontSize;
        this.controller.fontSize = oldFontSize *
            FlatQuestion.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        let rect: IRect = this.measureTextRect(point,
            this.getLocString(this.question.locDescription));
        this.controller.fontSize = oldFontSize;
        return new DescriptionBrick(this.question, this.controller, rect);
    }
    private generateFlatComment(point: IPoint): IPdfBrick {
        let rectText: IRect = this.measureTextRect(point,
            this.getLocString(this.question.locCommentText));
        let rectTextField: IRect = this.measureTextFieldRect(point, 3);
        let rect: IRect = this.mergeRects(rectText, rectTextField);
        return new CommentBrick(this.question, this.controller,
            rect, rectTextField, rectText);
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        return null;
    }
    generateFlats(point: IPoint): IPdfBrick[] {
        let oldMarginLeft: number = this.controller.margins.marginLeft;
        this.controller.margins.marginLeft += this.controller.measureText(this.question.indent).width;
        let indentPoint: IPoint = {
            xLeft: point.xLeft + this.controller.measureText(this.question.indent).width,
            yTop: point.yTop
        };
        let flats: IPdfBrick[] = new Array();
        switch (this.question.titleLocation) {
            case 'top':
            case 'default': {
                let titleFlat: IPdfBrick = this.generateFlatTitle(indentPoint);
                flats.push(titleFlat);
                let descPoint: IPoint = this.createPoint(titleFlat);
                let contentPoint: IPoint = this.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                if (descFlat !== null) {
                    flats.push(descFlat);
                    contentPoint = this.createPoint(descFlat);
                }
                flats.push(...this.generateFlatsContent(contentPoint));
                break;
            }
            case 'bottom': {
                let contentFlats: IPdfBrick[] = this.generateFlatsContent(indentPoint);
                flats.push(...contentFlats);
                let titlePoint: IPoint = this.createPoint(contentFlats[contentFlats.length - 1]);
                let titleFlat: IPdfBrick = this.generateFlatTitle(titlePoint);
                flats.push(titleFlat);
                let descPoint: IPoint = this.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                if (descFlat !== null) flats.push(descFlat);
                break;
            }
            case 'left': {
                let titleFlat: IPdfBrick = this.generateFlatTitle(indentPoint);
                flats.push(titleFlat);
                let descPoint: IPoint = this.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                let contentPoint: IPoint = this.createPoint(titleFlat, false);
                if (descFlat !== null) {
                    flats.push(descFlat);
                    contentPoint.xLeft = Math.max(contentPoint.xLeft,
                        (<PdfBrick>descFlat).rect.xRight);
                }
                flats.push(...this.generateFlatsContent(contentPoint));
                break;
            }
            case 'hidden': {
                flats.push(...this.generateFlatsContent(indentPoint));
                break;
            }
        }
        if (this.question.hasComment) {
            flats.push(this.generateFlatComment(this.createPoint(flats[flats.length - 1])));
        }
        this.controller.margins.marginLeft = oldMarginLeft;
        return flats;
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
                resultRect.yBot = Math.max(resultRect.yBot, rect.yBot)
        });
        return resultRect;
    }
    createPoint(flat: IPdfBrick | IRect, isLeft: boolean = true, isTop: boolean = false): IPoint {
        let rect: IRect = flat instanceof PdfBrick ? (<PdfBrick>flat).rect : <IRect>flat;
        return {
            xLeft: isLeft ? rect.xLeft : rect.xRight,
            yTop: isTop ? rect.yTop : rect.yBot
        };
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
    getQuestion<T extends Question>(): T {
        return <T>this.question;
    }
}