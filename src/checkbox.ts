import { IPoint, IRect, QuestionRepository, DocOptions } from "./survey";
import { IQuestion } from "survey-core";
import { SelectBaseQuestion } from "./selectbase";
import { ItemValue } from "survey-core";
import { QuestionCheckboxModel } from "survey-core";

export class CheckBoxQuestion extends SelectBaseQuestion {
  constructor(protected question: IQuestion, protected docOptions: DocOptions) {
    super(question, docOptions);
  }
  renderItem(
    point: IPoint,
    question: QuestionCheckboxModel,
    itemValue: ItemValue,
    index: number,
    isRender: boolean
  ): IRect {
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
    let textBoudndaries: IRect = this.renderText(
      textPoint,
      itemValue.text,
      false
    );
    let boundaries: IRect = {
      xLeft: buttonBoudndaries.xLeft,
      xRight: textBoudndaries.xRight,
      yTop: buttonBoudndaries.yTop,
      yBot: buttonBoudndaries.yBot
    };

    if (isRender) {
      // if (this.docOptions.tryNewPageElement(boundaries.yBot)) {
      //   point.xLeft = 0;
      //   point.yTop = 0;
      // }
      let checkBox = new (<any>this.docOptions.getDoc().AcroFormCheckBox)();
      checkBox.fieldName = question.id + index;
      checkBox.Rect = [
        buttonBoudndaries.xLeft,
        buttonBoudndaries.yTop,
        buttonBoudndaries.xRight - buttonBoudndaries.xLeft,
        buttonBoudndaries.yBot - buttonBoudndaries.yTop
      ];
      if (question.readOnly) checkBox.readOnly = true;
      if (question.value.includes(itemValue.value)) checkBox.AS = "/On";
      else checkBox.AS = "/Off";
      this.docOptions.getDoc().addField(checkBox);
      this.renderText(textPoint, itemValue.text);
    }
    return boundaries;
  }
  renderContentSelectbase(point: IPoint, isRender: boolean): IRect[] {
    let bottom: number = point.yTop;
    let right: number = point.xLeft;
    let question: QuestionCheckboxModel = this.getQuestion<
      QuestionCheckboxModel
    >();
    let lastPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
    let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
    let boundaries: Array<IRect> = new Array();
    let sortedChoices = this.getSortedChoices();
    if (this.getQuestion<QuestionCheckboxModel>().hasNone) {
      sortedChoices.push(new ItemValue("None"));
    }
    sortedChoices.forEach((itemValue: ItemValue, index: number) => {
      let checkButtonBoundaries: IRect = this.renderItem(
        currPoint,
        question,
        itemValue,
        index,
        false
      );
      if (
        this.docOptions.tryNewPageElement(checkButtonBoundaries.yBot, isRender)
      ) {
        boundaries.push({
          xLeft: lastPoint.xLeft,
          xRight: right,
          yTop: lastPoint.yTop,
          yBot: bottom
        });
        currPoint.xLeft = this.docOptions.getMargins().marginLeft;
        currPoint.yTop = this.docOptions.getMargins().marginTop;
        lastPoint = { xLeft: currPoint.xLeft, yTop: currPoint.yTop };
        right = this.docOptions.getMargins().marginLeft;
        bottom = currPoint.yTop;
      }
      checkButtonBoundaries = this.renderItem(
        currPoint,
        question,
        itemValue,
        index,
        isRender
      );
      bottom = checkButtonBoundaries.yBot;
      currPoint.yTop = checkButtonBoundaries.yBot;
      right = Math.max(right, checkButtonBoundaries.xRight);
    });
    if (question.hasComment) {
      let commentBoundarues = this.renderComment(currPoint, false);
      if (this.docOptions.tryNewPageElement(commentBoundarues.yBot, isRender)) {
        boundaries.push({
          xLeft: lastPoint.xLeft,
          xRight: right,
          yTop: lastPoint.yTop,
          yBot: bottom
        });
        currPoint.xLeft = this.docOptions.getMargins().marginLeft;
        currPoint.yTop = this.docOptions.getMargins().marginTop;
        lastPoint = { xLeft: currPoint.xLeft, yTop: currPoint.yTop };
        right = this.docOptions.getMargins().marginLeft;
        bottom = currPoint.yTop;
      }
      commentBoundarues = this.renderComment(currPoint, isRender);
      bottom = commentBoundarues.yBot;
      currPoint.yTop = commentBoundarues.yBot;
      right = Math.max(right, commentBoundarues.xRight);
    }
    boundaries.push({
      xLeft: lastPoint.xLeft,
      xRight: right,
      yTop: lastPoint.yTop,
      yBot: bottom
    });
    return boundaries;
  }
}
QuestionRepository.getInstance().register("checkbox", CheckBoxQuestion);
