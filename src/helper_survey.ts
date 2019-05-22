import * as jsPDF from 'jspdf';
import { IQuestion, Question, QuestionRatingModel, LocalizableString } from 'survey-core';
import { IPoint, IRect, DocController } from './doc_controller';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { CommentBrick } from './pdf_render/pdf_comment';
import { LinkBrick } from './pdf_render/pdf_link';
import { CompositeBrick } from './pdf_render/pdf_composite';
import { RowlineBrick } from './pdf_render/pdf_rowline';
import { HTMLBrick } from './pdf_render/pdf_html';
import { EmptyBrick } from './pdf_render/empty';
import { TitleBrick } from './pdf_render/pdf_title';
import { DescriptionBrick } from './pdf_render/pdf_description';
import { TitlePanelBrick } from './pdf_render/pdf_titlepanel';
import { TextBrick } from './pdf_render/pdf_text';

export interface IText {
    text: string;
    rect: IRect
}
export class SurveyHelper {
    static readonly EPSILON: number = 2.2204460492503130808472633361816e-15;
    static readonly TITLE_PANEL_FONT_SIZE_SCALE_MAGIC: number = 1.3;
    static readonly DESCRIPTION_FONT_SIZE_SCALE_MAGIC: number = 2.0 / 3.0;
    static readonly RATING_MIN_WIDTH: number = 3;
    static readonly RATING_MIN_HEIGHT: number = 2;
    static readonly IMAGEPICKER_COUNT: number = 4;
    static readonly IMAGEPICKER_RATIO: number = 4.0 / 3.0;
    static readonly MATRIX_COLUMN_WIDTH: number = 5;
    static readonly MULTIPLETEXT_TEXT_PERS: number = Math.E / 10.0;
    private static _doc: any = new jsPDF({ unit: 'pt' });
    public static setFontSize(fontSize: number, font?: string) {
        this._doc.setFontSize(fontSize);
        if (typeof font !== 'undefined') {
            this._doc.setFont(font)
        }
    }
    static measureText(text: number | LocalizableString | string = 1, fontStyle: string = 'normal',
        fontSize: number = this._doc.getFontSize()) {
        let oldFontSize = this._doc.getFontSize();
        this._doc.setFontSize(fontSize);
        this._doc.setFontStyle(fontStyle);
        let height: number = this._doc.getLineHeight() / this._doc.internal.scaleFactor;;
        let width: number = 0;

        if (typeof text === 'number') {
            width = height * text;
        }
        else {
            text = (typeof text === 'string') ? text : SurveyHelper.getLocString(text);
            width = text.split('').reduce((sm: number, cr: string) =>
                sm + this._doc.getTextWidth(cr), 0);
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
    static createDivBlock(element: string, controller: DocController) {
        return `<div style=` + this.generateCssTextRule(controller.fontSize, controller.fontStyle, controller.doc.internal.getFont().fontName) + `>` + element + `</div>`;
    }
    static generateCssTextRule(fontSize: number, fontStyle: string, fontName: string): string {
        return `'font-size: ` + fontSize + `pt; font-weight:` + fontStyle + `; font-family:` + fontName + `;'`;
    }
    static splitHtmlRect(htmlBrick: IPdfBrick): IPdfBrick {
        let bricks: IPdfBrick[] = [];
        let brickWidth = htmlBrick.xRight - htmlBrick.xLeft;
        let sizeOfPoint = this.measureText(1, 'normal', 1).width;
        let emptyBrickCount = (htmlBrick.yBot - htmlBrick.yTop) / sizeOfPoint - 1;
        htmlBrick.yBot = htmlBrick.yTop + sizeOfPoint;
        bricks.push(htmlBrick);
        let currPoint = SurveyHelper.createPoint(htmlBrick);
        for (let i: number = 0; i < emptyBrickCount; i++) {
            let emptyBrick = new EmptyBrick(SurveyHelper.createRect(currPoint, brickWidth, sizeOfPoint))
            bricks.push(emptyBrick);
            currPoint = SurveyHelper.createPoint(emptyBrick);
        }
        return new CompositeBrick(...bricks);
    }
    static createPlainTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: string, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): IPdfBrick {
        let words: string[] = new Array<string>();
        text.match(/\S+/g).forEach((word: string) => {
            while (word.length > 0) {
                for (let i: number = word.length; i > 0; i--) {
                    let subword: string = word.substring(0, i);
                    let width: number = SurveyHelper.measureText(subword,
                        controller.fontStyle, controller.fontSize).width;
                    if (i == 1 || point.xLeft + width <= controller.paperWidth -
                        controller.margins.right + SurveyHelper.EPSILON) {
                        words.push(subword);
                        word = word.substring(i);
                        break;
                    }
                }
            }
        });
        let texts: IText[] = new Array<IText>();
        let currPoint: IPoint = SurveyHelper.clone(point);
        texts.push({ text: '', rect: null });
        words.forEach((word: string) => {
            let lastIndex: number = texts.length - 1;
            let currText: string = texts[lastIndex].text;
            let space: string = currText != '' ? ' ' : '';
            let width: number = SurveyHelper.measureText(currText + space + word,
                controller.fontStyle, controller.fontSize).width;
            if (currPoint.xLeft + width <= controller.paperWidth -
                controller.margins.right + SurveyHelper.EPSILON) {
                texts[lastIndex].text += space + word;
            }
            else {
                let { width, height } = SurveyHelper.measureText(texts[lastIndex].text,
                    controller.fontStyle, controller.fontSize);
                texts[lastIndex].rect = SurveyHelper.createRect(currPoint, width, height);
                texts.push({ text: word, rect: null });
                currPoint.yTop += height;
            }
        });
        let { width, height } = SurveyHelper.measureText(texts[texts.length - 1].text,
            controller.fontStyle, controller.fontSize);
        texts[texts.length - 1].rect = SurveyHelper.createRect(currPoint, width, height);
        let composite: CompositeBrick = new CompositeBrick();
        texts.forEach((text: IText) => {
            composite.addBrick(new fabric(question, controller, text.rect, text.text));
        });
        return composite;
    }
    static async createTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: LocalizableString | string, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): Promise<IPdfBrick> {
        if (typeof text === 'string' || !text.hasHtml) {
            return this.createPlainTextFlat(point, question, controller, typeof text === 'string' ?
                text : SurveyHelper.getLocString(<LocalizableString>text), fabric);
        }
        else {
            return this.splitHtmlRect(await this.createHTMLFlat(point, <Question>question, controller, this.createDivBlock(text.html, controller)));
        }

    }
    static htmlMargins(controller: DocController) {
        return {
            top: controller.margins.top,
            bottom: controller.margins.bot,
            left: controller.margins.left,
            width: controller.paperWidth - controller.margins.left - controller.margins.right,
        }
    }
    static async createHTMLFlat(point: IPoint, question: Question, controller: DocController, html: any): Promise<IPdfBrick> {
        let margins = this.htmlMargins(controller);
        return new Promise((resolve) => {
            SurveyHelper._doc.fromHTML(html, point.xLeft, margins.top, {
                'pagesplit': true,
                width: margins.width
            }, function (result: any) {
                let y: number;
                y = (SurveyHelper._doc.getNumberOfPages() - 1) *
                    (controller.paperHeight - controller.margins.bot - controller.margins.top)
                    + result.y - margins.top;
                for (let i: number = 0; i < SurveyHelper._doc.getNumberOfPages() - 1; i++) {
                    SurveyHelper._doc.deletePage(1);
                }
                let rect = SurveyHelper.createRect(point, margins.width, y);
                resolve(new HTMLBrick(question, controller, rect, html));
            }, margins)
        });
    }
    static async createBoldTextFlat(point: IPoint, question: Question, controller: DocController, text: LocalizableString | string) {
        controller.fontStyle = 'bold';
        let composite: IPdfBrick = await SurveyHelper.createTextFlat(point, question, controller,
            text, TitleBrick);
        controller.fontStyle = 'normal';
        return composite;
    }
    static async createTitleFlat(point: IPoint, question: Question, controller: DocController) {
        return await SurveyHelper.createBoldTextFlat(point, question, controller,
            SurveyHelper.getTitleText(question));
    }
    static async createTitlePanelFlat(point: IPoint, question: IQuestion,
        controller: DocController, text: string) {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.TITLE_PANEL_FONT_SIZE_SCALE_MAGIC;
        controller.fontStyle = 'bold';
        let composite: IPdfBrick = await SurveyHelper.createTextFlat(point,
            question, controller, text, TitlePanelBrick);
        controller.fontStyle = 'normal';
        controller.fontSize = oldFontSize;
        return composite;
    }
    static async createDescFlat(point: IPoint, question: IQuestion, controller: DocController, text: LocalizableString | string) {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        let composite: IPdfBrick = await SurveyHelper.createTextFlat(point, question, controller, text, DescriptionBrick);
        controller.fontSize = oldFontSize;
        return composite;
    }
    static createOtherFlat(point: IPoint, question: IQuestion,
        controller: DocController, index: number = 0): IPdfBrick {
        let otherRect: IRect = SurveyHelper.createTextFieldRect(point, controller, 2);
        return new CommentBrick(question, controller, otherRect, false, index);
    }
    static createImageFlat(point: IPoint, question: IQuestion,
        controller: DocController, imagelink: string, width: number): IPdfBrick {
        let height: number = width / SurveyHelper.IMAGEPICKER_RATIO;
        let html: string =
            `<img
                src="${imagelink}"
                width="${width}"
                height="${height}"
            />`;
        return new HTMLBrick(question, controller,
            SurveyHelper.createRect(point, width, height), html);
    }
    static createRowlineFlat(point: IPoint, controller: DocController,
        width?: number, color?: string): IPdfBrick {
        let xRight: number = typeof width === 'undefined' ?
            controller.paperWidth - controller.margins.right :
            point.xLeft + width;
        return new RowlineBrick(controller, {
            xLeft: point.xLeft,
            xRight: xRight,
            yTop: point.yTop + SurveyHelper.EPSILON,
            yBot: point.yTop + SurveyHelper.EPSILON
        }, typeof color === 'undefined' ? null : color);
    }
    static async  createLinkFlat(point: IPoint, question: Question,
        controller: DocController, text: string, link: string) {
        let compositeText: CompositeBrick = <CompositeBrick>await SurveyHelper.
            createTextFlat(point, question, controller, text, TextBrick);
        let compositeLink: CompositeBrick = new CompositeBrick();
        compositeText.unfold().forEach((text: TextBrick) => {
            compositeLink.addBrick(new LinkBrick(text, link));
            let linePoint: IPoint = SurveyHelper.createPoint(compositeLink);
            compositeLink.addBrick(SurveyHelper.createRowlineFlat(linePoint,
                controller, compositeLink.xRight - compositeLink.xLeft, LinkBrick.COLOR));
        });
        return compositeLink;
    }
    static createTextFieldRect(point: IPoint, controller: DocController, lines: number = 1): IRect {
        let width: number = controller.paperWidth - point.xLeft - controller.margins.right;
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
    static getTitleText(question: Question): LocalizableString {
        let title = new LocalizableString(question.locTitle.owner, question.locTitle.useMarkdown)
        title.text = (question.no != '' ? question.no + ' . ' : '') + question.locTitle.renderedHtml;
        return title;
    }
    static getLocString(locObj: LocalizableString): string {
        return locObj.renderedHtml;
    }
    static getRatingMinWidth(): number {
        return SurveyHelper.measureText(SurveyHelper.RATING_MIN_WIDTH).width;
    }
    static getRatingItemText(question: QuestionRatingModel,
        index: number, locText: LocalizableString): LocalizableString {
        let ratingItemLocText = new LocalizableString(locText.owner, locText.useMarkdown);
        ratingItemLocText.text = locText.text;
        if (index == 0 && question.minRateDescription) {
            ratingItemLocText.text =
                question.locMinRateDescription.text + locText.text;
        }
        else if (index == question.visibleRateValues.length - 1 &&
            question.maxRateDescription) {
            ratingItemLocText.text =
                locText.text + question.locMaxRateDescription.text;
        }
        return ratingItemLocText;
    }
    static getColumnWidth(question: Question, controller: DocController) {
        return SurveyHelper.getPageAvailableWidth(controller) /
            (question.hasRows ? (question.visibleColumns.length + 1)
                : question.visibleColumns.length);
    }
    static getPageAvailableWidth(controller: DocController): number {
        return controller.paperWidth - controller.margins.left - controller.margins.right;
    }
    static getImagePickerAvailableWidth(controller: DocController): number {
        let width: number = (SurveyHelper.getPageAvailableWidth(
            controller) - 3 * SurveyHelper.measureText().height);
        return width > 0 ? width : SurveyHelper.measureText().height;
    }
    static setColumnMargins(question: Question, controller: DocController, column: number) {
        let cellWidth = this.getColumnWidth(question, controller);
        controller.margins.left = controller.margins.left + column * cellWidth;
        controller.margins.right = controller.paperWidth - controller.margins.left - cellWidth;
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