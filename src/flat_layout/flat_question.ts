import { Question, LocalizableString, Serializer, settings } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { AdornersOptions } from '../event_handler/adorners';
import { FlatRepository } from './flat_repository';
import { ContainerBrick } from '../pdf_render/pdf_container';
import { IQuestionStyle, ITextStyle } from '../style/types';

export interface IFlatQuestion {
    generateFlatsContent(point: IPoint): Promise<IPdfBrick[]>;
    generateFlats(point: IPoint): Promise<IPdfBrick[]>;
}

export class FlatQuestion<T extends Question = Question, S extends IQuestionStyle = IQuestionStyle> implements IFlatQuestion {
    public constructor(protected survey: SurveyPDF,
        protected question: T, protected controller: DocController, protected style: S) {
    }
    private async generateFlatTitle(point: IPoint): Promise<IPdfBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        let currPoint: IPoint = SurveyHelper.clone(point);
        const textStyle:Partial<ITextStyle> = { ...this.style.title };
        if (this.question.no) {
            const numberStyle = SurveyHelper.mergeObjects({}, textStyle, this.style.number);
            const noText: string = this.question.no;
            let noFlat: IPdfBrick;
            if (SurveyHelper.hasHtml(this.question.locTitle)) {
                this.controller.pushMargins();
                this.controller.margins.right = this.controller.paperWidth -
                        this.controller.margins.left - this.controller.measureText(noText, numberStyle).width;
                noFlat = await SurveyHelper.createHTMLFlat(currPoint, this.controller,
                    SurveyHelper.createHtmlContainerBlock(noText, this.controller, numberStyle), numberStyle);
                this.controller.popMargins();
            }
            else {
                noFlat = await SurveyHelper.createTextFlat(currPoint, this.controller, noText, numberStyle);
            }
            composite.addBrick(noFlat);
            currPoint.xLeft = noFlat.xRight + this.style.spacing.titleNumberGap;
        }
        this.controller.pushMargins();
        this.controller.margins.left = currPoint.xLeft;
        const textFlat: CompositeBrick = <CompositeBrick>await SurveyHelper.createTextFlat(
            currPoint, this.controller, this.question.locTitle, textStyle);
        composite.addBrick(textFlat);
        this.controller.popMargins();
        if (this.question.isRequired) {
            const requiredStyle = SurveyHelper.mergeObjects({}, textStyle, this.style.requiredMark);
            const requiredText: string = this.question.requiredMark;
            if (SurveyHelper.hasHtml(this.question.locTitle)) {
                currPoint = SurveyHelper.createPoint(textFlat.unfold()[0], false, false);
                currPoint.xLeft += this.style.spacing.titleRequiredMarkGap;
                this.controller.pushMargins();
                this.controller.margins.right = this.controller.paperWidth -
                        this.controller.margins.left - this.controller.measureText(requiredText, requiredStyle).width;
                composite.addBrick(await SurveyHelper.createHTMLFlat(currPoint, this.controller,
                    SurveyHelper.createHtmlContainerBlock(requiredText, this.controller, requiredStyle), requiredStyle));
                this.controller.popMargins();
            }
            else {
                currPoint = SurveyHelper.createPoint(textFlat.unfold().pop(), false, true);
                currPoint.xLeft += this.style.spacing.titleRequiredMarkGap;
                composite.addBrick(await SurveyHelper.createTextFlat(currPoint, this.controller, requiredText, requiredStyle));
            }
        }
        return composite;
    }
    private async generateFlatDescription(point: IPoint): Promise<IPdfBrick> {
        return await SurveyHelper.createTextFlat(point, this.controller, this.question.locDescription, { ...this.style.description });
    }
    private async generateFlatHeader(point: IPoint): Promise<CompositeBrick> {
        const containerBrick: ContainerBrick = new ContainerBrick(this.controller, {
            ...point,
            width: SurveyHelper.getPageAvailableWidth(this.controller)
        }, this.style.header);
        await containerBrick.setup(async (point, bricks) => {
            const titleFlat: IPdfBrick = await this.generateFlatTitle(point);
            bricks.push(titleFlat);
            if(this.question.hasDescriptionUnderTitle) {
                const descPoint: IPoint = SurveyHelper.createPoint(titleFlat, true, false);
                descPoint.yTop += this.style.spacing.titleDescriptionGap;
                descPoint.xLeft += this.style.spacing.contentIndentStart;
                bricks.push(await this.generateFlatDescription(descPoint));
            }
        });

        return containerBrick;
    }
    private async generateFlatsComment(point: IPoint): Promise<IPdfBrick> {
        const text: LocalizableString = this.question.locCommentText;
        const otherTextFlat: IPdfBrick = await SurveyHelper.createTextFlat(point, this.controller, text);
        const otherPoint: IPoint = SurveyHelper.createPoint(otherTextFlat);
        const shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(this.question, this.controller, this.question.isReadOnly);
        const style = SurveyHelper.getPatchedTextStyle(this.controller, SurveyHelper.mergeObjects({}, this.style.comment, shouldRenderReadOnly ? this.style.commentReadOnly : undefined));
        return new CompositeBrick(otherTextFlat, await SurveyHelper.createCommentFlat(
            otherPoint, this.controller, {
                fieldName: this.question.id + '_comment',
                rows: this.controller.otherRowsCount,
                value: this.question.comment !== undefined && this.question.comment !== null ? this.question.comment : '',
                shouldRenderBorders: settings.readOnlyCommentRenderMode === 'textarea',
                shouldRenderReadOnly,
                isReadOnly: this.question.isReadOnly,
                isMultiline: true,
                placeholder: ''
            }, style));
    }
    public async generateFlatsComposite(point: IPoint): Promise<IPdfBrick[]> {
        const contentPanel = (<any>this.question).contentPanel;
        if (!!contentPanel) {
            return await SurveyHelper.generatePanelFlats(this.survey, this.controller, contentPanel, point, this.survey.getElementStyle(contentPanel));
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
        if(Array.isArray(contentFlats)) {
            flats.push(...contentFlats);
        }
        const currPoint = SurveyHelper.clone(point);
        if(contentFlats && contentFlats.length > 0) {
            currPoint.yTop = SurveyHelper.mergeRects(...contentFlats).yBot;
        }
        if (this.question.hasComment) {
            currPoint.yTop += this.style.spacing.contentCommentGap;
            flats.push(await this.generateFlatsComment(currPoint));
        }
        if (this.question.hasDescriptionUnderInput) {
            currPoint.yTop += this.style.spacing.contentDescriptionGap;
            flats.push(await this.generateFlatDescription(currPoint));
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
        const titleLocationMatrix = 'matrix';
        switch (titleLocation) {
            case 'top':
            case 'default': {
                const compositeBrick = new CompositeBrick();
                const headerFlat = await this.generateFlatHeader(indentPoint);
                compositeBrick.addBrick(headerFlat);
                let contentPoint: IPoint = SurveyHelper.createPoint(headerFlat);
                const indent = this.style.spacing.contentIndentStart;
                contentPoint.xLeft += indent;
                compositeBrick.addBrick(SurveyHelper.createRowlineFlat(
                    SurveyHelper.createPoint(headerFlat), this.controller));
                contentPoint.yTop += this.style.spacing.headerContentGap + SurveyHelper.EPSILON;
                this.controller.pushMargins();
                this.controller.margins.left += indent;
                const contentFlats: IPdfBrick[] = await this.generateFlatsContentWithOptionalElements(contentPoint);
                this.controller.popMargins();
                if(contentFlats !== null && contentFlats.length !== 0) {
                    compositeBrick.addBrick(contentFlats.shift());
                }
                flats.push(compositeBrick);
                flats.push(...contentFlats);
                break;
            }
            case 'bottom': {
                const contentPoint: IPoint = SurveyHelper.clone(indentPoint);
                this.controller.pushMargins();
                const indent = this.style.spacing.contentIndentStart;
                contentPoint.xLeft += indent;
                this.controller.margins.left += indent;
                const contentFlats: IPdfBrick[] = await this.generateFlatsContentWithOptionalElements(contentPoint);
                this.controller.popMargins();
                flats.push(...contentFlats);
                const titlePoint: IPoint = indentPoint;
                if (flats.length !== 0) {
                    titlePoint.yTop = flats[flats.length - 1].yBot;
                }
                titlePoint.yTop += this.style.spacing.headerContentGap;
                flats.push(await this.generateFlatHeader(titlePoint));
                break;
            }
            case 'left': {
                this.controller.pushMargins(this.controller.margins.left,
                    this.controller.paperWidth - this.controller.margins.left -
                        SurveyHelper.getPageAvailableWidth(this.controller) * this.style.inlineHeaderWidthPercentage);
                const headerFlat: CompositeBrick = await this.generateFlatHeader(indentPoint);
                const contentPoint: IPoint = SurveyHelper.createPoint(headerFlat, false, true);
                this.controller.popMargins();
                contentPoint.xLeft += this.style.spacing.inlineHeaderContentGap;
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
            case titleLocationMatrix:
            default: {
                const contentPoint: IPoint = SurveyHelper.clone(indentPoint);
                this.controller.pushMargins();
                if (titleLocation !== titleLocationMatrix) {
                    const indent = this.style.spacing.contentIndentStart;
                    contentPoint.xLeft += indent;
                    this.controller.margins.left += indent;
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
        this.survey.afterRenderSurveyElement(this.question, flats);
        return flats;
    }
}

Serializer.addProperty('question', {
    name: 'readonlyRenderAs',
    default: 'auto',
    choices: ['auto', 'text', 'acroform'],
    visible: false
});