(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};

import { QuestionRepository } from "../src/questionRepository";
import { IPoint, IRect, IDocOptions,  DocController } from "../src/docController";
import { JsPdfSurveyModel } from "../src/survey";
import { Question, QuestionTextModel, QuestionCheckboxModel } from "survey-core";
import { PdfQuestion, IPdfQuestion } from "../src/question";
import { TextQuestion } from "../src/text";
import { CheckBoxQuestion } from "../src/checkbox";

test("Calc title boundaries", () => {
    let json = {
        questions: [{
            name: "textbox",
            type: "text",
            title: "Please enter your name:"
        }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let qm: Question = <Question>survey.getAllQuestions()[0];
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let docController: DocController = new DocController(docOptions);
    let pq: IPdfQuestion = new PdfQuestion(qm, docController);
    let resultBoundaries: IRect = pq.render({
        xLeft: docOptions.margins.marginLeft,
        yTop: docOptions.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docOptions.margins.marginLeft,
        xRight: docOptions.margins.marginLeft + (json.questions[0].title.length + 4) *
            docOptions.fontSize * docOptions.xScale,
        yTop: docOptions.margins.marginTop,
        yBot: docOptions.margins.marginTop + docOptions.fontSize * docOptions.yScale
    };
    expect(resultBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(resultBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(resultBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(resultBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

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
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let docController: DocController = new DocController(docOptions);
    let tq: IPdfQuestion = QuestionRepository.getInstance().create(qtm, docController);
    let resultBoundaries: IRect = tq.render({
        xLeft: docController.margins.marginLeft,
        yTop: docController.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docController.margins.marginLeft,
        xRight: docController.paperWidth - docController.margins.marginRight,
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
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let docController: DocController = new DocController(docOptions);
    let tq: IPdfQuestion = QuestionRepository.getInstance().create(qtm, docController);
    let resultBoundaries: IRect = tq.render({
        xLeft: docOptions.margins.marginLeft,
        yTop: docOptions.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docOptions.margins.marginLeft,
        xRight: docController.paperWidth - docController.margins.marginRight,
        yTop: docOptions.margins.marginTop,
        yBot: docOptions.margins.marginTop + 2 * docOptions.fontSize * docOptions.yScale
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
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let docController: DocController = new DocController(docOptions);
    let tq: IPdfQuestion = QuestionRepository.getInstance().create(qtm, docController);
    let resultBoundaries: IRect = tq.render({
        xLeft: docOptions.margins.marginLeft,
        yTop: docOptions.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docOptions.margins.marginLeft,
        xRight: docController.paperWidth - docController.margins.marginRight,
        yTop: docOptions.margins.marginTop,
        yBot: docOptions.margins.marginTop + docOptions.fontSize * docOptions.yScale
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
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let docController: DocController = new DocController(docOptions);
    let tq: IPdfQuestion = QuestionRepository.getInstance().create(qtm, new DocController(docOptions));
    let resultBoundaries: IRect = tq.render({
        xLeft: docOptions.margins.marginLeft,
        yTop: docOptions.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docOptions.margins.marginLeft,
        xRight: docController.paperWidth - docController.margins.marginRight,
        yTop: docOptions.margins.marginTop,
        yBot: docOptions.margins.marginTop + docOptions.fontSize * docOptions.yScale
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
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBot: 10 }
      };
    let point: IPoint = {
        xLeft: docOptions.margins.marginLeft,
        yTop: docOptions.margins.marginTop
    };
    let docController: DocController = new DocController(docOptions);
    let tq1: IPdfQuestion = QuestionRepository.getInstance().create(qtm1, docController);
    let tq1_Boundaries: IRect = tq1.render(point, false)[0];
    point.yTop = tq1_Boundaries.yBot;
    point.yTop += docOptions.fontSize * docOptions.yScale;
    let tq2: IPdfQuestion = QuestionRepository.getInstance().create(qtm2, docController);
    let tq2_Boundaries: IRect = tq2.render(point, false)[0];
    let resultBoundaries: IRect = {
        xLeft: tq1_Boundaries.xLeft,
        xRight: Math.max(tq1_Boundaries.xRight, tq2_Boundaries.xRight),
        yTop: tq1_Boundaries.yTop,
        yBot: tq2_Boundaries.yBot
    }
    let assumeBoundaries: IRect = {
        xLeft: docOptions.margins.marginLeft,
        xRight: docController.paperWidth - docController.margins.marginRight,
        yTop: docOptions.margins.marginTop,
        yBot: docOptions.margins.marginTop + 5 * docOptions.fontSize * docOptions.yScale
    };
    expect(resultBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(resultBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(resultBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(resultBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

test("Calc textbox boundaries title without number", () => {
    let json = {
        questions: [{
            name: "textbox",
            type: "text",
            title: "I do not need a number"
        }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    survey.showQuestionNumbers  = "off";
    let qm: Question = <Question>survey.getAllQuestions()[0];
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let docController: DocController = new DocController(docOptions);
    let pq: IPdfQuestion = new PdfQuestion(qm, docController);
    let resultBoundaries: IRect = pq.render({
        xLeft: docOptions.margins.marginLeft,
        yTop: docOptions.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docOptions.margins.marginLeft,
        xRight: docOptions.margins.marginLeft + json.questions[0].title.length *
            docOptions.fontSize * docOptions.xScale,
        yTop: docOptions.margins.marginTop,
        yBot: docOptions.margins.marginTop + docOptions.fontSize * docOptions.yScale
    };
    expect(resultBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(resultBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(resultBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(resultBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

test("Calc textbox boundaries required", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = {
        questions: [{
            name: "textbox",
            type: "text",
            title: "Please enter your name:",
            isRequired: true
        }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let qtm: QuestionTextModel = <QuestionTextModel>survey.getAllQuestions()[0];
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        }
    };
    let tq: IPdfQuestion = QuestionRepository.getInstance().create(qtm, new DocController(docOptions));
    let resultBoundaries: IRect = tq.render({
        xLeft: docOptions.margins.marginLeft,
        yTop: docOptions.margins.marginTop
    }, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docOptions.margins.marginLeft,
        xRight: docOptions.margins.marginLeft + (json.questions[0].title.length + 5
            + qtm.requiredText.length) * docOptions.fontSize * docOptions.xScale,
        yTop: docOptions.margins.marginTop,
        yBot: docOptions.margins.marginTop + 2 * docOptions.fontSize * docOptions.yScale
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

test("Calc boundaries title on the end of page", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let __dummy_cb = new CheckBoxQuestion(null, null);
    let json = {
        questions: [
            {
                type: "checkbox",
                name: "toendpagebox",
                title: "I am on one page?",
                choices: [
                    "One",
                    "Two",
                    "Three"
                ]
            },
            {
                name: "textbox",
                type: "text",
                title: "New page title"
            }
        ]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        } 
    };
    docOptions.paperHeight = 5 * (docOptions.fontSize * docOptions.yScale);
    let docController: DocController = new DocController(docOptions);
    let cbm: QuestionCheckboxModel = <QuestionCheckboxModel>survey.getAllQuestions()[0];
    let cbq: IPdfQuestion = QuestionRepository.getInstance().create(cbm, docController);
    let point: IPoint = {
        xLeft: docOptions.margins.marginLeft,
        yTop: docOptions.margins.marginTop
    }
    let checkboxBoundaries: IRect[] = cbq.render(point, false);
    if (docController.isNewPageQuestion(checkboxBoundaries)) {
        docController.addPage();
        point.xLeft = docOptions.margins.marginLeft;
        point.yTop = docOptions.margins.marginTop;
    }
    expect(point.xLeft).toBeCloseTo(docOptions.margins.marginLeft);
    expect(point.yTop).toBeCloseTo(docOptions.margins.marginTop);
    let qtm: QuestionTextModel = <QuestionTextModel>survey.getAllQuestions()[1];
    let tq: IPdfQuestion = QuestionRepository.getInstance().create(qtm, docController);
    let textboxBoundaries: IRect = tq.render(point, false)[0];
    let assumeBoundaries: IRect = {
        xLeft: docOptions.margins.marginLeft,
        xRight: docController.paperWidth - docController.margins.marginRight,
        yTop: docOptions.margins.marginTop,
        yBot: docOptions.margins.marginTop + 2 * docOptions.fontSize * docOptions.yScale
    };
    expect(textboxBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(textboxBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(textboxBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(textboxBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

test("Check that checkbox has square boundaries", () => {
    let __dummy_cb = new CheckBoxQuestion(null, null);
    let json = {
        questions: [
            {
                type: "checkbox",
                name: "box",
                title: "Square Pants",
                choices: [
                    "S"
                ]
            }
        ]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBot: 10
        } 
    };
    let docController: DocController = new DocController(docOptions);
    let cbm: QuestionCheckboxModel = <QuestionCheckboxModel>survey.getAllQuestions()[0];
    let cbq: CheckBoxQuestion =
        <CheckBoxQuestion>QuestionRepository.getInstance().create(cbm, docController);
    let point: IPoint = {
        xLeft: docOptions.margins.marginLeft,
        yTop: docOptions.margins.marginTop
    }
    let itemBoundaries: IRect = cbq.renderItem(point, cbm, cbm.choices[0], 0, false);
    let assumeBoundaries: IRect = {
        xLeft: docOptions.margins.marginLeft,
        xRight: docOptions.margins.marginLeft + docController.measureText().height +
            docController.measureText(json.questions[0].choices[0]).width,
        yTop: docOptions.margins.marginTop,
        yBot: docOptions.margins.marginTop + docController.measureText().height
    };
    expect(itemBoundaries.xLeft).toBeCloseTo(assumeBoundaries.xLeft);
    expect(itemBoundaries.xRight).toBeCloseTo(assumeBoundaries.xRight);
    expect(itemBoundaries.yTop).toBeCloseTo(assumeBoundaries.yTop);
    expect(itemBoundaries.yBot).toBeCloseTo(assumeBoundaries.yBot);
});

