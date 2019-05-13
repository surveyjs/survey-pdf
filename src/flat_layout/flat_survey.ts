import { IElement, IQuestion, PanelModelBase, PanelModel, QuestionRowModel } from 'survey-core';
import { PdfSurvey } from '../survey';
import { IPoint, DocController } from "../doc_controller";
import { FlatRepository } from './flat_repository';
import { IFlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { RowlineBrick } from '../pdf_render/pdf_rowline';
import { SurveyHelper } from '../helper_survey';

export class FlatSurvey {
    static parseWidth(width: string): number {
        return parseFloat(width) / 100.0;
    }
    public static generateFlatsPanel(point: IPoint,
        question: PanelModel, controller: DocController): IPdfBrick[] {
        let panelFlats: IPdfBrick[] = new Array<IPdfBrick>();
        let panelContentPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
        if (!!question.title) {
            let panelTitleFlat: IPdfBrick = SurveyHelper.createTitlePanelFlat(
                panelContentPoint, null, controller, question.title);
            let compositeFlat: CompositeBrick = new CompositeBrick(panelTitleFlat);
            panelContentPoint = SurveyHelper.createPoint(panelTitleFlat);
            if (!!question.description) {
                let panelDescFlat: IPdfBrick = SurveyHelper.createDescFlat(
                    panelContentPoint, null, controller,
                    SurveyHelper.getLocString(question.locDescription));
                compositeFlat.addBrick(panelDescFlat);
                panelContentPoint = SurveyHelper.createPoint(panelDescFlat);
            }
            panelFlats.push(compositeFlat);
        }
        let oldPanelMarginLeft: number = controller.margins.marginLeft;
        controller.margins.marginLeft += SurveyHelper.measureText(question.innerIndent).width;
        panelContentPoint.xLeft += SurveyHelper.measureText(question.innerIndent).width;
        panelFlats.push(...this.generateFlatsPagePanel(panelContentPoint, question, controller));
        controller.margins.marginLeft = oldPanelMarginLeft;
        return panelFlats;
    }
    private static generateFlatsPagePanel(point: IPoint,
        pagePanel: PanelModelBase, controller: DocController): IPdfBrick[] {
        if (!pagePanel.isVisible) return;
        pagePanel.onFirstRendering();
        let pagePanelFlats: IPdfBrick[] = new Array<IPdfBrick>();
        let currPoint: IPoint = SurveyHelper.clone(point);
        pagePanel.rows.forEach((row: QuestionRowModel) => {
            if (!row.visible) return;
            let width: number = controller.paperWidth -
                controller.margins.marginLeft - controller.margins.marginRight;
            let oldMarginLeft: number = controller.margins.marginLeft;
            let oldMarginRight: number = controller.margins.marginRight;
            let currMarginLeft: number = controller.margins.marginLeft;
            let rowFlats: IPdfBrick[] = new Array();
            row.elements.forEach((question: IElement) => {
                let persWidth: number = width * FlatSurvey.parseWidth(question.renderWidth);
                controller.margins.marginLeft = currMarginLeft;
                controller.margins.marginRight = controller.paperWidth -
                    currMarginLeft - persWidth;
                currMarginLeft = controller.paperWidth - controller.margins.marginRight;
                currPoint.xLeft = controller.margins.marginLeft;
                if (question instanceof PanelModel) {
                    rowFlats.push(...this.generateFlatsPanel(currPoint, question, controller));
                }
                else {
                    let flatQuestion: IFlatQuestion =
                        FlatRepository.getInstance().create(<IQuestion>question, controller);
                    rowFlats.push(...flatQuestion.generateFlats(currPoint));
                }
            });
            controller.margins.marginLeft = oldMarginLeft;
            controller.margins.marginRight = oldMarginRight;
            currPoint.xLeft = controller.margins.marginLeft;
            if (rowFlats.length !== 0) {
                currPoint.yTop = SurveyHelper.mergeRects(...rowFlats).yBot;
                currPoint.yTop += SurveyHelper.measureText().height;
                pagePanelFlats.push(...rowFlats);
                pagePanelFlats.push(SurveyHelper.createRowlineFlat(currPoint, controller));
                currPoint.yTop += SurveyHelper.EPSILON;
            }
        });
        return pagePanelFlats;
    }
    private static popRowlines(flats: IPdfBrick[]) {
        while (flats.length > 0 && flats[flats.length - 1] instanceof RowlineBrick) {
            flats.pop();
        }
    }
    static generateFlats(survey: PdfSurvey): IPdfBrick[][] {
        let flats: IPdfBrick[][] = new Array<IPdfBrick[]>();
        survey.pages.forEach((page: PanelModelBase) => {
            let pageFlats: IPdfBrick[] = new Array<IPdfBrick>();
            pageFlats.push(...this.generateFlatsPagePanel(
                survey.controller.leftTopPoint, page, survey.controller));
            flats.push(pageFlats);
            this.popRowlines(flats[flats.length - 1]);
        });
        return flats;
    }
}