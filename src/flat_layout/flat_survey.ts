import { IElement, Question, PanelModelBase, PanelModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { RowlineBrick } from '../pdf_render/pdf_rowline';
import { SurveyHelper } from '../helper_survey';

export class FlatSurvey {
    public static readonly QUES_GAP_VERT_SCALE: number = 1.5;
    public static readonly PANEL_CONT_GAP_SCALE: number = 1.0;
    public static readonly PANEL_DESC_GAP_SCALE: number = 0.25;
    public static async generateFlatsPanel(survey: SurveyPDF, controller: DocController,
        panel: PanelModel, point: IPoint): Promise<IPdfBrick[]> {
        let panelFlats: IPdfBrick[] = [];
        let panelContentPoint: IPoint = SurveyHelper.clone(point);
        controller.pushMargins();
        controller.margins.left += controller.measureText(panel.innerIndent).width;
        panelContentPoint.xLeft += controller.measureText(panel.innerIndent).width;
        panelFlats.push(...await this.generateFlatsPagePanel(survey,
            controller, panel, panelContentPoint));
        controller.popMargins();
        return panelFlats;
    }
    private static async generateFlatsPagePanel(survey: SurveyPDF, controller: DocController,
        pagePanel: PanelModelBase, point: IPoint): Promise<IPdfBrick[]> {
        if (!pagePanel.isVisible) return;
        pagePanel.onFirstRendering();
        let pagePanelFlats: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        if (survey.showPageTitles) {
            let compositeFlat: CompositeBrick = new CompositeBrick();
            if (pagePanel.title) {
                let pagelPanelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
                    currPoint, null, controller, pagePanel.locTitle);
                compositeFlat.addBrick(pagelPanelTitleFlat);
                currPoint = SurveyHelper.createPoint(pagelPanelTitleFlat);
            }
            if (pagePanel.description) {
                if (pagePanel.title) {
                    currPoint.yTop += controller.unitWidth * FlatSurvey.PANEL_DESC_GAP_SCALE;
                }
                let pagePanelDescFlat: IPdfBrick = await SurveyHelper.createDescFlat(
                    currPoint, null, controller, pagePanel.locDescription);
                compositeFlat.addBrick(pagePanelDescFlat);
                currPoint = SurveyHelper.createPoint(pagePanelDescFlat);
            }
            if (!compositeFlat.isEmpty) {
                pagePanelFlats.push(compositeFlat);
                currPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE;
            }
        }
        for (let row of pagePanel.rows) {
            if (!row.visible) continue;
            controller.pushMargins();
            let width: number = SurveyHelper.getPageAvailableWidth(controller);
            let nextMarginLeft: number = controller.margins.left;
            let rowFlats: IPdfBrick[] = [];
            for (let i: number = 0; i < row.visibleElements.length; i++) {
                let element: IElement = row.visibleElements[i];
                if (!element.isVisible) continue;
                let persWidth: number = SurveyHelper.parseWidth(element.renderWidth,
                    width - (row.visibleElements.length - 1) * controller.unitWidth);
                controller.margins.left = nextMarginLeft + ((i !== 0) ? controller.unitWidth : 0);
                controller.margins.right = controller.paperWidth - controller.margins.left - persWidth;
                currPoint.xLeft = controller.margins.left;
                nextMarginLeft = controller.margins.left + persWidth;
                if (element instanceof PanelModel) {
                    rowFlats.push(...await this.generateFlatsPanel(survey, controller, element, currPoint));
                }
                else {
                    rowFlats.push(...await SurveyHelper.generateQuestionFlats(survey,
                        controller, <Question>element, currPoint));
                }
            }
            controller.popMargins();
            currPoint.xLeft = controller.margins.left;
            if (rowFlats.length !== 0) {
                currPoint.yTop = SurveyHelper.mergeRects(...rowFlats).yBot;
                currPoint.xLeft = point.xLeft;
                currPoint.yTop += controller.unitHeight * FlatSurvey.QUES_GAP_VERT_SCALE;
                pagePanelFlats.push(...rowFlats);
                pagePanelFlats.push(SurveyHelper.createRowlineFlat(currPoint, controller));
                currPoint.yTop += SurveyHelper.EPSILON;
            }
        }
        return pagePanelFlats;
    }
    private static popRowlines(flats: IPdfBrick[]) {
        while (flats.length > 0 && flats[flats.length - 1] instanceof RowlineBrick) {
            flats.pop();
        }
    }
    public static async generateFlats(survey: SurveyPDF, controller: DocController): Promise<IPdfBrick[][]> {
        let flats: IPdfBrick[][] = [];
        for (let page of survey.visiblePages) {
            let pageFlats: IPdfBrick[] = [];
            pageFlats.push(...await this.generateFlatsPagePanel(
                survey, controller, page, controller.leftTopPoint));
            flats.push(pageFlats);
            this.popRowlines(flats[flats.length - 1]);
        }
        return flats;
    }
}