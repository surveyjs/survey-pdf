(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};

import { JsPdfSurveyModel } from "../src/survey";

test("count_pages_margin", () => {
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
    }
    let survey = new JsPdfSurveyModel(json);
    survey.render({
        fontSize: 30, xScale: 0.22, yScale: 0.36,
        margins: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBot: 10 }
      }, true);
    expect(survey.docOptions.getDoc().internal.getNumberOfPages()).toBe(2);
});