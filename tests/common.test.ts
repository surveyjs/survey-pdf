import { JsPdfSurveyModel } from "../src/jspdf/survey";

test("first", () => {
    let survey = new JsPdfSurveyModel({});
    expect(survey).toBeDefined();
});