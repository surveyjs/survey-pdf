(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
  return {};
};

import { QuestionTextModel } from "survey-core";
import { JsPdfSurveyModel } from "../src/__survey";
import { TextQuestion } from "../src/text";
import { CheckBoxQuestion } from "../src/checkbox";
test("Check title number", () => {
  let __dummy_tx = new TextQuestion(null, null);
  let json = {
    questions: [
      {
        name: "textbox",
        type: "text",
        title: "I'm number 1"
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
  let internalContent = survey.docController.doc.internal.pages[1][2];
  let regex = /\((.*)\)/;
  let content = internalContent.match(regex)[1];
  expect(content).toBe("1 . " + json.questions[0].title);
});

test("Check title number with custom questionStartIndex", () => {
  let __dummy_tx = new TextQuestion(null, null);
  let json = {
    questions: [
      {
        name: "textbox",
        type: "text",
        title: "I'm number 1"
      }
    ]
  };
  let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
  survey.questionStartIndex = "7";
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
  let internalContent = survey.docController.doc.internal.pages[1][2];
  let regex = /\((.*)\)/;
  let content = internalContent.match(regex)[1];
  expect(content).toBe("7 . " + json.questions[0].title);
});

test("Check title number with alphabetical questionStartIndex", () => {
  let __dummy_tx = new TextQuestion(null, null);
  let json = {
    questions: [
      {
        name: "textbox",
        type: "text",
        title: "I'm number 1"
      }
    ]
  };
  let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
  survey.questionStartIndex = "A";
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
  let internalContent = survey.docController.doc.internal.pages[1][2];
  let regex = /\((.*)\)/;
  let content = internalContent.match(regex)[1];
  expect(content).toBe("A . " + json.questions[0].title);
});

test("Check title required text", () => {
  let __dummy_tx = new TextQuestion(null, null);
  let json = {
    questions: [
      {
        name: "textbox",
        type: "text",
        title: "Filling Required",
        isRequired: true
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
  let internalContent = survey.docController.doc.internal.pages[1][2];
  let regex = /\((.*)\)/;
  let content = internalContent.match(regex)[1];
  expect(content).toBe(
    "1 . " +
      json.questions[0].title +
      " " +
      (<QuestionTextModel>survey.getAllQuestions()[0]).requiredText
  );
});
test("Check comment for checkbox", () => {
  let __dummy_cx = new CheckBoxQuestion(null, null);
  let json = {
    questions: [
      {
        name: "checkbox",
        type: "checkbox",
        hasComment: true,
        commentText: "comment check"
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
  let internalContent = survey.docController.doc.internal.pages[1][3];
  let regex = /\((.*)\)/;
  let content = internalContent.match(regex)[1];
  expect(content).toBe(json.questions[0].commentText);
});
