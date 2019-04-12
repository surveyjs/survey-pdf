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
import * as jsPDF from "jspdf";
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
export interface IMargin {
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBot: number;
}
export interface IDocOptions {
  fontSize: number;
  xScale: number;
  yScale: number;
  paperWidth?: number;
  paperHeight?: number;
  margins: IMargin;
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
  private _doc: any;
  private _fontSize: number;
  private _xScale: number;
  private _yScale: number;
  private _paperWidth: number;
  private _paperHeight: number;
  private _margins: IMargin;
  constructor(options: IDocOptions) {
    this._fontSize = options.fontSize;
    this._xScale = options.xScale;
    this._yScale = options.yScale;
    this._paperWidth =
      typeof options.paperWidth === "undefined" ? 210 : options.paperWidth;
    this._paperHeight =
      typeof options.paperHeight === "undefined" ? 297 : options.paperHeight;
    this._margins = options.margins;
    let logicWidth: number =
      this._paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
    let logicHeight: number =
      this._paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC;
    // addCustomustomFonts(jsPDF);
    this._doc = new jsPDF({ format: [logicWidth, logicHeight] });
    this._doc.setFontSize(this._fontSize);
  }
  get doc(): any {
    return this._doc;
  }
  get fontSize(): number {
    return this._fontSize;
  }
  get xScale(): number {
    return this._xScale;
  }
  get yScale(): number {
    return this._yScale;
  }
  get margins(): IMargin {
    return this._margins;
  }
  private addPage() {
    this.doc.addPage([
      this._paperWidth * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC,
      this._paperHeight * DocOptions.PAPER_TO_LOGIC_SCALE_MAGIC
    ]);
  }
  tryNewPageQuestion(boundaries: IRect[], isRender: boolean = true): boolean {
    let height = 0;
    boundaries.forEach((rect: IRect) => {
      height += rect.yBot - rect.yTop;
    });
    if (
      height <=
        this._paperHeight - this.margins.marginTop - this.margins.marginBot &&
      (boundaries.length > 1 ||
        this.tryNewPageElement(boundaries[0].yBot, false))
    ) {
      if (isRender) {
        this.addPage();
      }
      return true;
    }
    return false;
  }
  tryNewPageElement(yBot: number, isRender: boolean = true): boolean {
    if (yBot > this._paperHeight - this.margins.marginBot) {
      if (isRender) {
        this.addPage();
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
    this.docOptions.doc.setFontStyle("bold");
    let textBoundaries = this.renderText(
      point,
      this.getQuestion<Question>().title,
      isRender
    );
    this.docOptions.doc.setFontStyle("normal");
    return textBoundaries;
  }
  renderText(point: IPoint, text: string, isRender: boolean = true): IRect {
    let boundaruies: IRect = {
      xLeft: point.xLeft,
      xRight:
        point.xLeft +
        text.length * this.docOptions.fontSize * this.docOptions.xScale,
      yTop: point.yTop,
      yBot: point.yTop + this.docOptions.fontSize * this.docOptions.yScale
    };
    if (isRender) {
      let alignPoint = this.alignPoint(point, boundaruies);
      this.docOptions.doc.text(text, alignPoint.xLeft, alignPoint.yTop, {
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
        if (contentRects[0].yTop !== this.docOptions.margins.marginTop) {
          contentRects[0].xLeft = titleRect.xLeft;
          contentRects[0].xRight = Math.max(
            contentRects[0].xRight,
            titleRect.xRight
          );
          contentRects[0].yTop = titleRect.yTop;
        } else {
          contentRects.unshift(titleRect);
        }
        return contentRects;
      }
      case "bottom": {
        let contentRects: IRect[] = this.renderContent(point, isRender);
        let titlePoint: IPoint = {
          xLeft: contentRects[contentRects.length - 1].xLeft,
          yTop: contentRects[contentRects.length - 1].yBot
        };
        let titleRect: IRect = this.renderTitle(titlePoint, false);
        let isNewPage: boolean = this.docOptions.tryNewPageElement(
          titleRect.yBot,
          isRender
        );
        if (isNewPage) {
          titlePoint.xLeft = this.docOptions.margins.marginLeft;
          titlePoint.yTop = this.docOptions.margins.marginTop;
        }
        titleRect = this.renderTitle(titlePoint, isRender);
        if (isNewPage) {
          contentRects.push(titleRect);
        } else {
          contentRects[contentRects.length - 1].xRight = Math.max(
            contentRects[contentRects.length - 1].xRight,
            titleRect.xRight
          );
          contentRects[contentRects.length - 1].yBot = titleRect.yBot;
        }
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
        point.yTop += this.docOptions.fontSize * this.docOptions.yScale;
        if (this.docOptions.tryNewPageElement(point.yTop)) {
          point.xLeft = this.docOptions.margins.marginLeft;
          point.yTop = this.docOptions.margins.marginTop;
        }
      });
    });
  }
  save(fileName: string = "survey_result.pdf") {
    this.docOptions.doc.save(fileName);
  }
}
