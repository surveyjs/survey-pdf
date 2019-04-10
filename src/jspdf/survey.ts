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

export interface IPdfQuestion {
  getBoundariesContent(point: IPoint): IRect;
  getBoundaries(point: IPoint): IRect;
  renderContent(point: IPoint): void;
  render(point: IPoint): void;
}
export type RendererConstructor = new (
  question: IQuestion,
  docOptions: DocOptions
) => IPdfQuestion;

export class DocOptions {
  private static PAPER_TO_LOGIC_SCALE_MAGIC: number = 210.0 / 595.28;
  private paperCheckHeight: number;
  constructor(
    protected doc: any,
    protected fontSize: number,
    protected xScale: number,
    protected yScale: number,
    protected paperWidth: number,
    protected paperHeight: number,
    protected gap: number
  ) {
    this.paperCheckHeight = paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
    doc.setFontSize(fontSize);
  }
  getGap(): number {
    return this.gap;
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
  tryNewPageQuestion(boundaries: IRect): boolean {
    if (
      boundaries.yBot - boundaries.yTop <= this.paperCheckHeight &&
      boundaries.yBot > this.paperCheckHeight
    ) {
      this.doc.addPage([this.paperWidth, this.paperHeight]);
      return true;
    }
    return false;
  }
  tryNewPageElement(yBot: number): boolean {
    if (yBot > this.paperCheckHeight) {
      this.doc.addPage([this.paperWidth, this.paperHeight]);
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
  ) { }
  private getBoundariesTitle(point: IPoint): IRect {
    return this.getBoundariesText(point, this.getQuestion<Question>().title);
  }
  getBoundariesText(point: IPoint, text: string): IRect {
    return {
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
  }
  getBoundariesContent(point: IPoint): IRect {
    return {
      xLeft: point.xLeft,
      xRight: point.xLeft,
      yTop: point.yTop,
      yBot: point.yTop
    };
  }
  getBoundaries(point: IPoint): IRect {
    switch (this.getQuestion<Question>().titleLocation) {
      case "top":
      case "default": {
        let titleRect: IRect = this.getBoundariesTitle(point);
        let contentCoordinates: IPoint = {
          xLeft: titleRect.xLeft,
          yTop: titleRect.yBot
        };
        let contentRect: IRect = this.getBoundariesContent(contentCoordinates);
        return {
          xLeft: titleRect.xLeft,
          xRight: Math.max(titleRect.xRight, contentRect.xRight),
          yTop: titleRect.yTop,
          yBot: contentRect.yBot
        };
      }
      case "bottom": {
        let contentRect: IRect = this.getBoundariesContent(point);
        let titlePoint: IPoint = {
          xLeft: contentRect.xLeft,
          yTop: contentRect.yBot
        };
        let titleRect: IRect = this.getBoundariesTitle(titlePoint);
        return {
          xLeft: contentRect.xLeft,
          xRight: Math.max(titleRect.xRight, contentRect.xRight),
          yTop: contentRect.yTop,
          yBot: titleRect.yBot
        };
      }
      case "left": {
        let titleRect: IRect = this.getBoundariesTitle(point);
        let contentPoint: IPoint = {
          xLeft: titleRect.xRight,
          yTop: titleRect.yTop
        };
        let contentRect: IRect = this.getBoundariesContent(contentPoint);
        return {
          xLeft: titleRect.xLeft,
          xRight: contentRect.xRight,
          yTop: titleRect.yTop,
          yBot: Math.max(titleRect.yBot, contentRect.yBot)
        };
      }
      case "hidden": {
        return this.getBoundariesContent(point);
      }
    }
  }
  private renderTitle(point: IPoint) {
    this.renderText(point, (<any>this.question).title);
  }
  renderText(point: IPoint, text: string) {
    let alignPoint = this.alignPoint(
      point,
      this.getBoundariesText(point, text)
    );
    this.docOptions.getDoc().text(text, alignPoint.xLeft, alignPoint.yTop, {
      align: "left",
      baseline: "middle"
    });
  }
  renderContent(point: IPoint) { }
  render(point: IPoint) {
    switch (this.getQuestion<Question>().titleLocation) {
      case "top":
      case "default": {
        this.renderTitle(point);
        let titleRect: IRect = this.getBoundariesTitle(point);
        let contentPoint: IPoint = {
          xLeft: titleRect.xLeft,
          yTop: titleRect.yBot
        };
        if (
          this.docOptions.tryNewPageElement(
            this.getBoundariesContent(contentPoint).yBot
          )
        ) {
          point.xLeft = 0;
          point.yTop = 0;
          contentPoint.xLeft = 0;
          contentPoint.yTop = 0;
        }
        this.renderContent(contentPoint);
        break;
      }
      case "bottom": {
        this.renderContent(point);
        let contentRect: IRect = this.getBoundariesContent(point);
        let titlePoint: IPoint = {
          xLeft: contentRect.xLeft,
          yTop: contentRect.yBot
        };
        if (
          this.docOptions.tryNewPageElement(
            this.getBoundariesContent(titlePoint).yBot
          )
        ) {
          point.xLeft = 0;
          point.yTop = 0;
          titlePoint.xLeft = 0;
          titlePoint.yTop = 0;
        }
        this.renderTitle(titlePoint);
        break;
      }
      case "left": {
        this.renderTitle(point);
        let titleRect: IRect = this.getBoundariesTitle(point);
        let contentPoint: IPoint = {
          xLeft: titleRect.xRight,
          yTop: titleRect.yTop
        };
        if (
          this.docOptions.tryNewPageElement(
            this.getBoundariesContent(contentPoint).yBot
          )
        ) {
          point.xLeft = 0;
          point.yTop = 0;
          contentPoint.xLeft = 0;
          contentPoint.yTop = 0;
        }
        this.renderContent(contentPoint);
        break;
      }
      case "hidden": {
        this.renderContent(point);
        break;
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
    gap: number,
    paperWidth: number = 595.28,
    paperHeight: number = 841.89
  ) {
    let docOptions = new DocOptions(
      new jsPDF({
        format: [paperWidth, paperHeight]
      }),
      fontSize,
      xScale,
      yScale,
      paperWidth,
      paperHeight,
      gap
    );
    let point: IPoint = { xLeft: 0, yTop: 0 };
    this.pages.forEach((page: any) => {
      page.questions.forEach((question: IQuestion) => {
        let renderer: IPdfQuestion = QuestionRepository.getInstance().create(
          question,
          docOptions
        );
        let renderBoundaries: IRect = renderer.getBoundaries(point);
        if (docOptions.tryNewPageQuestion(renderBoundaries)) {
          point.xLeft = 0;
          point.yTop = 0;
        }
        renderer.render(point);
        renderBoundaries = renderer.getBoundaries(point);
        point.yTop = renderBoundaries.yBot;
      });
    });
    docOptions.getDoc().save("survey_result.pdf");
  }
}
