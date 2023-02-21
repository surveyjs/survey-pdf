import { SurveyModel, Event, Question } from 'survey-core';
import { IDocOptions, DocController } from './doc_controller';
import { FlatSurvey } from './flat_layout/flat_survey';
import { PagePacker } from './page_layout/page_packer';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { EventAsync, EventHandler } from './event_handler/event_handler';
import { DrawCanvas } from './event_handler/draw_canvas';
import { AdornersOptions, AdornersPanelOptions, AdornersPageOptions } from './event_handler/adorners';
import { SurveyHelper } from './helper_survey';

/**
 * The `SurveyPDF` object enables you to export your surveys and forms to PDF documents.
 * 
 * [View Demo](https://surveyjs.io/pdf-generator/examples/ (linkStyle))
 */
export class SurveyPDF extends SurveyModel {
    private static currentlySaving: boolean = false;
    private static saveQueue: any[] = [];
    private _haveCommercialLicense: boolean;
    public options: IDocOptions;
    public constructor(jsonObject: any, options?: IDocOptions) {
        super(jsonObject);
        if (typeof options === 'undefined') {
            options = {};
        }
        this.options = SurveyHelper.clone(options);
        this._haveCommercialLicense = options.commercial || options.haveCommercialLicense;
    }
    /**
     * Removes watermarks from the exported document.
     *
     * > You can enable this property only if you have a SurveyJS PDF Generator [commercial license](https://surveyjs.io/pricing). It is illegal to enable this property without a license.
     */
    public get haveCommercialLicense(): boolean {
        return this._haveCommercialLicense;
    }
    public set haveCommercialLicense(val: boolean) {
        this._haveCommercialLicense = val;
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
    public onRenderHeader: EventAsync<(survey: SurveyPDF, canvas: DrawCanvas) => any, any> =
        new EventAsync<(survey: SurveyPDF, canvas: DrawCanvas) => any, any>();
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
    public onRenderFooter: EventAsync<(survey: SurveyPDF, canvas: DrawCanvas) => any, any> =
        new EventAsync<(survey: SurveyPDF, canvas: DrawCanvas) => any, any>();
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
     * An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customization-customrender-questionelements#bricks) used to render the element.
     * 
     * - `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
     * An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.
     * 
     * - `options.repository`: `FlatRepository`\
     * A repository with classes that render elements to PDF. Use its `create` method if you need to create a new instance of a rendering class.
     * 
     * [View Demo](https://surveyjs.io/pdf-generator/examples/customize-header-and-footer-of-pdf-form/ (linkStyle))
     */
    public onRenderQuestion: EventAsync<(survey: SurveyPDF, options: AdornersOptions) => any, any> =
        new EventAsync<(survey: SurveyPDF, options: AdornersOptions) => any, any>();
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
     * An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customization-customrender-questionelements#bricks) used to render the element.
     * 
     * - `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
     * An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.
     * 
     * - `options.repository`: `FlatRepository`\
     * A repository with classes that render elements to PDF. Use its `create` method if you need to create a new instance of a rendering class.
     */
    public onRenderPanel: EventAsync<(survey: SurveyPDF, options: AdornersPanelOptions) => any, any> =
        new EventAsync<(survey: SurveyPDF, options: AdornersPanelOptions) => any, any>();
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
     * An array of [bricks](https://surveyjs.io/pdf-generator/documentation/customization-customrender-questionelements#bricks) used to render the element.
     * 
     * - `options.controller`: [`DocController`](https://surveyjs.io/pdf-generator/documentation/api-reference/doccontroller)\
     * An object that provides access to main PDF document properties (font, margins, page width and height) and allows you to modify them.
     * 
     * - `options.repository`: `FlatRepository`\
     * A repository with classes that render elements to PDF. Use its `create` method if you need to create a new instance of a rendering class.
     */
    public onRenderPage: EventAsync<(survey: SurveyPDF, options: AdornersPageOptions) => any, any> =
        new EventAsync<(survey: SurveyPDF, options: AdornersPageOptions) => any, any>();

    public onRenderCheckItemAcroform: EventAsync<(survey: SurveyPDF, options: any) => any, any> =
        new EventAsync<(survey: SurveyPDF, options: any) => any, any>();

    public onRenderRadioGroupWrapAcroform: EventAsync<(survey: SurveyPDF, options: any) => any, any> =
    new EventAsync<(survey: SurveyPDF, options: any) => any, any>();

    public onRenderRadioItemAcroform: EventAsync<(survey: SurveyPDF, options: any) => any, any> =
    new EventAsync<(survey: SurveyPDF, options: any) => any, any>();

    private waitForQuestionIsReady(question: Question): Promise<void> {
        return new Promise((resolve: any) => {
            if (question.isReady) {
                resolve();
            }
            else {
                const readyCallback: (sender: Question, options: any) => void =
                (_, options: any) => {
                    if (options.isReady) {
                        question.onReadyChanged.remove(readyCallback);
                        resolve();
                    }
                };
                question.onReadyChanged.add(readyCallback);
            }
        });
    }
    private async waitForCoreIsReady(): Promise<void> {
        for (const question of this.getAllQuestions()) {
            if (!!(<any>question).contentPanel) {
                const list: Question[] = [];
                (<any>question).contentPanel.addQuestionsToList(list);
                for (const innerQuestion of list) {
                    await this.waitForQuestionIsReady(innerQuestion);
                }
                continue;
            }
            else await this.waitForQuestionIsReady(
                SurveyHelper.getContentQuestion(<Question>question));
        }
    }
    public getUpdatedCheckItemAcroformOptions(options: any): void {
        this.onRenderCheckItemAcroform.fire(this, options);
    }
    public getUpdatedRadioGroupWrapOptions(options: any): void {
        this.onRenderRadioGroupWrapAcroform.fire(this, options);
    }
    public getUpdatedRadioItemAcroformOptions(options: any): void {
        this.onRenderRadioItemAcroform.fire(this, options);
    }
    protected async renderSurvey(controller: DocController): Promise<void> {
        await this.waitForCoreIsReady();
        const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(this, controller);
        const packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
        await EventHandler.process_header_events(this, controller, packs);
        for (let i: number = 0; i < packs.length; i++) {
            for (let j: number = 0; j < packs[i].length; j++) {
                if (controller.getNumberOfPages() === i) {
                    controller.addPage();
                }
                controller.setPage(i);
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
    }
    /**
     * An asynchronous method that starts download of the generated PDF file in the web browser.
     * 
     * @param fileName *(Optional)* A file name with the ".pdf" extension. Default value: `"survey_result.pdf"`.
     */
    public async save(fileName: string = 'survey_result.pdf'): Promise<any> {
        if(!SurveyPDF.currentlySaving) {
            const controller: DocController = new DocController(this.options);
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
    public async raw(type?: string): Promise<string> {
        const controller: DocController = new DocController(this.options);
        SurveyHelper.fixFont(controller);
        await this.renderSurvey(controller);
        return controller.doc.output(type);
    }
}
