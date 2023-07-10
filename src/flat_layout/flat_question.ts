import { IQuestion, Question, LocalizableString, Serializer } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatSurvey } from './flat_survey';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export interface IFlatQuestion {
    generateFlatsContent(point: IPoint): Promise<IPdfBrick[]>;
    generateFlats(point: IPoint): Promise<IPdfBrick[]>;
}
export class FlatQuestion implements IFlatQuestion {
    public static readonly CONTENT_GAP_VERT_SCALE: number = 0.5;
    public static readonly CONTENT_GAP_HOR_SCALE: number = 1.0;
    public static readonly CONTENT_INDENT_SCALE: number = 1.0;
    public static readonly DESC_GAP_SCALE: number = 0.0625;
    protected question: Question;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, protected controller: DocController) {
        this.question = <Question>question;
    }
    private async generateFlatTitle(point: IPoint): Promise<IPdfBrick> {
        return await SurveyHelper.createTitleFlat(point,
            this.question, this.controller);
    }
    private async generateFlatDescription(point: IPoint): Promise<IPdfBrick> {
        const descPoint: IPoint = SurveyHelper.clone(point);
        descPoint.xLeft += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
        descPoint.yTop += FlatQuestion.DESC_GAP_SCALE * this.controller.unitHeight;
        const text: LocalizableString = this.question.locDescription;
        return await SurveyHelper.createDescFlat(descPoint, this.question, this.controller, text);
    }
    private async generateFlatsComment(point: IPoint): Promise<IPdfBrick> {
        const text: LocalizableString = this.question.locCommentText;
        const otherTextFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            point, this.question, this.controller, text, TextBrick);
        const otherPoint: IPoint = SurveyHelper.createPoint(otherTextFlat);
        otherPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
        return new CompositeBrick(otherTextFlat, await SurveyHelper.createCommentFlat(
            otherPoint, this.question, this.controller, false, { rows: SurveyHelper.OTHER_ROWS_COUNT }));
    }
    public async generateFlatsComposite(point: IPoint): Promise<IPdfBrick[]> {
        const contentPanel = (<any>this.question).contentPanel;
        if (!!contentPanel) {
            return await FlatSurvey.generateFlatsPanel(this.survey,
                this.controller, contentPanel, point);
        }
        this.question = SurveyHelper.getContentQuestion(this.question);
        return await this.generateFlatsContent(point);
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        return null;
    }
    public async generateFlats(point: IPoint): Promise<IPdfBrick[]> {
        this.controller.pushMargins();
        this.controller.margins.left += this.controller.measureText(this.question.indent).width;
        const indentPoint: IPoint = {
            xLeft: point.xLeft + this.controller.measureText(this.question.indent).width,
            yTop: point.yTop
        };
        const flats: IPdfBrick[] = [];
        let commentPoint: IPoint = indentPoint;
        let titleLocation: string = this.question.getTitleLocation();
        titleLocation = this.question.hasTitle ? titleLocation : 'hidden';
        const isDesc = !!SurveyHelper.getLocString(this.question.locDescription);
        switch (titleLocation) {
            case 'top':
            case 'default': {
                const titleFlat: IPdfBrick = await this.generateFlatTitle(indentPoint);
                const compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
                let contentPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
                if (isDesc) {
                    const descFlat: IPdfBrick = await this.generateFlatDescription(
                        SurveyHelper.createPoint(titleFlat));
                    compositeFlat.addBrick(descFlat);
                    contentPoint = SurveyHelper.createPoint(descFlat);
                }
                else contentPoint.xLeft += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                compositeFlat.addBrick(SurveyHelper.createRowlineFlat(
                    SurveyHelper.createPoint(compositeFlat), this.controller));
                contentPoint.yTop += this.controller.unitHeight *
                    FlatQuestion.CONTENT_GAP_VERT_SCALE + SurveyHelper.EPSILON;
                commentPoint = contentPoint;
                this.controller.pushMargins();
                this.controller.margins.left += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                const contentFlats: IPdfBrick[] = await this.generateFlatsComposite(contentPoint);
                this.controller.popMargins();
                if (contentFlats !== null && contentFlats.length !== 0) {
                    commentPoint.yTop = SurveyHelper.mergeRects(...contentFlats).yBot +
                        this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
                    compositeFlat.addBrick(contentFlats.shift());
                }
                flats.push(compositeFlat);
                flats.push(...contentFlats);
                break;
            }
            case 'bottom': {
                const contentPoint: IPoint = SurveyHelper.clone(indentPoint);
                this.controller.pushMargins();
                contentPoint.xLeft += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                this.controller.margins.left += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                commentPoint = contentPoint;
                const contentFlats: IPdfBrick[] = await this.generateFlatsComposite(contentPoint);
                this.controller.popMargins();
                flats.push(...contentFlats);
                if (contentFlats !== null && contentFlats.length != 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...contentFlats));
                    commentPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
                }
                if (this.question.hasComment) {
                    flats.push(await this.generateFlatsComment(commentPoint));
                }
                const titlePoint: IPoint = indentPoint;
                if (flats.length !== 0) {
                    titlePoint.yTop = flats[flats.length - 1].yBot;
                }
                titlePoint.yTop += this.controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
                const titleFlat: IPdfBrick = await this.generateFlatTitle(titlePoint);
                const compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
                if (isDesc) {
                    const descFlat: IPdfBrick = await this.generateFlatDescription(
                        SurveyHelper.createPoint(titleFlat));
                    compositeFlat.addBrick(descFlat);
                }
                flats.push(compositeFlat);
                break;
            }
            case 'left': {
                this.controller.pushMargins(this.controller.margins.left,
                    this.controller.paperWidth - this.controller.margins.left -
                        SurveyHelper.getPageAvailableWidth(this.controller) *
                            SurveyHelper.MULTIPLETEXT_TEXT_PERS);
                const titleFlat: IPdfBrick = await this.generateFlatTitle(indentPoint);
                const compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
                const contentPoint: IPoint = SurveyHelper.createPoint(titleFlat, false, true);
                if (isDesc) {
                    const descFlat: IPdfBrick = await this.generateFlatDescription(
                        SurveyHelper.createPoint(titleFlat));
                    compositeFlat.addBrick(descFlat);
                    contentPoint.xLeft = Math.max(contentPoint.xLeft, descFlat.xRight);
                }
                this.controller.popMargins();
                contentPoint.xLeft += this.controller.unitWidth * FlatQuestion.CONTENT_GAP_HOR_SCALE;
                this.controller.margins.left = contentPoint.xLeft;
                commentPoint.xLeft = contentPoint.xLeft;
                const contentFlats: IPdfBrick[] = await this.generateFlatsComposite(contentPoint);
                if (contentFlats !== null && contentFlats.length != 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...contentFlats));
                    commentPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
                    compositeFlat.addBrick(contentFlats.shift());
                }
                flats.push(compositeFlat);
                flats.push(...contentFlats);
                break;
            }
            case 'hidden':
            case SurveyHelper.TITLE_LOCATION_MATRIX:
            default: {
                const contentPoint: IPoint = SurveyHelper.clone(indentPoint);
                this.controller.pushMargins();
                if (titleLocation !== SurveyHelper.TITLE_LOCATION_MATRIX) {
                    contentPoint.xLeft += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                    this.controller.margins.left += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                }
                commentPoint = contentPoint;
                flats.push(...await this.generateFlatsComposite(contentPoint));
                this.controller.popMargins();
                if (flats !== null && flats.length !== 0) {
                    commentPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flats));
                    commentPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
                }
                break;
            }
        }
        if (this.question.hasComment && this.question.titleLocation !== 'bottom') {
            flats.push(await this.generateFlatsComment(commentPoint));
        }
        this.controller.popMargins();
        return flats;
    }
    protected get shouldRenderAsComment(): boolean {
        return SurveyHelper.shouldRenderReadOnly(this.question, this.controller);
    }
}

Serializer.addProperty('question', {
    name: 'readonlyRenderAs',
    default: 'auto',
    choices: ['auto', 'text', 'acroform']
});