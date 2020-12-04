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
 * SurveyPDF object contains options, events and methods to export PDF
 */
export class SurveyPDF extends SurveyModel {
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
   * You have right to set this property to true if you have bought the commercial licence only.
   * It will remove the text about non-commerical usage on the top of the document.
   * Setting this property true without having a commercial licence is illegal
   */
  public get haveCommercialLicense(): boolean {
    return this._haveCommercialLicense;
  }
  public set haveCommercialLicense(val: boolean) {
    this._haveCommercialLicense = val;
  }
  /**
   * The event in fired for every rendered page
   * @param survey SurveyPDF object that fires the event
   * @param canvas DrawCanvas object that you may use it to draw text and images in the page header
   */
  public onRenderHeader: Event<
    (survey: SurveyPDF, canvas: DrawCanvas) => any,
    any
  > = new Event<(survey: SurveyPDF, canvas: DrawCanvas) => any, any>();
  /**
   * The event in fired for every rendered page
   * @param survey SurveyPDF object that fires the event
   * @param canvas DrawCanvas object that you may use it to draw text and images in the page footer
   */
  public onRenderFooter: Event<
    (survey: SurveyPDF, canvas: DrawCanvas) => any,
    any
  > = new Event<(survey: SurveyPDF, canvas: DrawCanvas) => any, any>();
  /**
   * The event in fired for every rendered question
   * @param survey SurveyPDF object that fires the event
   * @param options AdornersOptions object that have options to custom render the question
   */
  public onRenderQuestion: EventAsync<
    (survey: SurveyPDF, options: AdornersOptions) => any,
    any
  > = new EventAsync<(survey: SurveyPDF, options: AdornersOptions) => any, any>();
  /**
   * The event in fired for every rendered panel
   * @param survey SurveyPDF object that fires the event
   * @param options AdornersPanelOptions object that have options to custom render the panel
   */
  public onRenderPanel: EventAsync<
    (survey: SurveyPDF, options: AdornersPanelOptions) => any,
    any
  > = new EventAsync<(survey: SurveyPDF, options: AdornersPanelOptions) => any, any>();
  /**
   * The event in fired for every rendered page
   * @param survey SurveyPDF object that fires the event
   * @param options AdornersPageOptions object that have options to custom render the page
   */
  public onRenderPage: EventAsync<
    (survey: SurveyPDF, options: AdornersPageOptions) => any,
    any
  > = new EventAsync<(survey: SurveyPDF, options: AdornersPageOptions) => any, any>();
  private waitForQuestionIsReady(question: Question): Promise<void> {
    return new Promise((resolve: any) => {     
      if (question.isReady) {
        resolve();
      }
      else {
        let readyCallback: (sender: Question, options: any) => void =
          (_, options: any) => {
            if (options.isReady) {
              question.onReadyChanged.remove(readyCallback);
              resolve();
            }
          }
        question.onReadyChanged.add(readyCallback);
      }
    });
  }
  private async waitForCoreIsReady(): Promise<void> {
    for (let question of this.getAllQuestions()) {
      if (!!(<any>question).contentPanel) {
        let list: Question[] = [];
        (<any>question).contentPanel.addQuestionsToList(list);
        for (let innerQuestion of list) {
          await this.waitForQuestionIsReady(innerQuestion);
        }
        continue;
      }
      else await this.waitForQuestionIsReady(
        SurveyHelper.getContentQuestion(<Question>question));
    }
  }
  private async render(controller: DocController): Promise<void> {
    await this.waitForCoreIsReady();
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(this, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    EventHandler.process_header_events(this, controller, packs);
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
   * Call save method of surveyPDF object to download file in browser. This is asynchronous method
   * @param fileName optional filename parameter
   */
  public async save(fileName: string = 'survey_result.pdf'): Promise<any> {
    let controller: DocController = new DocController(this.options);
    SurveyHelper.fixFont(controller);
    await this.render(controller);
    return controller.doc.save(fileName, { returnPromise: true });
  }
  /**
   * Call raw method of surveyPDF to get PDF document as string object. This is asynchronous method
   * @param type omit to get raw string, or pass "blob", "bloburl" or "dataurlstring"
   */
  public async raw(type?: string): Promise<string> {
    let controller: DocController = new DocController(this.options);
    SurveyHelper.fixFont(controller);
    await this.render(controller);
    return controller.doc.output(type);
  }
}
