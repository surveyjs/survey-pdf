(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, DocController, IRect } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { calcTitleTop } from './flat_question.test';
import { DropdownBrick } from '../src/pdf_render/pdf_dropdown';
let __dummy_dd = new FlatDropdown(null, null, null);

test('Check dropdown', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check dropdown with other', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        elements: [
            {
                type: 'dropdown',
                name: 'dropdownWithOther',
                choices: [
                    'right choice'
                ],
                hasOther: true
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const otherPoint: IPoint = await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], TestHelper.wrapRect(SurveyHelper.mergeRects(
            flats[0][0].unfold()[0], flats[0][0].unfold()[2])));
    otherPoint.xLeft += controller.unitWidth;
    otherPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
    TestHelper.equalRect(expect, flats[0][0].unfold()[3], await SurveyHelper.createCommentFlat(
        otherPoint, survey.getAllQuestions()[0], controller, SurveyHelper.OTHER_ROWS_COUNT, false));
});
test('Check readonly text expends when textFieldRenderAs option set', async () => {
    const json = {
        elements: [
            {
             type: "dropdown",
             choices: [
              {
               value: "item1",
               text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
              }
             ],
             defaultValue: "item1",
             titleLocation: 'hidden',
             readOnly: true
            }
        ]
    };
    const options = TestHelper.defaultOptions;
    options.textFieldRenderAs = 'multiLine';
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const question = survey.getAllQuestions()[0];
    const textPoint: IPoint = controller.leftTopPoint;
    textPoint.xLeft += controller.unitWidth;
    const firstRect: IRect = await SurveyHelper.createTextFieldRect(textPoint, controller);
    const secondRect: IRect = await SurveyHelper.createReadOnlyTextFieldTextFlat(textPoint, controller, question, question.displayValue, false);
    firstRect.yBot = secondRect.yBot + controller.unitHeight * SurveyHelper.VALUE_READONLY_PADDING_SCALE;
    TestHelper.equalRect(expect, flats[0][0], firstRect);
});