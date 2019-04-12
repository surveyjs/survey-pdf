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
import { IDocOptions, DocOptions, IPoint, IRect } from "./docOptions";
import { IPdfQuestion } from "./question";
import { QuestionRepository } from "./questionRepository";
import addCustomFonts from "./customFonts";

export class JsPdfSurveyModel extends SurveyModel {
  docOptions: DocOptions;
  constructor(jsonObject: any) {
    super(jsonObject);
  }

  /**
   * Inner jsPDF paperSizes:
   * https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line147
   */

  render(options: IDocOptions) {
    this.docOptions = new DocOptions(options);
    // this.docOptions.doc.setFont("segoe");
    let point: IPoint = {
      xLeft: this.docOptions.margins.marginLeft,
      yTop: this.docOptions.margins.marginTop
    };
    this.pages.forEach((page: any) => {
      page.questions.forEach((question: IQuestion) => {
        let renderer: IPdfQuestion = QuestionRepository.getInstance().create(
          question,
          this.docOptions
        );
        let renderBoundaries: IRect[] = renderer.render(point, false);
        if (this.docOptions.tryNewPageQuestion(renderBoundaries)) {
          point.xLeft = this.docOptions.margins.marginLeft;
          point.yTop = this.docOptions.margins.marginTop;
        }
        renderBoundaries = renderer.render(point, true);
        point.yTop = renderBoundaries[renderBoundaries.length - 1].yBot;
      });
    });
  }
  save(fileName: string = "survey_result.pdf") {
    this.docOptions.doc.save(fileName);
  }
}
