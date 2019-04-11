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
export interface IMargin {
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBot: number;
}
export interface IPdfQuestion {
  renderContent(point: IPoint, isRender: boolean): IRect[];
  render(point: IPoint, isRender: boolean): IRect[];
}
export type RendererConstructor = new (
  question: IQuestion,
  docOptions: DocOptions
) => IPdfQuestion;
export class DocOptions {
  private static PAPER_TO_LOGIC_SCALE_MAGIC: number = 595.28 / 210.0;
  private doc: any;
  constructor(
    protected fontSize: number,
    protected xScale: number,
    protected yScale: number,
    protected paperWidth: number,
    protected paperHeight: number,
    protected margins: IMargin
  ) {
    let logicWidth: number = paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
    let logicHeight: number = paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
    this.doc = new jsPDF({ format: [logicWidth, logicHeight] });
    this.doc.setFontSize(fontSize);
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
  getMargins(): IMargin {
    return this.margins;
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
    if (height <= (this.paperHeight - this.margins.marginTop -
        this.margins.marginBot ) && boundaries.length > 1) {
      if (isRender) {
        this.doc.addPage([
          this.paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC,
          this.paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC]);
      }
      return true;
    }
    return false;
  }
  tryNewPageElement(yBot: number, isRender: boolean = true): boolean {
    if (yBot > (this.paperHeight - this.margins.marginBot)) {
      if (isRender) {
        this.doc.addPage([
          this.paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC,
          this.paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC]);
      }
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
  render(fontSize: number, xScale: number, yScale: number, margins: IMargin,
         paperWidth: number = 210, paperHeight: number = 297) {
    let docOptions = new DocOptions(fontSize, xScale, yScale,
      paperWidth, paperHeight, margins);
    let point: IPoint = { xLeft: docOptions.getMargins().marginLeft,
      yTop: docOptions.getMargins().marginTop };
    this.pages.forEach((page: any) => {
      page.questions.forEach((question: IQuestion) => {
        let renderer: IPdfQuestion = QuestionRepository.getInstance().create(
          question,
          docOptions
        );
        let renderBoundaries: IRect[] = renderer.render(point, false);
        if (docOptions.tryNewPageQuestion(renderBoundaries)) {
          point.xLeft = docOptions.getMargins().marginLeft;
          point.yTop = docOptions.getMargins().marginTop;
        }
        renderBoundaries = renderer.render(point, true);
        point.yTop = renderBoundaries[renderBoundaries.length - 1].yBot;
      });
    });
    docOptions.getDoc().save("survey_result.pdf");
  }
}
