(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatQuestion } from '../src/flat_layout/flat_question';
import { FlatBoolean } from '../src/flat_layout/flat_boolean';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_bl = new FlatBoolean(null, null);

test('Check boolean without title', async () => {
    let json = {
        elements: [
            {
                type: 'boolean',
                name: 'Boolman',
                title: 'Ama label'
            }
        ]
    };
    let survey: SurveyPDF = await new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    TestHelper.equalRect(expect, flats[0][0], {
        xLeft: survey.controller.leftTopPoint.xLeft + survey.controller.unitWidth,
        xRight: survey.controller.leftTopPoint.xLeft + survey.controller.unitWidth +
            survey.controller.unitHeight * (SurveyHelper.SELECT_ITEM_FLAT_SCALE +
                SurveyHelper.GAP_BETWEEN_ITEM_TEXT) +
            survey.controller.measureText(json.elements[0].title).width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.measureText(json.elements[0].title).height,
    })
});
test('Check boolean with title', async () => {
    let json: any = {
        elements: [
            {
                type: 'boolean',
                name: 'Boolman',
                title: 'Ama title',
                showTitle: true
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    TestHelper.equalRect(expect, flats[0][0], {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: (await SurveyHelper.createTitleFlat(survey.controller.leftTopPoint,
            <Question>survey.getAllQuestions()[0], survey.controller)).xRight,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.unitHeight * SurveyHelper.TITLE_FONT_SCALE +
            survey.controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE +
            survey.controller.unitHeight * SurveyHelper.SELECT_ITEM_FLAT_SCALE +
            survey.controller.unitHeight * (1.0 - SurveyHelper.SELECT_ITEM_FLAT_SCALE) / 2.0
    })
});