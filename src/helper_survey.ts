import { LocalizableString } from 'survey-core';
import { IPoint, IRect, DocController } from "./doc_controller";
import { IPdfBrick, PdfBrick } from './pdf_render/pdf_brick'

export class SurveyHelper {
    static measureTextRect(point: IPoint, controller: DocController, text: string): IRect {
        let { width, height } = controller.measureText(text);
        return SurveyHelper.createRect(point, width, height);
    }
    static measureTextFieldRect(point: IPoint, controller: DocController, lines: number = 1): IRect {
        let width: number = controller.paperWidth - point.xLeft -
            controller.margins.marginRight;
        let height: number = controller.measureText().height * lines;
        return SurveyHelper.createRect(point, width, height);
    }
    static mergeRects(...rects: IRect[]): IRect {
        let resultRect: IRect = {
            xLeft: rects[0].xLeft,
            xRight: rects[0].xRight,
            yTop: rects[0].yTop,
            yBot: rects[0].yBot
        };
        rects.forEach((rect: IRect) => {
            resultRect.xLeft = Math.min(resultRect.xLeft, rect.xLeft),
                resultRect.xRight = Math.max(resultRect.xRight, rect.xRight),
                resultRect.yTop = Math.min(resultRect.yTop, rect.yTop),
                resultRect.yBot = Math.max(resultRect.yBot, rect.yBot)
        });
        return resultRect;
    }
    static createPoint(flat: IPdfBrick | IRect, isLeft: boolean = true, isTop: boolean = false): IPoint {
        let rect: IRect = flat instanceof PdfBrick ? (<PdfBrick>flat).rect : <IRect>flat;
        return {
            xLeft: isLeft ? rect.xLeft : rect.xRight,
            yTop: isTop ? rect.yTop : rect.yBot
        };
    }
    static createRect(point: IPoint, width: number, height: number): IRect {
        return {
            xLeft: point.xLeft,
            xRight: point.xLeft + width,
            yTop: point.yTop,
            yBot: point.yTop + height
        };
    }
    static createAcroformRect(rect: IRect): Array<number> {
        return [
            rect.xLeft,
            rect.yTop,
            rect.xRight - rect.xLeft,
            rect.yBot - rect.yTop
        ];
    }
    static getLocString(locObj: LocalizableString): string {
        return locObj.renderedHtml;
    }
}