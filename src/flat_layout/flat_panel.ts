import { IElement, PanelModel, Question, SurveyElement } from 'survey-core';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DocController, IPoint } from '../doc_controller';
import { SurveyPDF } from '../survey';
import { SurveyHelper } from '../helper_survey';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { ContainerBrick } from '../pdf_render/pdf_container';
import { AdornersPanelOptions } from '../event_handler/adorners';
import { FlatRepository } from './flat_repository';
import { IStyles } from '../styles';
import { ITextAppearanceOptions } from '../pdf_render/pdf_text';

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
            currPoint.yTop = headerFlats[headerFlats.length - 1].yBot + this.styles.contentGap + SurveyHelper.EPSILON;
        }
        panelFlats.push(...await this.generateRowsFlats(currPoint));
        return panelFlats;
    }
    protected async generateTitleFlat(point: IPoint): Promise<IPdfBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        const textOptions:Partial<ITextAppearanceOptions> = { ...this.styles.title }
        let currPoint = SurveyHelper.clone(point);
        if (this.panel.no) {
            const noFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                currPoint, this.controller, this.panel.no, textOptions);
            composite.addBrick(noFlat);
            currPoint.xLeft = noFlat.xRight + this.controller.measureText(' ').width;
        }
        const panelTitleFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            currPoint, this.controller, this.panel.locTitle, textOptions);
        composite.addBrick(panelTitleFlat);
        return composite;
    }
    protected async createHeaderFlats(point: IPoint): Promise<Array<IPdfBrick>> {
        const containerBrick: ContainerBrick = new ContainerBrick(this.controller, {
            ...point,
            width: SurveyHelper.getPageAvailableWidth(this.controller)
        },
        {
            ...SurveyHelper.getPaddingFromStyle(this.styles.headerPadding),
            borderWidth: this.styles.headerBorderWidth,
            borderColor: this.styles.headerBorderColor,
            backgroundColor: this.styles.headerBackgroundColor,
        });
        await containerBrick.setup(async (point, bricks)=>{
            let currPoint = SurveyHelper.clone(point);
            if (this.panel.hasTitle) {
                const titleFlat = await this.generateTitleFlat(currPoint);
                bricks.push(titleFlat);
                currPoint = SurveyHelper.createPoint(titleFlat);
            }
            if (this.panel.description) {
                if (this.panel.title) {
                    currPoint.yTop += this.styles.descriptionGap;
                }
                const panelDescFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                    currPoint, this.controller, this.panel.locDescription, { ...this.styles.description });
                bricks.push(panelDescFlat);
                currPoint = SurveyHelper.createPoint(panelDescFlat);
            }
            const rowLinePoint: IPoint = SurveyHelper.createPoint(containerBrick);
            bricks.push(SurveyHelper.createRowlineFlat(rowLinePoint, this.controller));
        });
        return [containerBrick];
    }
    protected async generateRowsFlats(point: IPoint): Promise<IPdfBrick[]> {
        const currPoint = SurveyHelper.clone(point);
        const rowsFlats: IPdfBrick[] = [];
        for (const row of this.panel.rows) {
            if (!row.visible) continue;
            this.controller.pushMargins();
            const width: number = SurveyHelper.getPageAvailableWidth(this.controller);
            let nextMarginLeft: number = this.controller.margins.left;
            const rowContainers: Array<ContainerBrick> = [];
            const visibleElements = row.elements.filter(el => el.isVisible);
            for (let i: number = 0; i < visibleElements.length; i++) {
                let element: IElement = visibleElements[i];
                if (!element.isVisible) continue;
                const gap = this.styles.gapBetweenElements;//this.controller.unitWidth;
                const persWidth: number = SurveyHelper.parseWidth(element.renderWidth,
                    width - (visibleElements.length - 1) * gap,
                    visibleElements.length);
                this.controller.margins.left = nextMarginLeft + ((i !== 0) ? gap : 0);
                this.controller.margins.right = this.controller.paperWidth - this.controller.margins.left - persWidth;
                currPoint.xLeft = this.controller.margins.left;
                nextMarginLeft = this.controller.margins.left + persWidth;
                const elementStyles = this.survey.getStylesForElement(element as any as SurveyElement);
                const containerBrick = new ContainerBrick(this.controller, { ...currPoint, width: SurveyHelper.getPageAvailableWidth(this.controller) }, element.isQuestion ? {
                    ...SurveyHelper.getPaddingFromStyle(elementStyles.wrapperPadding),
                    borderWidth: elementStyles.wrapperBorderWidth,
                    borderColor: elementStyles.wrapperBorderColor,
                }
                    : {});
                await containerBrick.setup(async (point, bricks) => {
                    if (element instanceof PanelModel) {
                        bricks.push(...await SurveyHelper.generatePanelFlats(this.survey, this.controller, element, point, elementStyles));
                    }
                    else {
                        await (<Question>element).waitForQuestionIsReady();
                        bricks.push(...await SurveyHelper.generateQuestionFlats(this.survey,
                            this.controller, <Question>element, point, elementStyles));
                    }
                });
                rowContainers.push(containerBrick);
            }
            this.controller.popMargins();
            currPoint.xLeft = this.controller.margins.left;
            if (rowContainers.length !== 0) {
                const rowRect = SurveyHelper.mergeRects(...rowContainers);
                const yBot = rowRect.yBot;
                currPoint.yTop = yBot;
                rowContainers.forEach((brick: ContainerBrick) => {
                    brick.fitToHeight(rowRect.yBot - rowRect.yTop);
                });
                currPoint.xLeft = point.xLeft;
                currPoint.yTop += this.styles.gapBetweenRows;
                rowContainers.forEach((elementFlat: ContainerBrick) => rowsFlats.push(...elementFlat.getBricks()));
                rowsFlats.push(SurveyHelper.createRowlineFlat(currPoint, this.controller));
                currPoint.yTop += SurveyHelper.EPSILON;
            }
        }
        return rowsFlats;
    }
}