import { IPoint, IRect, QuestionRepository, DocOptions } from "./survey";
import { IQuestion } from "survey-core";
import { SelectBaseQuestion } from "./selectbase";
import { ItemValue } from "survey-core";
import { QuestionCheckboxModel } from "survey-core";

export class CheckBoxQuestion extends SelectBaseQuestion {
  constructor(protected question: IQuestion, protected docOptions: DocOptions) {
    super(question, docOptions);
  }
  renderContent(point: IPoint) {
    let question: QuestionCheckboxModel = this.getQuestion<
      QuestionCheckboxModel
    >();
    let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
    question.choices.forEach((itemValue: ItemValue, index: number) => {
      let name = question.id + index;
      let item = this.renderItem(
        currPoint,
        () => {
          let checkBox = new (<any>this.docOptions.getDoc().AcroFormCheckBox)();
          checkBox.fieldName = name;
          return checkBox;
        },
        itemValue
      );
      if (question.value.includes(itemValue.value)) item.AS = "/On";
      else item.AS = "/Off";
      this.docOptions.getDoc().addField(item);
      let checkButtonBoundaries: IRect = this.getBoudndariesItem(
        currPoint,
        itemValue
      );
      currPoint.yTop = checkButtonBoundaries.yBot;
    });
    if (question.hasComment) {
      this.renderComment(currPoint);
    }
  }
}
QuestionRepository.getInstance().register("checkbox", CheckBoxQuestion);
