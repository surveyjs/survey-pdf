import { IQuestion, PageModel, QuestionRowModel, IElement } from 'survey-core';
import { PdfSurvey } from '../survey';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { IPoint } from "../docController";
import { FlatRepository } from './flat_repository';
import { IFlatQuestion } from './flat_question';

export class FlatSurvey {
    static parseWidth(width: string): number {
        return parseFloat(width) / 100.0;
    }
    static generateFlats(survey: PdfSurvey): IPdfBrick[] {
        let controller = survey.controller;
        let point: IPoint = {
            xLeft: controller.margins.marginLeft,
            yTop: controller.margins.marginTop
        };
        let flats: IPdfBrick[] = new Array();
        survey.pages.forEach((page: PageModel) => {
            if (!page.isVisible) return;
            page.rows.forEach((row: QuestionRowModel) => {
                if (!row.visible) return;
                let width: number = controller.paperWidth -
                    controller.margins.marginLeft - controller.margins.marginRight;
                let oldMarginLeft: number = controller.margins.marginLeft;
                let oldMarginRight: number = controller.margins.marginRight;
                let currMarginLeft: number = controller.margins.marginLeft;
                row.elements.forEach((question: IElement) => {
                    let persWidth: number = width * FlatSurvey.parseWidth(question.width);
                    controller.margins.marginLeft = currMarginLeft;
                    controller.margins.marginRight = controller.paperWidth -
                        currMarginLeft - persWidth;
                    currMarginLeft = controller.paperWidth - controller.margins.marginRight;
                    let flatQuestion: IFlatQuestion =
                        FlatRepository.getInstance().create(<IQuestion>question, controller);
                    flats.push(...flatQuestion.generateFlats(point));
                });
                controller.margins.marginLeft = oldMarginLeft;
                controller.margins.marginRight = oldMarginRight;
            });
        });
        return flats;
    }
}