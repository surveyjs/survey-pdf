(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatComment } from '../src/flat_layout/flat_comment';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { FlatQuestion } from '../src/flat_layout/flat_question';
let __dummy_cm = new FlatComment(null, null, null);
let __dummy_cb = new FlatCheckbox(null, null, null);

async function commentPointBeforeTitle(resultRects: IPdfBrick[][], controller: DocController) {
    let commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    let resultPoint: IPoint = resultRects[0][0];
    TestHelper.equalPoint(expect, resultPoint, commentPoint);
    return commentPoint;
}
async function commentPointAfterTitle(titleLocation: string, resultRects: IPdfBrick[][],
    controller: DocController, survey: SurveyPDF) {
    if (titleLocation === 'left') {
        controller.margins.right = controller.paperWidth - controller.margins.left -
            SurveyHelper.getPageAvailableWidth(controller) *
                SurveyHelper.MULTIPLETEXT_TEXT_PERS;
    }
    let commentAssumePoint: IPoint = await SurveyHelper.createPoint(await SurveyHelper.createTitleFlat(
        TestHelper.defaultPoint, <Question>survey.getAllQuestions()[0], controller),
        titleLocation === 'top', titleLocation !== 'top');
    commentAssumePoint.xLeft += controller.unitWidth;
    if (titleLocation == 'top') {
        commentAssumePoint.yTop += controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
    }
    let commentResultPoint: IPoint = resultRects[0][1];
    TestHelper.equalPoint(expect, commentResultPoint, commentAssumePoint);
    return commentAssumePoint;
}
async function commmentPointToTitleTests(titleLocation: string) {
    let json: any = {
        questions: [
            {
                name: 'checkbox',
                type: 'checkbox',
                hasComment: 'true',
                title: 'test'
            }
        ]
    };
    json.questions[0].titleLocation = titleLocation;
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let resultRects: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    switch (titleLocation) {
        case 'hidden':
        case 'bottom': {
            await commentPointBeforeTitle(resultRects, controller)
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
    let json: any = {
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
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let resultRects: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(resultRects.length).toBe(1);
    if (titleLocation !== 'bottom') expect(resultRects[0].length).toBe(2);
    else expect(resultRects[0].length).toBe(3);
    if (titleLocation === 'top' || titleLocation === 'left') {
        let commentPoint: IPoint = SurveyHelper.createPoint(
            SurveyHelper.mergeRects(resultRects[0][0].unfold()[1],
                SurveyHelper.mergeRects(resultRects[0][0].unfold()[2])));
        commentPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
        TestHelper.equalPoint(expect, resultRects[0][1], commentPoint);
    }
    else {
        let commentPoint: IPoint = SurveyHelper.createPoint(resultRects[0][0]);
        commentPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
        TestHelper.equalPoint(expect, resultRects[0][1], commentPoint);
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
test('Check comment boundaries title hidden', async () => {
    let json: any = {
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
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    let assumeComment: IRect = SurveyHelper.createTextFieldRect(
        commentPoint, controller, survey.getAllQuestions()[0].rows);
    TestHelper.equalRect(expect, flats[0][0], assumeComment);
});
test('Check question comment', async () => {
    let json: any = {
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
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    let assumeText: IRect = await SurveyHelper.createTextFlat(
        commentPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].commentText, TextBrick);
    let assumeTextField: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeText), controller, 2);
    TestHelper.equalRect(expect, flats[0][0].unfold()[0].unfold()[0], assumeText);
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeTextField);
});
test('Check readonly comment', async () => {
    let json: any = {
        questions: [
            {
                type: 'comment',
                name: 'comment_readonly',
                readOnly: true,
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    let assumeTextField: IRect = SurveyHelper.createTextFieldRect(
        commentPoint, controller, survey.getAllQuestions()[0].rows);
    TestHelper.equalRect(expect, flats[0][0], assumeTextField);
});
test('Check readonly comment with long text', async () => {
    let json: any = {
        questions: [
            {
                type: 'comment',
                name: 'comment_readonly_long_text',
                readOnly: true,
                defaultValue: 'Loooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooooo' +
                    'ooooooooooooooooooooooooooooooooooooooooooooooong',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    let assumeTextField: IRect = SurveyHelper.createTextFieldRect(
        commentPoint, controller, survey.getAllQuestions()[0].rows);
    let textFlat: IPdfBrick = await SurveyHelper.
        createReadOnlyTextFieldTextFlat(commentPoint, controller,
            survey.getAllQuestions()[0], survey.getAllQuestions()[0].value, false);
    let padding: number = controller.unitWidth *
        SurveyHelper.VALUE_READONLY_PADDING_SCALE;
    assumeTextField.yBot = textFlat.yBot + padding;
    TestHelper.equalRect(expect, flats[0][0], assumeTextField);
});