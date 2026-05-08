(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { test, expect } from 'vitest';
import { SurveyPDF } from '../src/survey';
import { TestHelper } from '../src/helper_test';

test('SurveyPDF is defined', () => {
    let survey: SurveyPDF = new SurveyPDF({}, TestHelper.defaultOptions);
    expect(survey).toBeDefined();
});