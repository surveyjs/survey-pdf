(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question, QuestionCommentModel, QuestionRatingModel, QuestionExpressionModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, ISize, IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatComment } from '../src/flat_layout/flat_comment';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { FlatRating } from '../src/flat_layout/flat_rating';
import { FlatImagePicker } from '../src/flat_layout/flat_imagepicker';
import { FlatBoolean } from '../src/flat_layout/flat_boolean';
import { FlatExpression } from '../src/flat_layout/flat_expression';
import { FlatFile } from '../src/flat_layout/flat_file';
import { FlatMatrixMultiple } from '../src/flat_layout/flat_matrixmultiple';
import { FlatMultipleText } from '../src/flat_layout/flat_multipletext';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { TitleBrick } from '../src/pdf_render/pdf_title';
import { TextBoxBrick } from '../src/pdf_render/pdf_textbox';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);
let __dummy_dd = new FlatDropdown(null, null);
let __dummy_cm = new FlatComment(null, null);
let __dummy_rt = new FlatRating(null, null);
let __dummy_ip = new FlatImagePicker(null, null);
let __dummy_bl = new FlatBoolean(null, null);
let __dummy_ex = new FlatExpression(null, null);
let __dummy_fl = new FlatFile(null, null);
let __dummy_mm = new FlatMatrixMultiple(null, null);
let __dummy_mt = new FlatMultipleText(null, null);

async function calcTitleTop(leftTopPoint: IPoint, controller: DocController,
    titleQuestion: Question, compositeFlat: IPdfBrick, isDesc: boolean = false): Promise<IPoint> {
    let assumeTitle: IRect = await SurveyHelper.createTitleFlat(
        leftTopPoint, titleQuestion, controller);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle), controller);
    if (isDesc) {
        let assumeDesc: IRect = await SurveyHelper.createDescFlat(
            SurveyHelper.createPoint(assumeTitle), null,
            controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        assumeTextbox = SurveyHelper.createTextFieldRect(
            SurveyHelper.createPoint(assumeDesc), controller);
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeDesc, assumeTextbox));
    }
    else {
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeTextbox));
    }
    return SurveyHelper.createPoint(assumeTextbox);
}
async function calcTitleBottom(controller: DocController, titleQuestion: Question,
    compositeFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
    let assumeTitle: IRect = await SurveyHelper.createTitleFlat(
        SurveyHelper.createPoint(assumeTextbox), titleQuestion, controller);
    if (isDesc) {
        let assumeDesc: IRect = await SurveyHelper.createDescFlat(
            SurveyHelper.createPoint(assumeTitle), null,
            controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeDesc));
    } else {
        TestHelper.equalRect(expect, compositeFlat, assumeTitle);
    }
}
async function calcTitleLeft(controller: DocController, titleQuestion: Question,
    compositeFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    let oldRightMargins = controller.margins.right;
    controller.margins.right = controller.paperWidth - controller.margins.left -
        SurveyHelper.getPageAvailableWidth(controller)
        * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
    let assumeTitle: IRect = await SurveyHelper.createTitleFlat(
        controller.leftTopPoint, titleQuestion, controller);
    controller.margins.right = oldRightMargins;
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle, false, true), controller);
    if (isDesc) {
        controller.margins.right = controller.paperWidth - controller.margins.left -
            SurveyHelper.getPageAvailableWidth(controller)
            * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
        let assumeDesc: IRect = await SurveyHelper.createDescFlat(
            SurveyHelper.createPoint(assumeTitle), null,
            controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        controller.margins.right = oldRightMargins;
        TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeDesc));
        assumeTextbox.xLeft = Math.max(assumeTextbox.xLeft, assumeDesc.xRight);
    }
    else {
        TestHelper.equalRect(expect, compositeFlat, assumeTitle);
    }
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
}
export async function calcIndent(expect: any, leftTopPoint: IPoint, controller: DocController,
    compositeFlat: IPdfBrick, checktext: string, titleQuestion: Question = null) {
    let assumeTitle: IRect = SurveyHelper.createRect(leftTopPoint, 0, 0);
    if (titleQuestion != null) {
        assumeTitle = await SurveyHelper.createTitleFlat(leftTopPoint, titleQuestion, controller);
    }
    let assumeCheckbox: IRect = SurveyHelper.createRect(
        SurveyHelper.createPoint(assumeTitle),
        controller.measureText().height, controller.measureText().height);
    let assumeChecktext: IRect = await SurveyHelper.createTextFlat(
        SurveyHelper.createPoint(assumeCheckbox, false, true),
        null, controller, checktext, TextBrick);
    TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeCheckbox, assumeChecktext));
    return SurveyHelper.createPoint(assumeCheckbox);
}

test('Calc textbox boundaries title top', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title top'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Calc textbox boundaries title bottom', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title bottom',
                titleLocation: 'bottom'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    await calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0]);
});
test('Calc textbox boundaries title left', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox left bound',
                title: 'Title',
                titleLocation: 'left'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0][0].unfold()[0], flats[0][0].unfold()[1]);
});
test('Calc textbox boundaries title hidden', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title hidden',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        survey.controller.leftTopPoint, survey.controller);
    TestHelper.equalRect(expect, flats[0][0], assumeTextbox);
});

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
        TestHelper.equalPoint(expect, SurveyHelper.createPoint(resultRects[0][0].unfold()[1]), resultRects[0][1]);
    } else {
        TestHelper.equalPoint(expect, SurveyHelper.createPoint(resultRects[0][0]), resultRects[0][1]);
    }
}

test('Comment point after choice, title location: ' + 'top', async () => {
    commentPointAfterItem('top');
})
test('Comment point after choice, title location: ' + 'bottom', async () => {
    commentPointAfterItem('bottom');
})
test('Comment point after choice, title location: ' + 'hidden', async () => {
    commentPointAfterItem('hidden');
})
test('Comment point after choice, title location: ' + 'left', async () => {
    commentPointAfterItem('left');
})

test('Calc boundaries with space between questions', async () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox1',
            title: 'What have we here?'
        },
        {
            type: 'text',
            name: 'textbox2',
            title: 'Space between questions!'
        }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    let title2point: IPoint = await calcTitleTop(survey.controller.leftTopPoint,
        survey.controller, <Question>survey.getAllQuestions()[0], flats[0][0]);
    title2point.yTop += survey.controller.measureText().height;
    expect(flats[0][1] instanceof RowlineBrick).toBe(true);
    await calcTitleTop(title2point, survey.controller,
        <Question>survey.getAllQuestions()[1], flats[0][2]);
});
test('Calc textbox boundaries title without number', async () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'I do not need a number'
        }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.showQuestionNumbers = 'off';
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Calc textbox boundaries required', async () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'Please enter your name:',
            isRequired: true
        }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check that checkbox has square boundaries', async () => {
    let json = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                titleLocation: 'hidden',
                title: 'Square Pants',
                choices: [
                    'S'
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    await survey.render();
    let assumeCheckbox: IRect = SurveyHelper.createRect(
        TestHelper.defaultPoint,
        survey.controller.measureText().height, survey.controller.measureText().height);
    let acroFormFields = survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    let internalRect = acroFormFields[0].Rect;
    TestHelper.equalRect(expect, SurveyHelper.createRect(
        { xLeft: internalRect[0], yTop: internalRect[1] },
        internalRect[2], internalRect[3]), assumeCheckbox);
});
test('Check other checkbox place ', async () => {
    let json = {
        questions: [
            {
                titleLocation: 'hidden',
                name: 'checkbox',
                type: 'checkbox',
                hasOther: true,
                otherText: 'Other(describe)'
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    options.format = [40.0, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedRects: IRect[] = flats[0][0].unfold();
    let currPoint = TestHelper.defaultPoint;
    let itemWidth: number = survey.controller.measureText().width;
    let assumeRects: IRect[] = [];
    let itemRect: IRect = SurveyHelper.createRect(currPoint, itemWidth, itemWidth);
    assumeRects.push(itemRect);
    currPoint = SurveyHelper.createPoint(itemRect, false, true);
    let textRect =
        (await SurveyHelper.createTextFlat(currPoint, survey.getAllQuestions()[0], survey.controller, json.questions[0].otherText, TextBrick)).unfold();
    currPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(itemRect, ...textRect));
    assumeRects.push(...textRect);
    let textFieldRect = SurveyHelper.createTextFieldRect(currPoint, survey.controller, 2);
    assumeRects.push(textFieldRect);
    TestHelper.equalRects(expect, receivedRects, assumeRects);
});
test('Calc boundaries title top longer than description', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'My title is so interesting',
                description: 'But the description is not enough'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0], true);
});
test('Calc boundaries title top shorter than description', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Tiny title',
                description: 'The description is so long, very long, very'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0], true);
});
test('Calc boundaries title bottom longer than description', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'What a gorgeous title',
                titleLocation: 'bottom',
                description: 'Who reads the descriptions?'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    await calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0], true);
});
test('Calc boundaries title bottom shorter than description', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Piece of title',
                titleLocation: 'bottom',
                description: 'Very important information: required to read'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    await calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0], true);
});
test('Calc boundaries title left longer than description', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Pain',
                titleLocation: 'left',
                description: 'pan'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        new CompositeBrick(flats[0][0].unfold()[0], flats[0][0].unfold()[1]),
        flats[0][0].unfold()[2], true);
});
test('Calc boundaries title left shorter than description', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'A',
                titleLocation: 'left',
                description: 'Major Pain'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        new CompositeBrick(flats[0][0].unfold()[0], flats[0][0].unfold()[1]),
        flats[0][0].unfold()[2], true);
});
test('Calc boundaries title hidden with description', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Ninja',
                titleLocation: 'hidden',
                description: 'Under cover of night'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        survey.controller.leftTopPoint, survey.controller);
    TestHelper.equalRect(expect, flats[0][0], assumeTextbox);
});
test('Calc boundaries with indent', async () => {
    for (let i: number = 0; i < 10; i++) {
        let json = {
            questions: [
                {
                    type: 'checkbox',
                    name: 'box',
                    title: 'I stand straight',
                    indent: i,
                    choices: [
                        'Right choice'
                    ]
                }
            ]
        };
        let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
        let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
        expect(flats.length).toBe(1);
        expect(flats[0].length).toBe(1);
        let leftTopPoint: IPoint = survey.controller.leftTopPoint;
        leftTopPoint.xLeft += survey.controller.measureText(i).width;
        calcIndent(expect, leftTopPoint, survey.controller,
            flats[0][0], json.questions[0].choices[0],
            <Question>survey.getAllQuestions()[0]);
    }
});
test('Not visible question and visible question', async () => {
    let json = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                visible: false
            },
            {
                type: 'checkbox',
                name: 'box',
                visible: true
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let rects: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let assumeRect = [];
    assumeRect[0] = await SurveyHelper.createTitleFlat(TestHelper.defaultPoint,
        <Question>survey.getAllQuestions()[1], survey.controller);
    TestHelper.equalRects(expect, rects[0], assumeRect)
});
test('VisibleIf row', async () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'Look at visible me'
            },
            {
                type: 'text',
                name: 'Please! Don\'t look!',
                visibleIf: 'false'
            },
            {
                type: 'text',
                name: 'I\'m here'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
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

    let assumeComment: IRect = SurveyHelper.createTextFieldRect(
        survey.controller.leftTopPoint, survey.controller,
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
    let assumeText: IRect = await SurveyHelper.createTextFlat(survey.controller.leftTopPoint, survey.getAllQuestions()[0], survey.controller, json.questions[0].commentText, TextBrick);
    let assumeTextField: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeText), survey.controller, 2);
    TestHelper.equalRect(expect, flats[0][0].unfold()[0].unfold()[0], assumeText);
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeTextField);
});
test('Check two pages start point', async () => {
    let json = {
        pages: [
            {
                name: 'First Page',
                elements: [
                    {
                        type: 'text',
                        name: 'Enter me'
                    }
                ]
            },
            {
                name: 'Second Page',
                elements: [
                    {
                        type: 'text',
                        name: 'Not, me'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    expect(flats[0].length).toBe(1);
    expect(flats[1].length).toBe(1);
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(
        flats[0][0], true, true), survey.controller.leftTopPoint);
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(
        flats[1][0], true, true), survey.controller.leftTopPoint);
});
test('Check panel wihtout title', async () => {
    let json = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check panel with title', async () => {
    let json = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                title: 'Panel Title',
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        survey.controller.leftTopPoint, null, survey.controller, json.elements[0].title);
    TestHelper.equalRect(expect, flats[0][0], panelTitleFlat);
    await calcTitleTop(SurveyHelper.createPoint(panelTitleFlat), survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][1]);
});
test('Check panel with title and description', async () => {
    let json = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                title: 'Panel Title',
                description: 'Panel description',
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        survey.controller.leftTopPoint, null, survey.controller, json.elements[0].title);
    let panelDescFlat: IPdfBrick = await SurveyHelper.createDescFlat(
        SurveyHelper.createPoint(panelTitleFlat), null, survey.controller, json.elements[0].description);
    TestHelper.equalRect(expect, flats[0][0], SurveyHelper.mergeRects(panelTitleFlat, panelDescFlat));
    await calcTitleTop(SurveyHelper.createPoint(SurveyHelper.mergeRects(panelTitleFlat, panelDescFlat)), survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][1]);
});
test('Check panel with inner indent', async () => {
    let json = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                innerIndent: 3,
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let panelContentPoint: IPoint = survey.controller.leftTopPoint;
    panelContentPoint.xLeft += survey.controller.measureText(json.elements[0].innerIndent).width;
    calcTitleTop(panelContentPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check question title location in panel', async () => {
    let json = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                questionTitleLocation: 'bottom',
                elements: [
                    {
                        type: 'text',
                        name: 'At the very bottom'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    expect(flats[0][0] instanceof TextBoxBrick).toBe(true);
    expect(flats[0][1].unfold()[0] instanceof TitleBrick).toBe(true);
});
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
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + survey.controller.measureText().height +
            survey.controller.measureText(json.elements[0].title).width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height
    })
});
test('Check boolean with title', async () => {
    let json = {
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
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height * 2
    })
});
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check dropdown with other', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let otherPoint: IPoint = await calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], TestHelper.wrapRect(SurveyHelper.mergeRects(
            flats[0][0].unfold()[0], flats[0][0].unfold()[1])));
    TestHelper.equalRect(expect, flats[0][0].unfold()[2], SurveyHelper.createOtherFlat(
        otherPoint, survey.getAllQuestions()[0], survey.controller));
});
test('Check rating two elements', async () => {
    let json = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getRatingMinWidth(survey.controller) * 2,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.measureText().height * SurveyHelper.RATING_MIN_HEIGHT
    };
    TestHelper.equalRect(expect, flats[0][0], assumeRating);
});
test('Check rating two elements with min rate description', async () => {
    let json = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2,
                minRateDescription: 'I\'m sooooooo little'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let question: QuestionRatingModel = <QuestionRatingModel>survey.getAllQuestions()[0];
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getRatingMinWidth(survey.controller) + survey.controller.measureText(
                SurveyHelper.getRatingItemText(question, 0, question.visibleRateValues[0].locText),
                'bold').width + survey.controller.measureText().height,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.measureText().height * SurveyHelper.RATING_MIN_HEIGHT
    };
    TestHelper.equalRect(expect, flats[0][0], assumeRating);
});
test('Check rating two elements with max rate description', async () => {
    let json = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2,
                maxRateDescription: 'High rate !'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let question: QuestionRatingModel = <QuestionRatingModel>survey.getAllQuestions()[0];
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getRatingMinWidth(survey.controller) + survey.controller.measureText(
                SurveyHelper.getRatingItemText(question, 1,
                    question.visibleRateValues[0].locText), 'bold').width +
            survey.controller.measureText().height,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.measureText().height * SurveyHelper.RATING_MIN_HEIGHT
    };
    TestHelper.equalRect(expect, flats[0][0], assumeRating);
});
test('Check rating many elements', async () => {
    let json = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 6
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    options.format = [options.margins.left + options.margins.right +
        SurveyHelper.getRatingMinWidth(new SurveyPDF(json, options).controller) * 3 / DocController.MM_TO_PT, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.measureText().height * SurveyHelper.RATING_MIN_HEIGHT * 2
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeRating);
});
test('Check rating two elements with long min rate description', async () => {
    let json = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2,
                minRateDescription: '123456789'
            }
        ]
    };
    let longRateDesc: number = (new DocController(TestHelper.defaultOptions).measureText(
        json.elements[0].minRateDescription + ' 1', 'bold').width +
        new DocController(TestHelper.defaultOptions).measureText().height) / DocController.MM_TO_PT;
    let options: IDocOptions = TestHelper.defaultOptions;
    options.format = [options.margins.left +
        options.margins.right + longRateDesc, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.measureText().height * SurveyHelper.RATING_MIN_HEIGHT * 2
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeRating);
});
test('Check multiple text one item', async () => {
    let json = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi one item',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'Input me'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeMultipleText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeMultipleText);
    let assumeText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            survey.controller.measureText(json.elements[0].items[0].name, 'bold').width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height
    }
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], assumeText);
    let assumeBox: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) * SurveyHelper.MULTIPLETEXT_TEXT_PERS,
        xRight: assumeMultipleText.xRight,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height
    }
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeBox);
});
test('Check multiple text two items', async () => {
    let json = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'Input me'
                    },
                    {
                        name: 'Oh eee'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeMultipleText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height * 2
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMultipleText);
});
test('Check multiple text with colCount and long text', async () => {
    let sign: string = '|';
    let json = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi',
                titleLocation: 'hidden',
                colCount: 2,
                items: [
                    {
                        name: sign
                    },
                    {
                        name: sign + sign
                    },
                    {
                        name: sign
                    }
                ]
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let signWidth: number = new SurveyPDF(json, TestHelper.defaultOptions).
        controller.measureText(sign, 'bold').width / DocController.MM_TO_PT;
    options.format = [options.margins.left + options.margins.right +
        2.5 * signWidth / SurveyHelper.MULTIPLETEXT_TEXT_PERS, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeMultipleText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height * 3
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMultipleText);
});

test('Check imagepicker one image 100x100px', async () => {
    let json = {
        elements: [
            {
                type: 'imagepicker',
                name: 'imaque',
                titleLocation: 'hidden',
                choices: [
                    {
                        value: 'fox',
                        imageLink: 'data:image/png;base64,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'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let width: number = SurveyHelper.getImagePickerAvailableWidth(
        survey.controller) / SurveyHelper.IMAGEPICKER_COUNT;
    let height: number = width / SurveyHelper.IMAGEPICKER_RATIO;
    let assumeimagePicker: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + height + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeimagePicker);
});
test('Check imagepicker one image 100x100px with label', async () => {
    let json = {
        elements: [
            {
                type: 'imagepicker',
                name: 'imaque',
                titleLocation: 'hidden',
                showLabel: true,
                choices: [
                    {
                        value: 'fox',
                        imageLink: 'data:image/png;base64,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'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let width: number = SurveyHelper.getImagePickerAvailableWidth(
        survey.controller) / SurveyHelper.IMAGEPICKER_COUNT;
    let height: number = width / SurveyHelper.IMAGEPICKER_RATIO;
    let assumeimagePicker: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + height + 2.0 * survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeimagePicker);
});
test('Check imagepicker two images 100x100px', async () => {
    let json = {
        elements: [
            {
                type: 'imagepicker',
                name: 'imaque',
                titleLocation: 'hidden',
                choices: [
                    {
                        value: 'fox',
                        imageLink: 'data:image/png;base64,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'
                    },
                    {
                        value: 'pasta',
                        imageLink: 'data:image/jpeg;base64,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'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let width: number = SurveyHelper.getImagePickerAvailableWidth(
        survey.controller) / SurveyHelper.IMAGEPICKER_COUNT;
    let height: number = width / SurveyHelper.IMAGEPICKER_RATIO;
    let assumeimagePicker: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + 2.0 * width + survey.controller.measureText().height,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + height + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeimagePicker);
});
test('Check no files', async () => {
    let json = {
        elements: [
            {
                type: 'file',
                name: 'faque',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeFile: IRect = await SurveyHelper.createTextFlat(survey.controller.leftTopPoint,
        <Question>survey.getAllQuestions()[0], survey.controller, 'No file chosen', TextBrick);
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test('Check one text file', async () => {
    let json = {
        elements: [
            {
                type: 'file',
                name: 'faque',
                titleLocation: 'hidden',
                defaultValue: [
                    {
                        name: 'text.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,aGVsbG8='
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeFile: IRect = await SurveyHelper.createLinkFlat(survey.controller.leftTopPoint,
        <Question>survey.getAllQuestions()[0], survey.controller,
        json.elements[0].defaultValue[0].name, json.elements[0].defaultValue[0].content);
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test('Check two text files', async () => {
    let json = {
        elements: [
            {
                type: 'file',
                name: 'faque',
                titleLocation: 'hidden',
                allowMultiple: true,
                defaultValue: [
                    {
                        name: 'text.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,aGVsbG8='
                    },
                    {
                        name: 'letter.txt',
                        type: 'text/plain',
                        content: 'data:text/plain;base64,dG8gaG9tZQ=='
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let firstFileFlat: IRect = await SurveyHelper.createLinkFlat(survey.controller.leftTopPoint,
        <Question>survey.getAllQuestions()[0], survey.controller,
        json.elements[0].defaultValue[0].name, json.elements[0].defaultValue[0].content);
    let secondFilePoint: IPoint = SurveyHelper.createPoint(firstFileFlat, false, true);
    secondFilePoint.xLeft += survey.controller.measureText().width;
    let secondFileFlat: IRect = await SurveyHelper.createLinkFlat(secondFilePoint,
        <Question>survey.getAllQuestions()[0], survey.controller,
        json.elements[0].defaultValue[1].name, json.elements[0].defaultValue[1].content);
    let assumeFile: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: secondFileFlat.xRight,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: Math.max(firstFileFlat.yBot, secondFileFlat.yBot)
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test('Check one image 16x16px file', async () => {
    let json = {
        elements: [
            {
                type: 'file',
                name: 'faque',
                titleLocation: 'hidden',
                allowImagesPreview: true,
                defaultValue: [
                    {
                        name: 'cat.png',
                        type: 'image/png',
                        content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAt1BMVEVHcExTXGROYmJIT1ZPXmVJV11ES1JYZ24+SE5JU1s+R0xVYmtYZW1ETlRRXWVUYWpKV1xZZ25YZW5YanNrfIdTYWlaZ29nd4JUYmhIU1lHUVtRXWQ+SlA6QkouNzpFT1ZCS1JSXWVxhI98kp53iZZSXmVcaXE5QkdCTFNndn9WY2tZZm5canJfbXVbZ29hcHlXZGxtfYVNWmFRXWVCTFNKVl04QEdoeINnZGxrc3uAk6Fzb3dxg43scHiMAAAAKnRSTlMALwQXZU4MImyJQbCrPOPZRdOHx4X4t2fR0SfsoHhYseyioqbHwOy+59gMe1UiAAAAuElEQVQYlU2P5xKCQAyEI1gABVSKUu3tOgL2938u74Ybx/2xk3yT2SQAPw2Yb8KfRp6VzAxVDDVwYej1ZbHbG9tQTy030sJP+1po4MfSZs+qsrp+KubSg8e7Wq8mk/E44LinwqJr22IskCA4UgBiUqueUUqJ2gLzO0MCC8Ypx1MFXEIEqhFGjB/0zTXNbPvcXOkx7YjFbYDydsq7DIAeKyS9mSYadGBR51A0JVwy/dcyScFxwLAdgC+IFhIbrHyDqAAAAABJRU5ErkJggg=='
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let width: number = SurveyHelper.getImagePickerAvailableWidth(
        survey.controller) / SurveyHelper.IMAGEPICKER_COUNT;
    let height: number = width / SurveyHelper.IMAGEPICKER_RATIO;
    let assumeFile: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + height + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeFile);
});
test('Check expression', async () => {
    let json = {
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
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeExpression: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + survey.controller.measureText(
            (<QuestionExpressionModel>survey.getAllQuestions()[0]).displayValue).width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeExpression);
});
test('Check matrix multiple one column no rows', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'matri drop',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let size: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0 + size.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + size.height
    };
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], assumeMatrix);
});
test('Check matrix multiple one column one row', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'simplimat',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    }
                ],
                rows: [
                    'Arrow'
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let unfoldHeaderFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldHeaderFlats.length).toBe(2);
    let unfoldRowFlats: IPdfBrick[] = flats[0][1].unfold();
    expect(unfoldRowFlats.length).toBe(2);
    let header: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height +
            SurveyHelper.EPSILON + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMatrix);
    let assumeHeader: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0 + header.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, unfoldHeaderFlats[0], assumeHeader);
    let rowText: ISize = survey.controller.measureText(json.elements[0].rows[0]);
    let assumeRowText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + rowText.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + rowText.height
    };
    TestHelper.equalRect(expect, unfoldRowFlats[0], assumeRowText);
    let assumeRowQuestion: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRowText.yTop,
        yBot: assumeRowText.yTop + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, unfoldRowFlats[1], assumeRowQuestion);
});
test.skip('Check matrix multiple two columns one row vertical layout', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'vermat',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    },
                    {
                        name: 'Second choice'
                    }
                ],
                columnLayout: 'vertical',
                rows: [
                    'Cap'
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(7);
    let header: ISize = survey.controller.measureText(json.elements[0].rows[0], 'bold');
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height +
            + 2.0 * (survey.controller.measureText().height + SurveyHelper.EPSILON)
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
    let assumeHeader: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) / 2.0 + header.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeHeader);
    let row1Text: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeRow1Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row1Text.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + row1Text.height
    };
    TestHelper.equalRect(expect, flats[0][2], assumeRow1Text);
    let assumeRow1Question: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRow1Text.yTop,
        yBot: assumeRow1Text.yTop + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, flats[0][3], assumeRow1Question);
    let row2Text: ISize = survey.controller.measureText(json.elements[0].columns[1].name, 'bold');
    let assumeRow2Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row2Text.width,
        yTop: assumeRow1Question.yBot + SurveyHelper.EPSILON,
        yBot: assumeRow1Question.yBot + SurveyHelper.EPSILON + row2Text.height
    };
    TestHelper.equalRect(expect, flats[0][5], assumeRow2Text);
    let assumeRow2Question: IRect = {
        xLeft: assumeHeader.xLeft,
        xRight: assumeMatrix.xRight,
        yTop: assumeRow2Text.yTop,
        yBot: assumeRow2Text.yTop + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, flats[0][6], assumeRow2Question);
});
test.skip('Check matrix multiple two columns one row horizontal layout narrow width', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'horonelinemat',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    },
                    {
                        name: 'Second choice'
                    }
                ],
                rows: [
                    'Cap'
                ]
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let pageWidth: number = options.margins.left + options.margins.right +
        new DocController(options).measureText(SurveyHelper.MATRIX_COLUMN_WIDTH - 1).width;
    options.format = [pageWidth, <number>(options.format[1])];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(7);
    let header: ISize = survey.controller.measureText(json.elements[0].rows[0]);
    let assumeHeader: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + header.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeHeader);
    let row1Text: ISize = survey.controller.measureText(json.elements[0].columns[0].name);
    let assumeRow1Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row1Text.width,
        yTop: assumeHeader.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader.yBot + SurveyHelper.EPSILON + row1Text.height
    };
    TestHelper.equalRect(expect, flats[0][2], assumeRow1Text);
    let assumeRow1Question: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeRow1Text.yBot,
        yBot: assumeRow1Text.yBot + survey.controller.measureText().height  
    };
    TestHelper.equalRect(expect, flats[0][3], assumeRow1Question);
    let row2Text: ISize = survey.controller.measureText(json.elements[0].columns[1].name);
    let assumeRow2Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row2Text.width,
        yTop: assumeRow1Question.yBot + SurveyHelper.EPSILON,
        yBot: assumeRow1Question.yBot + SurveyHelper.EPSILON + row2Text.height
    };
    TestHelper.equalRect(expect, flats[0][5], assumeRow2Text);
    let assumeRow2Question: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeRow2Text.yBot,
        yBot: assumeRow2Text.yBot + survey.controller.measureText().height  
    };
    TestHelper.equalRect(expect, flats[0][6], assumeRow2Question);
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header.height + row1Text.height +
            row2Text.height + 2.0 * (survey.controller.measureText().height + SurveyHelper.EPSILON)
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test.skip('Check matrix multiple two columns one row vertical layout narrow width', async () => {
    let json = {
        elements: [
            {
                type: 'matrixdropdown',
                name: 'horonelinemat',
                titleLocation: 'hidden',
                columns: [
                    {
                        name: 'First power'
                    },
                    {
                        name: 'Second choice'
                    }
                ],
                columnLayout: 'vertical',
                rows: [
                    'Cap'
                ]
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let pageWidth: number = options.margins.left + options.margins.right +
        new DocController(options).measureText(SurveyHelper.MATRIX_COLUMN_WIDTH - 1).width;
    options.format = [pageWidth, <number>(options.format[1])];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(9);
    let header1: ISize = survey.controller.measureText(json.elements[0].columns[0].name, 'bold');
    let assumeHeader1: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + header1.width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header1.height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeHeader1);
    let row1Text: ISize = survey.controller.measureText(json.elements[0].columns[0].name);
    let assumeRow1Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row1Text.width,
        yTop: assumeHeader1.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader1.yBot + SurveyHelper.EPSILON + row1Text.height
    };
    TestHelper.equalRect(expect, flats[0][2], assumeRow1Text);
    let assumeRow1Question: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeRow1Text.yBot,
        yBot: assumeRow1Text.yBot + survey.controller.measureText().height  
    };
    TestHelper.equalRect(expect, flats[0][3], assumeRow1Question);
    let header2: ISize = survey.controller.measureText(json.elements[0].columns[1].name, 'bold');
    let assumeHeader2: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + header2.width,
        yTop: assumeRow1Question.yBot + SurveyHelper.EPSILON,
        yBot: assumeRow1Question.yBot + SurveyHelper.EPSILON + header2.height
    };
    let row2Text: ISize = survey.controller.measureText(json.elements[0].columns[1].name);
    TestHelper.equalRect(expect, flats[0][5], assumeHeader2);
    let assumeRow2Text: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + row2Text.width,
        yTop: assumeHeader2.yBot + SurveyHelper.EPSILON,
        yBot: assumeHeader2.yBot + SurveyHelper.EPSILON + row2Text.height
    };
    TestHelper.equalRect(expect, flats[0][7], assumeRow2Text);
    let assumeRow2Question: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: assumeRow2Text.yBot,
        yBot: assumeRow2Text.yBot + survey.controller.measureText().height  
    };
    TestHelper.equalRect(expect, flats[0][8], assumeRow2Question);
    let assumeMatrix: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + header1.height + row1Text.height + header2.height +
            row2Text.height + 3.0 * (survey.controller.measureText().height + SurveyHelper.EPSILON)
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(...flats[0]), assumeMatrix);
});
test('Check checkbox with colCount 4 with small font size 12', async () => {
    let json = {
        questions: [
            {
                titleLocation: "hidden",
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4', 'item5'],
                colCount: 4
            }
        ]
    };
    let options = TestHelper.defaultOptions;
    options.fontSize = 12;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedFlats: IRect[] = [];;
    receivedFlats.push(...flats[0][0].unfold(), ...flats[0][1].unfold());
    let itemHeight = survey.controller.measureText(1).height;
    let assumetFlats: IRect[] = [];
    let currPoint = TestHelper.defaultPoint;
    for (let i = 0; i < 4; i++) {
        let itemRect = SurveyHelper.createRect(currPoint, itemHeight, itemHeight);
        let text = survey.controller.measureText(json.questions[0].choices[i]);
        let textRect = SurveyHelper.createRect(SurveyHelper.createPoint(itemRect, false, true), text.width, text.height)
        assumetFlats.push(itemRect, textRect);
        currPoint.xLeft += SurveyHelper.getColumnWidth(survey.controller, 4);
    }
    currPoint = TestHelper.defaultPoint;
    currPoint.yTop += itemHeight;
    let rowLineRect = SurveyHelper.createRowlineFlat(currPoint, survey.controller);
    currPoint.yTop = rowLineRect.yBot;
    let itemRect = SurveyHelper.createRect(currPoint, itemHeight, itemHeight);
    let text = survey.controller.measureText(json.questions[0].choices[5]);
    let textRect = SurveyHelper.createRect(SurveyHelper.createPoint(itemRect, false, true), text.width, text.height)
    assumetFlats.push(rowLineRect, itemRect, textRect);
    TestHelper.equalRects(expect, receivedFlats, assumetFlats);
});

test('Check checkbox with colCount 4 with big font size 30', async () => {
    let json = {
        questions: [
            {
                titleLocation: "hidden",
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4', 'item5'],
                colCount: 4
            }
        ]
    };
    let options = TestHelper.defaultOptions;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedFlats: IRect[] = [];;
    for (let i = 0; i < 5; i++) {
        receivedFlats.push(...flats[0][i].unfold());
    }
    let itemHeight = survey.controller.measureText(1).height;
    let assumetFlats: IRect[] = [];
    let currPoint = TestHelper.defaultPoint;
    for (let i = 0; i < 5; i++) {
        let itemRect = SurveyHelper.createRect(currPoint, itemHeight, itemHeight);
        let text = survey.controller.measureText(json.questions[0].choices[i]);
        let textRect = SurveyHelper.createRect(SurveyHelper.createPoint(itemRect, false, true), text.width, text.height)
        assumetFlats.push(itemRect, textRect);
        currPoint.yTop = itemRect.yBot;
    }
    TestHelper.equalRects(expect, receivedFlats, assumetFlats);
});
test('Check checkbox with colCount 0 with big font size 30', async () => {
    let json = {
        questions: [
            {
                titleLocation: "hidden",
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4'],
                colCount: 0
            }
        ]
    };
    let options = TestHelper.defaultOptions;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedFlats: IRect[] = [];;
    receivedFlats.push(...flats[0][0].unfold(), ...flats[0][1].unfold());
    let itemHeight = survey.controller.measureText(1).height;
    let assumetFlats: IRect[] = [];
    let currPoint = TestHelper.defaultPoint;
    for (let i = 0; i < 3; i++) {
        let itemRect = SurveyHelper.createRect(currPoint, itemHeight, itemHeight);
        let text = survey.controller.measureText(json.questions[0].choices[i]);
        let textRect = SurveyHelper.createRect(SurveyHelper.createPoint(itemRect, false, true), text.width, text.height)
        assumetFlats.push(itemRect, textRect);
        currPoint.xLeft += SurveyHelper.getColumnWidth(survey.controller, 3);
    }
    currPoint = TestHelper.defaultPoint;
    currPoint.yTop += itemHeight;
    let rowLineRect = SurveyHelper.createRowlineFlat(currPoint, survey.controller);
    currPoint.yTop = rowLineRect.yBot;
    let itemRect = SurveyHelper.createRect(currPoint, itemHeight, itemHeight);
    let text = survey.controller.measureText(json.questions[0].choices[4]);
    let textRect = SurveyHelper.createRect(SurveyHelper.createPoint(itemRect, false, true), text.width, text.height)
    assumetFlats.push(rowLineRect, itemRect, textRect);
    TestHelper.equalRects(expect, receivedFlats, assumetFlats);
});
test('Check checkbox with colCount 0 with small font size 12', async () => {
    let json = {
        questions: [
            {
                titleLocation: "hidden",
                name: 'checkbox',
                type: 'checkbox',
                choices: ['item1', 'item2', 'item3', 'item4'],
                colCount: 0
            }
        ]
    };
    let options = TestHelper.defaultOptions;
    options.fontSize = 12;
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    let receivedFlats: IRect[] = [];;
    receivedFlats.push(...flats[0][0].unfold());
    let itemHeight = survey.controller.measureText(1).height;
    let assumetFlats: IRect[] = [];
    let currPoint = TestHelper.defaultPoint;
    for (let i = 0; i < 4; i++) {
        let itemRect = SurveyHelper.createRect(currPoint, itemHeight, itemHeight);
        let text = survey.controller.measureText(json.questions[0].choices[i]);
        let textRect = SurveyHelper.createRect(SurveyHelper.createPoint(itemRect, false, true), text.width, text.height)
        assumetFlats.push(itemRect, textRect);
        currPoint.xLeft += SurveyHelper.getColumnWidth(survey.controller, 4);
    }
    TestHelper.equalRects(expect, receivedFlats, assumetFlats);
});