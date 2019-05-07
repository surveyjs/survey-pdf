import { IPoint, IRect, DocController } from "../doc_controller";
import { IQuestion, Question } from 'survey-core';
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { TextBrick } from '../pdf_render/pdf_text';
import { CommentBrick } from '../pdf_render/pdf_comment';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

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
        return SurveyHelper.createTitleFlat(point,
            this.question, this.controller)
    }
    private generateFlatDescription(point: IPoint): IPdfBrick {
        let text: string = SurveyHelper.getLocString(this.question.locDescription);
        if (text == '') return null;
        return SurveyHelper.createDescFlat(point, this.question, this.controller, text);
    }
    private generateFlatsComment(point: IPoint): IPdfBrick {
        let text: string = SurveyHelper.getLocString(this.question.locCommentText);
        let compositeText: IPdfBrick = SurveyHelper.createTextFlat(
            point, this.question, this.controller, text, TextBrick);
        let rectTextField: IRect = SurveyHelper.createTextFieldRect(
            SurveyHelper.createPoint(compositeText), this.controller, 2);
        return new CompositeBrick(compositeText,
            new CommentBrick(this.question, this.controller, rectTextField, false));
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        return null;
    }
    generateFlats(point: IPoint): IPdfBrick[] {
        let oldMarginLeft: number = this.controller.margins.marginLeft;
        this.controller.margins.marginLeft += SurveyHelper.measureText(this.question.indent).width;
        let indentPoint: IPoint = {
            xLeft: point.xLeft + SurveyHelper.measureText(this.question.indent).width,
            yTop: point.yTop
        };
        let flats: IPdfBrick[] = new Array();
        let commentPoint: IPoint = indentPoint;
        let titleLocation: string = this.question.getTitleLocation();
        titleLocation = this.question.hasTitle ? titleLocation : 'hidden';
        switch (titleLocation) {
            case 'top':
            case 'default': {
                let titleFlat: IPdfBrick = this.generateFlatTitle(indentPoint);
                let compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let contentPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                if (descFlat !== null) {
                    compositeFlat.addBrick(descFlat);
                    contentPoint = SurveyHelper.createPoint(descFlat);
                }
                let contentFlats = this.generateFlatsContent(contentPoint);
                if (contentFlats.length != 0) {
                    compositeFlat.addBrick(contentFlats.shift());
                }
                flats.push(compositeFlat);
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
                    flats.push(this.generateFlatsComment(commentPoint));
                }
                let titlePoint: IPoint = indentPoint;
                if (contentFlats.length != 0) {
                    titlePoint = SurveyHelper.createPoint(flats[flats.length - 1]);
                }
                let titleFlat: IPdfBrick = this.generateFlatTitle(titlePoint);
                let compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                if (descFlat !== null) { compositeFlat.addBrick(descFlat); }
                flats.push(compositeFlat);
                break;
            }
            case 'left': {
                let titleFlat: IPdfBrick = this.generateFlatTitle(indentPoint);
                let compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = this.generateFlatDescription(descPoint);
                let contentPoint: IPoint = SurveyHelper.createPoint(titleFlat, false, true);
                if (descFlat !== null) {
                    compositeFlat.addBrick(descFlat);
                    contentPoint.xLeft = Math.max(contentPoint.xLeft, descFlat.xRight);
                }
                commentPoint.xLeft = SurveyHelper.createPoint(compositeFlat, false, true).xLeft;
                let contentFlats = this.generateFlatsContent(contentPoint);
                if (contentFlats.length != 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...contentFlats));
                    compositeFlat.addBrick(contentFlats.shift());
                }
                flats.push(compositeFlat);
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
            flats.push(this.generateFlatsComment(commentPoint));
        }
        this.controller.margins.marginLeft = oldMarginLeft;
        return flats;
    }
    //TO REVIEW
    getQuestion<T extends Question>(): T {
        return <T>this.question;
    }
}