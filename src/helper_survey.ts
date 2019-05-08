import { LocalizableString, Question, IQuestion } from 'survey-core';
import { IPoint, IRect, DocController } from './doc_controller';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { TitleBrick } from './pdf_render/pdf_title';
import { TitlePanelBrick } from './pdf_render/pdf_titlepanel';
import { DescriptionBrick } from './pdf_render/pdf_description';
import { CompositeBrick } from './pdf_render/pdf_composite';
import { RowlineBrick } from './pdf_render/pdf_rowline';
import * as jsPDF from 'jspdf';

export interface IText {
    text: string;
    rect: IRect
}
export class SurveyHelper {
    static EPSILON: number = 2.2204460492503130808472633361816e-15;
    static TITLE_PANEL_FONT_SIZE_SCALE_MAGIC: number = 1.3;
    static DESCRIPTION_FONT_SIZE_SCALE_MAGIC: number = 2.0 / 3.0;
    private static _doc: any = new jsPDF();
    public static setFontSize(fontSize: number, font?: string) {
        this._doc.setFontSize(fontSize);
        if (font != undefined) {
            this._doc.setFont(font)
        }
    }
    static measureText(text: number | string = 1, fontSize: number = this._doc.getFontSize(),
        fontStyle: string = 'normal') {
        let oldFontSize = this._doc.getFontSize();
        this._doc.setFontSize(fontSize);
        this._doc.setFontStyle(fontStyle);
        let height: number = this._doc.getLineHeight() / this._doc.internal.scaleFactor;
        let width: number = 0;
        if (typeof text === 'string') {
            width = text.split('').reduce((sm: number, cr: string) => sm + this._doc.getTextWidth(cr), 0);
        }
        else {
            width = height * text;
        }
        this._doc.setFontSize(oldFontSize);
        this._doc.setFontStyle('normal');
        return {
            width: width,
            height: height
        }
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
                    let width: number = SurveyHelper.measureText(subword, controller.fontSize, controller.fontStyle).width;
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
            let width: number = SurveyHelper.measureText(currText + space + word, controller.fontSize, controller.fontStyle).width;
            if (currPoint.xLeft + width <= controller.paperWidth -
                controller.margins.marginRight + SurveyHelper.EPSILON) {
                texts[lastIndex].text += space + word;
            }
            else {
                let { width, height } = SurveyHelper.measureText(texts[lastIndex].text, controller.fontSize, controller.fontStyle);
                texts[lastIndex].rect = SurveyHelper.createRect(currPoint, width, height);
                texts.push({ text: word, rect: null });
                currPoint.yTop += height;
            }
        });
        let { width, height } = SurveyHelper.measureText(texts[texts.length - 1].text, controller.fontSize, controller.fontStyle);
        texts[texts.length - 1].rect = SurveyHelper.createRect(currPoint, width, height);
        let composite: CompositeBrick = new CompositeBrick();
        texts.forEach((text: IText) => {
            composite.addBrick(new fabric(question, controller, text.rect, text.text));
        });
        return composite;
    }
    static createBoldTextFlat(point: IPoint, question: Question, controller: DocController, text: string) {
        controller.fontStyle = 'bold';
        let composite: IPdfBrick = SurveyHelper.createTextFlat(point, question, controller,
            text, TitleBrick);
        controller.fontStyle = 'normal';
        return composite;
    }
    static createTitleFlat(point: IPoint, question: Question, controller: DocController): IPdfBrick {
        let composite: IPdfBrick = SurveyHelper.createBoldTextFlat(point, question, controller,
            SurveyHelper.getTitleText(question));
        return composite;
    }
    static createTitlePanelFlat(point: IPoint, question: IQuestion,
        controller: DocController, text: string): IPdfBrick {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.TITLE_PANEL_FONT_SIZE_SCALE_MAGIC;
        controller.fontStyle = 'bold';
        let composite: IPdfBrick = SurveyHelper.createTextFlat(point, question, controller, text, TitlePanelBrick);
        controller.fontStyle = 'normal';
        controller.fontSize = oldFontSize;
        return composite;
    }
    static createDescFlat(point: IPoint, question: IQuestion, controller: DocController, text: string): IPdfBrick {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        let composite: IPdfBrick = SurveyHelper.createTextFlat(point, question, controller, text, DescriptionBrick);
        controller.fontSize = oldFontSize;
        return composite;
    }
    static createTextFieldRect(point: IPoint, controller: DocController, lines: number = 1): IRect {
        let width: number = controller.paperWidth - point.xLeft -
            controller.margins.marginRight;
        let height: number = SurveyHelper.measureText().height * lines;
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
    static getColumnWidth(question: Question, controller: DocController) {
        return (controller.paperWidth - controller.margins.marginLeft
            - controller.margins.marginRight) /
            (question.hasRows ? (question.visibleColumns.length + 1)
                : question.visibleColumns.length);
    }
    static setColumnMargins(question: Question, controller: DocController, column: number) {
        let cellWidth = this.getColumnWidth(question, controller);
        controller.margins.marginLeft = controller.margins.marginLeft + column * cellWidth;
        controller.margins.marginRight = controller.paperWidth - controller.margins.marginLeft - cellWidth;
    }
    static createRowlineFlat(point: IPoint, controller: DocController): IPdfBrick {
        return new RowlineBrick({
            xLeft: controller.margins.marginLeft,
            xRight: controller.paperWidth - controller.margins.marginRight,
            yTop: point.yTop + SurveyHelper.EPSILON,
            yBot: point.yTop + SurveyHelper.EPSILON
        });
    }
    static clone(src: any) {
        let target: any = {};
        for (let prop in src) {
            if (src.hasOwnProperty(prop)) {
                target[prop] = src[prop];
            }
        }
        return target;
    }
}