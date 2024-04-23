import { IElement, Question, PanelModelBase, PanelModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { RowlineBrick } from '../pdf_render/pdf_rowline';
import { SurveyHelper } from '../helper_survey';
import { AdornersPanelOptions, AdornersPageOptions } from '../event_handler/adorners';
import { FlatRepository } from '../entries/pdf';
import * as SurveyPDFModule from '../entries/pdf';

export class FlatSurvey {
    public static QUES_GAP_VERT_SCALE: number = 1.5;
    public static PANEL_CONT_GAP_SCALE: number = 1.0;
    public static PANEL_DESC_GAP_SCALE: number = 0.25;
    public static async generateFlatsPanel(survey: SurveyPDF, controller: DocController,
        panel: PanelModel, point: IPoint): Promise<IPdfBrick[]> {
        const panelFlats: IPdfBrick[] = [];
        const panelContentPoint: IPoint = SurveyHelper.clone(point);
        controller.pushMargins();
        controller.margins.left += controller.measureText(panel.innerIndent).width;
        panelContentPoint.xLeft += controller.measureText(panel.innerIndent).width;
        panelFlats.push(...await this.generateFlatsPagePanel(survey,
            controller, panel, panelContentPoint));
        controller.popMargins();
        const adornersOptions: AdornersPanelOptions = new AdornersPanelOptions(point,
            panelFlats, panel, controller, FlatRepository.getInstance(), SurveyPDFModule);
        await survey.onRenderPanel.fire(survey, adornersOptions);
        return [...adornersOptions.bricks];
    }
    private static async generateFlatsPagePanel(survey: SurveyPDF, controller: DocController,
        pagePanel: PanelModelBase, point: IPoint): Promise<IPdfBrick[]> {
        if (!pagePanel.isVisible) return;
        pagePanel.onFirstRendering();
        const pagePanelFlats: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        if (pagePanel.getType() !== 'page' || survey.showPageTitles) {
            const compositeFlat: CompositeBrick = new CompositeBrick();
            if (pagePanel.title) {
                if (pagePanel instanceof PanelModel && pagePanel.no) {
                    const noFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
                        currPoint, controller, pagePanel.no, pagePanel.getType() === 'page');
                    compositeFlat.addBrick(noFlat);
                    currPoint.xLeft = noFlat.xRight + controller.measureText(' ').width;
                }
                const pagelPanelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
                    currPoint, controller, pagePanel.locTitle, pagePanel.getType() === 'page');
                compositeFlat.addBrick(pagelPanelTitleFlat);
                currPoint = SurveyHelper.createPoint(pagelPanelTitleFlat);
            }
            if (pagePanel.description) {
                if (pagePanel.title) {
                    currPoint.yTop += controller.unitWidth * FlatSurvey.PANEL_DESC_GAP_SCALE;
                }
                const pagePanelDescFlat: IPdfBrick = await SurveyHelper.createDescFlat(
                    currPoint, null, controller, pagePanel.locDescription);
                compositeFlat.addBrick(pagePanelDescFlat);
                currPoint = SurveyHelper.createPoint(pagePanelDescFlat);
            }
            if (!compositeFlat.isEmpty) {
                const rowLinePoint: IPoint = SurveyHelper.createPoint(compositeFlat);
                compositeFlat.addBrick(SurveyHelper.createRowlineFlat(rowLinePoint, controller));
                pagePanelFlats.push(compositeFlat);
                currPoint.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
            }
        }
        for (const row of pagePanel.rows) {
            if (!row.visible) continue;
            controller.pushMargins();
            const width: number = SurveyHelper.getPageAvailableWidth(controller);
            let nextMarginLeft: number = controller.margins.left;
            const rowFlats: IPdfBrick[] = [];
            const visibleElements = row.elements.filter(el => el.isVisible);
            for (let i: number = 0; i < visibleElements.length; i++) {
                let element: IElement = visibleElements[i];
                if (!element.isVisible) continue;
                const persWidth: number = SurveyHelper.parseWidth(element.renderWidth,
                    width - (visibleElements.length - 1) * controller.unitWidth,
                    visibleElements.length);
                controller.margins.left = nextMarginLeft + ((i !== 0) ? controller.unitWidth : 0);
                controller.margins.right = controller.paperWidth - controller.margins.left - persWidth;
                currPoint.xLeft = controller.margins.left;
                nextMarginLeft = controller.margins.left + persWidth;
                if (element instanceof PanelModel) {
                    rowFlats.push(...await this.generateFlatsPanel(
                        survey, controller, element, currPoint));
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
    private static async generateFlatTitle(survey: SurveyPDF, controller: DocController,
        point: IPoint): Promise<CompositeBrick> {
        const compositeFlat: CompositeBrick = new CompositeBrick();
        if (survey.showTitle) {
            if (survey.title) {
                const surveyTitleFlat: IPdfBrick = await SurveyHelper.createTitleSurveyFlat(
                    point, controller, survey.locTitle);
                compositeFlat.addBrick(surveyTitleFlat);
                point = SurveyHelper.createPoint(surveyTitleFlat);
            }
            if (survey.description) {
                if (survey.title) {
                    point.yTop += controller.unitWidth * FlatSurvey.PANEL_DESC_GAP_SCALE;
                }
                compositeFlat.addBrick(await SurveyHelper.createDescFlat(
                    point, null, controller, survey.locDescription));
            }
        }
        return compositeFlat;
    }
    private static async generateFlatLogoImage(survey: SurveyPDF, controller: DocController,
        point: IPoint): Promise<IPdfBrick> {
        const logoUrl = SurveyHelper.getLocString(survey.locLogo);
        const logoSize = await SurveyHelper.getCorrectedImageSize(controller, { imageLink: logoUrl, imageHeight: survey.logoHeight, imageWidth: survey.logoWidth });
        const logoFlat: IPdfBrick = await SurveyHelper.createImageFlat(
            point, null, controller, { link: logoUrl,
                width: logoSize.width, height: logoSize.height });
        let shift: number = 0;
        if (survey.logoPosition === 'right') {
            shift = SurveyHelper.getPageAvailableWidth(controller) - logoFlat.width;
        }
        else if (survey.logoPosition !== 'left') {
            shift = SurveyHelper.getPageAvailableWidth(controller) / 2.0 - logoFlat.width / 2.0;
        }
        logoFlat.xLeft += shift;
        logoFlat.xRight += shift;
        return logoFlat;
    }
    public static async generateFlats(survey: SurveyPDF, controller: DocController): Promise<IPdfBrick[][]> {
        const flats: IPdfBrick[][] = [];
        if (!survey.hasLogo) {
            const titleFlat: CompositeBrick = await this.generateFlatTitle(
                survey, controller, controller.leftTopPoint);
            if (!titleFlat.isEmpty) flats.push([titleFlat]);
        }
        else if (survey.isLogoBefore) {
            const logoFlat: IPdfBrick = await this.generateFlatLogoImage(
                survey, controller, controller.leftTopPoint);
            flats.push([logoFlat]);
            const titlePoint: IPoint = SurveyHelper.createPoint(logoFlat,
                survey.logoPosition === 'top', survey.logoPosition !== 'top');
            if (survey.logoPosition !== 'top') {
                controller.pushMargins();
                titlePoint.xLeft += controller.unitWidth;
                controller.margins.left += logoFlat.width + controller.unitWidth;
            }
            else {
                titlePoint.xLeft = controller.leftTopPoint.xLeft;
                titlePoint.yTop += controller.unitHeight / 2.0;
            }
            const titleFlat: CompositeBrick = await this.generateFlatTitle(
                survey, controller, titlePoint);
            if (survey.logoPosition !== 'top') controller.popMargins();
            if (!titleFlat.isEmpty) flats[0].push(titleFlat);
        }
        else {
            if (survey.logoPosition === 'right') {
                const logoFlat: IPdfBrick = await this.generateFlatLogoImage(
                    survey, controller, controller.leftTopPoint);
                flats.push([logoFlat]);
                controller.pushMargins();
                controller.margins.right += logoFlat.width + controller.unitWidth;
                const titleFlat: CompositeBrick = await this.generateFlatTitle(
                    survey, controller, controller.leftTopPoint);
                if (!titleFlat.isEmpty) flats[0].unshift(titleFlat);
                controller.popMargins();
            }
            else {
                const titleFlat: CompositeBrick = await this.generateFlatTitle(
                    survey, controller, controller.leftTopPoint);
                let logoPoint: IPoint = controller.leftTopPoint;
                if (!titleFlat.isEmpty) {
                    flats.push([titleFlat]);
                    logoPoint = SurveyHelper.createPoint(titleFlat);
                    logoPoint.yTop += controller.unitHeight / 2.0;
                }
                const logoFlat: IPdfBrick = await this.generateFlatLogoImage(
                    survey, controller, logoPoint);
                if (flats.length !== 0) flats[0].push(logoFlat);
                else flats.push([logoFlat]);
            }
        }
        let point: IPoint = controller.leftTopPoint;
        if (flats.length !== 0) {
            point.yTop = SurveyHelper.createPoint(SurveyHelper.mergeRects(...flats[0])).yTop;
            flats[0].push(SurveyHelper.createRowlineFlat(point, controller));
            point.yTop += controller.unitHeight * FlatSurvey.PANEL_CONT_GAP_SCALE + SurveyHelper.EPSILON;
        }
        for (let i: number = 0; i < survey.visiblePages.length; i++) {
            survey.currentPage = survey.visiblePages[i];
            let pageFlats: IPdfBrick[] = [];
            pageFlats.push(...await this.generateFlatsPagePanel(
                survey, controller, survey.visiblePages[i], point));
            const adornersOptions: AdornersPageOptions = new AdornersPageOptions(point,
                pageFlats, survey.visiblePages[i], controller, FlatRepository.getInstance(), SurveyPDFModule);
            await survey.onRenderPage.fire(survey, adornersOptions);
            pageFlats = [...adornersOptions.bricks];
            if (i === 0 && flats.length !== 0) {
                flats[0].push(...pageFlats);
            }
            else flats.push(pageFlats);
            this.popRowlines(flats[flats.length - 1]);
            point.yTop = controller.leftTopPoint.yTop;
        }
        return flats;
    }
}