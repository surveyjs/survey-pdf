//TODO:
//merge reder and getBounraries methods to one render
//which returns array(?) of bounraries for every page
//also this method must have a parameter (bool) isRender
//(or only get boundaries)

//add gap (margin, etc) support

//fix tryNewPageElement in render of PdfQuestionRendererBase
//(toggle only if whole question can be placed in one page)

//sift up interface to testing

import { SurveyModel, IQuestion } from "survey-core";
import { IPoint, IRect, IDocOptions, DocController } from "./docController";
import { IPdfQuestion } from "./question";
import { QuestionRepository } from "./questionRepository";
import addCustomFonts from "./customFonts";

export class JsPdfSurveyModel extends SurveyModel {
  docController: DocController;
  constructor(jsonObject: any) {
    super(jsonObject);
  }

  /**
   * Inner jsPDF paperSizes:
   * https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line147
   */

  render(options: IDocOptions) {
    this.docController = new DocController(options);
    // this.docController.doc.setFont("segoe");
    let point: IPoint = {
      xLeft: this.docController.margins.marginLeft,
      yTop: this.docController.margins.marginTop
    };
    this.pages.forEach((page: any) => {
      page.questions.forEach((question: IQuestion) => {
        let renderer: IPdfQuestion = QuestionRepository.getInstance().create(
          question,
          this.docController
        );
        let renderBoundaries: IRect[] = renderer.render(point, false);
        if (this.docController.isNewPageQuestion(renderBoundaries)) {
          this.docController.addPage();
          point.xLeft = this.docController.margins.marginLeft;
          point.yTop = this.docController.margins.marginTop;
        }
        renderBoundaries = renderer.render(point, true);
        point.yTop = renderBoundaries[renderBoundaries.length - 1].yBot;
        point.yTop += this.docController.fontSize * this.docController.yScale;
        if (this.docController.isNewPageElement(point.yTop)) {
          this.docController.addPage();
          point.xLeft = this.docController.margins.marginLeft;
          point.yTop = this.docController.margins.marginTop;
        }
      });
    });
  }
  save(fileName: string = "survey_result.pdf") {
    this.docController.doc.save(fileName);
  }
}
