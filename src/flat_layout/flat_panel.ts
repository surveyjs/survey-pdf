import { PanelModel, Question, SurveyElement } from 'survey-core';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { DocController, IPoint } from '../doc_controller';
import { SurveyPDF } from '../survey';
import { SurveyHelper, ITextAppearanceOptions } from '../helper_survey';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { ContainerBrick } from '../pdf_render/pdf_container';
import { AdornersPanelOptions } from '../event_handler/adorners';
import { FlatRepository } from './flat_repository';
import { IStyles } from '../styles';

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
        const bricks = [...adornersOptions.bricks];
        this.survey.afterRenderSurveyElement(this.panel, bricks);
        return bricks;
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
        const textOptions:Partial<ITextAppearanceOptions> = { ...this.styles.title };
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
        }, this.styles.header);
        await containerBrick.setup(async (point, bricks)=>{
            let currPoint = SurveyHelper.clone(point);
            if (this.panel.hasTitle) {
                const titleFlat = await this.generateTitleFlat(currPoint);
                bricks.push(titleFlat);
                currPoint = SurveyHelper.createPoint(titleFlat);
            }
            if (this.panel.description) {
                if (this.panel.title) {
                    currPoint.yTop += this.styles.titleDescriptionGap;
                }
                const panelDescFlat: IPdfBrick = await SurveyHelper.createTextFlat(
                    currPoint, this.controller, this.panel.locDescription, { ...this.styles.description });
                bricks.push(panelDescFlat);
                currPoint = SurveyHelper.createPoint(panelDescFlat);
            }
            const rowLinePoint: IPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(...bricks));
            bricks.push(SurveyHelper.createRowlineFlat(rowLinePoint, this.controller));
        });
        return [containerBrick];
    }
    protected getRows(controller: DocController): Array<Array<{ element: SurveyElement, width: number }>> {
        const availableWidth = SurveyHelper.getPageAvailableWidth(controller);
        const rows: Array<Array<{ element: SurveyElement, width: number }>> = [];
        const gapBetweenElements = this.styles.gapBetweenElements;
        this.panel.rows.forEach(row => {
            let currentAvailableWidth = availableWidth + gapBetweenElements;
            let currentRow: Array<{ element: SurveyElement, width: number }> = [];
            if (!row.visible) return;
            const visibleElements = row.elements.filter(el => el.isVisible);
            (visibleElements as any as Array<SurveyElement>).forEach((el, i) => {
                const styles = this.survey.getStylesForElement(el);
                const minWidth = el.minWidth !== 'auto' ? SurveyHelper.parseWidth(el.minWidth, availableWidth, undefined, 'px') : styles.minWidth;
                const renderWidth = !!el.width ? SurveyHelper.parseWidth(el.width, availableWidth, undefined, 'px') : 0;
                const maxWidth = SurveyHelper.parseWidth(el.maxWidth, availableWidth, undefined, 'px');
                const width = Math.min(Math.max(minWidth, renderWidth), maxWidth);
                if(currentAvailableWidth < width + gapBetweenElements) {
                    rows.push(currentRow);
                    currentAvailableWidth = availableWidth - gapBetweenElements;
                    currentRow = [];
                }
                currentAvailableWidth -= width - gapBetweenElements;
                currentRow.push({ element: el, width: width });
            });
            if(currentRow.length != 0) {
                rows.push(currentRow);
            }
        });
        rows.forEach((row) => {
            const widthSum = row.reduce((sum, rowEl) => sum + rowEl.width, 0);
            let alignValue = (availableWidth - widthSum - (row.length - 1) * gapBetweenElements) / row.length;
            let expandableElements = [].concat(row);
            let restWidth = alignValue * row.length;
            while(expandableElements.length > 0 && restWidth > 0) {
                expandableElements = expandableElements.filter(rowEl => {
                    const maxWidth = SurveyHelper.parseWidth(rowEl.element.maxWidth, availableWidth, undefined, 'px');
                    if(maxWidth > rowEl.width + alignValue) {
                        restWidth -= alignValue;
                        rowEl.width = rowEl.width + alignValue;
                        return true;
                    } else {
                        restWidth -= maxWidth - rowEl.width;
                        rowEl.width = maxWidth;
                        return false;
                    }
                });
                alignValue = restWidth / expandableElements.length;
            }
        });
        return rows;
    }
    protected async generateRowsFlats(point: IPoint): Promise<IPdfBrick[]> {
        const currPoint = SurveyHelper.clone(point);
        const rowsFlats: IPdfBrick[] = [];
        const rowsInfo = this.getRows(this.controller);
        for (const rowInfo of rowsInfo) {
            let nextMarginLeft: number = this.controller.margins.left;
            const rowContainers: Array<ContainerBrick> = [];
            for (let i: number = 0; i < rowInfo.length; i++) {
                const { element, width } = rowInfo[i];
                const gap = this.styles.gapBetweenElements;
                this.controller.pushMargins();
                this.controller.margins.left = nextMarginLeft;
                this.controller.margins.right = this.controller.paperWidth - this.controller.margins.left - width;
                currPoint.xLeft = this.controller.margins.left;
                const elementStyles = this.survey.getStylesForElement(element as any as SurveyElement);
                const containerBrick = new ContainerBrick(this.controller, { ...currPoint, width: SurveyHelper.getPageAvailableWidth(this.controller) }, elementStyles.wrapper);
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
                this.controller.popMargins();
                nextMarginLeft += width + gap;
            }
            currPoint.xLeft = this.controller.margins.left;
            if (rowContainers.length !== 0) {
                const rowRect = SurveyHelper.mergeRects(...rowContainers);
                const yBot = rowRect.yBot;
                currPoint.yTop = yBot;
                rowContainers.forEach((brick: ContainerBrick) => {
                    brick.fitToHeight(rowRect.yBot - rowRect.yTop);
                });
                rowContainers.forEach((elementFlat: ContainerBrick) => rowsFlats.push(...elementFlat.getBricks()));
                rowsFlats.push(SurveyHelper.createRowlineFlat(currPoint, this.controller));
                currPoint.xLeft = point.xLeft;
                currPoint.yTop += this.styles.gapBetweenRows;
                nextMarginLeft = currPoint.xLeft;
            }
        }
        return rowsFlats;
    }
}