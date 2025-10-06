import { IQuestion, Question, QuestionRatingModel, QuestionFileModel, LocalizableString, QuestionDropdownModel, PanelModel, PageModel } from 'survey-core';
import { SurveyPDF } from './survey';
import { IPoint, IRect, ISize, DocController } from './doc_controller';
import { FlatRepository } from './flat_layout/flat_repository';
import { IFlatQuestion } from './flat_layout/flat_question';
import { IPdfBrick, PdfBrick } from './pdf_render/pdf_brick';
import { TextBrick, ITextAppearanceOptions } from './pdf_render/pdf_text';
import { ILinkBrickAppearanceOptions, ILinkOptions, LinkBrick } from './pdf_render/pdf_link';
import { HTMLBrick } from './pdf_render/pdf_html';
import { ImageBrick } from './pdf_render/pdf_image';
import { EmptyBrick } from './pdf_render/pdf_empty';
import { RowlineBrick } from './pdf_render/pdf_rowline';
import { CompositeBrick } from './pdf_render/pdf_composite';
import { ITextFieldBrickAppearanceOptions, ITextFieldBrickOptions, TextFieldBrick } from './pdf_render/pdf_textfield';
import { FlatPanel } from './flat_layout/flat_panel';
import { FlatPage } from './flat_layout/flat_page';
import { IStyles } from './styles';

export type IBorderDescription = IRect & ISize;

export enum BorderMode {
    Inside = 0,
    Middle = 1,
    Outside = 2,
}
export enum BorderRect {
    None = 0,
    Top =  1,
    Bottom = 2,
    Right = 4,
    Left = 8,
    All = 15
}
export type IBorderAppearanceOptions = {
    borderColor: string,
    borderWidth: number,
    dashStyle?: { dashArray: [number, number] | [number], dashPhase: number },
    borderMode?: BorderMode,
    borderRect?: BorderRect,
}

export interface ITextWithAlignAppearanceOptions extends ITextAppearanceOptions {
    textAlign?: 'left' | 'center' | 'right';
}

export class SurveyHelper {
    public static readonly EPSILON: number = 2.2204460492503130808472633361816e-15;
    public static readonly HTML_TAIL_TEXT_SCALE: number = 0.24;

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
    public static chooseHtmlFont(controller: DocController, fontName?: string): string {
        return controller.useCustomFontInHtml ? fontName ?? controller.fontName : 'helvetica';
    }
    public static generateCssTextRule(appearance: ITextAppearanceOptions): string {
        return `"font-size: ${appearance.fontSize}pt; font-weight: ${appearance.fontStyle}; font-family: ${appearance.fontName}; color: ${appearance.fontColor}; lineHeight: ${appearance.lineHeight}"`;
    }
    public static createHtmlContainerBlock(html: string, controller: DocController, appearance?: Partial<ITextAppearanceOptions>): string {
        const newApperance: ITextAppearanceOptions = SurveyHelper.getPatchedTextAppearanceOptions(controller, appearance);
        const font = this.chooseHtmlFont(controller, newApperance.fontName);
        return `<div class="__surveypdf_html" style=${this.generateCssTextRule(newApperance)}>` +
            `<style>.__surveypdf_html p { margin: 0; line-height: ${newApperance.lineHeight}pt } body { margin: 0; }</style>${html}</div>`;
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
            bricks.push(new EmptyBrick(controller, this.createRect(currPoint, htmlBrick.width, minHeight)));
            currPoint.yTop += minHeight;
        }
        const remainingHeight: number = htmlHeight - (emptyBrickCount + 1) * minHeight;
        if (remainingHeight > 0) {
            bricks.push(new EmptyBrick(controller, this.createRect(currPoint, htmlBrick.width, remainingHeight)));
        }
        return new CompositeBrick(...bricks);
    }
    public static createPlainTextFlat(point: IPoint,
        controller: DocController, text: string, options: ITextWithAlignAppearanceOptions): CompositeBrick {
        const lines: string[] = controller.doc.splitTextToSize(text,
            controller.paperWidth - controller.margins.right - point.xLeft);
        const currPoint: IPoint = this.clone(point);
        const composite: CompositeBrick = new CompositeBrick();
        lines.forEach((text: string) => {
            const size: ISize = controller.measureText(text, options);
            composite.addBrick(new TextBrick(controller,
                this.createRect(currPoint, size.width, size.height), { text }, options));
            currPoint.yTop += size.height;
        });
        if(options.textAlign == 'right') {
            const spaceXRight = point.xLeft + SurveyHelper.getPageAvailableWidth(controller);
            composite.translateX((xLeft, xRight) => {
                return { xLeft: xLeft + (spaceXRight - xRight), xRight: spaceXRight };
            });
        }
        if(options.textAlign == 'center') {
            const spaceXCenter = point.xLeft + SurveyHelper.getPageAvailableWidth(controller) / 2;
            composite.translateX((xLeft, xRight) => {
                const shift = spaceXCenter - (xLeft + xRight) / 2;
                return { xLeft: xLeft + shift, xRight: xRight + shift };
            });
        }
        return composite;
    }
    public static async createTextFlat(point: IPoint,
        controller: DocController, text: string | LocalizableString, appearance?: Partial<ITextWithAlignAppearanceOptions>): Promise<IPdfBrick> {
        const newApperance: ITextWithAlignAppearanceOptions = SurveyHelper.getPatchedTextAppearanceOptions(controller, appearance);
        newApperance.textAlign = newApperance.textAlign ?? 'left';
        const oldFontSize: number = controller.fontSize;
        const oldFontStyle: string = controller.fontStyle;
        const oldFontName: string = controller.fontName;
        const oldLineHeightFactor = controller.lineHeightFactor;
        controller.fontSize = newApperance.fontSize;
        controller.fontStyle = newApperance.fontStyle;
        controller.fontName = newApperance.fontName;
        controller.lineHeightFactor = newApperance.lineHeight / newApperance.fontSize;
        let result: IPdfBrick;
        if (typeof text === 'string' || !this.hasHtml(text)) {
            result = this.createPlainTextFlat(point, controller, typeof text === 'string' ?
                text : this.getLocString(<LocalizableString>text), newApperance);
        }
        else {
            result = this.splitHtmlRect(controller, await this.createHTMLFlat(point, controller,
                this.createHtmlContainerBlock(this.getLocString(text), controller)));
        }
        controller.lineHeightFactor = oldLineHeightFactor;
        controller.fontSize = oldFontSize;
        controller.fontStyle = oldFontStyle;
        controller.fontName = oldFontName;
        return result;
    }
    public static mergeObjects(dest:any, ...sources:Array<any>):any {
        sources.forEach(source => {
            Object.keys(source).forEach(key=>{
                if (source[key] !== undefined) {
                    if(typeof source[key] == 'object' && source[key] !== null && !Array.isArray(source[key])) {
                        dest[key] = SurveyHelper.mergeObjects(dest[key] ?? {}, source[key]);
                    } else {
                        dest[key] = source[key];
                    }
                }

            });
        });
        return dest;
    }
    public static getPatchedTextAppearanceOptions(controller: DocController, options?: Partial<ITextAppearanceOptions>): ITextAppearanceOptions {
        const newOptions = SurveyHelper.mergeObjects(SurveyHelper.getDefaultTextAppearanceOptions(controller), options ?? {});
        if(options && options.lineHeight == undefined) {
            newOptions.lineHeight = newOptions.fontSize;
        }
        return newOptions;
    }
    public static getDefaultTextAppearanceOptions(controller: DocController):ITextAppearanceOptions {
        return {
            fontSize: controller.fontSize,
            fontName: controller.fontName,
            fontStyle: controller.fontStyle,
            lineHeight: controller.fontSize,
            fontColor: '#404040'
        };
    }
    public static hasHtml(text: LocalizableString): boolean {
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

    public static async createHTMLFlat(point: IPoint, controller: DocController, html: string): Promise<IPdfBrick> {
        const margins: { top: number, bottom: number, width: number } = this.getHtmlMargins(controller, point);
        return await new Promise<IPdfBrick>((resolve) => {
            controller.helperDoc.fromHTML(html, point.xLeft, margins.top, {
                pagesplit: true, width: margins.width
            }, function (result: any) {
                const rect: IRect = SurveyHelper.createHTMLRect(point, controller, margins, result.y);
                resolve(new HTMLBrick(controller, rect, { html }, SurveyHelper.getDefaultTextAppearanceOptions(controller)));
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
    private static setCanvas(controller: DocController, canvas: HTMLCanvasElement, divWidth: number, divHeight: number, img: HTMLImageElement): void {
        canvas.width = divWidth * controller.htmlToImageQuality;
        canvas.height = divHeight * controller.htmlToImageQuality;
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.scale(controller.htmlToImageQuality, controller.htmlToImageQuality);
        context.fillStyle = '#FFFFFF';
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
                SurveyHelper.setCanvas(controller, canvas, divWidth, divHeight, img);
                const url: string = canvas.toDataURL('image/jpeg', controller.htmlToImageQuality);
                canvas.remove();
                resolve({ url: url, aspect: divWidth / divHeight });
            };
            img.onerror = function () {
                resolve({ url: 'data:,', aspect: width / this.EPSILON });
            };
        });
    }
    public static getReadonlyRenderAs(question: Question, controller: DocController): 'auto' | 'text' | 'acroform' {
        return (<any>question).readonlyRenderAs === 'auto' ? controller.readonlyRenderAs : (<any>question).readonlyRenderAs;
    }
    public static async createCommentFlat(point: IPoint, question: Question,
        controller: DocController, options: { rows?: number } & ITextFieldBrickOptions, appearance: ITextFieldBrickAppearanceOptions): Promise<IPdfBrick> {
        options.rows = options.rows ?? 1;
        options.value = options.value ?? '';
        options.shouldRenderReadOnly = SurveyHelper.shouldRenderReadOnly(question, controller, options.isReadOnly);
        const rect: IRect = this.createTextFieldRect(point, controller, options.rows, appearance.lineHeight);
        let textFlat;
        if (SurveyHelper.shouldRenderReadOnly(question, controller, options.isReadOnly)) {
            textFlat = await this.createReadOnlyTextFieldTextFlat(
                point, controller, options.value, appearance);
        }
        const comment = new TextFieldBrick(controller, rect, options, appearance);
        if(textFlat) {
            comment.textBrick = textFlat;
        }
        return comment;
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
            return new HTMLBrick(controller, this.createRect(point, imageOptions.width, imageOptions.height), { html, isImage: true }, SurveyHelper.getDefaultTextAppearanceOptions(controller));
        }
        return new ImageBrick(controller, point, imageOptions);
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
    public static async createLinkFlat(point: IPoint, controller: DocController, options: ILinkOptions, appearance?: Partial<ILinkBrickAppearanceOptions>): Promise<IPdfBrick> {
        const newAppearance: ITextAppearanceOptions = SurveyHelper.getPatchedTextAppearanceOptions(controller, appearance);
        const compositeText: CompositeBrick = <CompositeBrick>await this.
            createTextFlat(point, controller, options.text, newAppearance);
        const compositeLink: CompositeBrick = new CompositeBrick();
        compositeText.unfold().forEach((text: TextBrick) => {
            compositeLink.addBrick(new LinkBrick(controller, text,
                {
                    link: options.link,
                    text: text.options.text,
                    readOnlyShowLink: options.readOnlyShowLink,
                    shouldRenderReadOnly: options.shouldRenderReadOnly
                },
                newAppearance
            ));
            const linePoint: IPoint = this.createPoint(compositeLink);
            compositeLink.addBrick(this.createRowlineFlat(linePoint,
                controller, compositeLink.width, newAppearance.fontColor));
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
    public static createTextFieldRect(point: IPoint, controller: DocController, lines: number = 1, lineHeight: number = controller.unitHeight): IRect {
        let width: number = controller.paperWidth - point.xLeft - controller.margins.right;
        width = Math.max(width, controller.unitWidth);
        const height: number = lineHeight * lines;
        return this.createRect(point, width, height);
    }
    public static async createReadOnlyTextFieldTextFlat(point: IPoint,
        controller: DocController, value: string, appearance: ITextFieldBrickAppearanceOptions): Promise<IPdfBrick> {
        controller.pushMargins(point.xLeft, controller.margins.right);
        const textFlat: IPdfBrick = await this.createTextFlat(
            point, controller, value.toString(), appearance);
        controller.popMargins();
        return textFlat;
    }
    public static renderFlatBorders(controller: DocController, options: IBorderDescription, appearance: IBorderAppearanceOptions): void {
        appearance.borderMode = appearance.borderMode ?? BorderMode.Inside;
        appearance.borderRect = appearance.borderRect ?? BorderRect.All;
        const borderWidth: number = appearance.borderWidth;
        if(!borderWidth) return;
        const oldDrawColor: string = controller.doc.getDrawColor();
        controller.doc.setDrawColor(appearance.borderColor);
        controller.doc.setLineWidth(borderWidth);

        const scaleFactor = appearance.borderMode == BorderMode.Middle ? 0 : (appearance.borderMode == BorderMode.Inside ? - 1 : 1) * borderWidth;
        const scaledRect = this.scaleRect(options, {
            scaleX: (options.width + scaleFactor) / options.width,
            scaleY: (options.height + scaleFactor) / options.height
        });
        if(appearance.dashStyle) {
            const dashStyle = appearance.dashStyle;
            const borderLength = (Math.abs(scaledRect.yTop - scaledRect.yBot) + Math.abs(scaledRect.xLeft - scaledRect.xRight)) * 2;
            const dashWithSpaceSize = dashStyle.dashArray[0] + (dashStyle.dashArray[1] ?? dashStyle.dashArray[0]);
            const dashSize = dashStyle.dashArray[0] + (borderLength % dashWithSpaceSize) / Math.floor(borderLength / dashWithSpaceSize);

            controller.doc.setLineDashPattern(
                [dashSize, dashStyle.dashArray[1] ?? dashStyle.dashArray[0]],
                dashStyle.dashPhase
            );
        }
        if(appearance.borderRect & BorderRect.Top) {
            controller.doc.line(scaledRect.xLeft, scaledRect.yTop, scaledRect.xRight, scaledRect.yTop)
        }
        if(appearance.borderRect & BorderRect.Bottom) {
            controller.doc.line(scaledRect.xLeft, scaledRect.yBot, scaledRect.xRight, scaledRect.yBot)
        }
        if(appearance.borderRect & BorderRect.Left) {
            controller.doc.line(scaledRect.xLeft, scaledRect.yTop - borderWidth / 2, scaledRect.xLeft, scaledRect.yBot + borderWidth / 2)
        }
        if(appearance.borderRect & BorderRect.Right) {
            controller.doc.line(scaledRect.xRight, scaledRect.yTop - borderWidth / 2, scaledRect.xRight, scaledRect.yBot + borderWidth / 2)
        }

        // controller.doc.rect(...this.createAcroformRect(scaledRect));
        if(appearance.dashStyle) {
            controller.doc.setLineDashPattern([]);
        }
        controller.doc.setDrawColor(oldDrawColor);
    }
    public static getLocString(text: LocalizableString): string {
        if (this.hasHtml(text)) return text.renderedHtml;
        return (<any>text).renderedText || text.renderedHtml;
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
    public static getPageAvailableWidth(controller: DocController): number {
        return controller.paperWidth - controller.margins.left - controller.margins.right;
    }
    public static getColumnWidth(controller: DocController, colCount: number, gapBetweenColumns: number) {
        return (this.getPageAvailableWidth(controller) - (colCount - 1) *
            gapBetweenColumns) / colCount;
    }
    public static setColumnMargins(controller: DocController, colCount: number, column: number, gapBetweenColumns: number) {
        const cellWidth: number = this.getColumnWidth(controller, colCount, gapBetweenColumns);
        controller.margins.left = controller.margins.left + column *
            (cellWidth + gapBetweenColumns);
        controller.margins.right = controller.margins.right + (colCount - column - 1) *
            (cellWidth + gapBetweenColumns);
    }
    public static moveRect(rect: IRect, left: number = rect.xLeft, top: number = rect.yTop): IRect {
        return {
            xLeft: left,
            yTop: top,
            xRight: left + rect.xRight - rect.xLeft,
            yBot: top + rect.yBot - rect.yTop
        };
    }
    public static scaleRect(rect: IRect, scale: number | { scaleX: number, scaleY: number }): IRect {
        const scaleX = typeof scale == 'number' ? scale : scale.scaleX;
        const scaleY = typeof scale == 'number' ? scale : scale.scaleY;
        const scaleWidth: number = (rect.xRight - rect.xLeft) * (1.0 - scaleX) / 2.0;
        const scaleHeight: number = (rect.yBot - rect.yTop) * (1.0 - scaleY) / 2.0;
        return {
            xLeft: rect.xLeft + scaleWidth,
            yTop: rect.yTop + scaleHeight,
            xRight: rect.xRight - scaleWidth,
            yBot: rect.yBot - scaleHeight
        };
    }
    public static getRectBorderScale(flat: ISize, borderWidth: number): { scaleX: number, scaleY: number } {
        return { scaleX: (flat.width - borderWidth * 2) / flat.width, scaleY: (flat.height - borderWidth * 2) / flat.height };
    }
    public static async generateQuestionFlats(survey: SurveyPDF,
        controller: DocController, question: Question, point: IPoint, styles: IStyles): Promise<IPdfBrick[]> {
        const questionType: string = this.getContentQuestionType(question, survey);
        const flatQuestion: IFlatQuestion = FlatRepository.getInstance().
            create(survey, question, controller, styles, questionType);
        const questionFlats: IPdfBrick[] = await flatQuestion.generateFlats(point);
        return [...questionFlats];
    }
    public static async generatePanelFlats(survey: SurveyPDF,
        controller: DocController, panel: PanelModel, point: IPoint, styles: IStyles): Promise<IPdfBrick[]> {
        const panelFlats = await new FlatPanel(survey, panel, controller, styles).generateFlats(point);
        return [...panelFlats];
    }
    public static async generatePageFlats(survey: SurveyPDF,
        controller: DocController, page: PageModel, point: IPoint, styles: IStyles): Promise<IPdfBrick[]> {
        const pageFlats = await new FlatPage(survey, page, controller, styles).generateFlats(point);
        return [...pageFlats];
    }
    public static isFontExist(controller: DocController, fontName: string): boolean {
        return controller.doc.internal.getFont(fontName).fontName === fontName;
    }
    public static isCustomFont(controller: DocController, fontName: string): boolean {
        return controller.doc.internal.getFont(fontName).encoding === 'Identity-H';
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
    public static async getCorrectedImageSize(controller: DocController, imageOptions: { imageWidth?: any, imageHeight?: any, imageLink: string, defaultImageWidth?: any, defaultImageHeight?: any }): Promise<ISize> {
        let { imageWidth, imageLink, imageHeight, defaultImageWidth, defaultImageHeight } = imageOptions;
        imageWidth = typeof imageWidth === 'number' ? imageWidth.toString() : imageWidth;
        imageHeight = typeof imageHeight === 'number' ? imageHeight.toString() : imageHeight;
        let widthPt: number = imageWidth && SurveyHelper.parseWidth(imageWidth, SurveyHelper.getPageAvailableWidth(controller), 1, 'px');
        let heightPt: number = imageHeight && SurveyHelper.parseWidth(imageHeight, SurveyHelper.getPageAvailableWidth(controller), 1, 'px');
        defaultImageWidth = typeof defaultImageWidth === 'number' ? defaultImageWidth.toString() : defaultImageWidth;
        defaultImageHeight = typeof defaultImageHeight === 'number' ? defaultImageHeight.toString() : defaultImageHeight;
        let defaultWidthPt: number = defaultImageWidth && SurveyHelper.parseWidth(defaultImageWidth, SurveyHelper.getPageAvailableWidth(controller), 1, 'px');
        let defaultHeightPt: number = defaultImageHeight && SurveyHelper.parseWidth(defaultImageHeight, SurveyHelper.getPageAvailableWidth(controller), 1, 'px');

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
        return { width: widthPt || defaultWidthPt || 0, height: heightPt || defaultHeightPt || 0 };
    }
    public static alignVerticallyBricks(align: 'top' | 'center' | 'bottom', ...bricks: IPdfBrick[]) {
        const mergedRect = SurveyHelper.mergeRects(...bricks);
        bricks.forEach((brick) => {
            switch (align) {
                case 'center': {
                    brick.translateY((yTop, yBot) => {
                        const shift = ((mergedRect.yTop + mergedRect.yBot) - (yTop + yBot)) / 2;
                        return { yTop: yTop + shift, yBot: yBot + shift };
                    });
                    break;
                }
                case 'bottom': {
                    brick.translateY((yTop, yBot) => {
                        return { yTop: yTop + mergedRect.yBot - yBot, yBot: mergedRect.yBot };
                    });
                    break;
                }
                default: {
                    brick.translateY((yTop, yBot) => {
                        return { yTop: mergedRect.yTop, yBot: yBot - yTop + mergedRect.yTop };
                    });
                }
            }
        });
    }
    public static getPaddingFromStyle(paddings: Array<number> | number): { paddingTop: number, paddingBottom: number, paddingLeft: number, paddingRight: number } {
        if(Array.isArray(paddings) && paddings.length > 1) {
            if(paddings.length == 2) {
                return {
                    paddingTop: paddings[0],
                    paddingBottom: paddings[0],
                    paddingLeft: paddings[1],
                    paddingRight: paddings[1]
                }
            }
            if(paddings.length == 3) {
                return {
                    paddingTop: paddings[0],
                    paddingLeft: paddings[1],
                    paddingRight: paddings[1],
                    paddingBottom: paddings[2],
                }
            }
            if(paddings.length == 4) {
                return {
                    paddingTop: paddings[0],
                    paddingRight: paddings[1],
                    paddingBottom: paddings[2],
                    paddingLeft: paddings[3],
                }
            }
        }
        else {
            const value = Array.isArray(paddings) ? paddings[0] : paddings;
            return {
                paddingTop: value,
                paddingBottom: value,
                paddingRight: value,
                paddingLeft: value
             }
        }
    }
}