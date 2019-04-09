import {
  IPoint,
  IRect,
  QuestionRepository,
  DocOptions,
  PdfQuestionRendererBase
} from "./survey";
import { IQuestion } from "survey-core";
import { ItemValue } from "survey-core";
import { QuestionSelectBase } from "survey-core";

export class SelectBaseQuestion extends PdfQuestionRendererBase {
  constructor(protected question: IQuestion, protected docOptions: DocOptions) {
    super(question, docOptions);
    if (this.getQuestion<QuestionSelectBase>().hasNone) {
      this.getQuestion<QuestionSelectBase>().choices.push(
        new ItemValue("None")
      );
    }
  }
  getBoundariesComment(point: IPoint): IRect {
    let question = this.getQuestion<QuestionSelectBase>();
    let textBoundaries = this.getBoundariesText(point, question.commentText);
    let width =
      question.commentText.length *
      this.docOptions.getFontSize() *
      this.docOptions.getXScale();
    let height = this.docOptions.getFontSize() * this.docOptions.getYScale();
    return {
      xLeft: textBoundaries.xLeft,
      xRight: textBoundaries.xLeft + width,
      yTop: textBoundaries.yTop,
      yBot: textBoundaries.yBot + height
    };
  }
  renderComment(point: IPoint) {
    let question = this.getQuestion<QuestionSelectBase>();
    this.renderText(point, question.commentText);
    let textBoundaries = this.getBoundariesText(point, question.commentText);
    let textField = new (<any>this.docOptions.getDoc().AcroFormTextField)();
    let width =
      question.commentText.length *
      this.docOptions.getFontSize() *
      this.docOptions.getXScale();
    let height = this.docOptions.getFontSize() * this.docOptions.getYScale();
    textField.Rect = [textBoundaries.xLeft, textBoundaries.yBot, width, height];
    textField.multiline = false;
    textField.value = "";
    this.docOptions.getDoc().addField(textField);
  }
  getBoudndariesItem(point: IPoint, itemValue: ItemValue): IRect {
    let buttonBoudndaries: IRect = {
      xLeft: point.xLeft,
      xRight:
        point.xLeft +
        this.docOptions.getFontSize() * this.docOptions.getYScale(),
      yTop: point.yTop,
      yBot:
        point.yTop + this.docOptions.getFontSize() * this.docOptions.getYScale()
    };
    let textPoint: IPoint = {
      xLeft: buttonBoudndaries.xRight,
      yTop: buttonBoudndaries.yTop
    };
    let textBoudndaries: IRect = this.getBoundariesText(
      textPoint,
      itemValue.text
    );
    return {
      xLeft: buttonBoudndaries.xLeft,
      xRight: textBoudndaries.xRight,
      yTop: buttonBoudndaries.yTop,
      yBot: buttonBoudndaries.yBot
    };
  }
  getBoundariesContent(point: IPoint): IRect {
    let bottom: number = point.yTop;
    let right: number = point.xLeft;
    let question: QuestionSelectBase = this.getQuestion<QuestionSelectBase>();
    let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
    question.choices.forEach((itemValue: ItemValue) => {
      let checkButtonBoundaries = this.getBoudndariesItem(currPoint, itemValue);
      bottom = checkButtonBoundaries.yBot;
      currPoint.yTop = bottom;
      right = Math.max(right, checkButtonBoundaries.xRight);
    });
    if (question.hasComment) {
      let commentBoundaries = this.getBoundariesComment(currPoint);
      bottom = commentBoundaries.yBot;
      right = Math.max(right, commentBoundaries.xRight);
    }
    return {
      xLeft: point.xLeft,
      xRight: right,
      yTop: point.yTop,
      yBot: bottom
    };
  }
  renderItem(
    point: IPoint,
    itemConstructor: () => any,
    itemValue: ItemValue
  ): any {
    if (
      this.docOptions.tryNewPageElement(
        this.getBoudndariesItem(point, itemValue).yBot
      )
    ) {
      point.xLeft = 0;
      point.yTop = 0;
    }
    let radioButton = itemConstructor();
    radioButton.Rect = [
      point.xLeft,
      point.yTop,
      this.docOptions.getDoc().getFontSize() * this.docOptions.getYScale(),
      this.docOptions.getDoc().getFontSize() * this.docOptions.getYScale()
    ];
    let textPoint: IPoint = {
      xLeft:
        point.xLeft +
        this.docOptions.getDoc().getFontSize() * this.docOptions.getYScale(),
      yTop: point.yTop
    };
    this.renderText(textPoint, itemValue.text);
    return radioButton;
  }
}
