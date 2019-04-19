(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { PdfSurvey } from '../src/survey';
import { TestHelper } from '../src/helper_test';

test("first", () => {
    let survey: PdfSurvey = new PdfSurvey({}, TestHelper.defaultOptions);
    expect(survey).toBeDefined();
});