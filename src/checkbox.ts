import { IQuestion, ItemValue, QuestionCheckboxModel } from "survey-core";
import { SelectBaseQuestion } from "./selectbase";
import { IPoint, IRect, DocController } from "./doc_controller";
import { QuestionRepository } from "./questionRepository";

export class CheckBoxQuestion extends SelectBaseQuestion {
  constructor(
    protected question: IQuestion,
    protected docController: DocController
  ) {
    super(question, docController);
  }
  //TO REVIEW
  renderOther(
    point: IPoint,
    question: QuestionCheckboxModel,
    itemValue: ItemValue,
    index: number,
    isRender: boolean
  ) {
    let itemBoundaries = this.renderItem(
      point,
      question,
      itemValue,
      index,
      isRender
    );
    let boundaries: IRect = {
      xLeft: itemBoundaries.xLeft,
      xRight:
        this.docController.paperWidth - this.docController.margins.marginRight,
      yTop: itemBoundaries.yTop,
      yBot:
        itemBoundaries.yBot +
        this.docController.fontSize * this.docController.yScale
    };
    if (isRender) {
      let textField = new (<any>this.docController.doc.AcroFormTextField)();
      textField.Rect = [
        itemBoundaries.xLeft,
        itemBoundaries.yBot,
        boundaries.xRight - boundaries.xLeft,
        boundaries.yBot - itemBoundaries.yBot
      ];
      textField.multiline = false;
      textField.value = "";
      this.docController.doc.addField(textField);
    }
    return boundaries;
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
      checkBox.AS = question.isItemSelected(itemValue) ? "/On" : "/Off";
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
      let render =
        itemValue.value === question.otherItem.value
          ? this.renderOther.bind(this)
          : this.renderItem.bind(this);
      let checkButtonBoundaries: IRect = render(
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
      checkButtonBoundaries = render(
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
