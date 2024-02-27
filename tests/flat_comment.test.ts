(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question, QuestionCommentModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatQuestion } from '../src/flat_layout/flat_question';
import { FlatComment } from '../src/flat_layout/flat_comment';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';

import * as Survey from 'survey-core';
import { TextFieldBrick } from '../src/pdf_render/pdf_textfield';

const __dummy_cm = new FlatComment(null, null, null);
const __dummy_cb = new FlatCheckbox(null, null, null);

async function commentPointBeforeTitle(resultRects: IPdfBrick[][], controller: DocController) {
    const commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    const resultPoint: IPoint = resultRects[0][0];
    TestHelper.equalPoint(expect, resultPoint, commentPoint);
    return commentPoint;
}
async function commentPointAfterTitle(titleLocation: string, resultRects: IPdfBrick[][],
    controller: DocController, survey: SurveyPDF) {
    if (titleLocation === 'left') {
        controller.margins.right = controller.paperWidth - controller.margins.left -
            SurveyHelper.getPageAvailableWidth(controller) * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
    }
    const commentAssumePoint: IPoint = SurveyHelper.createPoint(await SurveyHelper.createTitleFlat(
        controller.leftTopPoint, <Question>survey.getAllQuestions()[0], controller),
    titleLocation === 'top', titleLocation !== 'top');
    commentAssumePoint.xLeft += controller.unitWidth;
    if (titleLocation === 'top') {
        commentAssumePoint.yTop += controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
    }
    const commentResultPoint: IPoint = resultRects[0][1];
    TestHelper.equalPoint(expect, commentResultPoint, commentAssumePoint);
    return commentAssumePoint;
}
async function commmentPointToTitleTests(titleLocation: string) {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const resultRects: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    switch (titleLocation) {
        case 'hidden':
        case 'bottom': {
            await commentPointBeforeTitle(resultRects, controller);
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
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const resultRects: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(resultRects.length).toBe(1);
    if (titleLocation !== 'bottom') expect(resultRects[0].length).toBe(2);
    else expect(resultRects[0].length).toBe(3);
    if (titleLocation === 'top' || titleLocation === 'left') {
        const rowlineShift: number = titleLocation === 'top' ? 1 : 0;
        const commentPoint: IPoint = SurveyHelper.createPoint(
            SurveyHelper.mergeRects(resultRects[0][0].unfold()[1 + rowlineShift],
                SurveyHelper.mergeRects(resultRects[0][0].unfold()[2 + rowlineShift])));
        commentPoint.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
        TestHelper.equalPoint(expect, resultRects[0][1], commentPoint);
    }
    else {
        const commentPoint: IPoint = SurveyHelper.createPoint(resultRects[0][0]);
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
    const json: any = {
        questions: [
            {
                type: 'comment',
                name: 'comment',
                title: 'No comments',
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    const question = <QuestionCommentModel>survey.getAllQuestions()[0];
    const assumeComment: IRect = SurveyHelper.createTextFieldRect(
        commentPoint, controller, question.rows);
    TestHelper.equalRect(expect, flats[0][0], assumeComment);
});
test('Check question comment', async () => {
    const json: any = {
        questions: [
            {
                commentText: 'test',
                type: 'checkbox',
                hasComment: true,
                name: 'comment',
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    const assumeText: IRect = await SurveyHelper.createTextFlat(
        commentPoint, survey.getAllQuestions()[0],
        controller, json.questions[0].commentText, TextBrick);
    const otherPount: IPoint = SurveyHelper.createPoint(assumeText);
    otherPount.yTop += controller.unitHeight * SurveyHelper.GAP_BETWEEN_ROWS;
    const assumeTextField: IRect = SurveyHelper.createTextFieldRect(otherPount, controller, 2);
    TestHelper.equalRect(expect, flats[0][0].unfold()[0].unfold()[0], assumeText);
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeTextField);
});
test('Check readonly comment', async () => {
    const json: any = {
        questions: [
            {
                type: 'comment',
                name: 'comment_readonly',
                readOnly: true,
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    const question = <QuestionCommentModel>survey.getAllQuestions()[0];
    const assumeTextField: IRect = SurveyHelper.createTextFieldRect(
        commentPoint, controller, question.rows);
    TestHelper.equalRect(expect, flats[0][0], assumeTextField);
});
test('Check readonly comment with long text', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const commentPoint: IPoint = controller.leftTopPoint;
    commentPoint.xLeft += controller.unitWidth;
    const question = <QuestionCommentModel>survey.getAllQuestions()[0];
    const assumeTextField: IRect = SurveyHelper.createTextFieldRect(
        commentPoint, controller, question.rows);
    const textFlat: IPdfBrick = await SurveyHelper.
        createReadOnlyTextFieldTextFlat(commentPoint, controller,
            survey.getAllQuestions()[0], survey.getAllQuestions()[0].value);
    const padding: number = controller.unitWidth *
        SurveyHelper.VALUE_READONLY_PADDING_SCALE;
    assumeTextField.yBot = textFlat.yBot + padding;
    TestHelper.equalRect(expect, flats[0][0], assumeTextField);
});
class SurveyPDFTester extends SurveyPDF {
    public get haveCommercialLicense(): boolean { return true; }
}
test('Check readonly text with readOnlyTextRenderMode set to div', async () => {
    const oldRenderMode = Survey.settings.readOnlyCommentRenderMode;
    Survey.settings.readOnlyCommentRenderMode = 'div';
    try {
        const json: any = {
            questions: [
                {
                    type: 'comment',
                    name: 'text_readonly',
                    readOnly: true,
                    titleLocation: 'hidden'
                }
            ]
        };
        const survey: SurveyPDF = new SurveyPDFTester(json, TestHelper.defaultOptions);
        const pdfAsString = await survey.raw();
        // Stream in result PDF document should be small - in this example 14
        expect(pdfAsString.indexOf('/Length 14\n') > 0).toBeTruthy();

    } finally {
        Survey.settings.readOnlyCommentRenderMode = oldRenderMode;
    }
});

test('Check readOnly comment flat is moving text bruck inside', async () => {
    const json: any = {
        questions: [
            {
                type: 'comment',
                name: 'text_readonly',
                readOnly: true,
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const question = survey.getAllQuestions()[0];
    const comment = <TextFieldBrick>await SurveyHelper.createCommentFlat({ xLeft: 0, yTop: 0 }, question, controller, true);
    const textBrick = comment['textBrick'];
    expect(textBrick).toBeDefined();
    const initialXLeft = textBrick.xLeft;
    const initialXRight = textBrick.xRight;
    const initialYTop = textBrick.yTop;
    const initialYBot = textBrick.yBot;
    comment.xLeft += 20;
    comment.xRight += 25;
    comment.yTop +=10;
    comment.yBot +=15;
    expect(textBrick.xLeft - initialXLeft).toBeCloseTo(20);
    expect(textBrick.xRight - initialXRight).toBeCloseTo(25);
    expect(textBrick.yTop - initialYTop).toBeCloseTo(10);
    expect(textBrick.yBot - initialYBot).toBeCloseTo(15);
});