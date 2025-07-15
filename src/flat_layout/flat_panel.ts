import { IElement, PanelModel, Question } from 'survey-core';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DocController, IPoint } from '../doc_controller';
import { SurveyPDF } from '../survey';
import { SurveyHelper } from '../helper_survey';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { AdornersPanelOptions } from '../event_handler/adorners';
import { FlatRepository } from './flat_repository';
import { IStyles } from '../styles';
import { ITextOptions } from '../pdf_render/pdf_text';

export class FlatPanel<T extends PanelModel = PanelModel> {
    constructor(protected survey: SurveyPDF, protected panel: T, protected controller: DocController, protected styles: IStyles) {}
    public async generateFlats(point: IPoint): Promise<IPdfBrick[]> {
        const panelFlats: IPdfBrick[] = [];
        const panelContentPoint: IPoint = SurveyHelper.clone(point);
        this.controller.pushMargins();
        this.controller.margins.left += this.controller.measureText(this.panel.innerIndent).width;
        panelContentPoint.xLeft += this.controller.measureText(this.panel.innerIndent).width;
        panelFlats.push(...await this.generateContentFlats(panelContentPoint));
        this.controller.popMargins();
        const adornersOptions: AdornersPanelOptions = new AdornersPanelOptions(point,
            panelFlats, this.panel, this.controller, FlatRepository.getInstance());
        await this.survey.onRenderPanel.fire(this.survey, adornersOptions);
        return [...adornersOptions.bricks];
    }
    protected async generateContentFlats(point: IPoint): Promise<IPdfBrick[]> {
        if (!this.panel.isVisible) return;
        this.panel.onFirstRendering();
        const panelFlats: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        if(this.panel.hasDescriptionUnderTitle || this.panel.hasTitle) {
            const headerFlats = await this.createHeaderFlats(currPoint);
            panelFlats.push(...headerFlats);
            currPoint.yTop = headerFlats[headerFlats.length - 1].yBot + SurveyHelper.getScaledVerticalSize(this.controller, this.styles.panelContGapScale) + SurveyHelper.EPSILON;
        }
        panelFlats.push(...await this.generateRowsFlats(currPoint));
        return panelFlats;
    }
    protected async generateTitleFlat(point: IPoint): Promise<IPdfBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        const textOptions:Partial<ITextOptions> = {
            fontSize: SurveyHelper.getScaledFontSize(this.controller, this.styles.titleFontSizeScale),
            fontStyle: this.styles.titleFontStyle,
            fontColor: this.styles.titleFontColor
        };
        let currPoint = SurveyHelper.clone(point);
        if (this.panel.no) {
            const noFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                currPoint, null, this.controller, this.panel.no, textOptions);
            composite.addBrick(noFlat);
            currPoint.xLeft = noFlat.xRight + this.controller.measureText(' ').width;
        }
        const panelTitleFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            currPoint, null, this.controller, this.panel.locTitle, textOptions);
        composite.addBrick(panelTitleFlat);
        return composite;
    }
    protected async createHeaderFlats(point: IPoint): Promise<Array<IPdfBrick>> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        let currPoint = SurveyHelper.clone(point);
        if (this.panel.hasTitle) {
            const titleFlat = await this.generateTitleFlat(currPoint);
            compositeFlat.addBrick(titleFlat);
            currPoint = SurveyHelper.createPoint(titleFlat);
        }
        if (this.panel.description) {
            if (this.panel.title) {
                currPoint.yTop += SurveyHelper.getScaledHorizontalSize(this.controller, this.styles.panelDescriptionGapScale);
            }
            const panelDescFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                currPoint, null, this.controller, this.panel.locDescription, { fontSize: this.controller.fontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE });
            compositeFlat.addBrick(panelDescFlat);
            currPoint = SurveyHelper.createPoint(panelDescFlat);
        }
        const rowLinePoint: IPoint = SurveyHelper.createPoint(compositeFlat);
        compositeFlat.addBrick(SurveyHelper.createRowlineFlat(rowLinePoint, this.controller));
        return [compositeFlat];
    }
    protected async generateRowsFlats(point: IPoint): Promise<IPdfBrick[]> {
        const currPoint = SurveyHelper.clone(point);
        const rowsFlats: IPdfBrick[] = [];
        for (const row of this.panel.rows) {
            if (!row.visible) continue;
            this.controller.pushMargins();
            const width: number = SurveyHelper.getPageAvailableWidth(this.controller);
            let nextMarginLeft: number = this.controller.margins.left;
            const rowFlats: IPdfBrick[] = [];
            const visibleElements = row.elements.filter(el => el.isVisible);
            for (let i: number = 0; i < visibleElements.length; i++) {
                let element: IElement = visibleElements[i];
                if (!element.isVisible) continue;
                const persWidth: number = SurveyHelper.parseWidth(element.renderWidth,
                    width - (visibleElements.length - 1) * this.controller.unitWidth,
                    visibleElements.length);
                this.controller.margins.left = nextMarginLeft + ((i !== 0) ? this.controller.unitWidth : 0);
                this.controller.margins.right = this.controller.paperWidth - this.controller.margins.left - persWidth;
                currPoint.xLeft = this.controller.margins.left;
                nextMarginLeft = this.controller.margins.left + persWidth;
                if (element instanceof PanelModel) {
                    rowFlats.push(...await SurveyHelper.generatePanelFlats(this.survey, this.controller, element, currPoint));
                }
                else {
                    await (<Question>element).waitForQuestionIsReady();
                    rowFlats.push(...await SurveyHelper.generateQuestionFlats(this.survey,
                        this.controller, <Question>element, currPoint));
                }
            }
            this.controller.popMargins();
            currPoint.xLeft = this.controller.margins.left;
            if (rowFlats.length !== 0) {
                currPoint.yTop = SurveyHelper.mergeRects(...rowFlats).yBot;
                currPoint.xLeft = point.xLeft;
                currPoint.yTop += SurveyHelper.getScaledVerticalSize(this.controller, this.styles.questionGapVerticalScale);
                rowsFlats.push(...rowFlats);
                rowsFlats.push(SurveyHelper.createRowlineFlat(currPoint, this.controller));
                currPoint.yTop += SurveyHelper.EPSILON;
            }
        }
        return rowsFlats;
    }
}