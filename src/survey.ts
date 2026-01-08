import { SurveyModel, EventBase, SurveyElement, Serializer, Question, PanelModel, PageModel, ITheme, ItemValue } from 'survey-core';
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
import { IDocStyles } from './styles/types';
import { createStylesFromTheme, getDefaultStylesFromTheme } from './styles';
import { DefaultLight } from './themes/default-light';
import { parsePadding } from './utils';
import { ITextStyle, ISelectionInputStyle, IQuestionStyle, IPageStyle, IPanelStyle } from './styles/types';

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
     * A `SurveyPDF` instance that raised the event.
     * - `canvas`: [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas)\
     * An object that you can use to draw text and images in the page header.
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
     * A `SurveyPDF` instance that raised the event.
     * - `canvas`: [`DrawCanvas`](https://surveyjs.io/pdf-generator/documentation/api-reference/drawcanvas)\
     * An object that you can use to draw text and images in the page footer.
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
     * A `SurveyPDF` instance that raised the event.
     * - `options.question`: [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\
     * A survey question that is being rendered.
     * - `options.point`: `IPoint`\
     * An object with coordinates of the top-left corner of the element being rendered. This object contains the following properties: `{ xLeft: number, yTop: number }`.
     * - `options.bricks`: [`PdfBrick[]`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick)\
     * An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#custom-rendering) used to render the element.
     * - `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
     * An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.
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
     * A `SurveyPDF` instance that raised the event.
     * - `options.panel`: [`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panel-model)\
     * A panel that is being rendered.
     * - `options.point`: `IPoint`\
     * An object with coordinates of the top-left corner of the element being rendered. This object contains the following properties: `{ xLeft: number, yTop: number }`.
     * - `options.bricks`: [`PdfBrick[]`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick)\
     * An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#custom-rendering) used to render the element.
     * - `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
     * An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.
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
     * A `SurveyPDF` instance that raised the event.
     * - `options.page`: [`PageModel`](https://surveyjs.io/form-library/documentation/api-reference/page-model)\
     * A page that is being rendered.
     * - `options.point`: `IPoint`\
     * An object with coordinates of the top-left corner of the element being rendered. This object contains the following properties: `{ xLeft: number, yTop: number }`.
     * - `options.bricks`: [`PdfBrick[]`](https://surveyjs.io/pdf-generator/documentation/api-reference/pdfbrick)\
     * An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form#custom-rendering) used to render the element.
     * - `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
     * An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.
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

    /**
     * An event that allows you to customize the visual style applied to a question in an exported PDF document.
     *
     * Parameters:
     *
     * - `sender`: `SurveyPDF`\
     * A `SurveyPDF` instance that raised the event.
     * - `options.question`: [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\
     * A survey question whose style is being customized.
     * - `options.getColorVariable`: `(name: string) => string`\
     * A helper function that returns the value of a color variable by name.
     * - `options.getSizeVariable`: `(name: string) => number`\
     * A helper function that returns the value of a size variable by name.
     * - `options.style`: [`IQuestionStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/IQuestionStyle)\
     * An object that defines the question's visual style. Modify its properties to control how the question is rendered in the exported PDF document.
     */
    public onGetQuestionStyle = new EventBase<SurveyPDF, { question: Question, style: IQuestionStyle, getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number }>;
    /**
     * An event that allows you to customize the visual style applied to a panel in an exported PDF document.
     *
     * Parameters:
     *
     * - `sender`: `SurveyPDF`\
     * A `SurveyPDF` instance that raised the event.
     * - `options.panel`: [`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panel-model)\
     * A panel whose style is being customized.
     * - `options.getColorVariable`: `(name: string) => string`\
     * A helper function that returns the value of a color variable by name.
     * - `options.getSizeVariable`: `(name: string) => number`\
     * A helper function that returns the value of a size variable by name.
     * - `options.style`: [`IPanelStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/IPanelStyle)\
     * An object that defines the panel's visual style. Modify its properties to control how the panel is rendered in the exported PDF document.
     */
    public onGetPanelStyle = new EventBase<SurveyPDF, { panel: PanelModel, style: IPanelStyle, getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number }>;
    /**
     * An event that allows you to customize the visual style applied to a page in an exported PDF document.
     *
     * Parameters:
     *
     * - `sender`: `SurveyPDF`\
     * A `SurveyPDF` instance that raised the event.
     * - `options.page`: [`PageModel`](https://surveyjs.io/form-library/documentation/api-reference/page-model)\
     * A page whose style is being customized.
     * - `options.getColorVariable`: `(name: string) => string`\
     * A helper function that returns the value of a color variable by name.
     * - `options.getSizeVariable`: `(name: string) => number`\
     * A helper function that returns the value of a size variable by name.
     * - `options.style`: [`IPageStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/IPageStyle)\
     * An object that defines the page's visual style. Modify its properties to control how the page is rendered in the exported PDF document.
     */
    public onGetPageStyle = new EventBase<SurveyPDF, { page: PanelModel, style: IPageStyle, getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number }>;
    /**
     * An event that allows you to customize the visual style applied to a collection item in an exported PDF document.
     *
     * Parameters:
     *
     * - `sender`: `SurveyPDF`\
     * A `SurveyPDF` instance that raised the event.
     * - `options.question`: [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\
     * A question to which the item belongs.
     * - `options.item`: `ItemValue`\
     * A collection item whose style is being customized.
     * - `options.getColorVariable`: `(name: string) => string`\
     * A helper function that returns the value of a color variable by name.
     * - `options.getSizeVariable`: `(name: string) => number`\
     * A helper function that returns the value of a size variable by name.
     * - `options.style.choiceText`: [`ITextStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/ITextStyle)\
     * An object that defines the visual style applied to the item's text.
     * - `options.style.input`: [`ISelectionInputStyle`](https://surveyjs.io/pdf-generator/documentation/api-reference/ISelectionInputStyle)\
     * An object that defines the visual style applied to the item's input control.
     *
     * Modify the properties of `options.style.choiceText` and `options.style.input` to control how the item is rendered in the exported PDF document.
     */
    public onGetItemStyle = new EventBase<SurveyPDF, { question: Question, item: ItemValue, style: { choiceText: ITextStyle, input: ISelectionInputStyle }, getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number}>;

    private _styles: IDocStyles;
    /**
     * An object that defines visual styles applied to UI elements in an exported PDF document.
     *
     * Modify the properties of this object to control how survey elements are rendered in the PDF.
     */
    public get styles(): IDocStyles {
        if(!this._styles) {
            this._styles = getDefaultStylesFromTheme(this.theme);
        }
        return this._styles;
    }
    public set styles(styles: IDocStyles) {
        SurveyHelper.mergeObjects(this.styles, styles);
    }

    public setStyles(callback: (options: { getColorVariable: (name: string) => string, getSizeVariable: (name: string) => number }) => IDocStyles) {
        this.styles = createStylesFromTheme(this.theme, callback);
    }
    private _theme: ITheme;
    public get theme(): ITheme {
        return this._theme || DefaultLight;
    }
    public applyTheme(theme: ITheme): void {
        this._theme = SurveyHelper.mergeObjects({}, this.theme, theme);
        this._styles = undefined;
        this.stylesHash = {};
    }
    public getItemStyle(question: Question, item: ItemValue, styles: { choiceText: ITextStyle, input: ISelectionInputStyle }): { choiceText: ITextStyle, input: ISelectionInputStyle } {
        return createStylesFromTheme(this.theme, (options) => {
            const eventOptions = {
                getColorVariable: options.getColorVariable,
                getSizeVariable: options.getSizeVariable,
                style: styles
            };
            this.onGetItemStyle.fire(this, { question, item, ...eventOptions });
            return styles;
        });
    }
    private stylesHash: { [id: number]: IQuestionStyle | IPanelStyle | IPageStyle } = {};
    public getElementStyle<T extends IQuestionStyle | IPanelStyle | IPageStyle = IQuestionStyle>(element: SurveyElement): T {
        const uniqueId = element.uniqueId;
        if(!this.stylesHash[uniqueId]) {
            const styles = this.styles;
            const types = [element.getType()];
            let currentClass = Serializer.findClass(element.getType());
            while(!!currentClass.parentName) {
                types.unshift(currentClass.parentName);
                currentClass = Serializer.findClass(currentClass.parentName);
            }
            const res = {};
            types.forEach(type => {
                SurveyHelper.mergeObjects(res, (styles as any)[type] ?? {});
            });
            this.stylesHash[uniqueId] = createStylesFromTheme(this.theme, (options) => {
                const eventOptions = {
                    getColorVariable: options.getColorVariable,
                    getSizeVariable: options.getSizeVariable,
                    style: res
                };
                if(element.isPanel) {
                    this.onGetPanelStyle.fire(this, { panel: element as PanelModel, ...eventOptions });
                }
                if(element.isPage) {
                    this.onGetPageStyle.fire(this, { page: element as PageModel, ...eventOptions });
                }
                if(element.isQuestion) {
                    this.onGetQuestionStyle.fire(this, { question: element as Question, ...eventOptions });
                }
                return res;
            });
        }
        return this.stylesHash[uniqueId] as T;
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
            controller.setFillColor(this.styles.survey.backgroundColor);
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
        this.stylesHash = {};
    }
    private createController(): DocController {
        const marginsFromStyles = parsePadding(this.styles.survey.padding);
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