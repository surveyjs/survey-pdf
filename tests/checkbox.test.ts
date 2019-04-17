(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
  return {};
};
import { QuestionCheckboxModel } from "survey-core";
import { JsPdfSurveyModel } from "../src/survey";
import { CheckBoxQuestion } from "../src/checkbox";
import { IDocOptions, DocController, IRect } from "../src/docController";
import { QuestionRepository } from "../src/questionRepository";
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

test("Test has other split", () => {
  let docOptions: IDocOptions = {
    fontSize: 30,
    xScale: 0.22,
    yScale: 0.36,
    margins: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBot: 10
    }
  };
  docOptions["paperHeight"] =
    3 * (docOptions.fontSize * docOptions.yScale) +
    docOptions.margins.marginBot +
    docOptions.margins.marginTop;
  let docController = new DocController(docOptions);
  let cbm: QuestionCheckboxModel = new QuestionCheckboxModel("Test");
  cbm.hasOther = true;
  cbm.choices = ["item1"];
  let cbq: CheckBoxQuestion = <CheckBoxQuestion>(
    QuestionRepository.getInstance().create(cbm, docController)
  );
  let checkboxBoundaries: IRect[] = cbq.render(
    {
      xLeft: docOptions.margins.marginLeft,
      yTop: docOptions.margins.marginTop
    },
    false
  );
  let assumeBoundaries = {
    xLeft: docOptions.margins.marginLeft,
    xRight: docController.paperWidth - docOptions.margins.marginRight,
    yTop: docOptions.margins.marginTop,
    yBot:
      2 * (docOptions.fontSize * docOptions.yScale) +
      docOptions.margins.marginTop
  };
  expect(checkboxBoundaries.length).toBe(2);
  expect(checkboxBoundaries[1].xLeft).toBeCloseTo(assumeBoundaries.xLeft);
  expect(checkboxBoundaries[1].xRight).toBeCloseTo(assumeBoundaries.xRight);
  expect(checkboxBoundaries[1].yTop).toBeCloseTo(assumeBoundaries.yTop);
  expect(checkboxBoundaries[1].yBot).toBeCloseTo(assumeBoundaries.yBot);
});
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
