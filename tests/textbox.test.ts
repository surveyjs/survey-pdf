(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};

import { JsPdfSurveyModel } from "../src/survey";
import { TextQuestion } from "../src/text";

test("Set textbox no value", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = { questions: [ {
        name: "textbox",
        type: "text",
        title: "NoValue:"
      }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    survey.render({
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBot: 10 }
      });
    expect(survey.docController.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].value)
        .toBe("");
});

test("Set textbox default value", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = { questions: [ {
        name: "textbox",
        type: "text",
        title: "NeedDefValue:",
        defaultValue: "OhYes"
      }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    survey.render({
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBot: 10 }
      });
    expect(survey.docController.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].value)
        .toBe(json.questions[0].defaultValue);
});

test("Set textbox data value", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = { questions: [ {
        name: "textbox",
        type: "text",
        title: "NeedValue:"
      }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    survey.data = {
        textbox: "Spider pig"
    }
    survey.render({
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBot: 10 }
      });
    expect(survey.docController.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].value)
        .toBe(survey.data.textbox);
});

test("Set textbox data value with default value", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = { questions: [ {
        name: "textbox",
        type: "text",
        title: "NeedValue:",
        defaultValue: "Only not me"
      }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    survey.data = {
        textbox: "Invisible black"
    }
    survey.render({
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBot: 10 }
      });
    expect(survey.docController.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].value)
        .toBe(survey.data.textbox);
    expect(survey.docController.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields[0].value)
        .not.toBe(json.questions[0].defaultValue);
});