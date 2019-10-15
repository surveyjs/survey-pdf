(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
  return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatQuestion } from '../src/flat_layout/flat_question';
import { FlatBoolean } from '../src/flat_layout/flat_boolean';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_bl = new FlatBoolean(null, null, null);

test('Check boolean', async () => {
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
  let controller: DocController = new DocController(TestHelper.defaultOptions);
  let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
  expect(flats.length).toBe(1);
  expect(flats[0].length).toBe(1);
  TestHelper.equalRect(expect, flats[0][0], {
    xLeft: controller.leftTopPoint.xLeft,
    xRight: (await SurveyHelper.createTitleFlat(
      controller.leftTopPoint,
      <Question>survey.getAllQuestions()[0],
      controller
    )).xRight,
    yTop: controller.leftTopPoint.yTop,
    yBot:
      controller.leftTopPoint.yTop +
      controller.unitHeight * SurveyHelper.TITLE_FONT_SCALE +
      controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE +
      controller.unitHeight * SurveyHelper.SELECT_ITEM_FLAT_SCALE +
      (controller.unitHeight * (1.0 - SurveyHelper.SELECT_ITEM_FLAT_SCALE)) /
        2.0
  });
});