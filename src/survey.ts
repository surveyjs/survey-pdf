//TODO:
//merge reder and getBounraries methods to one render
//which returns array(?) of bounraries for every page
//also this method must have a parameter (bool) isRender
//(or only get boundaries)

//add gap (margin, etc) support

//fix tryNewPageElement in render of PdfQuestionRendererBase
//(toggle only if whole question can be placed in one page)

//sift up interface to testing

import { SurveyModel } from "survey-core";
import { Question } from "survey-core";
import { IQuestion } from "survey-core";
import jsPDF from "jspdf";
import addCustomFonts from "./customFonts";

export interface IPoint {
  xLeft: number;
  yTop: number;
}
export interface IRect {
  xLeft: number;
  xRight: number;
  yTop: number;
  yBot: number;
}

export interface IPdfQuestion {
  renderContent(point: IPoint, isRender: boolean): IRect[];
  render(point: IPoint, isRender: boolean): IRect[];
}
export type RendererConstructor = new (
  question: IQuestion,
  docOptions: DocOptions
) => IPdfQuestion;
export interface Margins {
  marginTop: number;
  marginBot: number;
  marginLeft: number;
  marginRight: number;
}
export class DocOptions {
  private static PAPER_TO_LOGIC_SCALE_MAGIC: number = 210.0 / 595.28;
  private paperCheckHeight: number;
  constructor(
    protected doc: any,
    protected fontSize: number,
    protected xScale: number,
    protected yScale: number,
    protected paperWidth: number,
    protected paperHeight: number
  ) {
    this.paperCheckHeight = paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
    doc.setFontSize(fontSize);
  }
  getDoc(): any {
    return this.doc;
  }
  getFontSize(): number {
    return this.fontSize;
  }
  getXScale(): number {
    return this.xScale;
  }
  getYScale(): number {
    return this.yScale;
  }
  setXScale(xScale: number) {
    this.xScale = xScale;
  }
  setYScale(yScale: number) {
    this.yScale = yScale;
  }
  setFontSize(fontSize: number) {
    this.fontSize = fontSize;
    this.doc.setFontSize(fontSize);
  }
  tryNewPageQuestion(boundaries: IRect[], isRender: boolean = true): boolean {
    let height = 0;
    boundaries.forEach((rect: IRect) => {
      height += rect.yBot - rect.yTop;
    });
    if (height <= this.paperCheckHeight && boundaries.length > 1) {
      if (isRender) this.doc.addPage([this.paperWidth, this.paperHeight]);
      return true;
    }
    return false;
  }
  tryNewPageElement(yBot: number, isRender: boolean = true): boolean {
    if (yBot > this.paperCheckHeight) {
      if (isRender) this.doc.addPage([this.paperWidth, this.paperHeight]);
      return true;
    }
    return false;
  }
}

export class QuestionRepository {
  private questions: { [index: string]: RendererConstructor } = {};
  private static instance = new QuestionRepository();
  static getInstance(): QuestionRepository {
    return QuestionRepository.instance;
  }
  register(modelType: string, rendererConstructor: RendererConstructor) {
    this.questions[modelType] = rendererConstructor;
  }
  create(question: IQuestion, docOptions: DocOptions): IPdfQuestion {
    let rendererConstructor =
      this.questions[question.getType()] || PdfQuestionRendererBase;
    return new rendererConstructor(question, docOptions);
  }
}

export class PdfQuestionRendererBase implements IPdfQuestion {
  constructor(
    protected question: IQuestion,
    protected docOptions: DocOptions
  ) {}
  private renderTitle(point: IPoint, isRender: boolean = true): IRect {
    return this.renderText(point, this.getQuestion<Question>().title, isRender);
  }
  renderText(point: IPoint, text: string, isRender: boolean = true): IRect {
    let boundaruies: IRect = {
      xLeft: point.xLeft,
      xRight:
        point.xLeft +
        text.length *
          this.docOptions.getFontSize() *
          this.docOptions.getXScale(),
      yTop: point.yTop,
      yBot:
        point.yTop + this.docOptions.getFontSize() * this.docOptions.getYScale()
    };
    if (isRender) {
      let alignPoint = this.alignPoint(point, boundaruies);
      this.docOptions.getDoc().text(text, alignPoint.xLeft, alignPoint.yTop, {
        align: "left",
        baseline: "middle"
      });
    }
    return boundaruies;
  }
  renderContent(point: IPoint, isRender: boolean = true): IRect[] {
    return [
      {
        xLeft: point.xLeft,
        xRight: point.xLeft,
        yTop: point.yTop,
        yBot: point.yTop
      }
    ];
  }
  render(point: IPoint, isRender: boolean = true): IRect[] {
    switch (this.getQuestion<Question>().titleLocation) {
      case "top":
      case "default": {
        let titleRect: IRect = this.renderTitle(point, isRender);
        let contentPoint: IPoint = {
          xLeft: titleRect.xLeft,
          yTop: titleRect.yBot
        };
        let contentRects: IRect[] = this.renderContent(contentPoint, isRender);
        contentRects[0].xLeft = titleRect.xLeft;
        contentRects[0].xRight = Math.max(
          contentRects[0].xRight,
          titleRect.xLeft
        );
        return contentRects;
      }
      case "bottom": {
        let contentRects: IRect[] = this.renderContent(point, isRender);
        let titlePoint: IPoint = {
          xLeft: contentRects[contentRects.length - 1].xLeft,
          yTop: contentRects[contentRects.length - 1].yBot
        };
        let titleRect: IRect = this.renderTitle(titlePoint, isRender);
        contentRects[contentRects.length - 1].xRight = Math.max(
          contentRects[contentRects.length - 1].xRight,
          titleRect.xRight
        );
        contentRects[contentRects.length - 1].yBot = titleRect.yBot;
        return contentRects;
      }
      case "left": {
        let titleRect: IRect = this.renderTitle(point, isRender);
        let contentPoint: IPoint = {
          xLeft: titleRect.xRight,
          yTop: titleRect.yTop
        };
        let contentRects: IRect[] = this.renderContent(contentPoint, isRender);
        contentRects[0].xLeft = titleRect.xLeft;
        contentRects[0].yBot = Math.max(contentRects[0].yBot, titleRect.yBot);
        return contentRects;
      }
      case "hidden": {
        return this.renderContent(point, isRender);
      }
    }
  }
  alignPoint(point: IPoint, boundaries: IRect): IPoint {
    return {
      xLeft: point.xLeft,
      yTop: point.yTop + (boundaries.yBot - boundaries.yTop) / 2.0
    };
  }
  getQuestion<T extends Question>(): T {
    return <T>this.question;
  }
}

export class JsPdfSurveyModel extends SurveyModel {
  constructor(jsonObject: any) {
    super(jsonObject);
  }

  /**
   * Use it to render survey to PDF.
   * Look https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line147
   * for standar paper sizes.
   */
  render(
    fontSize: number,
    xScale: number,
    yScale: number,
    paperWidth: number = 595.28,
    paperHeight: number = 841.89
  ) {
    addCustomFonts(jsPDF);
    let docOptions = new DocOptions(
      new jsPDF({
        format: [paperWidth, paperHeight]
      }),
      fontSize,
      xScale,
      yScale,
      paperWidth,
      paperHeight
    );
    docOptions.getDoc().setFontSize(fontSize);
    docOptions.getDoc().setFont("segoe");
    console.log(docOptions.getDoc().getFontList());
    let point: IPoint = { xLeft: 0, yTop: 0 };
    this.pages.forEach((page: any) => {
      page.questions.forEach((question: IQuestion) => {
        let renderer: IPdfQuestion = QuestionRepository.getInstance().create(
          question,
          docOptions
        );
        let renderBoundaries: IRect[] = renderer.render(point, false);
        if (docOptions.tryNewPageQuestion(renderBoundaries)) {
          point.xLeft = 0;
          point.yTop = 0;
        }
        renderBoundaries = renderer.render(point, true);
        point.yTop = renderBoundaries[renderBoundaries.length - 1].yBot;
      });
    });
    docOptions.getDoc().save("survey_result.pdf");
  }
}
