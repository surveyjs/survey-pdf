import { SurveyModel } from 'survey-core';
import { IDocOptions, DocController } from './doc_controller';
import { FlatSurvey } from './flat_layout/flat_survey';
import { PagePacker } from './page_layout/page_packer';
import { IPdfBrick } from './pdf_render/pdf_brick';
import { EventPDF, EventHandler } from './event_handler/event_handler';
import { DrawCanvas } from './event_handler/draw_canvas';
import { AdornersOptions } from './event_handler/adorners';
import { SurveyHelper } from './helper_survey';

export class SurveyPDF extends SurveyModel {
  public options: IDocOptions;
  public constructor(jsonObject: any, options: IDocOptions) {
    super(jsonObject);
    this.options = SurveyHelper.clone(options);
  }
  /**
   * The event in fired for every rendered page
   * @param survey SurveyPDF object that fires the event
   * @param canvas DrawCanvas object that you may use it to draw text and images in the page header
   */
  public onRenderHeader: EventPDF<
    (survey: SurveyPDF, canvas: DrawCanvas) => any,
    any
  > = new EventPDF<(survey: SurveyPDF, canvas: DrawCanvas) => any, any>();
  /**
   * The event in fired for every rendered page
   * @param survey SurveyPDF object that fires the event
   * @param canvas DrawCanvas object that you may use it to draw text and images in the page footer
   */
  public onRenderFooter: EventPDF<
    (survey: SurveyPDF, canvas: DrawCanvas) => any,
    any
  > = new EventPDF<(survey: SurveyPDF, canvas: DrawCanvas) => any, any>();
  /**
   * The event in fired for every rendered question
   * @param survey SurveyPDF object that fires the event
   * @param canvas AdornersOptions object that have options to custom render the question
   */
  public onRenderQuestion: EventPDF<
    (survey: SurveyPDF, options: AdornersOptions) => any,
    any
  > = new EventPDF<(survey: SurveyPDF, options: AdornersOptions) => any, any>();
  private wairForCoreIsReady(): Promise<void> {
    let countChoicesByUrl = 0;
    this.getAllQuestions().forEach((value: any) => {
      if (typeof value.choicesByUrl !== 'undefined' && !value.choicesByUrl.isEmpty) {
        countChoicesByUrl++;
      }
    });
    let result: Promise<void> = new Promise<void>((resolve: any) => {
      this.onLoadChoicesFromServer.add(() => {
        if (--countChoicesByUrl === 0) {
          resolve();
        }
      });
    });
    return result;
  }
  private async render(controller: DocController): Promise<void> {
    await this.wairForCoreIsReady();
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(this, controller);
    let packs: IPdfBrick[][] = PagePacker.pack(flats, controller);
    EventHandler.process_header_events(this, controller, packs);
    for (let i: number = 0; i < packs.length; i++) {
      let pageAdded: boolean = i === 0;
      for (let j: number = 0; j < packs[i].length; j++) {
        if (!pageAdded) {
          pageAdded = true;
          if (packs[i][j].isAddPage()) {
            controller.addPage();
          }
        }
        // packs[i][j].unfold().forEach((rect: IPdfBrick) => {
        //     controller.doc.setDrawColor('green');
        //     controller.doc.rect(...SurveyHelper.createAcroformRect(rect));
        //     controller.doc.setDrawColor('black');
        // }
        // );
        await packs[i][j].render();
      }
    }
  }
  public async save(fileName: string = 'survey_result.pdf'): Promise<any> {
    let controller: DocController = new DocController(this.options);
    SurveyHelper.fixFont(controller);
    await this.render(controller);
    return controller.doc.save(fileName, { returnPromise: true });
  }
  public async raw(): Promise<String> {
    let controller: DocController = new DocController(this.options);
    await this.render(controller);
    return controller.doc.__private__.buildDocument();
  }
}

export { SurveyPDF as Survey };
