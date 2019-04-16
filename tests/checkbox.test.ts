(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
  return {};
};
import { QuestionCheckboxModel } from "survey-core";
import { JsPdfSurveyModel } from "../src/survey";
import { CheckBoxQuestion } from "../src/checkbox";

let __dummy_cx = new CheckBoxQuestion(null, null);
//TODO
test("Test has other  checkbox", () => {
  let json = {
    questions: [
      {
        name: "checkbox",
        type: "checkbox",
        hasOther: true,
        otherText: "Other test"
      }
    ]
  };
  let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
  survey.render({
    fontSize: 30,
    xScale: 0.22,
    yScale: 0.36,
    margins: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBot: 10
    }
  });
  let internal = survey.docController.doc.internal;
  let internalOtherText = internal.pages[1][3];
  let internalOtherCheckBox =
    internal.acroformPlugin.acroFormDictionaryRoot.Fields[0];
  let internalOtherTextField =
    internal.acroformPlugin.acroFormDictionaryRoot.Fields[1];
  let regex = /\((.*)\)/;
  let otherText = internalOtherText.match(regex)[1];

  expect(otherText).toBe(json.questions[0].otherText);
  expect(internalOtherTextField).toBeDefined();
  expect(internalOtherCheckBox).toBeDefined();
});
//TODO
test("Test has other split", () => {});
//TODO
test("Test absence of comment with hasOther option", () => {});
//TODO
test("Test duplicate value of otherText", () => {});
