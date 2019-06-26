(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { calcTitleTop } from './flat_question.test';
let __dummy_dd = new FlatDropdown(null, null);

test('Check dropdown', async () => {
    let json = {
        elements: [
            {
                type: 'dropdown',
                name: 'expand me',
                choices: [
                    'right choice'
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check dropdown with other', async () => {
    let json = {
        showQuestionNumbers: 'false',
        elements: [
            {
                type: 'dropdown',
                name: 'expand me',
                choices: [
                    'right choice'
                ],
                hasOther: true
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let otherPoint: IPoint = await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], TestHelper.wrapRect(SurveyHelper.mergeRects(
            flats[0][0].unfold()[0], flats[0][0].unfold()[1])));
    otherPoint.xLeft += controller.unitWidth;
    TestHelper.equalRect(expect, flats[0][0].unfold()[2], SurveyHelper.createOtherFlat(
        otherPoint, survey.getAllQuestions()[0], controller));
});