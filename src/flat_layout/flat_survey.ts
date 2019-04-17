import { IQuestion } from 'survey-core';
import { PdfSurvey } from '../survey';
import { IPdfQuestion } from '../pdf_render/pdf_question';
import { IPoint } from "../docController";
import { FlatRepository } from './flat_repository';
import { IFlatQuestion } from './flat_question';

export class FlatSurvey {
    static generateFlats(survey: PdfSurvey): IPdfQuestion[] {
        let controller = survey.controller;
        let point: IPoint = {
            xLeft: controller.margins.marginLeft,
            yTop: controller.margins.marginTop
        };
        survey.pages.forEach((page: any) => {
            page.questions.forEach((question: IQuestion) => {
            let flatQuestion: IFlatQuestion =
                FlatRepository.getInstance().create(question, controller);
            flatQuestion.generateFlats(point);
            // let renderBoundaries: IRect[] = renderer.render(point, false);
            // if (this.docController.isNewPageQuestion(renderBoundaries)) {
            //     this.docController.addPage();
            //     point.xLeft = this.docController.margins.marginLeft;
            //     point.yTop = this.docController.margins.marginTop;
            // }
            // renderBoundaries = renderer.render(point, true);
            // point.yTop = renderBoundaries[renderBoundaries.length - 1].yBot;
            // point.yTop += this.docController.measureText().height;
            // if (this.docController.isNewPageElement(point.yTop)) {
            //     this.docController.addPage();
            //     point.xLeft = this.docController.margins.marginLeft;
            //     point.yTop = this.docController.margins.marginTop;
            // }
            });
        });
        return null;
    }
}