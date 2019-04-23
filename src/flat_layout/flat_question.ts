import { IPoint, IRect, DocController } from "../doc_controller";
import { IQuestion, Question } from 'survey-core';
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { TextBrick } from '../pdf_render/pdf_text';
import { TitleBrick } from '../pdf_render/pdf_title';
import { DescriptionBrick } from '../pdf_render/pdf_description';
import { CommentBrick } from '../pdf_render/pdf_comment';
import { SurveyHelper } from '../helper_survey';
import { ComposeBrick } from '../pdf_render/pdf_compose';

export interface IFlatQuestion {
    generateFlatsContent(point: IPoint): IPdfBrick[];
    generateFlats(point: IPoint): IPdfBrick[];
}

export class FlatQuestion implements IFlatQuestion {
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
        let rect: IRect = SurveyHelper.createDescRect(point, this.controller,
            SurveyHelper.getLocString(this.question.locDescription));
        return new DescriptionBrick(this.question, this.controller, rect, this.question.description);
    }
    private generateFlatsComment(point: IPoint): IPdfBrick[] {
        let commentText: string = SurveyHelper.getLocString(this.question.locCommentText);
        let rectText: IRect = SurveyHelper.createTextRect(point, this.controller, commentText);
        let rectTextField: IRect = SurveyHelper.createTextFieldRect(
            SurveyHelper.createPoint(rectText), this.controller, 2);
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
        let commentPoint: IPoint = indentPoint;
        switch (this.question.titleLocation) {
            case 'top':
            case 'default': {
                let titleFlat: IPdfBrick = this.generateFlatTitle(indentPoint);
                let composeFlat: ComposeBrick = new ComposeBrick(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let contentPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                if (descFlat !== null) {
                    composeFlat.addBrick(descFlat);
                    contentPoint = SurveyHelper.createPoint(descFlat);
                }
                let contentFlats = this.generateFlatsContent(contentPoint);
                if (contentFlats.length != 0) {
                    composeFlat.addBrick(contentFlats.shift());
                }
                flats.push(composeFlat);
                flats.push(...contentFlats);
                commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flats));
                break;
            }
            case 'bottom': {
                let contentFlats: IPdfBrick[] = this.generateFlatsContent(indentPoint);
                flats.push(...contentFlats);
                if (contentFlats.length != 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...contentFlats));
                }
                if (this.question.hasComment) {
                    flats.push(...this.generateFlatsComment(commentPoint));
                }
                let titlePoint: IPoint = indentPoint;
                if (contentFlats.length != 0) {
                    titlePoint = SurveyHelper.createPoint(flats[flats.length - 1]);
                }
                let titleFlat: IPdfBrick = this.generateFlatTitle(titlePoint);
                let composeFlat: ComposeBrick = new ComposeBrick(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                if (descFlat !== null) { composeFlat.addBrick(descFlat); }
                flats.push(composeFlat);
                break;
            }
            case 'left': {
                let titleFlat: IPdfBrick = this.generateFlatTitle(indentPoint);
                let composeFlat: ComposeBrick = new ComposeBrick(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                let contentPoint: IPoint = SurveyHelper.createPoint(titleFlat, false, true);
                if (descFlat !== null) {
                    composeFlat.addBrick(descFlat);
                    contentPoint.xLeft = Math.max(contentPoint.xLeft, descFlat.xRight);
                }
                flats.push(composeFlat);
                commentPoint.xLeft = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flats), false, true).xLeft;
                let contentFlats = this.generateFlatsContent(contentPoint);
                if (contentFlats.length != 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...contentFlats));
                }
                flats.push(...contentFlats);
                break;
            }
            case 'hidden': {
                flats.push(...this.generateFlatsContent(indentPoint));
                if (flats.length != 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flats));
                }
                break;
            }
        }
        if (this.question.hasComment && this.question.titleLocation != 'bottom') {
            flats.push(...this.generateFlatsComment(commentPoint));
        }
        this.controller.margins.marginLeft = oldMarginLeft;
        return flats;
    }
    //TO REVIEW
    getQuestion<T extends Question>(): T {
        return <T>this.question;
    }
}