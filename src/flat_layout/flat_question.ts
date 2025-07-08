import { IQuestion, Question, LocalizableString, Serializer, settings } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { TextBrick } from '../pdf_render/pdf_text';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { AdornersOptions } from '../event_handler/adorners';
import { FlatRepository } from './flat_repository';
import { FlatPanel } from './flat_panel';
import { IStyles } from '../styles';

export interface IFlatQuestion {
    generateFlatsContent(point: IPoint): Promise<IPdfBrick[]>;
    generateFlats(point: IPoint): Promise<IPdfBrick[]>;
}
export class FlatQuestion<T extends Question = Question> implements IFlatQuestion {
    public static CONTENT_GAP_VERT_SCALE: number = 0.5;
    public static CONTENT_GAP_HOR_SCALE: number = 1.0;
    public static CONTENT_INDENT_SCALE: number = 1.0;
    public static DESC_GAP_SCALE: number = 0.0625;
    public constructor(protected survey: SurveyPDF,
        protected question: T, protected controller: DocController, protected styles: IStyles) {
    }
    private async generateFlatTitle(point: IPoint): Promise<IPdfBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        let currPoint: IPoint = SurveyHelper.clone(point);
        const oldFontSize: number = this.controller.fontSize;
        this.controller.fontSize *= SurveyHelper.TITLE_FONT_SCALE;
        if (this.question.no) {
            const noText: string = this.question.no + ' ';
            let noFlat: IPdfBrick;
            if (SurveyHelper.hasHtml(this.question.locTitle)) {
                // controller.fontStyle = 'bold'; TODO
                this.controller.pushMargins();
                this.controller.margins.right = this.controller.paperWidth -
                        this.controller.margins.left - this.controller.measureText(noText, 'bold').width;
                noFlat = await SurveyHelper.createHTMLFlat(currPoint, this.question, this.controller,
                    SurveyHelper.createHtmlContainerBlock(noText, this.controller, 'standard'));
                this.controller.popMargins();
                // controller.fontStyle = 'normal'; TODO
            }
            else {
                noFlat = await SurveyHelper.createTextFlat(currPoint,
                    this.question, this.controller, noText, {
                        fontStyle: 'bold'
                    });
            }
            composite.addBrick(noFlat);
            currPoint.xLeft = noFlat.xRight;
        }
        this.controller.pushMargins();
        this.controller.margins.left = currPoint.xLeft;
        const textFlat: CompositeBrick = <CompositeBrick>await SurveyHelper.createTextFlat(
            currPoint, this.question, this.controller, this.question.locTitle, {
                fontStyle: 'bold'
            });
        composite.addBrick(textFlat);
        this.controller.popMargins();
        if (this.question.isRequired) {
            const requiredText: string = this.question.requiredText;
            if (SurveyHelper.hasHtml(this.question.locTitle)) {
                currPoint = SurveyHelper.createPoint(textFlat.unfold()[0], false, false);
                this.controller.fontStyle = 'bold';
                this.controller.pushMargins();
                this.controller.margins.right = this.controller.paperWidth -
                        this.controller.margins.left - this.controller.measureText(requiredText, 'bold').width;
                composite.addBrick(await SurveyHelper.createHTMLFlat(currPoint, this.question, this.controller,
                    SurveyHelper.createHtmlContainerBlock(requiredText, this.controller, 'standard')));
                this.controller.popMargins();
                this.controller.fontStyle = 'normal';
            }
            else {
                currPoint = SurveyHelper.createPoint(textFlat.unfold().pop(), false, true);
                composite.addBrick(await SurveyHelper.createTextFlat(currPoint,
                    this.question, this.controller, requiredText, {
                        fontStyle: 'bold'
                    }));
            }
        }
        this.controller.fontSize = oldFontSize;
        return composite;
    }
    private async generateFlatDescription(point: IPoint): Promise<IPdfBrick> {
        return await SurveyHelper.createTextFlat(point, this.question, this.controller, this.question.locDescription, { fontSize: this.controller.fontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE });
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
            point, this.question, this.controller, text);
        const otherPoint: IPoint = SurveyHelper.createPoint(otherTextFlat);
        otherPoint.yTop += this.controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
        return new CompositeBrick(otherTextFlat, await SurveyHelper.createCommentFlat(
            otherPoint, this.question, this.controller, {
                fieldName: this.question.id + '_comment',
                rows: SurveyHelper.OTHER_ROWS_COUNT,
                value: this.question.comment !== undefined && this.question.comment !== null ? this.question.comment : '',
                shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                isReadOnly: this.question.isReadOnly,
                isMultiline: true,
                placeholder: ''
            }));
    }
    public async generateFlatsComposite(point: IPoint): Promise<IPdfBrick[]> {
        const contentPanel = (<any>this.question).contentPanel;
        if (!!contentPanel) {
            return await new FlatPanel(this.survey, contentPanel, this.controller).generateFlats(point);
        }
        this.question = SurveyHelper.getContentQuestion(this.question) as T;
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
        const adornersOptions: AdornersOptions = new AdornersOptions(point,
            flats, this.question, this.controller, FlatRepository.getInstance());
        if (this.question.customWidget && this.question.customWidget.isFit(this.question) &&
            this.question.customWidget.pdfRender) {
            this.survey.onRenderQuestion.unshift(this.question.customWidget.pdfRender);
        }
        await this.survey.onRenderQuestion.fire(this.survey, adornersOptions);
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