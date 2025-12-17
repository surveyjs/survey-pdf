import { SurveyModel, EventBase, SurveyElement, Serializer, Question, PanelModel, PageModel, ITheme, ItemValue, IQuestion } from 'survey-core';
import { hasLicense } from 'survey-core';
import { IDocOptions, DocController, DocOptions } from './doc_controller';
import { FlatSurvey } from './flat_layout/flat_survey';
import { PagePacker } from './page_layout/page_packer';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { EventAsync, } from './event_handler/event_async';
import { EventHandler } from './event_handler/event_handler';
import { DrawCanvas } from './event_handler/draw_canvas';
import { AdornersOptions, AdornersPanelOptions, AdornersPageOptions } from './event_handler/adorners';
import { SurveyHelper } from './helper_survey';
import { createStylesFromTheme, getDefaultStylesFromTheme, IStyles } from './styles';
import { DefaultLight } from './themes/default-light';
import { parsePadding } from './utils';

/**
 * The `SurveyPDF` object enables you to export your surveys and forms to PDF documents.
 *
 * [View Demo](https://surveyjs.io/pdf-generator/examples/ (linkStyle))
 */
export class SurveyPDF extends SurveyModel {
    private static currentlySaving: boolean = false;
    private static saveQueue: any[] = [];
    public options: IDocOptions;
    public constructor(jsonObject: any, options?: IDocOptions) {
        super(jsonObject);
        if (typeof options === 'undefined') {
            options = {};
        }
        if(this.questionsOnPageMode == 'inputPerPage') {
            this.questionsOnPageMode = 'standard';
        }
        this.options = SurveyHelper.clone(options);
    }
    public get haveCommercialLicense(): boolean {
        const f = hasLicense;
        return !!f && f(2);
    }
    public set haveCommercialLicense(val: boolean) {
        // eslint-disable-next-line no-console
        console.error('As of v1.9.101, the haveCommercialLicense property is not supported. To activate your license, use the setLicenseKey(key) method as shown on the following page: https://surveyjs.io/remove-alert-banner');
    }
    /**
     * An event that is raised when SurveyJS PDF Generator renders a page header. Handle this event to customize the header.
     *
     * Parameters:
     *
     * - `sender`: `SurveyPDF`\
     * A SurveyPDF instance that raised the event.
     *
     * - `canvas`: [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas)\
     * An object that you can use to draw text and images in the page header.
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))
     */
    public onRenderHeader: EventAsync<SurveyPDF, DrawCanvas> =
        new EventAsync<SurveyPDF, DrawCanvas>();
    /**
     * An event that is raised when SurveyJS PDF Generator renders a page footer. Handle this event to customize the footer.
     *
     * Parameters:
     *
     * - `sender`: `SurveyPDF`\
     * A SurveyPDF instance that raised the event.
     *
     * - `canvas`: [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas)\
     * An object that you can use to draw text and images in the page footer.
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))
     */
    public onRenderFooter: EventAsync<SurveyPDF, DrawCanvas> =
        new EventAsync<SurveyPDF, DrawCanvas>();
    /**
     * An event that is raised when SurveyJS PDF Generator renders a survey question. Handle this event to customize question rendering.
     *
     * Parameters:
     *
     * - `sender`: `SurveyPDF`\
     * A SurveyPDF instance that raised the event.
     *
     * - `options.question`: [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\
     * A survey question that is being rendered.
     *
     * - `options.point`: `IPoint`\
     * An object with coordinates of the top-left corner of the element being rendered. This object contains the following properties: `{ xLeft: number, yTop: number }`.
     *
     * - `options.bricks`: [`PdfBrick[]`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick)\
     * An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#custom-rendering) used to render the element.
     *
     * - `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
     * An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.
     *
     * - `options.repository`: `FlatRepository`\
     * A repository with classes that render elements to PDF. Use its `create` method if you need to create a new instance of a rendering class.
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/how-to-use-adorners-in-pdf-forms/ (linkStyle))
     */
    public onRenderQuestion: EventAsync<SurveyPDF, AdornersOptions> =
        new EventAsync<SurveyPDF, AdornersOptions>();
    /**
     * An event that is raised when SurveyJS PDF Generator renders a panel. Handle this event to customize panel rendering.
     *
     * Parameters:
     *
     * - `sender`: `SurveyPDF`\
     * A SurveyPDF instance that raised the event.
     *
     * - `options.panel`: [`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panel-model)\
     * A panel that is being rendered.
     *
     * - `options.point`: `IPoint`\
     * An object with coordinates of the top-left corner of the element being rendered. This object contains the following properties: `{ xLeft: number, yTop: number }`.
     *
     * - `options.bricks`: [`PdfBrick[]`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick)\
     * An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#custom-rendering) used to render the element.
     *
     * - `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
     * An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.
     *
     * - `options.repository`: `FlatRepository`\
     * A repository with classes that render elements to PDF. Use its `create` method if you need to create a new instance of a rendering class.
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/how-to-use-adorners-in-pdf-forms/ (linkStyle))
     */
    public onRenderPanel: EventAsync<SurveyPDF, AdornersPanelOptions> =
        new EventAsync<SurveyPDF, AdornersPanelOptions>();
    /**
     * An event that is raised when SurveyJS PDF Generator renders a page. Handle this event to customize page rendering.
     *
     * Parameters:
     *
     * - `sender`: `SurveyPDF`\
     * A SurveyPDF instance that raised the event.
     *
     * - `options.page`: [`PageModel`](https://surveyjs.io/form-library/documentation/api-reference/page-model)\
     * A page that is being rendered.
     *
     * - `options.point`: `IPoint`\
     * An object with coordinates of the top-left corner of the element being rendered. This object contains the following properties: `{ xLeft: number, yTop: number }`.
     *
     * - `options.bricks`: [`PdfBrick[]`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick)\
     * An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#custom-rendering) used to render the element.
     *
     * - `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
     * An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.
     *
     * - `options.repository`: `FlatRepository`\
     * A repository with classes that render elements to PDF. Use its `create` method if you need to create a new instance of a rendering class.
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/how-to-use-adorners-in-pdf-forms/ (linkStyle))
     */
    public onRenderPage: EventAsync<SurveyPDF, AdornersPageOptions> =
        new EventAsync<SurveyPDF, AdornersPageOptions>();

    public onDocControllerCreated: EventBase<SurveyPDF, { controller: DocController }> = new EventBase<SurveyPDF, {controller: DocController}>();

    public onRenderCheckItemAcroform: EventAsync<SurveyPDF, any> =
        new EventAsync<SurveyPDF, any>();

    public onRenderRadioGroupWrapAcroform: EventAsync<SurveyPDF, any> =
    new EventAsync<SurveyPDF, any>();

    public onRenderRadioItemAcroform: EventAsync<SurveyPDF, any> =
    new EventAsync<SurveyPDF, any>();

    public updateCheckItemAcroformOptions(options: any, question: Question, context?: any): void {
        this.onRenderCheckItemAcroform.fire(this, {
            options: options,
            question: question,
            ...(context ?? {})
        });
    }
    public getUpdatedRadioGroupWrapOptions(options: any, question: Question, context?: any): void {
        this.onRenderRadioGroupWrapAcroform.fire(this, {
            options: options,
            question: question,
            ...(context ?? {})
        });
    }
    public updateRadioItemAcroformOptions(options: any, question: Question, context?: any): void {
        this.onRenderRadioItemAcroform.fire(this, {
            options: options,
            question: question,
            ...(context ?? {})
        });
    }

    public onGetQuestionStyles = new EventBase<SurveyPDF, { question: Question, styles: IStyles, getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number }>;
    public onGetPanelStyles = new EventBase<SurveyPDF, { panel: PanelModel, styles: IStyles, getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number }>;
    public onGetPageStyles = new EventBase<SurveyPDF, { page: PanelModel, styles: IStyles, getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number }>;
    public onGetItemStyles = new EventBase<SurveyPDF, { question: Question, item: ItemValue, styles: IStyles, getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number}>;

    private _styles: IStyles;
    public get styles(): IStyles {
        if(!this._styles) {
            this._styles = getDefaultStylesFromTheme(this.theme);
        }
        return this._styles;
    }
    public set styles(styles: IStyles) {
        SurveyHelper.mergeObjects(this.styles, styles);
    }

    public setStyles(callback: (options: { getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number }) => IStyles) {
        this.styles = createStylesFromTheme(this.theme, callback);
    }
    private _theme: ITheme;
    public get theme(): ITheme {
        return this._theme || DefaultLight;
    }
    public applyTheme(theme: ITheme): void {
        this._theme = theme;
        this._styles = undefined;
    }
    public getStylesForItem(question: Question, item: ItemValue, styles: IStyles): IStyles {
        return createStylesFromTheme(this.theme, (options) => {
            const eventOptions = {
                getColorVariable: options.getColorVariable,
                getSizeVariable: options.getSizeVariable,
                styles: styles
            };
            this.onGetItemStyles.fire(this, { question, item, ...eventOptions });
            return styles;
        });
    }
    public getStylesForElement(element: SurveyElement): IStyles {
        const styles = this.styles;
        const types = [element.getType()];
        let currentClass = Serializer.findClass(element.getType());
        while(!!currentClass.parentName) {
            types.unshift(currentClass.parentName);
            currentClass = Serializer.findClass(currentClass.parentName);
        }
        const res = {};
        types.forEach(type => {
            SurveyHelper.mergeObjects(res, styles[type] ?? {});
        });
        return createStylesFromTheme(this.theme, (options) => {
            const eventOptions = {
                getColorVariable: options.getColorVariable,
                getSizeVariable: options.getSizeVariable,
                styles: res
            };
            if(element.isPanel) {
                this.onGetPanelStyles.fire(this, { panel: element as PanelModel, ...eventOptions });
            }
            if(element.isPage) {
                this.onGetPageStyles.fire(this, { page: element as PageModel, ...eventOptions });
            }
            if(element.isQuestion) {
                this.onGetQuestionStyles.fire(this, { question: element as Question, ...eventOptions });
            }
            return res;
        });
    }
    private correctBricksPosition(controller: DocController, flats: IPdfBrick[][]) {
        if(controller.isRTL) {
            flats.forEach(flatsArr => {
                flatsArr.forEach(flat => {
                    flat.translateX((xLeft: number, xRight: number) => {
                        const shiftWidth = controller.paperWidth - xLeft - xRight;
                        return { xLeft: xLeft + shiftWidth, xRight: xRight + shiftWidth };
                    });
                });
            });
        }
    }

    private navigationMap: { [index: string]: number } = {};

    public afterRenderSurveyElement(element: SurveyElement, bricks: Array<IPdfBrick>) {
        bricks.forEach(brick => brick.addBeforeRenderCallback(() => {
            if(brick.getPageNumber() !== undefined) {
                this.navigationMap[element.uniqueId] = Math.min(this.navigationMap[element.uniqueId] ?? Number.MAX_VALUE, brick.getPageNumber() + 1);
            }
        }));
    }
    private renderPanelNavigation(controller: DocController, panel: PanelModel, rootChapter: any) {
        const { doc } = controller;
        if(!this.navigationMap[panel.uniqueId]) return;
        const panelChapter = doc.outline.add(rootChapter, panel.title || panel.name, { pageNumber: this.navigationMap[panel.uniqueId] });
        (panel.elements as any as Array<SurveyElement>).forEach((el: SurveyElement) => {
            if(el.isVisible && this.navigationMap[el.uniqueId]) {
                if(el.isPanel) {
                    this.renderPanelNavigation(controller, el as PanelModel, panelChapter);
                } else {
                    doc.outline.add(panelChapter, el.title || el.name, { pageNumber: this.navigationMap[el.uniqueId] });
                }
            }
        });
    }
    private renderNavigation(controller: DocController) {
        if(this.options.showNavigation ?? true) {
            this.visiblePages.forEach(page => {
                this.renderPanelNavigation(controller, page, null);
            });
            this.navigationMap = {};
        }
    }
    protected async renderSurvey(controller: DocController): Promise<void> {
        this.visiblePages.forEach(page => page.onFirstRendering());
        const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(this, controller);
        this.correctBricksPosition(controller, flats);
        const packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
        packs.forEach((pagePack, i) => {
            pagePack.forEach(pack => {
                pack.setPageNumber(i);
            });
        });
        await EventHandler.process_header_events(this, controller, packs);
        for (let i: number = 0; i < packs.length; i++) {
            if (controller.getNumberOfPages() === i) {
                controller.addPage();
            }
            controller.setPage(i);
            controller.setFillColor(this.styles.backgroundColor);
            controller.doc.rect(0, 0, controller.doc.internal.pageSize.getWidth(), controller.doc.internal.pageSize.getHeight(), 'F');
            controller.restoreFillColor();
            for (let j: number = 0; j < packs[i].length; j++) {

                //gizmos bricks borders for debug
                // packs[i][j].unfold().forEach((rect: IPdfBrick) => {
                //     controller.doc.setDrawColor('green');
                //     controller.doc.rect(...SurveyHelper.createAcroformRect(rect));
                //     controller.doc.setDrawColor('black');
                //   }
                // );
                await packs[i][j].render();
            }
        }
        this.renderNavigation(controller);
        SurveyHelper.clear();
    }
    private createController(): DocController {
        const marginsFromStyles = parsePadding(this.styles.padding);
        Object.keys(marginsFromStyles).forEach((key: 'top' | 'left' | 'bot' | 'right') => {
            marginsFromStyles[key] /= DocOptions.MM_TO_PT;
        });
        const options = SurveyHelper.mergeObjects({}, {
            margins: marginsFromStyles
        }, this.options);
        return new DocController(options);
    }
    /**
     * An asynchronous method that starts to download the generated PDF file in the web browser.
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/save-completed-forms-as-pdf-files/ (linkStyle))
     * @param fileName *(Optional)* A file name with the ".pdf" extension. Default value: `"survey_result.pdf"`.
     */

    public async save(fileName: string = 'survey_result.pdf'): Promise<any> {
        if(!SurveyPDF.currentlySaving) {
            const controller: DocController = this.createController();
            this.onDocControllerCreated.fire(this, { controller: controller });
            SurveyPDF.currentlySaving = true;
            SurveyHelper.fixFont(controller);
            await this.renderSurvey(controller);
            const promise = controller.doc.save(fileName, { returnPromise: true });
            promise.then(() => {
                SurveyPDF.currentlySaving = false;
                const saveFunc = SurveyPDF.saveQueue.shift();
                if(!!saveFunc) {
                    saveFunc();
                }
            });
            return promise;
        } else {
            SurveyPDF.saveQueue.push(() => {
                this.save(fileName);
            });
        }
    }
    /**
     * An asynchronous method that allows you to get PDF content in different formats.
     *
     * [View Demo](https://surveyjs.io/pdf-generator/examples/convert-pdf-form-blob-base64-raw-pdf-javascript/ (linkStyle))
     *
     * @param type *(Optional)* One of `"blob"`, `"bloburl"`, `"dataurlstring"`. Do not specify this parameter if you want to get raw PDF content as a string value.
     *
     */
    raw(): Promise<string>;
    raw(type: 'arraybuffer'): Promise<ArrayBuffer>;
    raw(type: 'blob'): Promise<Blob>;
    raw(type: 'bloburl'): Promise<URL>;
    raw(type: 'dataurlstring'): Promise<string>;
    public async raw(type?: string): Promise<ArrayBuffer | string | Blob | URL > {
        const controller: DocController = this.createController();
        this.onDocControllerCreated.fire(this, { controller: controller });
        SurveyHelper.fixFont(controller);
        await this.renderSurvey(controller);
        return controller.doc.output(type);
    }
}