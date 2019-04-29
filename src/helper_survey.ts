import { LocalizableString, Question, IQuestion } from 'survey-core';
import { IPoint, IRect, DocController } from './doc_controller';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { CompositeBrick } from './pdf_render/pdf_composite';

export interface IText {
    text: string;
    rect: IRect
}
export class SurveyHelper {
    static EPSILON: number = 2.2204460492503130808472633361816e-15;
    static DESCRIPTION_FONT_SIZE_SCALE_MAGIC: number = 2.0 / 3.0;
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
    static createPoint(rect: IRect, isLeft: boolean = true, isTop: boolean = false): IPoint {
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
    static createTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: string, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): IPdfBrick {
        let words: string[] = new Array<string>();
        text.match(/\S+/g).forEach((word: string) => {
            while (word.length > 0) {
                for (let i: number = word.length; i > 0; i--) {
                    let subword: string = word.substring(0, i);
                    let width: number = controller.measureText(subword).width;
                    if (i == 1 || point.xLeft + width <= controller.paperWidth -
                            controller.margins.marginRight + SurveyHelper.EPSILON) {
                        words.push(subword);
                        word = word.substring(i);
                        break;
                    }
                }
            }
        });
        let texts: IText[] = new Array<IText>();
        let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
        texts.push({ text: '', rect: null });
        words.forEach((word: string) => {
            let lastIndex: number = texts.length - 1;
            let currText: string = texts[lastIndex].text;
            let space: string = currText != '' ? ' ' : '';
            let width: number = controller.measureText(currText + space + word).width;
            if (currPoint.xLeft + width <= controller.paperWidth -
                    controller.margins.marginRight + SurveyHelper.EPSILON) {
                texts[lastIndex].text += space + word;
            }
            else {
                let { width, height } = controller.measureText(texts[lastIndex].text);
                texts[lastIndex].rect = SurveyHelper.createRect(currPoint, width, height);
                texts.push({ text: word, rect: null });
                currPoint.yTop += height;
            }
        });
        let { width, height } = controller.measureText(texts[texts.length - 1].text);
        texts[texts.length - 1].rect = SurveyHelper.createRect(currPoint, width, height);
        let composite: CompositeBrick = new CompositeBrick();
        texts.forEach((text: IText) => {
            composite.addBrick(new fabric(question, controller, text.rect, text.text));
        });
        return composite;
    }
    static createDescFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: string, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): IPdfBrick {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        let composite: IPdfBrick = SurveyHelper.createTextFlat(point, question, controller, text, fabric);
        controller.fontSize = oldFontSize;
        return composite;
    }
    static createTextFieldRect(point: IPoint, controller: DocController, lines: number = 1): IRect {
        let width: number = controller.paperWidth - point.xLeft -
            controller.margins.marginRight;
        let height: number = controller.measureText().height * lines;
        return SurveyHelper.createRect(point, width, height);
    }
    static createAcroformRect(rect: IRect): Array<number> {
        return [
            rect.xLeft,
            rect.yTop,
            rect.xRight - rect.xLeft,
            rect.yBot - rect.yTop
        ];
    }
    static getTitleText(question: Question): string {
        let number: string = question.no != '' ? question.no + ' . ' : '';
        return number + SurveyHelper.getLocString(question.locTitle);
    }
    static getLocString(locObj: LocalizableString): string {
        return locObj.renderedHtml;
    }
}