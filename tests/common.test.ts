import { JsPdfSurveyModel } from "../src/survey";

test("first", () => {
    let survey = new JsPdfSurveyModel({});
    expect(survey).toBeDefined();
});