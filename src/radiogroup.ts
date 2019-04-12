// import { IPoint, IRect, QuestionRepository, docController, PdfQuestionRendererBase } from "./survey";
// import { IQuestion } from "../base";
// import { SelectBaseQuestion } from "./selectbase"
// import { ItemValue } from "../itemvalue";
// import { QuestionSelectBase } from '../question_baseselect';

// export class RadioGroupQuestion extends SelectBaseQuestion {
//     constructor(protected question: IQuestion, protected docController: docController) {
//         super(question, docController);
//     }
//     renderContentSelectbase(point: IPoint, isRender: boolean): IRect {
//         let question: QuestionSelectBase = this.getQuestion<QuestionSelectBase>();
//         let radioGroup = new (<any>this.docController.getDoc().AcroFormRadioButton)();
//         radioGroup.value = question.id;
//         this.docController.getDoc().addField(radioGroup);
//         let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
//         question.choices.forEach((itemValue: ItemValue, index: number) => {
//             let name = question.id + index;
//             let item = this.renderItem(currPoint, () =>
//                 radioGroup.createOption(name), itemValue);
//             if (question.value === itemValue.value) {
//                 item.AS = "/" + name;
//             }
//            let radiokButtonBoundaries: IRect = this.getBoudndariesItem(currPoint, itemValue);
//            currPoint.yTop = radiokButtonBoundaries.yBot;
//         });
//         radioGroup.setAppearance(this.docController.getDoc().AcroForm.Appearance.RadioButton.Circle);
//     }
// }
// QuestionRepository.getInstance().register("radiogroup", RadioGroupQuestion);
