(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatExpression } from '../src/flat_layout/flat_expression';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { QuestionExpressionModel } from 'survey-core';
let __dummy_ex = new FlatExpression(null, null, null);

test('Check expression', async () => {
    let json: any = {
        elements: [
            {
                type: 'expression',
                name: 'expque',
                titleLocation: 'hidden',
                expression: '1'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeExpression: IRect = {
        xLeft: controller.leftTopPoint.xLeft + controller.unitWidth,
        xRight: controller.leftTopPoint.xLeft + SurveyHelper.getPageAvailableWidth(controller),
        yTop: controller.leftTopPoint.yTop,
        yBot: controller.leftTopPoint.yTop + controller.unitHeight
    };
    TestHelper.equalRect(expect, flats[0][0], assumeExpression);
});
test('Check expression with display format', async () => {
    let json: any = {
        elements: [
            { type: 'expression', name: 'exp', expression: '0.05', displayStyle: 'percent' },
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let question = <QuestionExpressionModel>survey.getAllQuestions()[0];
    expect(question.formatedValue).toEqual('5%');
    expect(question.displayValue).toEqual('5%');
    expect(SurveyHelper.getQuestionOrCommentDisplayValue(question, true)).toEqual('5%');
});