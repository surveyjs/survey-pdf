import {
  IPoint,
  IRect,
  DocController
} from "./doc_controller";
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
      let inputField = question.inputType !== "password" ?
        new (<any>this.docController.doc.AcroFormTextField)() :
        new (<any>this.docController.doc.AcroFormPasswordField)();
      inputField.Rect = [
        boundaries.xLeft,
        boundaries.yTop,
        boundaries.xRight - boundaries.xLeft,
        boundaries.yBot - boundaries.yTop
      ];
      if (question.inputType !== "password") {
        inputField.value = question.value || question.defaultValue || "";
        inputField.defaultValue = this.getLocString(question.locPlaceHolder);
      }
      else {
        inputField.value = "";
      }
      inputField.readOnly = question.isReadOnly;
      inputField.fieldName = question.id;
      this.docController.doc.addField(inputField);
    }
    return [boundaries];
  }
}

QuestionRepository.getInstance().register("text", TextQuestion);
