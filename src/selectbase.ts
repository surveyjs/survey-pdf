import { IPoint, IRect, DocOptions, PdfQuestionRendererBase } from "./survey";
import { IQuestion, QuestionSelectBase, ItemValue } from "survey-core";
export class SelectBaseQuestion extends PdfQuestionRendererBase {
  constructor(protected question: IQuestion, protected docOptions: DocOptions) {
    super(question, docOptions);
  }
  // getBoundariesComment(point: IPoint): IRect {
  //   let question = this.getQuestion<QuestionSelectBase>();
  //   let textBoundaries = this.renderText(point, question.commentText, false);
  //   let width =
  //     question.commentText.length *
  //     this.docOptions.getFontSize() *
  //     this.docOptions.getXScale();
  //   let height = this.docOptions.getFontSize() * this.docOptions.getYScale();
  //   return {
  //     xLeft: textBoundaries.xLeft,
  //     xRight: textBoundaries.xLeft + width,
  //     yTop: textBoundaries.yTop,
  //     yBot: textBoundaries.yBot + height
  //   };
  // }
  // getBoudndariesItem(point: IPoint, itemValue: ItemValue): IRect {
  //   let buttonBoudndaries: IRect = {
  //     xLeft: point.xLeft,
  //     xRight:
  //       point.xLeft +
  //       this.docOptions.getFontSize() * this.docOptions.getYScale(),
  //     yTop: point.yTop,
  //     yBot:
  //       point.yTop + this.docOptions.getFontSize() * this.docOptions.getYScale()
  //   };
  //   let textPoint: IPoint = {
  //     xLeft: buttonBoudndaries.xRight,
  //     yTop: buttonBoudndaries.yTop
  //   };
  //   let textBoudndaries: IRect = this.renderText(textPoint, itemValue.text, false);
  //   return {
  //     xLeft: buttonBoudndaries.xLeft,
  //     xRight: textBoudndaries.xRight,
  //     yTop: buttonBoudndaries.yTop,
  //     yBot: buttonBoudndaries.yBot
  //   };
  // }
  // getBoundariesContent(point: IPoint): IRect {
  //   let bottom: number = point.yTop;
  //   let right: number = point.xLeft;
  //   let question: QuestionSelectBase = this.getQuestion<QuestionSelectBase>();
  //   let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
  //   question.choices.forEach((itemValue: ItemValue) => {
  //     let checkButtonBoundaries = this.getBoudndariesItem(currPoint, itemValue);
  //     bottom = checkButtonBoundaries.yBot;
  //     currPoint.yTop = bottom;
  //     right = Math.max(right, checkButtonBoundaries.xRight);
  //   });
  //   // if (question.hasComment) {
  //   //   let commentBoundaries = this.getBoundariesComment(currPoint);
  //   //   bottom = commentBoundaries.yBot;
  //   //   right = Math.max(right, commentBoundaries.xRight);
  //   // }
  //   return {
  //     xLeft: point.xLeft,
  //     xRight: right,
  //     yTop: point.yTop,
  //     yBot: bottom
  //   };
  // }
  renderComment(point: IPoint, isRender: boolean) {
    let question = this.getQuestion<QuestionSelectBase>();
    let textBoundaries = this.renderText(point, question.commentText, false);
    let textField = new (<any>this.docOptions.getDoc().AcroFormTextField)();
    let width =
      question.commentText.length *
      this.docOptions.getFontSize() *
      this.docOptions.getXScale();
    let height = this.docOptions.getFontSize() * this.docOptions.getYScale();
    if (isRender) {
      this.renderText(point, question.commentText, true);
      textField.Rect = [
        textBoundaries.xLeft,
        textBoundaries.yBot,
        width,
        height
      ];
      textField.multiline = false;
      textField.value = "";
      this.docOptions.getDoc().addField(textField);
    }
    return {
      xLeft: textBoundaries.xLeft,
      xRight: textBoundaries.xLeft + width,
      yTop: textBoundaries.yTop,
      yBot: textBoundaries.yBot + height
    };
  }

  renderContentSelectbase(point: IPoint, isRender: boolean): IRect[] {
    return super.renderContent(point, isRender);
  }
  renderContent(point: IPoint, isRender: boolean): IRect[] {
    //renderComment
    return this.renderContentSelectbase(point, isRender);
  }
}
