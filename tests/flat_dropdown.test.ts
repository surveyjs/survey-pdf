(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, DocController, IRect } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatQuestion } from '../src/flat_layout/flat_question';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { calcTitleTop } from './flat_question.test';
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
    const question: Question = survey.getAllQuestions()[0];
    await calcTitleTop(controller.leftTopPoint, controller, question, flats[0][0]);
});
test('Check dropdown with other not answered', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        elements: [
            {
                type: 'dropdown',
                name: 'dropdown_other_not_answered',
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
    const question: Question = survey.getAllQuestions()[0];
    await calcTitleTop(controller.leftTopPoint, controller, question, flats[0][0]);
});
test('Check dropdown with other answered', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
        elements: [
            {
                type: 'dropdown',
                name: 'dropdown_other_answered',
                choices: [
                    'right choice'
                ],
                hasOther: true,
                defaultValue: 'other'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const question: Question = survey.getAllQuestions()[0];
    const unfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    const actualTitleWithDropdown: IPdfBrick = TestHelper.wrapRect(SurveyHelper.mergeRects(
        ...unfoldFlats.slice(0, unfoldFlats.length - 1)));
    const otherPoint: IPoint  = await calcTitleTop(
        controller.leftTopPoint, controller, question, actualTitleWithDropdown);
    otherPoint.xLeft += controller.unitWidth * FlatQuestion.CONTENT_INDENT_SCALE;
    otherPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
    const actualComment: IRect = unfoldFlats[unfoldFlats.length - 1];
    const assumeComment: IRect = await SurveyHelper.createCommentFlat(
        otherPoint, question, controller, SurveyHelper.OTHER_ROWS_COUNT, false);
    TestHelper.equalRect(expect, actualComment, assumeComment);
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
    const firstRect: IRect = SurveyHelper.createTextFieldRect(textPoint, controller);
    const secondRect: IRect = await SurveyHelper.createReadOnlyTextFieldTextFlat(textPoint, controller, question, question.displayValue, false);
    firstRect.yBot = secondRect.yBot + controller.unitHeight * SurveyHelper.VALUE_READONLY_PADDING_SCALE;
    TestHelper.equalRect(expect, flats[0][0], firstRect);
});