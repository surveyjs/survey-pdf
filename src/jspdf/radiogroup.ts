import {
  IPoint,
  IRect,
  QuestionRepository,
  DocOptions,
  PdfQuestionRendererBase
} from "./survey";
import { IQuestion } from "survey-core";
import { SelectBaseQuestion } from "./selectbase";
import { ItemValue } from "survey-core";
import { QuestionSelectBase } from "survey-core";

export class RadioGroupQuestion extends SelectBaseQuestion {
  constructor(protected question: IQuestion, protected docOptions: DocOptions) {
    super(question, docOptions);
  }
  renderContent(point: IPoint) {
    let question: QuestionSelectBase = this.getQuestion<QuestionSelectBase>();
    let radioGroup = new (<any>this.docOptions.getDoc().AcroFormRadioButton)();
    radioGroup.value = question.id;
    this.docOptions.getDoc().addField(radioGroup);
    let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
    question.choices.forEach((itemValue: ItemValue, index: number) => {
      let name = question.id + index;
      let item = this.renderItem(
        currPoint,
        () => radioGroup.createOption(name),
        itemValue
      );
      if (question.value === itemValue.value) {
        item.AS = "/" + name;
      }
      let radiokButtonBoundaries: IRect = this.getBoudndariesItem(
        currPoint,
        itemValue
      );
      currPoint.yTop = radiokButtonBoundaries.yBot;
    });
    radioGroup.setAppearance(
      this.docOptions.getDoc().AcroForm.Appearance.RadioButton.Circle
    );
  }
}
QuestionRepository.getInstance().register("radiogroup", RadioGroupQuestion);
