import { IElement, IQuestion, PanelModelBase, PanelModel, QuestionRowModel } from 'survey-core';
import { PdfSurvey } from '../survey';
import { IPoint, DocController } from "../doc_controller";
import { FlatRepository } from './flat_repository';
import { IFlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatSurvey {
    static parseWidth(width: string): number {
        return parseFloat(width) / 100.0;
    }
    private static generateFlatsPagePanel(pagePanel: PanelModelBase,
        controller: DocController, point: IPoint): IPdfBrick[] {
        if (!pagePanel.isVisible) return;
        pagePanel.onFirstRendering();
        let pagePanelFlats: IPdfBrick[] = new Array<IPdfBrick>();
        let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
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
                    let panelContentPoint: IPoint = { xLeft: currPoint.xLeft, yTop: currPoint.yTop };
                    if (!!question.title) {
                        let panelTitleFlat: IPdfBrick = SurveyHelper.createTitlePanelFlat(
                            currPoint, null, controller, question.title);
                        let compositeFlat: CompositeBrick = new CompositeBrick(panelTitleFlat);
                        panelContentPoint = SurveyHelper.createPoint(panelTitleFlat);
                        if (!!question.description) {
                            let panelDescFlat: IPdfBrick = SurveyHelper.createDescFlat(
                                panelContentPoint, null, controller,
                                SurveyHelper.getLocString(question.locDescription));
                            compositeFlat.addBrick(panelDescFlat);
                            panelContentPoint = SurveyHelper.createPoint(panelDescFlat);
                        }
                        rowFlats.push(compositeFlat);
                    }
                    let oldPanelMarginLeft: number = controller.margins.marginLeft;
                    controller.margins.marginLeft += SurveyHelper.measureText(question.innerIndent).width;
                    panelContentPoint.xLeft += SurveyHelper.measureText(question.innerIndent).width;
                    rowFlats.push(...this.generateFlatsPagePanel(
                        question, controller, panelContentPoint));
                    controller.margins.marginLeft = oldPanelMarginLeft;
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
            if (rowFlats.length != 0) {
                currPoint.yTop = SurveyHelper.mergeRects(...rowFlats).yBot;
                currPoint.yTop += SurveyHelper.measureText().height;
                pagePanelFlats.push(...rowFlats);
            }
        });
        return pagePanelFlats;
    }
    static generateFlats(survey: PdfSurvey): IPdfBrick[][] {
        let flats: IPdfBrick[][] = new Array<IPdfBrick[]>();
        survey.pages.forEach((page: PanelModelBase) => {
            flats.push(this.generateFlatsPagePanel(page, survey.controller, survey.controller.leftTopPoint));
        });
        return flats;
    }
}