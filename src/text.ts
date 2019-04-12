import {
  IPoint,
  IRect,
  DocController
} from "./docController";
import {
  PdfQuestion
} from "./question";
import {
  QuestionRepository
} from "./questionRepository";
import { IQuestion } from "survey-core";
import { QuestionTextModel } from "survey-core";

export class TextQuestion extends PdfQuestion {
  constructor(protected question: IQuestion, protected docController: DocController) {
    super(question, docController);
  }
  renderContent(point: IPoint, isRender: boolean): IRect[] {
    let question: QuestionTextModel = this.getQuestion<QuestionTextModel>();
    let width: number = this.docController.paperWidth - point.xLeft -
      this.docController.margins.marginRight;
    let height: number = this.docController.measureText(question.title).height;
    let boundaries: IRect = {
      xLeft: point.xLeft,
      xRight: point.xLeft + width,
      yTop: point.yTop,
      yBot: point.yTop + height
    };
    if (isRender) {
      let textField = new (<any>this.docController.doc.AcroFormTextField)();
      textField.Rect = [
        boundaries.xLeft,
        boundaries.yTop,
        boundaries.xRight - boundaries.xLeft,
        boundaries.yBot - boundaries.yTop
      ];
      textField.multiline = false;
      textField.value = question.value || question.defaultValue || "";
      textField.fieldName = question.id;
      this.docController.doc.addField(textField);
    }
    return [boundaries];
  }
}

QuestionRepository.getInstance().register("text", TextQuestion);
