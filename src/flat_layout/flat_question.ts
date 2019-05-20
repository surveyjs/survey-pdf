import { IPoint, IRect, DocController } from "../doc_controller";
import { IQuestion, Question } from 'survey-core';
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { CommentBrick } from '../pdf_render/pdf_comment';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export interface IFlatQuestion {
    generateFlatsContent(point: IPoint): Promise<IPdfBrick[]>;
    generateFlats(point: IPoint): Promise<IPdfBrick[]>;
}

export class FlatQuestion implements IFlatQuestion {
    protected question: Question;
    constructor(question: IQuestion, protected controller: DocController) {
        this.question = <Question>question;
    }

    private async  generateFlatTitle(point: IPoint): Promise<IPdfBrick> {
        return await SurveyHelper.createTitleFlat(point,
            this.question, this.controller)
    }
    private async generateFlatDescription(point: IPoint): Promise<IPdfBrick> {
        let text: string = SurveyHelper.getLocString(this.question.locDescription);
        if (text == '') return null;
        return await SurveyHelper.createDescFlat(point, this.question, this.controller, text);
    }
    private async generateFlatsComment(point: IPoint): Promise<IPdfBrick> {
        let text: string = SurveyHelper.getLocString(this.question.locCommentText);
        let compositeText: IPdfBrick = await SurveyHelper.createTextFlat(
            point, this.question, this.controller, text);
        let rectTextField: IRect = SurveyHelper.createTextFieldRect(
            SurveyHelper.createPoint(compositeText), this.controller, 2);
        return new CompositeBrick(compositeText,
            new CommentBrick(this.question, this.controller, rectTextField, false));
    }
    async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return null;
    }
    async generateFlats(point: IPoint): Promise<IPdfBrick[]> {
        let oldMarginLeft: number = this.controller.margins.left;
        this.controller.margins.left += SurveyHelper.measureText(this.question.indent).width;
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
                let titleFlat: IPdfBrick = await this.generateFlatTitle(indentPoint);
                let compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let contentPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = await this.generateFlatDescription(descPoint);
                if (descFlat !== null) {
                    compositeFlat.addBrick(descFlat);
                    contentPoint = SurveyHelper.createPoint(descFlat);
                }
                let contentFlats = await this.generateFlatsContent(contentPoint);
                if (contentFlats.length != 0) {
                    compositeFlat.addBrick(contentFlats.shift());
                }
                flats.push(compositeFlat);
                flats.push(...contentFlats);
                commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flats));
                break;
            }
            case 'bottom': {
                let contentFlats: IPdfBrick[] = await this.generateFlatsContent(indentPoint);
                flats.push(...contentFlats);
                if (contentFlats.length != 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...contentFlats));
                }
                if (this.question.hasComment) {
                    flats.push(await this.generateFlatsComment(commentPoint));
                }
                let titlePoint: IPoint = indentPoint;
                if (contentFlats.length != 0) {
                    titlePoint = SurveyHelper.createPoint(flats[flats.length - 1]);
                }
                let titleFlat: IPdfBrick = await this.generateFlatTitle(titlePoint);
                let compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = await this.generateFlatDescription(descPoint);
                if (descFlat !== null) { compositeFlat.addBrick(descFlat); }
                flats.push(compositeFlat);
                break;
            }
            case 'left': {
                let titleFlat: IPdfBrick = await this.generateFlatTitle(indentPoint);
                let compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
                let descPoint: IPoint = SurveyHelper.createPoint(titleFlat);
                let descFlat: IPdfBrick = await this.generateFlatDescription(descPoint);
                let contentPoint: IPoint = SurveyHelper.createPoint(titleFlat, false, true);
                if (descFlat !== null) {
                    compositeFlat.addBrick(descFlat);
                    contentPoint.xLeft = Math.max(contentPoint.xLeft, descFlat.xRight);
                }
                commentPoint.xLeft = SurveyHelper.createPoint(compositeFlat, false, true).xLeft;
                let contentFlats = await this.generateFlatsContent(contentPoint);
                if (contentFlats.length != 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...contentFlats));
                    compositeFlat.addBrick(contentFlats.shift());
                }
                flats.push(compositeFlat);
                flats.push(...contentFlats);
                break;
            }
            case 'hidden': {
                flats.push(...await this.generateFlatsContent(indentPoint));
                if (flats.length != 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flats));
                }
                break;
            }
        }
        if (this.question.hasComment && this.question.titleLocation != 'bottom') {
            flats.push(await this.generateFlatsComment(commentPoint));
        }
        this.controller.margins.left = oldMarginLeft;
        return flats;
    }
    //TO REVIEW
    getQuestion<T extends Question>(): T {
        return <T>this.question;
    }
}