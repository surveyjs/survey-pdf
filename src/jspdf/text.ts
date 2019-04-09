import {
  IPoint,
  IRect,
  QuestionRepository,
  DocOptions,
  PdfQuestionRendererBase
} from "./survey";
import { IQuestion } from "survey-core";
import { QuestionTextModel } from "survey-core";

export class TextQuestion extends PdfQuestionRendererBase {
  constructor(protected question: IQuestion, protected docOptions: DocOptions) {
    super(question, docOptions);
  }
  getBoundariesContent(point: IPoint): IRect {
    let question: QuestionTextModel = this.getQuestion<QuestionTextModel>();
    //???
    let width =
      question.title.length *
      this.docOptions.getFontSize() *
      this.docOptions.getXScale();
    let height = this.docOptions.getFontSize() * this.docOptions.getYScale();
    return {
      xLeft: point.xLeft,
      xRight: point.xLeft + width,
      yTop: point.yTop,
      yBot: point.yTop + height
    };
  }
  renderContent(point: IPoint) {
    let question: QuestionTextModel = this.getQuestion<QuestionTextModel>();
    let textField = new (<any>this.docOptions.getDoc().AcroFormTextField)();
    let boundaries: IRect = this.getBoundariesContent(point);
    textField.Rect = [
      boundaries.xLeft,
      boundaries.yTop,
      boundaries.xRight - boundaries.xLeft,
      boundaries.yBot - boundaries.yTop
    ];
    textField.multiline = false;
    textField.value = question.value || "";
    textField.fieldName = question.id;
    this.docOptions.getDoc().addField(textField);
  }
}

QuestionRepository.getInstance().register("text", TextQuestion);
