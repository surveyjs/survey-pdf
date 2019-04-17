(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
  return {};
};
import { QuestionCheckboxModel, surveyLocalization } from "survey-core";
import { JsPdfSurveyModel } from "../src/__survey";
import { CheckBoxQuestion } from "../src/checkbox";
import { DocOptions, IDocOptions } from "../src/docController";
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
  expect(internalOtherTextField.FT).toBe("/Tx");
  expect(internalOtherCheckBox.FT).toBe("/Btn");
});
//TODO
test("Test has other split", () => {});
test("Test duplicate value other", () => {
  let json = {
    questions: [
      {
        name: "checkbox",
        type: "checkbox",
        choices: ["other"],
        hasOther: true
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
  let internalOtherCheckBoxChoice =
    internal.acroformPlugin.acroFormDictionaryRoot.Fields[0];
  let internalOtherTextFieldChoice =
    internal.acroformPlugin.acroFormDictionaryRoot.Fields[1];
  let internalOtherCheckBox =
    internal.acroformPlugin.acroFormDictionaryRoot.Fields[2];
  let internalOtherTextField =
    internal.acroformPlugin.acroFormDictionaryRoot.Fields[3];
  expect(internalOtherCheckBoxChoice.FT).toBe("/Btn");
  expect(internalOtherTextFieldChoice.FT).toBe("/Tx");
  expect(internalOtherCheckBox.FT).toBe("/Btn");
  expect(internalOtherTextField.FT).toBe("/Tx");
});
test("Test all items disabled", () => {
  let json = {
    questions: [
      {
        name: "checkbox",
        type: "checkbox",
        choices: ["item1", "item2", "item3"],
        readOnly: true
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
  survey.docController.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
    (acroCheckBox: any) => {
      expect(acroCheckBox.readOnly).toBe(true);
    }
  );
});
test("Test all items enabled", () => {
  let json = {
    questions: [
      {
        name: "checkbox",
        type: "checkbox",
        choices: ["item1", "item2", "item3"],
        readOnly: false
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
  survey.docController.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
    (acroCheckBox: any) => {
      expect(acroCheckBox.readOnly).toBe(false);
    }
  );
});

test("Test enable one item", () => {
  let json = {
    questions: [
      {
        name: "checkbox",
        type: "checkbox",
        choices: ["item1", "item2", "item3"],
        choicesEnableIf: "{item} == item2"
      }
    ]
  };
  const INDEX_OF_ENABLED_ITEM = 1;
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
  survey.docController.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields.forEach(
    (acroCheckBox: any, index: number) => {
      if (index === INDEX_OF_ENABLED_ITEM)
        expect(acroCheckBox.readOnly).toBe(false);
      else expect(acroCheckBox.readOnly).toBe(true);
    }
  );
});
