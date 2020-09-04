import { IQuestion, Question, QuestionRatingModel,
    QuestionFileModel, LocalizableString } from 'survey-core';
import * as SurveyPDFModule from './entries/pdf';
import { SurveyPDF } from './survey';
import { IPoint, IRect, ISize, DocController } from './doc_controller';
import { FlatRepository } from './flat_layout/flat_repository';
import { IFlatQuestion } from './flat_layout/flat_question';
import { IPdfBrick, PdfBrick } from './pdf_render/pdf_brick';
import { TextBrick } from './pdf_render/pdf_text';
import { TextBoldBrick } from './pdf_render/pdf_textbold';
import { TitlePanelBrick } from './pdf_render/pdf_titlepanel';
import { DescriptionBrick } from './pdf_render/pdf_description';
import { CommentBrick } from './pdf_render/pdf_comment';
import { LinkBrick } from './pdf_render/pdf_link';
import { HTMLBrick } from './pdf_render/pdf_html';
import { EmptyBrick } from './pdf_render/pdf_empty';
import { RowlineBrick } from './pdf_render/pdf_rowline';
import { CompositeBrick } from './pdf_render/pdf_composite';
import { AdornersOptions } from './event_handler/adorners';

export class SurveyHelper {
    public static readonly EPSILON: number = 2.2204460492503130808472633361816e-15;
    public static readonly TITLE_SURVEY_FONT_SIZE_SCALE: number = 1.7;
    public static readonly TITLE_PANEL_FONT_SIZE_SCALE: number = 1.3;
    public static readonly DESCRIPTION_FONT_SIZE_SCALE: number = 2.0 / 3.0;
    public static readonly RATING_MIN_WIDTH: number = 3;
    public static readonly RATING_MIN_HEIGHT: number = 2;
    public static readonly RATING_COLUMN_WIDTH: number = 5;
    public static readonly MATRIX_COLUMN_WIDTH: number = 5;
    public static readonly IMAGEPICKER_COUNT: number = 4;
    public static readonly IMAGEPICKER_RATIO: number = 4.0 / 3.0;
    public static readonly MULTIPLETEXT_TEXT_PERS: number = Math.E / 10.0;
    public static readonly HTML_TAIL_TEXT: number = 0.24;
    public static readonly SELECT_ITEM_FLAT_SCALE: number = 0.95;
    public static readonly GAP_BETWEEN_ROWS: number = 0.25;
    public static readonly GAP_BETWEEN_COLUMNS: number = 1.5;
    public static readonly GAP_BETWEEN_ITEM_TEXT: number = 0.25;
    public static readonly BORDER_SCALE: number = 0.1;
    public static readonly VISIBLE_BORDER_SCALE: number = 0.8;
    public static readonly UNVISIBLE_BORDER_SCALE: number = 0.2;
    public static readonly RADIUS_SCALE: number = 3;
    public static readonly TITLE_FONT_SCALE: number = 1.1;
    public static readonly VALUE_READONLY_PADDING_SCALE: number = 0.3;
    public static readonly HTML_TO_IMAGE_QUALITY: number = 1.0;
    public static readonly FORM_BORDER_COLOR: string = '#9f9f9f';
    public static readonly TEXT_COLOR: string = '#404040';
    public static readonly BACKGROUND_COLOR: string = '#FFFFFF';
    public static readonly TITLE_LOCATION_MATRIX: string = 'matrix';
    public static readonly STANDARD_FONT: string = 'helvetica';
    public static readonly CUSTOM_FONT_ENCODING: string = 'Identity-H';

    public static parseWidth(width: string, maxWidth: number,
        columnsCount: number = 1): number {
        if (width.indexOf('calc') === 0) {
            return maxWidth / columnsCount;
        }
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
    public static pxToPt(value: number) {
        return value * 72.0 / 96.0;
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
    public static createHeaderRect(controller: DocController): IRect {
        return {
            xLeft: 0.0,
            xRight: controller.paperWidth,
            yTop: 0.0,
            yBot: controller.margins.top
        };
    }
    public static createFooterRect(controller: DocController): IRect {
        return {
            xLeft: 0.0,
            xRight: controller.paperWidth,
            yTop: controller.paperHeight - controller.margins.bot,
            yBot: controller.paperHeight
        };
    }
    public static createDivBlock(element: string, controller: DocController): string {
        return `<div style= ${this.generateCssTextRule(controller.fontSize,
            controller.fontStyle,
            SurveyHelper.isCustomFont(controller, controller.fontName) ? SurveyHelper.STANDARD_FONT : controller.fontName)}>
            ${element}
            </div>`;
    }
    public static generateCssTextRule(fontSize: number, fontStyle: string, fontName: string): string {
        return `'font-size: ${fontSize}pt; 
                 font-weight: ${fontStyle}; 
                 font-family: ${fontName};
                 color: ${SurveyHelper.TEXT_COLOR};'`;
    }
    public static splitHtmlRect(controller: DocController, htmlBrick: IPdfBrick): IPdfBrick {
        let bricks: IPdfBrick[] = [];
        let htmlHeight: number = htmlBrick.height;
        let minHeight: number = controller.measureText(1, 'normal', controller.doc.fontSize).height;
        let emptyBrickCount: number = Math.floor(htmlHeight / minHeight) - 1;
        htmlBrick.yBot = htmlBrick.yTop + minHeight;
        bricks.push(htmlBrick);
        let currPoint: IPoint = SurveyHelper.createPoint(htmlBrick);
        for (let i: number = 0; i < emptyBrickCount; i++) {
            bricks.push(new EmptyBrick(SurveyHelper.createRect(currPoint, htmlBrick.width, minHeight)));
            currPoint.yTop += minHeight;
        }
        let remainingHeight: number = htmlHeight - (emptyBrickCount + 1) * minHeight;
        if (remainingHeight > 0) {
            bricks.push(new EmptyBrick(SurveyHelper.createRect(currPoint, htmlBrick.width, remainingHeight)));
        }
        return new CompositeBrick(...bricks);
    }
    public static createPlainTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: string, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): CompositeBrick {
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
        if (typeof text === 'string' || !SurveyHelper.hasHtml(text)) {
            return this.createPlainTextFlat(point, question, controller, typeof text === 'string' ?
                text : SurveyHelper.getLocString(<LocalizableString>text), fabric);
        }
        else {
            return this.splitHtmlRect(controller, await this.createHTMLFlat(point,
                <Question>question, controller, this.createDivBlock(SurveyHelper.getLocString(text), controller)));
        }
    }
    private static hasHtml(text: LocalizableString): boolean {
        return text.hasHtml && /<\/?[a-z][\s\S]*>/i.test(text.renderedHtml);
    }
    private static getHtmlMargins(controller: DocController, point: IPoint): { top: number, bottom: number, width: number } {
        let width: number = controller.paperWidth - point.xLeft - controller.margins.right;
        return {
            top: controller.margins.top,
            bottom: controller.margins.bot,
            width: width > controller.unitWidth ? width : controller.unitWidth
        }
    }
    public static async createHTMLFlat(point: IPoint, question: Question, controller: DocController, html: string): Promise<IPdfBrick> {
        let margins: { top: number, bottom: number, width: number } = this.getHtmlMargins(controller, point);
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
                let rect: IRect = SurveyHelper.createRect(point, margins.width, yBot);
                resolve(new HTMLBrick(question, controller, rect, html));
            }, margins)
        });
    }
    public static htmlToXml(html: string): string {
        let htmlDoc: Document = document.implementation.createHTMLDocument('');
        htmlDoc.write(html.replace(/\#/g, '%23'));
        htmlDoc.documentElement.setAttribute('xmlns', htmlDoc.documentElement.namespaceURI);
        return (new XMLSerializer()).serializeToString(htmlDoc.body);
    }
    public static async htmlToImage(html: string, width: number, controller: DocController):
        Promise<{ url: string, aspect: number }> {  
        let div: HTMLDivElement = document.createElement('div');
        div.style.display = 'block';
        div.style.position = 'fixed';
        div.style.top = '-10000px';
        div.style.left = '-10000px';
        div.style.width = (width / 72.0 * 96.0) + 'px';
        div.insertAdjacentHTML('beforeend', html);
        document.body.appendChild(div);
        let divWidth: number = div.offsetWidth;
        let divHeight: number = div.offsetHeight;
        div.remove();
        let fakePadding: number = controller.unitHeight / 2.0;
        let svg: string = '<svg xmlns="http://www.w3.org/2000/svg" ' +
            `width="${divWidth}px" ` +
            `height="${divHeight}px" ` +
            `viewBox="0 ${fakePadding} ${divWidth} ${divHeight + fakePadding}">` +
            '<foreignObject width="100%" height="100%">' +
            SurveyHelper.htmlToXml(html) + '</foreignObject></svg>';
        let data: string = 'data:image/svg+xml;base64,' +
            btoa(unescape(encodeURIComponent(svg.replace(/%23/g, '#'))));
        let img: HTMLImageElement = new Image();
        img.src = data;
        return await new Promise((resolve) => {
            img.onload = function() {
                let canvas: HTMLCanvasElement = document.createElement('canvas');
                canvas.width = divWidth;
                canvas.height = divHeight;
                let context: CanvasRenderingContext2D = canvas.getContext('2d');
                context.fillStyle = SurveyHelper.BACKGROUND_COLOR;
                context.fillRect(0, 0, divWidth, divHeight);
                context.drawImage(img, 0, 0);
                let url: string = canvas.toDataURL('image/jpeg', SurveyHelper.HTML_TO_IMAGE_QUALITY);
                canvas.remove();
                resolve({ url: url, aspect: divWidth / divHeight });
            };
            img.onerror = function() {
                resolve({ url: 'data:,', aspect: width / SurveyHelper.EPSILON });
            };
        });
    }
    public static async createBoldTextFlat(point: IPoint, question: Question,
        controller: DocController, text: string | LocalizableString): Promise<IPdfBrick> {
        controller.fontStyle = 'bold';
        let composite: IPdfBrick = await SurveyHelper.createTextFlat(
            point, question, controller, text, TextBoldBrick);
        controller.fontStyle = 'normal';
        return composite;
    }
    public static async createTitleFlat(point: IPoint, question: Question, controller: DocController): Promise<IPdfBrick> {
        let composite: CompositeBrick = new CompositeBrick();
        let currPoint: IPoint = SurveyHelper.clone(point);
        let oldFontSize: number = controller.fontSize;
        controller.fontSize *= SurveyHelper.TITLE_FONT_SCALE;
        if (question.no) {
            let noText: string = question.no + ' ';
            let noFlat: IPdfBrick;
            if (SurveyHelper.hasHtml(question.locTitle)) {
                controller.fontStyle = 'bold';
                controller.pushMargins();
                controller.margins.right = controller.paperWidth -
                    controller.margins.left - controller.measureText(noText, 'bold').width;
                noFlat = await SurveyHelper.createHTMLFlat(currPoint, question, controller,
                    SurveyHelper.createDivBlock(noText, controller));
                controller.popMargins();
                controller.fontStyle = 'normal';
            }
            else {
                noFlat = await SurveyHelper.createBoldTextFlat(currPoint,
                    question, controller, noText);
            }
            composite.addBrick(noFlat);
            currPoint.xLeft = noFlat.xRight;
        }
        controller.pushMargins();
        controller.margins.left = currPoint.xLeft;
        let textFlat: CompositeBrick = <CompositeBrick>await SurveyHelper.createBoldTextFlat(
            currPoint, question, controller, question.locTitle);
        composite.addBrick(textFlat);
        controller.popMargins();
        if (question.isRequired) {
            let requiredText: string = question.requiredText;
            if (SurveyHelper.hasHtml(question.locTitle)) {
                currPoint = SurveyHelper.createPoint(textFlat.unfold()[0], false, false);
                controller.fontStyle = 'bold';
                controller.pushMargins();
                controller.margins.right = controller.paperWidth -
                    controller.margins.left - controller.measureText(requiredText, 'bold').width;
                composite.addBrick(await SurveyHelper.createHTMLFlat(currPoint, question, controller,
                    SurveyHelper.createDivBlock(requiredText, controller)));
                controller.popMargins();
                controller.fontStyle = 'normal';
            }
            else {
                currPoint = SurveyHelper.createPoint(textFlat.unfold().pop(), false, true);
                composite.addBrick(await SurveyHelper.createBoldTextFlat(currPoint,
                    question, controller, requiredText));
            }
        }
        controller.fontSize = oldFontSize;
        return composite;
    }
    public static async createTitleSurveyFlat(point: IPoint, controller: DocController,
        text: string | LocalizableString): Promise<IPdfBrick> {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.TITLE_SURVEY_FONT_SIZE_SCALE;
        controller.fontStyle = 'bold';
        let composite: IPdfBrick = await SurveyHelper.createTextFlat(point,
            null, controller, text, TitlePanelBrick);
        controller.fontStyle = 'normal';
        controller.fontSize = oldFontSize;
        return composite;
    }
    public static async createTitlePanelFlat(point: IPoint, controller: DocController,
        text: string | LocalizableString): Promise<IPdfBrick> {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.TITLE_PANEL_FONT_SIZE_SCALE;
        controller.fontStyle = 'bold';
        let composite: IPdfBrick = await SurveyHelper.createTextFlat(point,
            null, controller, text, TitlePanelBrick);
        controller.fontStyle = 'normal';
        controller.fontSize = oldFontSize;
        return composite;
    }
    public static async createDescFlat(point: IPoint, question: IQuestion,
        controller: DocController, text: string | LocalizableString): Promise<IPdfBrick> {
        let oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * SurveyHelper.DESCRIPTION_FONT_SIZE_SCALE;
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
        controller: DocController, imagelink: string, width: number, height?: number): IPdfBrick {
        if (typeof height === 'undefined') {
            height = width / SurveyHelper.IMAGEPICKER_RATIO;
        }
        let html: string = `<img src='${imagelink}' width='${width}' height='${height}'/>`;
        return new HTMLBrick(question, controller,
            SurveyHelper.createRect(point, width, height), html, true);
    }
    public static async canPreviewImage(question: QuestionFileModel,
        item: { name: string, type: string, content: string },
        url: string): Promise<boolean> {
        return question.canPreviewImage(item) &&
            await SurveyHelper.getImageSize(url) !== null; 
    }
    public static async getImageSize(url: string): Promise<ISize> {
        return await new Promise((resolve) => {
            let image: any = new Image();
            image.src = url;
            image.onload = function() {
                return resolve({ width: image.width, height: image.height });
            }
            image.onerror = function() { return resolve(null); }
        });
    }
    public static createRowlineFlat(point: IPoint, controller: DocController,
        width?: number, color?: string): IPdfBrick {
        let xRight: number = typeof width === 'undefined' ?
            controller.paperWidth - controller.margins.right :
            point.xLeft + width;
        xRight = xRight > point.xLeft ? xRight : point.xLeft + SurveyHelper.EPSILON;
        return new RowlineBrick(controller, {
            xLeft: point.xLeft,
            xRight: xRight,
            yTop: point.yTop + SurveyHelper.EPSILON,
            yBot: point.yTop + SurveyHelper.EPSILON
        }, typeof color === 'undefined' ? null : color);
    }
    public static async createLinkFlat(point: IPoint, question: Question,
        controller: DocController, text: string, link: string): Promise<IPdfBrick> {
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
    public static createAcroformRect(rect: IRect): number[] {
        return [
            rect.xLeft,
            rect.yTop,
            rect.xRight - rect.xLeft,
            rect.yBot - rect.yTop
        ];
    }
    public static createTextFieldRect(point: IPoint, controller: DocController, lines: number = 1): IRect {
        let width: number = controller.paperWidth - point.xLeft - controller.margins.right;
        width = Math.max(width, controller.unitWidth);
        let height: number = controller.unitHeight * lines;
        return SurveyHelper.createRect(point, width, height);
    }
    public static async createReadOnlyTextFieldTextFlat(point: IPoint,
        controller: DocController, question: Question, value: string, onlyFirstLine: boolean): Promise<IPdfBrick> {
        let padding: number = controller.unitWidth * SurveyHelper.VALUE_READONLY_PADDING_SCALE;
        if (!onlyFirstLine) point.yTop += padding;
        point.xLeft += padding;
        controller.pushMargins(point.xLeft, controller.margins.right + padding);
        let textFlat: IPdfBrick = await SurveyHelper.createTextFlat(
            point, question, controller, value.toString(), TextBrick);
        controller.popMargins();
        return textFlat;
    }
    public static renderFlatBorders(controller: DocController, flat: PdfBrick): void {
        let minSide: number = Math.min(flat.width, flat.height);
        let visibleWidth: number = controller.unitHeight * SurveyHelper.VISIBLE_BORDER_SCALE * SurveyHelper.BORDER_SCALE;
        let visibleScale: number = SurveyHelper.formScale(controller, flat) + visibleWidth / minSide;
        let unvisibleWidth: number = controller.unitHeight * SurveyHelper.UNVISIBLE_BORDER_SCALE * SurveyHelper.BORDER_SCALE;
        let unvisibleScale: number = 1.0 - unvisibleWidth / minSide;
        let unvisibleRadius: number = SurveyHelper.RADIUS_SCALE * unvisibleWidth;
        let oldDrawColor: string = controller.doc.getDrawColor();
        controller.doc.setDrawColor(flat.formBorderColor);
        controller.doc.setLineWidth(visibleWidth);
        controller.doc.rect(...SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(flat, visibleScale)));
        controller.doc.setDrawColor(SurveyHelper.BACKGROUND_COLOR);
        controller.doc.setLineWidth(unvisibleWidth);
        controller.doc.roundedRect(...SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(flat, unvisibleScale)), unvisibleRadius, unvisibleRadius);
        controller.doc.setDrawColor(oldDrawColor);
    }
    public static async renderReadOnlyTextField(controller: DocController,
        question: Question, flat: PdfBrick, value: string,
        onlyFirstLine: boolean = true): Promise<void> {
        let point: IPoint = SurveyHelper.createPoint(flat, true, true);
        let oldFontSize = controller.fontSize;
        controller.fontSize = flat.fontSize;
        let textFlat: IPdfBrick = await SurveyHelper.
            createReadOnlyTextFieldTextFlat(point, controller, question, value, onlyFirstLine);
        controller.fontSize = oldFontSize;
        if (onlyFirstLine) await textFlat.unfold()[0].render();
        else await textFlat.render();
        SurveyHelper.renderFlatBorders(controller, flat);
    }
    public static getLocString(text: LocalizableString): string {
        if (SurveyHelper.hasHtml(text)) return text.renderedHtml;
        return (<any>text).renderedText || text.renderedHtml;
    }
    public static getContentQuestion(question: Question): Question {
        return !!question.contentQuestion ? question.contentQuestion : question;
    }
    public static getRatingMinWidth(controller: DocController): number {
        return controller.measureText(SurveyHelper.RATING_MIN_WIDTH).width;
    }
    public static getRatingItemText(question: QuestionRatingModel,
        index: number, locText: LocalizableString): LocalizableString {
        let ratingItemLocText: LocalizableString = new LocalizableString(locText.owner, locText.useMarkdown);
        ratingItemLocText.text = SurveyHelper.getLocString(locText);
        if (index === 0 && question.minRateDescription) {
            ratingItemLocText.text =
                question.locMinRateDescription.text + ' ' + SurveyHelper.getLocString(locText);
        }
        else if (index === question.visibleRateValues.length - 1 &&
            question.maxRateDescription) {
            ratingItemLocText.text =
            SurveyHelper.getLocString(locText) + ' ' + question.locMaxRateDescription.text;
        }
        return ratingItemLocText;
    }
    public static getPageAvailableWidth(controller: DocController): number {
        return controller.paperWidth - controller.margins.left - controller.margins.right;
    }
    public static getImagePickerAvailableWidth(controller: DocController): number {
        let width: number = (SurveyHelper.getPageAvailableWidth(
            controller) - (SurveyHelper.IMAGEPICKER_COUNT - 1) * controller.unitHeight);
        return width > 0 ? width : controller.unitHeight;
    }
    public static getColumnWidth(controller: DocController, colCount: number) {
        return (SurveyHelper.getPageAvailableWidth(controller) -
            (colCount - 1) * controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS) / colCount;
    }
    public static setColumnMargins(controller: DocController, colCount: number, column: number) {
        let cellWidth: number = this.getColumnWidth(controller, colCount);
        controller.margins.left = controller.margins.left + column *
            (cellWidth + controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS);
        controller.margins.right = controller.margins.right + (colCount - column - 1) *
            (cellWidth + controller.unitWidth * SurveyHelper.GAP_BETWEEN_COLUMNS);
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
        let minSide: number = Math.min(flat.width, flat.height);
        let borderWidth: number = 2.0 * controller.unitWidth * SurveyHelper.BORDER_SCALE;
        return (minSide - borderWidth) / minSide;
    }
    public static async generateQuestionFlats(survey: SurveyPDF,
        controller: DocController, question: Question, point: IPoint): Promise<IPdfBrick[]> {
        let questionComposite: Question = SurveyHelper.getContentQuestion(question);
        let questionType: string = question.customWidget ?
            question.customWidget.pdfQuestionType : questionComposite.getType();
        let flatQuestion: IFlatQuestion =
            FlatRepository.getInstance().create(survey, question, controller, questionType);
        let questionFlats: IPdfBrick[] = await flatQuestion.generateFlats(point);
        let adornersOptions: AdornersOptions = new AdornersOptions(point,
            questionFlats, question, controller, FlatRepository.getInstance(), SurveyPDFModule);
        if (question.customWidget && question.customWidget.isFit(question) &&
            question.customWidget.pdfRender) {
            survey.onRenderQuestion.unshift(question.customWidget.pdfRender);
        }
        await survey.onRenderQuestion.fire(survey, adornersOptions);
        return [...adornersOptions.bricks];
    }
    public static isCustomFont(controller: DocController, fontName: string) {
        return controller.doc.internal.getFont(fontName).encoding === SurveyHelper.CUSTOM_FONT_ENCODING;
    }
    public static fixFont(controller: DocController) {
        if (SurveyHelper.isCustomFont(controller, controller.fontName)) {
            controller.doc.text('Dummy', 0, 0);
            controller.doc.deletePage(1);
            controller.addPage();
        }
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