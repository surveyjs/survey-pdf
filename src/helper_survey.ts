import { IQuestion, Question, QuestionRatingModel, QuestionFileModel, LocalizableString, QuestionSelectBase, QuestionDropdownModel, settings } from 'survey-core';
import * as SurveyPDFModule from './entries/pdf';
import { SurveyPDF } from './survey';
import { IPoint, IRect, ISize, DocController } from './doc_controller';
import { FlatRepository } from './flat_layout/flat_repository';
import { IFlatQuestion } from './flat_layout/flat_question';
import { IHTMLRenderType } from './flat_layout/flat_html';
import { IPdfBrick, PdfBrick } from './pdf_render/pdf_brick';
import { TextBrick } from './pdf_render/pdf_text';
import { TextBoldBrick } from './pdf_render/pdf_textbold';
import { TitlePanelBrick } from './pdf_render/pdf_titlepanel';
import { DescriptionBrick } from './pdf_render/pdf_description';
import { CommentBrick } from './pdf_render/pdf_comment';
import { LinkBrick } from './pdf_render/pdf_link';
import { HTMLBrick } from './pdf_render/pdf_html';
import { ImageBrick } from './pdf_render/pdf_image';
import { EmptyBrick } from './pdf_render/pdf_empty';
import { RowlineBrick } from './pdf_render/pdf_rowline';
import { CompositeBrick } from './pdf_render/pdf_composite';
import { AdornersOptions } from './event_handler/adorners';

export class SurveyHelper {
    public static EPSILON: number = 2.2204460492503130808472633361816e-15;
    public static TITLE_SURVEY_FONT_SIZE_SCALE: number = 1.7;
    public static TITLE_PAGE_FONT_SIZE_SCALE: number = 1.3;
    public static TITLE_PANEL_FONT_SIZE_SCALE: number = 1.3;
    public static DESCRIPTION_FONT_SIZE_SCALE: number = 2.0 / 3.0;
    public static OTHER_ROWS_COUNT: number = 2;
    public static RATING_MIN_WIDTH: number = 3;
    public static RATING_MIN_HEIGHT: number = 2;
    public static RATING_COLUMN_WIDTH: number = 5;
    public static MATRIX_COLUMN_WIDTH: number = 5;
    public static IMAGEPICKER_COUNT: number = 4;
    public static IMAGEPICKER_RATIO: number = 4.0 / 3.0;
    public static MULTIPLETEXT_TEXT_PERS: number = Math.E / 10.0;
    public static HTML_TAIL_TEXT_SCALE: number = 0.24;
    public static SELECT_ITEM_FLAT_SCALE: number = 0.95;
    public static GAP_BETWEEN_ROWS: number = 0.25;
    public static GAP_BETWEEN_COLUMNS: number = 1.5;
    public static GAP_BETWEEN_ITEM_TEXT: number = 0.25;
    public static FORM_BORDER_VISIBLE: boolean = true;
    public static BORDER_SCALE: number = 0.1;
    public static VISIBLE_BORDER_SCALE: number = 0.8;
    public static UNVISIBLE_BORDER_SCALE: number = 0.2;
    public static RADIUS_SCALE: number = 3.0;
    public static TITLE_FONT_SCALE: number = 1.1;
    public static VALUE_READONLY_PADDING_SCALE: number = 0.3;
    public static HTML_TO_IMAGE_QUALITY: number = 1.0;
    public static FORM_BORDER_COLOR: string = '#9f9f9f';
    public static TEXT_COLOR: string = '#404040';
    public static BACKGROUND_COLOR: string = '#FFFFFF';
    public static TITLE_LOCATION_MATRIX: string = 'matrix';
    public static STANDARD_FONT: string = 'helvetica';
    public static CUSTOM_FONT_ENCODING: string = 'Identity-H';

    public static parseWidth(width: string, maxWidth: number,
        columnsCount: number = 1, defaultUnit?: string): number {
        if (width.indexOf('calc') === 0) {
            return maxWidth / columnsCount;
        }
        const value: number = parseFloat(width);
        const unit: string = width.replace(/[^A-Za-z%]/g, '') || defaultUnit;
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
    public static pxToPt(value: number | string) {
        if (typeof value === 'string') {
            if(!isNaN(Number(value))) {
                value += 'px';
            }
            return SurveyHelper.parseWidth(value, Number.MAX_VALUE);
        }
        return value * 72.0 / 96.0;
    }
    public static mergeRects(...rects: IRect[]): IRect {
        const resultRect: IRect = {
            xLeft: rects[0].xLeft,
            xRight: rects[0].xRight,
            yTop: rects[0].yTop,
            yBot: rects[0].yBot
        };
        rects.forEach((rect: IRect) => {
            resultRect.xLeft = Math.min(resultRect.xLeft, rect.xLeft),
            resultRect.xRight = Math.max(resultRect.xRight, rect.xRight),
            resultRect.yTop = Math.min(resultRect.yTop, rect.yTop),
            resultRect.yBot = Math.max(resultRect.yBot, rect.yBot);
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
    public static chooseHtmlFont(controller: DocController): string {
        return controller.useCustomFontInHtml ? controller.fontName : this.STANDARD_FONT;
    }
    public static generateCssTextRule(fontSize: number, fontStyle: string, fontName: string): string {
        return `"font-size: ${fontSize}pt; font-weight: ${fontStyle}; font-family: ${fontName}; color: ${this.TEXT_COLOR};"`;
    }
    public static createHtmlContainerBlock(html: string, controller: DocController, renderAs: IHTMLRenderType): string {
        const font = this.chooseHtmlFont(controller);
        return `<div class="__surveypdf_html" style=${this.generateCssTextRule(
            controller.fontSize, controller.fontStyle, font)}>` +
            `<style>.__surveypdf_html p { margin: 0; line-height: ${controller.fontSize}pt } body { margin: 0; }</style>${html}</div>`;
    }
    public static splitHtmlRect(controller: DocController, htmlBrick: IPdfBrick): IPdfBrick {
        const bricks: IPdfBrick[] = [];
        const htmlHeight: number = htmlBrick.height;
        const minHeight: number = controller.doc.getFontSize();
        htmlBrick.yBot = htmlBrick.yTop + minHeight;
        const emptyBrickCount: number = Math.floor(htmlHeight / minHeight) - 1;
        bricks.push(htmlBrick);
        const currPoint: IPoint = this.createPoint(htmlBrick);
        for (let i: number = 0; i < emptyBrickCount; i++) {
            bricks.push(new EmptyBrick(this.createRect(currPoint, htmlBrick.width, minHeight)));
            currPoint.yTop += minHeight;
        }
        const remainingHeight: number = htmlHeight - (emptyBrickCount + 1) * minHeight;
        if (remainingHeight > 0) {
            bricks.push(new EmptyBrick(this.createRect(currPoint, htmlBrick.width, remainingHeight)));
        }
        return new CompositeBrick(...bricks);
    }
    public static createPlainTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: string, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): CompositeBrick {
        const lines: string[] = controller.doc.splitTextToSize(text,
            controller.paperWidth - controller.margins.right - point.xLeft);
        const currPoint: IPoint = this.clone(point);
        const composite: CompositeBrick = new CompositeBrick();
        lines.forEach((line: string) => {
            const size: ISize = controller.measureText(line);
            composite.addBrick(new fabric(question, controller,
                this.createRect(currPoint, size.width, size.height), line));
            currPoint.yTop += size.height;
        });
        return composite;
    }
    public static async createTextFlat<T extends IPdfBrick>(point: IPoint, question: IQuestion,
        controller: DocController, text: string | LocalizableString, fabric: new (question: IQuestion,
            controller: DocController, rect: IRect, text: string) => T): Promise<IPdfBrick> {
        if (typeof text === 'string' || !this.hasHtml(text)) {
            return this.createPlainTextFlat(point, question, controller, typeof text === 'string' ?
                text : this.getLocString(<LocalizableString>text), fabric);
        }
        else {
            return this.splitHtmlRect(controller, await this.createHTMLFlat(point, <Question>question, controller,
                this.createHtmlContainerBlock(this.getLocString(text), controller, 'standard')));
        }
    }
    private static hasHtml(text: LocalizableString): boolean {
        const pattern: RegExp = /<\/?[a-z][\s\S]*>/i;
        return text.hasHtml && (pattern.test((<any>text).renderedText) || pattern.test(text.renderedHtml));
    }
    private static getHtmlMargins(controller: DocController, point: IPoint): { top: number, bottom: number, width: number } {
        const width: number = controller.paperWidth - point.xLeft - controller.margins.right;
        return {
            top: controller.margins.top,
            bottom: controller.margins.bot,
            width: width > controller.unitWidth ? width : controller.unitWidth
        };
    }

    public static createHTMLRect(point: IPoint, controller: DocController,
        margins: { top: number, bottom: number, width: number }, resultY: number): IRect {
        const availablePageHeight: number = controller.paperHeight - controller.margins.bot - controller.margins.top;
        const height: number = (controller.helperDoc.getNumberOfPages() - 1) *
            (controller.fontSize * Math.floor(availablePageHeight / controller.fontSize))
            + resultY - margins.top + SurveyHelper.HTML_TAIL_TEXT_SCALE * controller.fontSize;
        const numberOfPages: number = controller.helperDoc.getNumberOfPages();
        controller.helperDoc.addPage();
        for (let i: number = 0; i < numberOfPages; i++) {
            controller.helperDoc.deletePage(1);
        }
        return SurveyHelper.createRect(point, margins.width, height);
    }

    public static async createHTMLFlat(point: IPoint, question: Question, controller: DocController, html: string): Promise<IPdfBrick> {
        const margins: { top: number, bottom: number, width: number } = this.getHtmlMargins(controller, point);
        return await new Promise<IPdfBrick>((resolve) => {
            controller.helperDoc.fromHTML(html, point.xLeft, margins.top, {
                pagesplit: true, width: margins.width
            }, function (result: any) {
                const rect: IRect = SurveyHelper.createHTMLRect(point, controller, margins, result.y);
                resolve(new HTMLBrick(question, controller, rect, html));
            }, margins);
        });
    }
    public static generateFontFace(fontName: string, fontBase64: string, fontWeight: string) {
        return `@font-face { font-family: ${fontName}; ` +
            `src: url(data:application/font-woff;charset=utf-8;base64,${fontBase64}) format('woff'); ` +
            `font-weight: ${fontWeight}; }`;
    }
    public static generateFontFaceWithItalicStyle(fontName: string, fontBase64: string, fontWeight: string) {
        return `@font-face { font-family: ${fontName}; ` +
            `src: url(data:application/font-woff;charset=utf-8;base64,${fontBase64}) format('woff'); ` +
            `font-weight: ${fontWeight}; font-style: italic}`;
    }
    public static htmlToXml(html: string): string {
        const htmlDoc: Document = document.implementation.createHTMLDocument('');
        htmlDoc.write(html.replace(/\#/g, '%23'));
        htmlDoc.documentElement.setAttribute('xmlns', htmlDoc.documentElement.namespaceURI);
        htmlDoc.body.style.margin = 'unset';
        return (new XMLSerializer()).serializeToString(htmlDoc.body).replace(/%23/g, '#');
    }
    public static createSvgContent(html: string, width: number, controller: DocController) {
        const style: HTMLStyleElement = document.createElement('style');
        style.innerHTML = '.__surveypdf_html p { margin: unset; line-height: 22px; } body { margin: unset; }';
        document.body.appendChild(style);
        const div: HTMLDivElement = document.createElement('div');
        div.className = '__surveypdf_html';
        div.style.display = 'block';
        div.style.position = 'fixed';
        div.style.top = '-10000px';
        div.style.left = '-10000px';
        div.style.width = (width / 72.0 * 96.0) + 'px';
        div.style.boxSizing = 'initial';
        div.style.color = 'initial';
        div.style.fontFamily = 'initial';
        div.style.font = 'initial';
        div.style.lineHeight = 'initial';
        div.insertAdjacentHTML('beforeend', html);
        document.body.appendChild(div);
        const divWidth: number = div.offsetWidth;
        const divHeight: number = div.offsetHeight;
        div.remove();
        style.remove();
        let defs: string = '';
        if (controller.useCustomFontInHtml) {
            defs = `<defs><style>${this.generateFontFace(controller.fontName, controller.base64Normal, 'normal')}` +
                ` ${this.generateFontFace(controller.fontName, controller.base64Bold, 'bold')}</style></defs>`;
        } else {
            Object.keys(DocController.customFonts).forEach(fontName => {
                const font = DocController.customFonts[fontName];
                Object.keys(font).forEach((fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic') => {
                    if (fontStyle === 'normal' || fontStyle === 'bold') {
                        defs += `${this.generateFontFace(fontName, font[fontStyle], fontStyle)}`;
                    } else {
                        defs += `${this.generateFontFaceWithItalicStyle(fontName, font[fontStyle], fontStyle === 'italic' ? 'normal' : 'bold')}`;
                    }
                });
                defs = '<defs><style>' + defs + '</style></defs>';
            });
        }
        const svg: string = `<svg xmlns="http://www.w3.org/2000/svg" width="${divWidth}px" height="${divHeight}px">` + defs +
            '<style>.__surveypdf_html p { margin: unset; line-height: 22px; }</style>' +
            `<foreignObject width="${divWidth}px" height="${divHeight}px">` +
            this.htmlToXml(html) + '</foreignObject></svg>';
        return { svg, divWidth, divHeight };
    }
    private static setCanvas(canvas: HTMLCanvasElement, divWidth: number, divHeight: number, img: HTMLImageElement): void {
        canvas.width = divWidth * SurveyHelper.HTML_TO_IMAGE_QUALITY;
        canvas.height = divHeight * SurveyHelper.HTML_TO_IMAGE_QUALITY;
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.scale(SurveyHelper.HTML_TO_IMAGE_QUALITY, SurveyHelper.HTML_TO_IMAGE_QUALITY);
        context.fillStyle = SurveyHelper.BACKGROUND_COLOR;
        context.fillRect(0, 0, divWidth, divHeight);
        context.drawImage(img, 0, 0);
    }
    public static async htmlToImage(html: string, width: number, controller: DocController): Promise<{ url: string, aspect: number }> {
        const { svg, divWidth, divHeight } = SurveyHelper.createSvgContent(html, width, controller);
        const data: string = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
        const img: HTMLImageElement = new Image();
        img.crossOrigin='anonymous';
        img.src = data;
        return new Promise((resolve) => {
            img.onload = function () {
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                SurveyHelper.setCanvas(canvas, divWidth, divHeight, img);
                const url: string = canvas.toDataURL('image/jpeg', SurveyHelper.HTML_TO_IMAGE_QUALITY);
                canvas.remove();
                resolve({ url: url, aspect: divWidth / divHeight });
            };
            img.onerror = function () {
                resolve({ url: 'data:,', aspect: width / this.EPSILON });
            };
        });
    }
    public static async createBoldTextFlat(point: IPoint, question: Question,
        controller: DocController, text: string | LocalizableString): Promise<IPdfBrick> {
        controller.fontStyle = 'bold';
        const composite: IPdfBrick = await this.createTextFlat(
            point, question, controller, text, TextBoldBrick);
        controller.fontStyle = 'normal';
        return composite;
    }
    public static async createTitleFlat(point: IPoint, question: Question, controller: DocController): Promise<IPdfBrick> {
        const composite: CompositeBrick = new CompositeBrick();
        let currPoint: IPoint = this.clone(point);
        const oldFontSize: number = controller.fontSize;
        controller.fontSize *= this.TITLE_FONT_SCALE;
        if (question.no) {
            const noText: string = question.no + ' ';
            let noFlat: IPdfBrick;
            if (this.hasHtml(question.locTitle)) {
                controller.fontStyle = 'bold';
                controller.pushMargins();
                controller.margins.right = controller.paperWidth -
                    controller.margins.left - controller.measureText(noText, 'bold').width;
                noFlat = await this.createHTMLFlat(currPoint, question, controller,
                    this.createHtmlContainerBlock(noText, controller, 'standard'));
                controller.popMargins();
                controller.fontStyle = 'normal';
            }
            else {
                noFlat = await this.createBoldTextFlat(currPoint,
                    question, controller, noText);
            }
            composite.addBrick(noFlat);
            currPoint.xLeft = noFlat.xRight;
        }
        controller.pushMargins();
        controller.margins.left = currPoint.xLeft;
        const textFlat: CompositeBrick = <CompositeBrick>await this.createBoldTextFlat(
            currPoint, question, controller, question.locTitle);
        composite.addBrick(textFlat);
        controller.popMargins();
        if (question.isRequired) {
            const requiredText: string = question.requiredText;
            if (this.hasHtml(question.locTitle)) {
                currPoint = this.createPoint(textFlat.unfold()[0], false, false);
                controller.fontStyle = 'bold';
                controller.pushMargins();
                controller.margins.right = controller.paperWidth -
                    controller.margins.left - controller.measureText(requiredText, 'bold').width;
                composite.addBrick(await this.createHTMLFlat(currPoint, question, controller,
                    this.createHtmlContainerBlock(requiredText, controller, 'standard')));
                controller.popMargins();
                controller.fontStyle = 'normal';
            }
            else {
                currPoint = this.createPoint(textFlat.unfold().pop(), false, true);
                composite.addBrick(await this.createBoldTextFlat(currPoint,
                    question, controller, requiredText));
            }
        }
        controller.fontSize = oldFontSize;
        return composite;
    }
    private static async createTitleSurveyPanelFlat(point: IPoint, controller: DocController,
        text: string | LocalizableString, fontSizeScale: number): Promise<IPdfBrick> {
        const oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * fontSizeScale;
        controller.fontStyle = 'bold';
        const titleFlat: IPdfBrick = await this.createTextFlat(point, null, controller, text, TitlePanelBrick);
        controller.fontStyle = 'normal';
        controller.fontSize = oldFontSize;
        return titleFlat;
    }
    public static async createTitleSurveyFlat(point: IPoint, controller: DocController,
        text: string | LocalizableString): Promise<IPdfBrick> {
        return await this.createTitleSurveyPanelFlat(point, controller, text, this.TITLE_SURVEY_FONT_SIZE_SCALE);
    }
    public static async createTitlePanelFlat(point: IPoint, controller: DocController,
        text: string | LocalizableString, isPage: boolean = false): Promise<IPdfBrick> {
        return await this.createTitleSurveyPanelFlat(point, controller, text,
            isPage ? this.TITLE_PAGE_FONT_SIZE_SCALE : this.TITLE_PANEL_FONT_SIZE_SCALE);
    }
    public static async createDescFlat(point: IPoint, question: IQuestion,
        controller: DocController, text: string | LocalizableString): Promise<IPdfBrick> {
        const oldFontSize: number = controller.fontSize;
        controller.fontSize = oldFontSize * this.DESCRIPTION_FONT_SIZE_SCALE;
        const composite: IPdfBrick = await this.createTextFlat(
            point, question, controller, text, DescriptionBrick);
        controller.fontSize = oldFontSize;
        return composite;
    }
    public static getReadonlyRenderAs(question: Question, controller: DocController): 'auto' | 'text' | 'acroform' {
        return (<any>question).readonlyRenderAs === 'auto' ? controller.readonlyRenderAs : (<any>question).readonlyRenderAs;
    }
    public static async createCommentFlat(point: IPoint, question: Question,
        controller: DocController, isQuestion: boolean, options: { rows?: number, index?: number, value?: string, readOnly?: boolean } = {}): Promise<IPdfBrick> {
        const rect: IRect = this.createTextFieldRect(point, controller, options.rows ?? 1);
        let textFlat;
        if (options.readOnly ?? SurveyHelper.shouldRenderReadOnly(question, controller)) {
            const renderedValue = options.value ?? this.getQuestionOrCommentValue(question, isQuestion);
            textFlat = await this.createReadOnlyTextFieldTextFlat(
                point, controller, question, renderedValue);
            const padding: number = controller.unitHeight * this.VALUE_READONLY_PADDING_SCALE;
            if (textFlat.yBot + padding > rect.yBot) rect.yBot = textFlat.yBot + padding;
        }
        const comment = new CommentBrick(question, controller, rect, isQuestion, options.index);
        if(options.readOnly !== null && options.readOnly !== undefined) {
            comment.isReadOnly = options.readOnly;
        }
        comment.textBrick = textFlat;
        return comment;
    }
    public static getQuestionOrCommentValue(question: Question, isQuestion: boolean = true): string {
        return isQuestion ? (question.value !== undefined && question.value !== null ? question.value : '') :
            (question.comment !== undefined && question.comment !== null ? question.comment : '');
    }
    public static getQuestionOrCommentDisplayValue(question: Question, isQuestion: boolean = true): string {
        return isQuestion ? question.displayValue : SurveyHelper.getQuestionOrCommentValue(question, isQuestion);
    }
    public static inBrowser = typeof Image === 'function';

    public static get hasDocument(): boolean {
        return typeof document !== 'undefined';
    }

    public static async getImageBase64(imageLink: string): Promise<string> {
        const image = new Image();
        image.crossOrigin='anonymous';
        return new Promise((resolve) => {
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.height = image.naturalHeight;
                canvas.width = image.naturalWidth;
                ctx.drawImage(image, 0, 0);
                const dataUrl = canvas.toDataURL();
                resolve(dataUrl);
            };
            image.onerror = () => {
                resolve('');
            };
            image.src = imageLink;
        });
    }
    public static shouldConvertImageToPng = true;
    public static async getImageLink(controller: DocController, imageOptions: { link: string, width: number, height: number, objectFit?: string }, applyImageFit: boolean): Promise<string> {
        const ptToPx: number = 96.0 / 72.0;
        let url = this.shouldConvertImageToPng ? await SurveyHelper.getImageBase64(imageOptions.link) : imageOptions.link;
        if(typeof XMLSerializer === 'function' && applyImageFit) {
            const canvasHtml: string =
               `<div style='overflow: hidden; width: ${imageOptions.width * ptToPx}px; height: ${imageOptions.height * ptToPx}px;'>
                   <img src='${url}' style='object-fit: ${imageOptions.objectFit}; width: 100%; height: 100%;'/>
               </div>`;
            url = (await SurveyHelper.htmlToImage(canvasHtml, imageOptions.width, controller)).url;
        }
        return url;
    }
    public static async createImageFlat(point: IPoint, question: any,
        controller: DocController, imageOptions: { link: string, width: number, height: number, objectFit?: string }, applyImageFit?: boolean): Promise<IPdfBrick> {
        if (SurveyHelper.inBrowser) {
            imageOptions.objectFit = !!question && !!question.imageFit ? question.imageFit : (imageOptions.objectFit || 'contain');
            if (applyImageFit ?? controller.applyImageFit) {
                if (imageOptions.width > controller.paperWidth - controller.margins.left - controller.margins.right) {
                    const newWidth: number = controller.paperWidth - controller.margins.left - controller.margins.right;
                    imageOptions.height *= newWidth / imageOptions.width;
                    imageOptions.width = newWidth;
                }
            }
            const html: string = `<img src='${await SurveyHelper.getImageLink(controller, imageOptions, applyImageFit ?? controller.applyImageFit)}' width='${imageOptions.width}' height='${imageOptions.height}'/>`;
            return new HTMLBrick(question, controller, this.createRect(point, imageOptions.width, imageOptions.height), html, true);
        }
        return new ImageBrick(question, controller, imageOptions.link, point, imageOptions.width, imageOptions.height);
    }
    public static canPreviewImage(question: QuestionFileModel, item: { name: string, type: string, content: string }, url: string): boolean {
        return question.canPreviewImage(item);
        //  &&  await this.getImageSize(url) !== null;
    }
    public static async getImageSize(url: string): Promise<ISize> {
        if (!SurveyHelper.inBrowser) {
            return await new Promise((resolve) => {
                return resolve({ width: undefined, height: undefined });
            });
        }
        return await new Promise((resolve) => {
            const image: any = new Image();
            image.src = url;
            image.onload = function () {
                return resolve({ width: image.width, height: image.height });
            };
            image.onerror = function () { return resolve(null); };
        });
    }
    public static createRowlineFlat(point: IPoint, controller: DocController,
        width?: number, color?: string): IPdfBrick {
        let xRight: number = typeof width === 'undefined' ?
            controller.paperWidth - controller.margins.right :
            point.xLeft + width;
        xRight = xRight > point.xLeft ? xRight : point.xLeft + this.EPSILON;
        return new RowlineBrick(controller, {
            xLeft: point.xLeft,
            xRight: xRight,
            yTop: point.yTop + this.EPSILON,
            yBot: point.yTop + this.EPSILON
        }, typeof color === 'undefined' ? null : color);
    }
    public static async createLinkFlat(point: IPoint, question: Question,
        controller: DocController, text: string, link: string): Promise<IPdfBrick> {
        const compositeText: CompositeBrick = <CompositeBrick>await this.
            createTextFlat(point, question, controller, text, TextBrick);
        const compositeLink: CompositeBrick = new CompositeBrick();
        compositeText.unfold().forEach((text: TextBrick) => {
            compositeLink.addBrick(new LinkBrick(text, link));
            const linePoint: IPoint = this.createPoint(compositeLink);
            compositeLink.addBrick(this.createRowlineFlat(linePoint,
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
        const height: number = controller.unitHeight * lines;
        return this.createRect(point, width, height);
    }
    public static async createReadOnlyTextFieldTextFlat(point: IPoint,
        controller: DocController, question: Question, value: string): Promise<IPdfBrick> {
        const padding: number = controller.unitWidth * this.VALUE_READONLY_PADDING_SCALE;
        point.yTop += padding;
        point.xLeft += padding;
        controller.pushMargins(point.xLeft, controller.margins.right + padding);
        const textFlat: IPdfBrick = await this.createTextFlat(
            point, question, controller, value.toString(), TextBrick);
        controller.popMargins();
        return textFlat;
    }
    public static renderFlatBorders(controller: DocController, flat: PdfBrick): void {
        if (!this.FORM_BORDER_VISIBLE) return;
        const minSide: number = Math.min(flat.width, flat.height);
        const visibleWidth: number = controller.unitHeight * this.VISIBLE_BORDER_SCALE * this.BORDER_SCALE;
        const visibleScale: number = this.formScale(controller, flat) + visibleWidth / minSide;
        const unvisibleWidth: number = controller.unitHeight * this.UNVISIBLE_BORDER_SCALE * this.BORDER_SCALE;
        const unvisibleScale: number = 1.0 - unvisibleWidth / minSide;
        const unvisibleRadius: number = this.RADIUS_SCALE * unvisibleWidth;
        const oldDrawColor: string = controller.doc.getDrawColor();
        controller.doc.setDrawColor(flat.formBorderColor);
        controller.doc.setLineWidth(visibleWidth);
        controller.doc.rect(...this.createAcroformRect(this.scaleRect(flat, visibleScale)));
        controller.doc.setDrawColor(this.BACKGROUND_COLOR);
        controller.doc.setLineWidth(unvisibleWidth);
        controller.doc.roundedRect(...this.createAcroformRect(
            this.scaleRect(flat, unvisibleScale)), unvisibleRadius, unvisibleRadius);
        controller.doc.setDrawColor(oldDrawColor);
    }
    public static getLocString(text: LocalizableString): string {
        if (this.hasHtml(text)) return text.renderedHtml;
        return (<any>text).renderedText || text.renderedHtml;
    }
    public static getDropdownQuestionValue(question: Question): string {
        const qDropDown: QuestionDropdownModel = <QuestionDropdownModel>question;
        if (qDropDown.isOtherSelected) {
            return qDropDown.otherText;
        }
        else if (!!question.displayValue) {
            return question.displayValue;
        }
        else if (qDropDown.showOptionsCaption) {
            return qDropDown.optionsCaption;
        }
        return '';
    }
    public static getContentQuestion(question: Question): Question {
        return !!(<any>question).contentQuestion ? (<any>question).contentQuestion : question;
    }
    public static getContentQuestionTypeRenderAs(question: Question, survey: SurveyPDF): string {
        let renderAs = question.renderAs;
        if(question.getType() === 'boolean' && survey.options.useLegacyBooleanRendering) {
            renderAs = 'checkbox';
        }
        if(renderAs !== 'default') {
            const type = `${question.getType()}-${renderAs}`;
            if(FlatRepository.getInstance().isTypeRegistered(type)) return type;
        }
        return question.getType();
    }
    public static getContentQuestionType(question: Question, survey: SurveyPDF): string {
        if(!!question.customWidget) return question.customWidget.pdfQuestionType;
        return !!(<any>question).contentQuestion ? 'custom_model' : this.getContentQuestionTypeRenderAs(question, survey);
    }
    public static getRatingMinWidth(controller: DocController): number {
        return controller.measureText(this.RATING_MIN_WIDTH).width;
    }
    public static getRatingItemText(question: QuestionRatingModel,
        index: number, locText: LocalizableString): LocalizableString {
        const ratingItemLocText: LocalizableString = new LocalizableString(locText.owner, locText.useMarkdown);
        ratingItemLocText.text = this.getLocString(locText);
        if (index === 0 && question.minRateDescription) {
            ratingItemLocText.text = question.locMinRateDescription.text + ' ' + this.getLocString(locText);
        }
        else if (index === question.visibleRateValues.length - 1 && question.maxRateDescription) {
            ratingItemLocText.text = this.getLocString(locText) + ' ' + question.locMaxRateDescription.text;
        }
        return ratingItemLocText;
    }
    public static getPageAvailableWidth(controller: DocController): number {
        return controller.paperWidth - controller.margins.left - controller.margins.right;
    }
    public static getImagePickerAvailableWidth(controller: DocController): number {
        const width: number = (this.getPageAvailableWidth(controller) -
            (this.IMAGEPICKER_COUNT - 1) * controller.unitHeight);
        return width > 0 ? width : controller.unitHeight;
    }
    public static getColumnWidth(controller: DocController, colCount: number) {
        return (this.getPageAvailableWidth(controller) - (colCount - 1) *
            controller.unitWidth * this.GAP_BETWEEN_COLUMNS) / colCount;
    }
    public static setColumnMargins(controller: DocController, colCount: number, column: number) {
        const cellWidth: number = this.getColumnWidth(controller, colCount);
        controller.margins.left = controller.margins.left + column *
            (cellWidth + controller.unitWidth * this.GAP_BETWEEN_COLUMNS);
        controller.margins.right = controller.margins.right + (colCount - column - 1) *
            (cellWidth + controller.unitWidth * this.GAP_BETWEEN_COLUMNS);
    }
    public static moveRect(rect: IRect, left: number = rect.xLeft, top: number = rect.yTop): IRect {
        return {
            xLeft: left,
            yTop: top,
            xRight: left + rect.xRight - rect.xLeft,
            yBot: top + rect.yBot - rect.yTop
        };
    }
    public static scaleRect(rect: IRect, scale: number): IRect {
        const width: number = rect.xRight - rect.xLeft;
        const height: number = rect.yBot - rect.yTop;
        const scaleWidth: number = ((width < height) ? width : height) * (1.0 - scale) / 2.0;
        return {
            xLeft: rect.xLeft + scaleWidth,
            yTop: rect.yTop + scaleWidth,
            xRight: rect.xRight - scaleWidth,
            yBot: rect.yBot - scaleWidth
        };
    }
    public static formScale(controller: DocController, flat: PdfBrick): number {
        const minSide: number = Math.min(flat.width, flat.height);
        const borderWidth: number = 2.0 * controller.unitWidth * this.BORDER_SCALE;
        return (minSide - borderWidth) / minSide;
    }
    public static async generateQuestionFlats(survey: SurveyPDF,
        controller: DocController, question: Question, point: IPoint): Promise<IPdfBrick[]> {
        const questionType: string = this.getContentQuestionType(question, survey);
        const flatQuestion: IFlatQuestion = FlatRepository.getInstance().
            create(survey, question, controller, questionType);
        const questionFlats: IPdfBrick[] = await flatQuestion.generateFlats(point);
        const adornersOptions: AdornersOptions = new AdornersOptions(point,
            questionFlats, question, controller, FlatRepository.getInstance(), SurveyPDFModule);
        if (question.customWidget && question.customWidget.isFit(question) &&
            question.customWidget.pdfRender) {
            survey.onRenderQuestion.unshift(question.customWidget.pdfRender);
        }
        await survey.onRenderQuestion.fire(survey, adornersOptions);
        return [...adornersOptions.bricks];
    }
    public static isFontExist(controller: DocController, fontName: string): boolean {
        return controller.doc.internal.getFont(fontName).fontName === fontName;
    }
    public static isCustomFont(controller: DocController, fontName: string): boolean {
        return controller.doc.internal.getFont(fontName).encoding === this.CUSTOM_FONT_ENCODING;
    }
    public static fixFont(controller: DocController): void {
        if (this.isCustomFont(controller, controller.fontName)) {
            controller.doc.text('load font', 0, 0);
            controller.doc.deletePage(1);
            controller.addPage();
        }
    }
    public static clone(src: any): any {
        const target: any = {};
        for (const prop in src) {
            if (src.hasOwnProperty(prop)) {
                target[prop] = src[prop];
            }
        }
        return target;
    }
    public static shouldRenderReadOnly(question: IQuestion, controller: DocController, readOnly?: boolean): boolean {
        return ((!!question && question.isReadOnly || readOnly) && SurveyHelper.getReadonlyRenderAs(
            <Question>question, controller) !== 'acroform') || controller?.compress;
    }
    public static isSizeEmpty(val: any): boolean {
        return !val || val === 'auto';
    }
    public static isHeightEmpty(val: any): boolean {
        return this.isSizeEmpty(val) || val == '100%';
    }
    public static async getCorrectedImageSize(controller: DocController, imageOptions: { imageWidth: any, imageHeight: any, imageLink: string }): Promise<ISize> {
        let { imageWidth, imageLink, imageHeight } = imageOptions;
        imageWidth = typeof imageWidth === 'number' ? imageWidth.toString() : imageWidth;
        imageHeight = typeof imageHeight === 'number' ? imageHeight.toString() : imageHeight;
        let widthPt: number = imageWidth && SurveyHelper.parseWidth(imageWidth, SurveyHelper.getPageAvailableWidth(controller), 1, 'px');
        let heightPt: number = imageHeight && SurveyHelper.parseWidth(imageHeight, SurveyHelper.getPageAvailableWidth(controller), 1, 'px');
        if(SurveyHelper.isSizeEmpty(imageWidth) || SurveyHelper.isHeightEmpty(imageHeight)) {
            const imageSize = await SurveyHelper.getImageSize(imageLink);
            if(!SurveyHelper.isSizeEmpty(imageWidth)) {
                if(imageSize && imageSize.width) {
                    heightPt = imageSize.height * widthPt / imageSize.width;
                }
            }
            else if(!SurveyHelper.isHeightEmpty(imageHeight)) {
                if(imageSize && imageSize.height) {
                    widthPt = imageSize.width * heightPt / imageSize.height;
                }
            }
            else if(imageSize && imageSize.height && imageSize.width) {
                heightPt = SurveyHelper.parseWidth(imageSize.height.toString(), SurveyHelper.getPageAvailableWidth(controller), 1, 'px');
                widthPt = SurveyHelper.parseWidth(imageSize.width.toString(), SurveyHelper.getPageAvailableWidth(controller), 1, 'px');
            }
        }
        return { width: widthPt || 0, height: heightPt || 0 };
    }
}