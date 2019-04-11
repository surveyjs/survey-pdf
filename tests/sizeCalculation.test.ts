(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};

import { JsPdfSurveyModel, IDocOptions, QuestionRepository, DocOptions } from "../src/survey";
import { QuestionCheckboxModel } from "survey-core";
import { TextQuestion } from "../src/text";
import { CheckBoxQuestion } from "../src/checkbox";

test("Calc textbox boundaries", () => {
    let __dummy_tx = new TextQuestion(null, null);
    let json = { questions: [ {
        name: "textbox",
        type: "text",
        title: "Please enter your name:"
      }]
    };
    let survey: JsPdfSurveyModel = new JsPdfSurveyModel(json);
    let cbq: QuestionCheckboxModel = <QuestionCheckboxModel>survey.getAllQuestions()[0];
    let docOptions: IDocOptions = {
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBot: 10 }
      };
    let tq = QuestionRepository.getInstance().create(cbq, new DocOptions(docOptions));
    expect(tq
        .render({
            xLeft: docOptions.margins.marginLeft,
            yTop: docOptions.margins.marginTop}, false))
        .toBe([{
            xLeft: docOptions.margins.marginLeft,
            xRight: docOptions.margins.marginLeft + json.questions[0].title.length *
                    docOptions.fontSize * docOptions.xScale,
            yTop: docOptions.margins.marginTop,
            yBot: 2 * docOptions.fontSize * docOptions.yScale
        }]);
});

test("Split large quesion on two pages", () => {
    let __dummy_cb = new CheckBoxQuestion(null, null);
    let json = { questions: [ {
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
        ]}]
    };
    let survey = new JsPdfSurveyModel(json);
    survey.render({
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBot: 10 }
      });
    expect(survey.docOptions.getDoc().internal.getNumberOfPages()).toBe(2);
});