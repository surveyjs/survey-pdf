(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question, QuestionCommentModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatComment } from '../src/flat_layout/flat_comment';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_cm = new FlatComment(null, null);
let __dummy_cb = new FlatCheckbox(null, null);

async function commentPointBeforeTitle(resultRects: IPdfBrick[][]) {
    let commentPoint = TestHelper.defaultPoint;
    let resultPoint = resultRects[0][0];
    TestHelper.equalPoint(expect, resultPoint, commentPoint);
    return commentPoint;
}
async function commentPointAfterTitle(titleLocation: string, resultRects: IPdfBrick[][], controller: DocController, survey: SurveyPDF) {
    if (titleLocation === 'left') {
        controller.margins.right = controller.paperWidth - controller.margins.left -
            SurveyHelper.getPageAvailableWidth(controller)
            * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
    }
    let commentAssumePoint: IPoint = await SurveyHelper.createPoint(await SurveyHelper.createTitleFlat(
        TestHelper.defaultPoint, <Question>survey.getAllQuestions()[0], controller),
        titleLocation === 'top', titleLocation !== 'top');
    if (titleLocation === 'top') {
        commentAssumePoint.xLeft += survey.controller.unitWidth;
    }
    let commentResultPoint: IPoint = resultRects[0][1];
    TestHelper.equalPoint(expect, commentResultPoint, commentAssumePoint);
    return commentAssumePoint;
}
async function commmentPointToTitleTests(titleLocation: string) {
    let json = {
        questions: [
            {
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test'
            }
        ]
    };
    (<any>json).questions[0].titleLocation = titleLocation;
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    let resultRects: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    switch (titleLocation) {
        case 'hidden':
        case 'bottom': {
            await commentPointBeforeTitle(resultRects)
            break;
        }
        case 'top':
        case 'left': {
            await commentPointAfterTitle(titleLocation, resultRects, controller, survey);
            break;
        }
    }
}
test('Comment point, title location top', async () => {
    await commmentPointToTitleTests('top');
});
test('Comment point, title location bottom', async () => {
    await commmentPointToTitleTests('bottom');
});
test('Comment point, title location left', async () => {
    await commmentPointToTitleTests('left');
});
test('Comment point, title location hidden', async () => {
    await commmentPointToTitleTests('hidden');
});
async function commentPointAfterItem(titleLocation: string) {
    let json = {
        showQuestionNumbers: 'false',
        questions: [
            {
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test',
                choices: ['test']
            }
        ]
    };
    (<any>json).questions[0].titleLocation = titleLocation;
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let resultRects: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(resultRects.length).toBe(1);
    if (titleLocation !== 'bottom') expect(resultRects[0].length).toBe(2);
    else expect(resultRects[0].length).toBe(3);
    if (titleLocation === 'top' || titleLocation === 'left') {
        let commentPoint: IPoint = SurveyHelper.createPoint(
            SurveyHelper.mergeRects(resultRects[0][0].unfold()[1],
                SurveyHelper.mergeRects(resultRects[0][0].unfold()[2])));
        TestHelper.equalPoint(expect, commentPoint, resultRects[0][1]);
    } else {
        TestHelper.equalPoint(expect, SurveyHelper.createPoint(resultRects[0][0]), resultRects[0][1]);
    }
}
test('Comment point after choice, title location: top', async () => {
    await commentPointAfterItem('top');
});
test('Comment point after choice, title location: bottom', async () => {
    await commentPointAfterItem('bottom');
});
test('Comment point after choice, title location: hidden', async () => {
    await commentPointAfterItem('hidden');
});
test('Comment point after choice, title location: left', async () => {
    await commentPointAfterItem('left');
});
test('Calc comment boundaries title hidden', async () => {
    let json = {
        questions: [
            {
                type: 'comment',
                name: 'comment',
                title: 'No comments',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let commentPoint: IPoint = survey.controller.leftTopPoint;
    commentPoint.xLeft += survey.controller.unitWidth;
    let assumeComment: IRect = SurveyHelper.createTextFieldRect(
        commentPoint, survey.controller,
        (<QuestionCommentModel>survey.getAllQuestions()[0]).rows);
    TestHelper.equalRect(expect, flats[0][0], assumeComment);
});
test('Calc question comment', async () => {
    let json = {
        questions: [
            {
                commentText: 'test',
                type: 'checkbox',
                hasComment: true,
                name: 'comment',
                title: 'No comments',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeText: IRect = await SurveyHelper.createTextFlat(
        survey.controller.leftTopPoint, survey.getAllQuestions()[0],
        survey.controller, json.questions[0].commentText, TextBrick);
    let assumeTextField: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeText), survey.controller, 2);
    TestHelper.equalRect(expect, flats[0][0].unfold()[0].unfold()[0], assumeText);
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeTextField);
});