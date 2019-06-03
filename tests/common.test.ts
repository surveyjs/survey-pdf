(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { TestHelper } from '../src/helper_test';

test('first', () => {
    let survey: SurveyPDF = new SurveyPDF({}, TestHelper.defaultOptions);
    expect(survey).toBeDefined();
});