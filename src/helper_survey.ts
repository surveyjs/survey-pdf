import { IQuestion, Question, QuestionRatingModel, LocalizableString } from 'survey-core';
import { IPoint, IRect, DocController } from './doc_controller';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { TextBrick } from './pdf_render/pdf_text';
import { TitleBrick } from './pdf_render/pdf_title';
import { TitlePanelBrick } from './pdf_render/pdf_titlepanel';
import { DescriptionBrick } from './pdf_render/pdf_description';
import { CommentBrick } from './pdf_render/pdf_comment';
import { LinkBrick } from './pdf_render/pdf_link';
import { HTMLBrick } from './pdf_render/pdf_html';
import { EmptyBrick } from './pdf_render/pdf_empty';
import { RowlineBrick } from './pdf_render/pdf_rowline';
import { CompositeBrick } from './pdf_render/pdf_composite';

export interface IText {
    text: string;
    rect: IRect
}
export class SurveyHelper {
    public static readonly EPSILON: number = 2.2204460492503130808472633361816e-15;
    public static readonly TITLE_PANEL_FONT_SIZE_SCALE_MAGIC: number = 1.3;
    public static readonly DESCRIPTION_FONT_SIZE_SCALE_MAGIC: number = 2.0 / 3.0;
    public static readonly RATING_MIN_WIDTH: number = 3;
    public static readonly RATING_MIN_HEIGHT: number = 2;
    public static readonly MATRIX_COLUMN_WIDTH: number = 5;
    public static readonly IMAGEPICKER_COUNT: number = 4;
    public static readonly IMAGEPICKER_RATIO: number = 4.0 / 3.0;
    public static readonly MULTIPLETEXT_TEXT_PERS: number = Math.E / 10.0;
    public static readonly HTML_TAIL_TEXT: number = 0.2;
    public static mergeRects(...rects: IRect[]): IRect {
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
    public static createPoint(rect: IRect, isLeft: boolean = true, isTop: boolean = false): IPoint {
        return {
            xLeft: isLeft ? rect.xLeft : rect.xRight,
            yTop: isTop ? rect.yTop : rect.yBot
        };
    }
    public static createRect(point: IPoint, width: number, height: number): IRect {
        return {
            xLeft: point.xLeft,
            xRight: point.xLeft + width,
            yTop: point.yTop,
            yBot: point.yTop + height
        };
    }
    public static createDivBlock(element: string, controller: DocController) {
        return `<div style=` + this.generateCssTextRule(controller.fontSize,
            controller.fontStyle, controller.doc.internal.getFont().fontName) + `>` + element + `</div>`;
    }
    public static generateCssTextRule(fontSize: number, fontStyle: string, fontName: string): string {
        return `'font-size: ` + fontSize + `pt; font-weight:` + fontStyle + `; font-family:` + fontName + `;'`;
    }
    public static splitHtmlRect(controller: DocController, htmlBrick: IPdfBrick): IPdfBrick {
        let bricks: IPdfBrick[] = [];
        let brickWidth = htmlBrick.xRight - htmlBrick.xLeft;
        let sizeOfPoint = controller.measureText(1, 'normal', 1).width;
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
    public static createPlainTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: string, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): IPdfBrick {
        let words: string[] = [];
        text.match(/\S+/g).forEach((word: string) => {
            while (word.length > 0) {
                for (let i: number = word.length; i > 0; i--) {
                    let subword: string = word.substring(0, i);
                    let width: number = controller.measureText(subword,
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
        let texts: IText[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        texts.push({ text: '', rect: null });
        words.forEach((word: string) => {
            let lastIndex: number = texts.length - 1;
            let currText: string = texts[lastIndex].text;
            let space: string = currText != '' ? ' ' : '';
            let width: number = controller.measureText(currText + space + word,
                controller.fontStyle, controller.fontSize).width;
            if (currPoint.xLeft + width <= controller.paperWidth -
                controller.margins.right + SurveyHelper.EPSILON) {
                texts[lastIndex].text += space + word;
            }
            else {
                let { width, height } = controller.measureText(texts[lastIndex].text,
                    controller.fontStyle, controller.fontSize);
                texts[lastIndex].rect = SurveyHelper.createRect(currPoint, width, height);
                texts.push({ text: word, rect: null });
                currPoint.yTop += height;
            }
        });
        let { width, height } = controller.measureText(texts[texts.length - 1].text,
            controller.fontStyle, controller.fontSize);
        texts[texts.length - 1].rect = SurveyHelper.createRect(currPoint, width, height);
        let composite: CompositeBrick = new CompositeBrick();
        texts.forEach((text: IText) => {
            composite.addBrick(new fabric(question, controller, text.rect, text.text));
        });
        return composite;
    }
    public static async createTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: LocalizableString | string, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): Promise<IPdfBrick> {
        if (typeof text === 'string' || !text.hasHtml) {
            return this.createPlainTextFlat(point, question, controller, typeof text === 'string' ?
                text : SurveyHelper.getLocString(<LocalizableString>text), fabric);
        }
        else {
            return this.splitHtmlRect(controller, await this.createHTMLFlat(point,
                <Question>question, controller, this.createDivBlock(text.html, controller)));
        }

    }
    static htmlMargins(controller: DocController, point: IPoint) {
        return {
            top: controller.margins.top,
            bottom: controller.margins.bot,
            width: controller.paperWidth - point.xLeft - controller.margins.right,
        }
    }
    static async createHTMLFlat(point: IPoint, question: Question, controller: DocController, html: any): Promise<IPdfBrick> {
        let margins = this.htmlMargins(controller, point);
        return await new Promise((resolve) => {
            controller.helperDoc.fromHTML(html, point.xLeft, margins.top, {
                'pagesplit': true,
                width: margins.width
            }, function (result: any) {
                let yBot: number;
                yBot = (controller.helperDoc.getNumberOfPages() - 1) *
                    (controller.paperHeight - controller.margins.bot - controller.margins.top)
                    + result.y - margins.top + SurveyHelper.HTML_TAIL_TEXT * controller.fontSize;
                for (let i = 0; i < controller.helperDoc.getNumberOfPages() - 1; i++) {
                    controller.helperDoc.deletePage(1);
                }
                let rect = SurveyHelper.createRect(point, margins.width, yBot);
                resolve(new HTMLBrick(question, controller, rect, html));
            }, margins)
        });
    }
    public static async createBoldTextFlat(point: IPoint, question: Question,
        controller: DocController, text: LocalizableString | string) {
        controller.fontStyle = 'bold';
        let composite: IPdfBrick = await SurveyHelper.createTextFlat(
            point, question, controller, text, TitleBrick);
        controller.fontStyle = 'normal';
        return composite;
    }
    public static async createTitleFlat(point: IPoint, question: Question, controller: DocController) {
        return await SurveyHelper.createBoldTextFlat(point, question, controller,
            SurveyHelper.getTitleText(question));
    }
    public static async createTitlePanelFlat(point: IPoint, question: IQuestion,
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
    public static async createDescFlat(point: IPoint, question: IQuestion,
        controller: DocController, text: LocalizableString | string) {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        let composite: IPdfBrick = await SurveyHelper.createTextFlat(point, question, controller, text, DescriptionBrick);
        controller.fontSize = oldFontSize;
        return composite;
    }
    public static createOtherFlat(point: IPoint, question: IQuestion,
        controller: DocController, index: number = 0): IPdfBrick {
        let otherRect: IRect = SurveyHelper.createTextFieldRect(point, controller, 2);
        return new CommentBrick(question, controller, otherRect, false, index);
    }
    public static createImageFlat(point: IPoint, question: IQuestion,
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
    public static createRowlineFlat(point: IPoint, controller: DocController,
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
    public static async  createLinkFlat(point: IPoint, question: Question,
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
    public static createTextFieldRect(point: IPoint, controller: DocController, lines: number = 1): IRect {
        let width: number = controller.paperWidth - point.xLeft - controller.margins.right;
        let height: number = controller.measureText().height * lines;
        return SurveyHelper.createRect(point, width, height);
    }
    public static createAcroformRect(rect: IRect): number[] {
        return [
            rect.xLeft,
            rect.yTop,
            rect.xRight - rect.xLeft,
            rect.yBot - rect.yTop
        ];
    }
    public static getTitleText(question: Question): LocalizableString {
        let title = new LocalizableString(question.locTitle.owner, question.locTitle.useMarkdown)
        title.text = (question.no != '' ? question.no + ' . ' : '') + question.locTitle.renderedHtml;
        return title;
    }
    public static getLocString(locObj: LocalizableString): string {
        return locObj.renderedHtml;
    }
    public static getRatingMinWidth(controller: DocController): number {
        return controller.measureText(SurveyHelper.RATING_MIN_WIDTH).width;
    }
    public static getRatingItemText(question: QuestionRatingModel,
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
    public static getColumnWidth(question: Question, controller: DocController) {
        return SurveyHelper.getPageAvailableWidth(controller) /
            (question.hasRows ? (question.visibleColumns.length + 1)
                : question.visibleColumns.length);
    }
    public static getPageAvailableWidth(controller: DocController): number {
        return controller.paperWidth - controller.margins.left - controller.margins.right;
    }
    public static getImagePickerAvailableWidth(controller: DocController): number {
        let width: number = (SurveyHelper.getPageAvailableWidth(
            controller) - 3 * controller.measureText().height);
        return width > 0 ? width : controller.measureText().height;
    }
    public static setColumnMargins(question: Question, controller: DocController, column: number) {
        let cellWidth = this.getColumnWidth(question, controller);
        controller.margins.left = controller.margins.left + column * cellWidth;
        controller.margins.right = controller.paperWidth - controller.margins.left - cellWidth;
    }
    public static clone(src: any) {
        let target: any = {};
        for (let prop in src) {
            if (src.hasOwnProperty(prop)) {
                target[prop] = src[prop];
            }
        }
        return target;
    }
}