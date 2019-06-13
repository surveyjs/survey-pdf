import { IQuestion, Question, QuestionRatingModel, LocalizableString } from 'survey-core';
import { IPoint, IRect, ISize, DocController, } from './doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_render/pdf_brick';
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
    public static readonly HTML_TAIL_TEXT: number = 0.24;
    public static readonly SELECT_ITEM_FLAT_SCALE: number = 0.8;
    public static readonly GAP_BETWEEN_ROWS: number = 0.25;
    public static readonly BORDER_SCALE: number = 0.1;
    public static readonly VISIBLE_BORDER_SCALE: number = 0.6;
    public static readonly UNVISIBLE_BORDER_SCALE: number = 0.4;
    public static readonly RADIUS_SCALE: number = 2.5;
    public static readonly TEXT_COLOR: string = '#000000';
    public static readonly BACKGROUND_COLOR: string = '#FFFFFF';
    public static readonly TITLE_LOCATION_MATRIX: string = 'matrix';

    public static parseWidth(width: string, maxWidth: number): number {
        let value: number = parseFloat(width);
        let unit: string = width.replace(/[^A-Za-z]/g, '');
        let k: number;
        switch (unit) {
            case 'pt':
                k = 1.0;
                break;
            case 'mm':
                k = 72.0 / 25.4;
                break;
            case 'cm':
                k = 72.0 / 2.54;
                break;
            case 'in':
                k = 72.0;
                break;
            case 'px':
                k = 72.0 / 96.0;
                break;
            case 'pc':
                k = 12.0;
                break;
            case 'em':
                k = 12.0;
                break;
            case 'ex':
                k = 6.0;
                break;
            default:
            case '%':
                k = maxWidth / 100.0;
                break;
        }
        return Math.min(value * k, maxWidth);
    }
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
        return `<div style= ${this.generateCssTextRule(controller.fontSize,
            controller.fontStyle,
            `helvetica`)}>
            ${element}
            </div>`;
    }
    public static generateCssTextRule(fontSize: number, fontStyle: string, fontName: string): string {
        return `'font-size: ${fontSize}pt; 
                 font-weight: ${fontStyle}; 
                 font-family:${fontName};'`;
    }
    public static splitHtmlRect(controller: DocController, htmlBrick: IPdfBrick): IPdfBrick {
        let bricks: IPdfBrick[] = [];
        let htmlHeight = htmlBrick.height;
        let minHeight = controller.measureText(1, 'normal', controller.doc.fontSize).height;
        let emptyBrickCount = Math.floor(htmlHeight / minHeight) - 1;
        htmlBrick.yBot = htmlBrick.yTop + minHeight;
        bricks.push(htmlBrick);
        let currPoint = SurveyHelper.createPoint(htmlBrick);
        for (let i: number = 0; i < emptyBrickCount; i++) {
            let emptyBrick = new EmptyBrick(SurveyHelper.createRect(currPoint, htmlBrick.width, minHeight))
            bricks.push(emptyBrick);
            currPoint.yTop += minHeight;
        }
        let remainingHeight = htmlHeight - (emptyBrickCount + 1) * minHeight;
        if (remainingHeight > 0) {
            bricks.push(new EmptyBrick(SurveyHelper.createRect(currPoint, htmlBrick.width, remainingHeight)));
        }
        return new CompositeBrick(...bricks);
    }
    public static createPlainTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: string, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): IPdfBrick {
        let lines: string[] = controller.doc.splitTextToSize(text,
            controller.paperWidth - controller.margins.right - point.xLeft);
        let currPoint: IPoint = SurveyHelper.clone(point);
        let composite: CompositeBrick = new CompositeBrick();
        lines.forEach((line: string) => {
            let size: ISize = controller.measureText(line);
            composite.addBrick(new fabric(question, controller,
                SurveyHelper.createRect(currPoint, size.width, size.height), line));
            currPoint.yTop += size.height;
        });
        return composite;
    }
    public static async createTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: string | LocalizableString, fabric: new (question: IQuestion,
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
    static htmlMargins(controller: DocController, point: IPoint): { top: number, bottom: number, width: number } {
        return {
            top: controller.margins.top,
            bottom: controller.margins.bot,
            width: controller.paperWidth - point.xLeft - controller.margins.right,
        }
    }
    static async createHTMLFlat(point: IPoint, question: Question, controller: DocController, html: string): Promise<IPdfBrick> {
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
                controller.helperDoc.addPage();
                for (let i: number = 0; i < controller.helperDoc.getNumberOfPages(); i++) {
                    controller.helperDoc.deletePage(1);
                }
                let rect = SurveyHelper.createRect(point, margins.width, yBot);
                resolve(new HTMLBrick(question, controller, rect, html));
            }, margins)
        });
    }
    public static async createBoldTextFlat(point: IPoint, question: Question,
        controller: DocController, text: string | LocalizableString) {
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
        controller: DocController, text: string | LocalizableString) {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE_MAGIC;
        let composite: IPdfBrick = await SurveyHelper.createTextFlat(
            point, question, controller, text, DescriptionBrick);
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
                src='${imagelink}'
                width='${width}'
                height='${height}'
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
                controller, compositeLink.width, LinkBrick.COLOR));
        });
        return compositeLink;
    }
    public static createTextFieldRect(point: IPoint, controller: DocController, lines: number = 1): IRect {
        let width: number = controller.paperWidth - point.xLeft - controller.margins.right;
        let height: number = controller.unitHeight * lines;
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
        if (index === 0 && question.minRateDescription) {
            ratingItemLocText.text =
                question.locMinRateDescription.text + locText.text;
        }
        else if (index === question.visibleRateValues.length - 1 &&
            question.maxRateDescription) {
            ratingItemLocText.text =
                locText.text + question.locMaxRateDescription.text;
        }
        return ratingItemLocText;
    }

    public static getColumnWidth(controller: DocController, colCount: number) {
        return SurveyHelper.getPageAvailableWidth(controller) / colCount;
    }
    public static getPageAvailableWidth(controller: DocController): number {
        return controller.paperWidth - controller.margins.left - controller.margins.right;
    }
    public static getImagePickerAvailableWidth(controller: DocController): number {
        let width: number = (SurveyHelper.getPageAvailableWidth(
            controller) - (SurveyHelper.IMAGEPICKER_COUNT - 1) * controller.unitHeight);
        return width > 0 ? width : controller.unitHeight;
    }
    public static setColumnMargins(controller: DocController, colCount: number, column: number) {
        let cellWidth: number = this.getColumnWidth(controller, colCount);
        controller.margins.left = controller.margins.left + column * cellWidth;
        controller.margins.right = controller.paperWidth - controller.margins.left - cellWidth;
    }
    public static moveRect(rect: IRect, left: number = rect.xLeft, top: number = rect.yTop): IRect {
        let width: number = rect.xRight - rect.xLeft;
        let height: number = rect.yBot - rect.yTop;
        return {
            xLeft: left,
            yTop: top,
            xRight: left + width,
            yBot: top + height
        }
    }
    public static scaleRect(rect: IRect, scale: number): IRect {
        let width: number = rect.xRight - rect.xLeft;
        let height: number = rect.yBot - rect.yTop;
        let scaleWidth: number = ((width < height) ? width : height) * (1.0 - scale) / 2.0;
        return {
            xLeft: rect.xLeft + scaleWidth,
            yTop: rect.yTop + scaleWidth,
            xRight: rect.xRight - scaleWidth,
            yBot: rect.yBot - scaleWidth
        }
    }
    public static formScale(controller: DocController, flat: PdfBrick): number {
        let minSide = flat.width < flat.height ? flat.width : flat.height;
        let fontSize = controller.unitHeight;
        return (minSide - fontSize * SurveyHelper.BORDER_SCALE * 2.0) / minSide;
    }
    public static wrapInBordersFlat(controller: DocController, flat: PdfBrick): void {
        let minSide = flat.width < flat.height ? flat.width : flat.height;
        let fontSize: number = controller.unitWidth;
        let visibleWidth: number = fontSize * SurveyHelper.VISIBLE_BORDER_SCALE * SurveyHelper.BORDER_SCALE;
        let visibleScale: number = SurveyHelper.formScale(controller, flat) + visibleWidth / minSide;
        let unvisibleWidth: number = fontSize * SurveyHelper.UNVISIBLE_BORDER_SCALE * SurveyHelper.BORDER_SCALE;
        let unvisibleScale: number = 1.0 - unvisibleWidth / minSide;
        let unvisibleRadius: number = SurveyHelper.RADIUS_SCALE * unvisibleWidth;
        controller.doc.setDrawColor(SurveyHelper.TEXT_COLOR);
        controller.doc.setLineWidth(visibleWidth);
        controller.doc.rect(...SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(flat, visibleScale)));
        controller.doc.setDrawColor(SurveyHelper.BACKGROUND_COLOR);
        controller.doc.setLineWidth(unvisibleWidth);
        controller.doc.roundedRect(...SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(flat, unvisibleScale)), unvisibleRadius, unvisibleRadius);
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