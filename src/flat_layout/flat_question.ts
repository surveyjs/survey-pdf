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
    public static CONTENT_GAP_VERT_SCALE: number = 0.5;
    public static CONTENT_GAP_HOR_SCALE: number = 1.0;
    public static CONTENT_INDENT_SCALE: number = 1.0;
    public static DESC_GAP_SCALE: number = 0.0625;
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
        return await SurveyHelper.createDescFlat(point, this.question, this.controller, this.question.locDescription);
    }
    private async generateFlatHeader(point: IPoint): Promise<CompositeBrick> {
        const titleFlat: IPdfBrick = await this.generateFlatTitle(point);
        const compositeFlat: CompositeBrick = new CompositeBrick(titleFlat);
        if(this.question.hasDescriptionUnderTitle) {
            const descPoint: IPoint = SurveyHelper.createPoint(titleFlat, true, false);
            descPoint.yTop += FlatQuestion.DESC_GAP_SCALE * this.controller.unitHeight;
            descPoint.xLeft += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
            compositeFlat.addBrick(await this.generateFlatDescription(descPoint));
        }
        return compositeFlat;
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
    public async generateFlatsContentWithOptionalElements(point: IPoint): Promise<IPdfBrick[]> {
        const flats: Array<IPdfBrick> = [];
        const contentFlats = await this.generateFlatsComposite(point);
        flats.push(...contentFlats);
        const getLatestPoint = (): IPoint => {
            const res = SurveyHelper.clone(point);
            if(contentFlats !== null && contentFlats.length !== 0) {
                res.yTop = SurveyHelper.mergeRects(...flats).yBot + this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
            }
            return res;
        };
        if (this.question.hasComment) {
            flats.push(await this.generateFlatsComment(getLatestPoint()));
        }
        if (this.question.hasDescriptionUnderInput) {
            flats.push(await this.generateFlatDescription(getLatestPoint()));
        }

        return flats;
    }
    public async generateFlats(point: IPoint): Promise<IPdfBrick[]> {
        this.controller.pushMargins();
        this.controller.margins.left += this.controller.measureText(this.question.indent).width;
        const indentPoint: IPoint = {
            xLeft: point.xLeft + this.controller.measureText(this.question.indent).width,
            yTop: point.yTop
        };
        const flats: IPdfBrick[] = [];
        let titleLocation: string = this.question.getTitleLocation();
        titleLocation = this.question.hasTitle ? titleLocation : 'hidden';
        switch (titleLocation) {
            case 'top':
            case 'default': {
                const headerFlat = await this.generateFlatHeader(indentPoint);
                let contentPoint: IPoint = SurveyHelper.createPoint(headerFlat);
                contentPoint.xLeft += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                headerFlat.addBrick(SurveyHelper.createRowlineFlat(
                    SurveyHelper.createPoint(headerFlat), this.controller));
                contentPoint.yTop += this.controller.unitHeight *
                    FlatQuestion.CONTENT_GAP_VERT_SCALE + SurveyHelper.EPSILON;
                this.controller.pushMargins();
                this.controller.margins.left += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                const contentFlats: IPdfBrick[] = await this.generateFlatsContentWithOptionalElements(contentPoint);
                this.controller.popMargins();
                if(contentFlats !== null && contentFlats.length !== 0) {
                    headerFlat.addBrick(contentFlats.shift());
                }
                flats.push(headerFlat);
                flats.push(...contentFlats);
                break;
            }
            case 'bottom': {
                const contentPoint: IPoint = SurveyHelper.clone(indentPoint);
                this.controller.pushMargins();
                contentPoint.xLeft += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                this.controller.margins.left += this.controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
                const contentFlats: IPdfBrick[] = await this.generateFlatsContentWithOptionalElements(contentPoint);
                this.controller.popMargins();
                flats.push(...contentFlats);
                const titlePoint: IPoint = indentPoint;
                if (flats.length !== 0) {
                    titlePoint.yTop = flats[flats.length - 1].yBot;
                }
                titlePoint.yTop += this.controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
                flats.push(await this.generateFlatHeader(titlePoint));
                break;
            }
            case 'left': {
                this.controller.pushMargins(this.controller.margins.left,
                    this.controller.paperWidth - this.controller.margins.left -
                        SurveyHelper.getPageAvailableWidth(this.controller) *
                            SurveyHelper.MULTIPLETEXT_TEXT_PERS);
                const headerFlat: CompositeBrick = await this.generateFlatHeader(indentPoint);
                const contentPoint: IPoint = SurveyHelper.createPoint(headerFlat, false, true);
                this.controller.popMargins();
                contentPoint.xLeft += this.controller.unitWidth * FlatQuestion.CONTENT_GAP_HOR_SCALE;
                this.controller.margins.left = contentPoint.xLeft;
                const contentFlats: IPdfBrick[] = await this.generateFlatsContentWithOptionalElements(contentPoint);
                if(contentFlats !== null && contentFlats.length !== 0) {
                    headerFlat.addBrick(contentFlats.shift());
                }
                flats.push(headerFlat);
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
                flats.push(...await this.generateFlatsContentWithOptionalElements(contentPoint));
                this.controller.popMargins();
                break;
            }
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
    choices: ['auto', 'text', 'acroform'],
    visible: false
});