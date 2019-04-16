import { IQuestion, ItemValue, QuestionCheckboxModel } from "survey-core";
import { SelectBaseQuestion } from "./selectbase";
import { IPoint, IRect, DocController } from "./docController";
import { QuestionRepository } from "./questionRepository";

export class CheckBoxQuestion extends SelectBaseQuestion {
  constructor(
    protected question: IQuestion,
    protected docController: DocController
  ) {
    super(question, docController);
  }
  public get questionCheck(): QuestionCheckboxModel {
    return this.question as QuestionCheckboxModel;
  }
  renderItem(
    point: IPoint,
    question: QuestionCheckboxModel,
    itemValue: ItemValue,
    index: number,
    isRender: boolean
  ): IRect {
    let height: number = this.docController.measureText().height;
    let buttonBoudndaries: IRect = {
      xLeft: point.xLeft,
      xRight: point.xLeft + height,
      yTop: point.yTop,
      yBot: point.yTop + height
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
      let checkBox = new (<any>this.docController.doc.AcroFormCheckBox)();
      checkBox.fieldName = question.id + index;
      checkBox.Rect = [
        buttonBoudndaries.xLeft,
        buttonBoudndaries.yTop,
        buttonBoudndaries.xRight - buttonBoudndaries.xLeft,
        buttonBoudndaries.yBot - buttonBoudndaries.yTop
      ];
      checkBox.readOnly = question.isReadOnly || !itemValue.isEnabled;
      checkBox.AS = this.questionCheck.isItemSelected(itemValue)
        ? "/On"
        : "/Off";
      this.docController.doc.addField(checkBox);
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
    question.visibleChoices.forEach((itemValue: ItemValue, index: number) => {
      let checkButtonBoundaries: IRect = this.renderItem(
        currPoint,
        question,
        itemValue,
        index,
        false
      );
      if (this.docController.isNewPageElement(checkButtonBoundaries.yBot)) {
        if (isRender) this.docController.addPage();
        boundaries.push({
          xLeft: lastPoint.xLeft,
          xRight: right,
          yTop: lastPoint.yTop,
          yBot: bottom
        });
        currPoint.xLeft = this.docController.margins.marginLeft;
        currPoint.yTop = this.docController.margins.marginTop;
        lastPoint = { xLeft: currPoint.xLeft, yTop: currPoint.yTop };
        right = this.docController.margins.marginLeft;
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
