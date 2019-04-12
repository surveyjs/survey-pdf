(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};

import { QuestionRepository } from "../src/questionRepository";
import { IPoint, IRect, IDocOptions,  DocController } from "../src/docController";
import { JsPdfSurveyModel } from "../src/survey";
import { QuestionTextModel } from "survey-core";
import { TextQuestion } from "../src/text";
import { CheckBoxQuestion } from "../src/checkbox";

test("Calc textbox boundaries title top", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = {
        questions: [{
            name: "textbox",
            type: "text",
            title: "Please enter your name:"
        }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let qtm: QuestionTextModel = <QuestionTextModel>survey.getAllQuestions()[0];
    let docController: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let tq = QuestionRepository.getInstance().create(qtm, new DocController(docController));
    let resultBoundaries: IRect = tq.render({
        xLeft: docController.margins.marginLeft,
        yTop: docController.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docController.margins.marginLeft,
        xRight: docController.margins.marginLeft + (json.questions[0].title.length + 4) *
            docController.fontSize * docController.xScale,
        yTop: docController.margins.marginTop,
        yBot: docController.margins.marginTop + 2 * docController.fontSize * docController.yScale
    };
    expect(resultBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(resultBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(resultBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(resultBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

test("Calc textbox boundaries title bottom", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = {
        questions: [{
            name: "textbox",
            type: "text",
            title: "Please enter your name:",
            titleLocation: "bottom"
        }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let qtm: QuestionTextModel = <QuestionTextModel>survey.getAllQuestions()[0];
    let docController: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let tq = QuestionRepository.getInstance().create(qtm, new DocController(docController));
    let resultBoundaries: IRect = tq.render({
        xLeft: docController.margins.marginLeft,
        yTop: docController.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docController.margins.marginLeft,
        xRight: docController.margins.marginLeft + (json.questions[0].title.length + 4) *
            docController.fontSize * docController.xScale,
        yTop: docController.margins.marginTop,
        yBot: docController.margins.marginTop + 2 * docController.fontSize * docController.yScale
    };
    expect(resultBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(resultBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(resultBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(resultBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

test("Calc textbox boundaries title left", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = {
        questions: [{
            name: "textbox",
            type: "text",
            title: "Please enter your name:",
            titleLocation: "left"
        }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let qtm: QuestionTextModel = <QuestionTextModel>survey.getAllQuestions()[0];
    let docController: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let tq = QuestionRepository.getInstance().create(qtm, new DocController(docController));
    let resultBoundaries: IRect = tq.render({
        xLeft: docController.margins.marginLeft,
        yTop: docController.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docController.margins.marginLeft,
        xRight: docController.margins.marginLeft + (json.questions[0].title.length + 4) *
            docController.fontSize * docController.xScale + json.questions[0].title.length *
            docController.fontSize * docController.xScale,
        yTop: docController.margins.marginTop,
        yBot: docController.margins.marginTop + docController.fontSize * docController.yScale
    };
    expect(resultBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(resultBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(resultBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(resultBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

test("Calc textbox boundaries title hidden", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = {
        questions: [{
            name: "textbox",
            type: "text",
            title: "Please enter your name:",
            titleLocation: "hidden"
        }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let qtm: QuestionTextModel = <QuestionTextModel>survey.getAllQuestions()[0];
    let docController: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let tq = QuestionRepository.getInstance().create(qtm, new DocController(docController));
    let resultBoundaries: IRect = tq.render({
        xLeft: docController.margins.marginLeft,
        yTop: docController.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docController.margins.marginLeft,
        xRight: docController.margins.marginLeft + json.questions[0].title.length *
            docController.fontSize * docController.xScale,
        yTop: docController.margins.marginTop,
        yBot: docController.margins.marginTop + docController.fontSize * docController.yScale
    };
    expect(resultBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(resultBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(resultBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(resultBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

test("Calc boundaries with space between questions", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = {
        questions: [{
            name: "textbox1",
            type: "text",
            title: "What have we here?"
        },
        {
            name: "textbox2",
            type: "text",
            title: "Space between questions!"
      }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let qtm1: QuestionTextModel = <QuestionTextModel>survey.getAllQuestions()[0];
    let qtm2: QuestionTextModel = <QuestionTextModel>survey.getAllQuestions()[1];
    let docController: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBot: 10 }
      };
    let point: IPoint = {
        xLeft: docController.margins.marginLeft,
        yTop: docController.margins.marginTop
    };
    let tq1 = QuestionRepository.getInstance().create(qtm1, new DocController(docController));
    let tq1_Boundaries: IRect = tq1.render(point, false)[0];
    point.yTop = tq1_Boundaries.yBot;
    point.yTop += docController.fontSize * docController.yScale;
    let tq2 = QuestionRepository.getInstance().create(qtm2, new DocController(docController));
    let tq2_Boundaries: IRect = tq2.render(point, false)[0];
    let resultBoundaries: IRect = {
        xLeft: tq1_Boundaries.xLeft,
        xRight: Math.max(tq1_Boundaries.xRight, tq2_Boundaries.xRight),
        yTop: tq1_Boundaries.yTop,
        yBot: tq2_Boundaries.yBot
    }
    let assumeBoundaries: IRect = {
        xLeft: docController.margins.marginLeft,
        xRight: docController.margins.marginLeft + (json.questions[1].title.length + 4) *
                docController.fontSize * docController.xScale,
        yTop: docController.margins.marginTop,
        yBot: docController.margins.marginTop + 5 * docController.fontSize * docController.yScale
    };
    expect(resultBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(resultBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(resultBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(resultBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

test("Calc textbox boundaries title without number", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = {
        questions: [{
            name: "textbox",
            type: "text",
            title: "I do not need a number"
        }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    survey.showQuestionNumbers  = "off";
    let qtm: QuestionTextModel = <QuestionTextModel>survey.getAllQuestions()[0];
    let docController: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let tq = QuestionRepository.getInstance().create(qtm, new DocController(docController));
    let resultBoundaries: IRect = tq.render({
        xLeft: docController.margins.marginLeft,
        yTop: docController.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docController.margins.marginLeft,
        xRight: docController.margins.marginLeft + json.questions[0].title.length *
            docController.fontSize * docController.xScale,
        yTop: docController.margins.marginTop,
        yBot: docController.margins.marginTop + 2 * docController.fontSize * docController.yScale
    };
    expect(resultBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(resultBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(resultBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(resultBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

test("Split large quesion on two pages", () => {
    let __dummy_cb = new CheckBoxQuestion(null, null);
    let json = {
        questions: [{
            type: "checkbox",
            name: "longcar_margin",
            title: "What LONG car are you driving?",
            isRequired: true,
            choices: [
                "Ford",
                "Vauxhall",
                "Volkswagen",
                "Nissan",
                "Audi",
                "Mercedes-Benz",
                "BMW",
                "car0",
                "car1",
                "car2",
                "car3",
                "car4",
                "car5",
                "car6",
                "car7",
                "car8",
                "car9",
                "car10",
                "car11",
                "car12",
                "car13",
                "car14",
                "car15",
                "car16",
                "car17",
                "car18",
                "car19",
                "car20",
                "car21",
                "car22",
                "car23",
                "car24",
                "car25",
                "car26",
                "car27",
                "car28",
                "car29"
            ]
        }]
    };
    let survey = new JsPdfSurveyModel(json);
    survey.render({
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    });
    expect(survey.docController.doc.internal.getNumberOfPages()).toBe(2);
});