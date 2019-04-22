import { IPoint, IRect, DocController } from "../doc_controller";
import { IQuestion, Question } from 'survey-core';
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { TextBrick } from '../pdf_render/pdf_text';
import { TitleBrick } from '../pdf_render/pdf_title';
import { DescriptionBrick } from '../pdf_render/pdf_description';
import { CommentBrick } from '../pdf_render/pdf_comment';
import { SurveyHelper } from '../helper_survey';

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
        let text: string = SurveyHelper.getTitleText(this.question);
        let rect: IRect = SurveyHelper.createTextRect(point, this.controller, text);
        this.controller.fontStyle = 'normal';
        return new TitleBrick(this.question, this.controller, rect, text);
    }
    private generateFlatDescription(point: IPoint): IPdfBrick {
        if (SurveyHelper.getLocString(this.question.locDescription) == '') return null;
        let oldFontSize: number = this.controller.fontSize;
        this.controller.fontSize = oldFontSize *
            FlatQuestion.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        let rect: IRect = SurveyHelper.createTextRect(point, this.controller,
            SurveyHelper.getLocString(this.question.locDescription));
        this.controller.fontSize = oldFontSize;
        return new DescriptionBrick(this.question, this.controller, rect);
    }
    private generateFlatsComment(point: IPoint): IPdfBrick[] {
        let commentText: string = SurveyHelper.getLocString(this.question.locCommentText);
        let rectText: IRect = SurveyHelper.createTextRect(point, this.controller, commentText);
        let rectTextField: IRect = SurveyHelper.createTextFieldRect(point, this.controller, 2);
        return [new TextBrick(this.question, this.controller, rectText, commentText),
            new CommentBrick(this.question, this.controller, rectTextField, false)];
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
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let contentPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                if (descFlat !== null) {
                    flats.push(descFlat);
                    contentPoint = SurveyHelper.createPoint(descFlat);
                }
                flats.push(...this.generateFlatsContent(contentPoint));
                break;
            }
            case 'bottom': {
                let contentFlats: IPdfBrick[] = this.generateFlatsContent(indentPoint);
                flats.push(...contentFlats);
                let titlePoint: IPoint = SurveyHelper.createPoint(contentFlats[contentFlats.length - 1]);
                let titleFlat: IPdfBrick = this.generateFlatTitle(titlePoint);
                flats.push(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                if (descFlat !== null) flats.push(descFlat);
                break;
            }
            case 'left': {
                let titleFlat: IPdfBrick = this.generateFlatTitle(indentPoint);
                flats.push(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                let contentPoint: IPoint = SurveyHelper.createPoint(titleFlat, false, true);
                if (descFlat !== null) {
                    flats.push(descFlat);
                    contentPoint.xLeft = Math.max(contentPoint.xLeft, descFlat.xRight);
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
            flats.push(...this.generateFlatsComment(SurveyHelper.createPoint(flats[flats.length - 1])));
        }
        this.controller.margins.marginLeft = oldMarginLeft;
        return flats;
    }
    getQuestion<T extends Question>(): T {
        return <T>this.question;
    }
}