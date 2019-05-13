(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { Question, QuestionCommentModel, QuestionRatingModel } from 'survey-core';
import { PdfSurvey } from '../src/survey';
import { IPoint, IRect, DocController, IDocOptions } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatComment } from '../src/flat_layout/flat_comment';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { FlatDropdown } from '../src/flat_layout/flat_dropdown';
import { FlatRating } from '../src/entries/pdf';
import { FlatBoolean } from '../src/flat_layout/flat_boolean';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { TitleBrick } from '../src/pdf_render/pdf_title';
import { TextFieldBrick } from '../src/pdf_render/pdf_textfield';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);
let __dummy_dd = new FlatDropdown(null, null);
let __dummy_cm = new FlatComment(null, null);
let __dummy_rt = new FlatRating(null, null);
let __dummy_bl = new FlatBoolean(null, null);
SurveyHelper.setFontSize(TestHelper.defaultOptions.fontSize);

function calcTitleTop(leftTopPoint: IPoint, controller: DocController,
    titleQuestion: Question, compositeFlat: IPdfBrick, isDesc: boolean = false): IPoint {
    let assumeTitle: IRect = SurveyHelper.createTitleFlat(
        leftTopPoint, titleQuestion, controller);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle), controller);
    if (isDesc) {
        let assumeDesc: IRect = SurveyHelper.createDescFlat(
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
function calcTitleBottom(controller: DocController, titleQuestion: Question,
    compositeFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
    let assumeTitle: IRect = SurveyHelper.createTitleFlat(
        SurveyHelper.createPoint(assumeTextbox), titleQuestion, controller);
    if (isDesc) {
        let assumeDesc: IRect = SurveyHelper.createDescFlat(
            SurveyHelper.createPoint(assumeTitle), null,
            controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeDesc));
    } else {
        TestHelper.equalRect(expect, compositeFlat, assumeTitle);
    }
}
function calcTitleLeft(controller: DocController, titleQuestion: Question,
    compositeFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    let assumeTitle: IRect = SurveyHelper.createTitleFlat(
        controller.leftTopPoint, titleQuestion, controller);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle, false, true), controller);
    if (isDesc) {
        let assumeDesc: IRect = SurveyHelper.createDescFlat(
            SurveyHelper.createPoint(assumeTitle), null,
            controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeDesc));
        assumeTextbox.xLeft = Math.max(assumeTextbox.xLeft, assumeDesc.xRight);
    }
    else {
        TestHelper.equalRect(expect, compositeFlat, assumeTitle);
    }
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
}
export function calcIndent(expect: any, leftTopPoint: IPoint, controller: DocController,
    compositeFlat: IPdfBrick, checktext: string, titleQuestion: Question = null) {
    let assumeTitle: IRect = SurveyHelper.createRect(leftTopPoint, 0, 0);
    if (titleQuestion != null) {
        assumeTitle = SurveyHelper.createTitleFlat(leftTopPoint, titleQuestion, controller);
    }
    let assumeCheckbox: IRect = SurveyHelper.createRect(
        SurveyHelper.createPoint(assumeTitle),
        SurveyHelper.measureText().height, SurveyHelper.measureText().height);
    let assumeChecktext: IRect = SurveyHelper.createTextFlat(
        SurveyHelper.createPoint(assumeCheckbox, false, true),
        null, controller, checktext, TextBrick);
    TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeCheckbox, assumeChecktext));
    return SurveyHelper.createPoint(assumeCheckbox);
}

test('Calc textbox boundaries title top', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title top'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Calc textbox boundaries title bottom', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0]);
});
test('Calc textbox boundaries title left', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title left',
                titleLocation: 'left'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0][0].unfold()[0], flats[0][0].unfold()[1]);
});
test('Calc textbox boundaries title hidden', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        survey.controller.leftTopPoint, survey.controller);
    TestHelper.equalRect(expect, flats[0][0], assumeTextbox);
});

function commentPointBeforeTitle(resultRects: IPdfBrick[][]) {
    let commentPoint = TestHelper.defaultPoint;
    let resultPoint = resultRects[0][0];
    TestHelper.equalPoint(expect, resultPoint, commentPoint);
    return commentPoint;
}
function commentPointAfterTitle(titleLocation: string, resultRects: IPdfBrick[][], controller: DocController, survey: PdfSurvey) {
    let commentAssumePoint: IPoint = SurveyHelper.createPoint(SurveyHelper.createTitleFlat(
        TestHelper.defaultPoint, <Question>survey.getAllQuestions()[0], controller),
        titleLocation === 'top', titleLocation !== 'top');
    let commentResultPoint: IPoint = resultRects[0][1];
    TestHelper.equalPoint(expect, commentResultPoint, commentAssumePoint);
    return commentAssumePoint;
}
function commmentPointToTitleTests() {
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
    ['left', 'top', 'bottom', 'hidden'].forEach((titleLocation) => {
        (<any>json).questions[0].titleLocation = titleLocation;
        let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
        let controller: DocController = survey.controller;
        let resultRects: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
        switch (titleLocation) {
            case 'hidden':
            case 'bottom': {
                test('Comment point, title location: ' + titleLocation, () => {
                    commentPointBeforeTitle(resultRects);
                });
                break;
            }
            case 'top':
            case 'left': {
                test('Comment point, title location: ' + titleLocation, () => {
                    commentPointAfterTitle(titleLocation, resultRects, controller, survey);
                });
                break;
            }
        }
    });
}
commmentPointToTitleTests();
function commentPointAfterItem() {
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
    ['bottom', 'hidden', 'top', 'left'].forEach((titleLocation) => {
        (<any>json).questions[0].titleLocation = titleLocation;
        let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
        let resultRects: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
        test('Comment point after choice, title location: ' + titleLocation, () => {
            expect(resultRects.length).toBe(1);
            if (titleLocation !== 'bottom') expect(resultRects[0].length).toBe(2);
            else expect(resultRects[0].length).toBe(3);
            if (titleLocation == 'top' || titleLocation == 'left') {
                TestHelper.equalPoint(expect, SurveyHelper.createPoint(resultRects[0][0].unfold()[1]), resultRects[0][1]);
            } else {
                TestHelper.equalPoint(expect, SurveyHelper.createPoint(resultRects[0][0]), resultRects[0][1]);
            }
        });
    })
}
commentPointAfterItem();
test('Calc boundaries with space between questions', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    let title2point: IPoint = calcTitleTop(survey.controller.leftTopPoint,
        survey.controller, <Question>survey.getAllQuestions()[0], flats[0][0]);
    title2point.yTop += SurveyHelper.measureText().height;
    expect(flats[0][1] instanceof RowlineBrick).toBe(true);
    calcTitleTop(title2point, survey.controller,
        <Question>survey.getAllQuestions()[1], flats[0][2]);
});
test('Calc textbox boundaries title without number', () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'I do not need a number'
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    survey.showQuestionNumbers = 'off';
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Calc textbox boundaries required', () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'Please enter your name:',
            isRequired: true
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check that checkbox has square boundaries', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    survey.render();
    let assumeCheckbox: IRect = SurveyHelper.createRect(
        TestHelper.defaultPoint,
        SurveyHelper.measureText().height, SurveyHelper.measureText().height);
    let acroFormFields = survey.controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    let internalRect = acroFormFields[0].Rect;
    TestHelper.equalRect(expect, SurveyHelper.createRect(
        { xLeft: internalRect[0], yTop: internalRect[1] },
        internalRect[2], internalRect[3]), assumeCheckbox);
});
test('Calc boundaries title top longer than description', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0], true);
});
test('Calc boundaries title top shorter than description', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0], true);
});
test('Calc boundaries title bottom longer than description', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0], true);
});
test('Calc boundaries title bottom shorter than description', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0], true);
});
test('Calc boundaries title left longer than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'I only wish that wisdom',
                titleLocation: 'left',
                description: 'Oh dear Pan'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        new CompositeBrick(flats[0][0].unfold()[0], flats[0][0].unfold()[1]),
        flats[0][0].unfold()[2], true);
});
test('Calc boundaries title left shorter than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Diamonds',
                titleLocation: 'left',
                description: 'Takes One To Know One'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        new CompositeBrick(flats[0][0].unfold()[0], flats[0][0].unfold()[1]),
        flats[0][0].unfold()[2], true);
});
test('Calc boundaries title hidden with description', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        survey.controller.leftTopPoint, survey.controller);
    TestHelper.equalRect(expect, flats[0][0], assumeTextbox);
});
test('Calc boundaries with indent', () => {
    for (let i = 0; i < 10; i++) {
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
        let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
        let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
        expect(flats.length).toBe(1);
        expect(flats[0].length).toBe(1);
        let leftTopPoint: IPoint = survey.controller.leftTopPoint;
        leftTopPoint.xLeft += SurveyHelper.measureText(i).width;
        calcIndent(expect, leftTopPoint, survey.controller,
            flats[0][0], json.questions[0].choices[0],
            <Question>survey.getAllQuestions()[0]);
    }
});
test('Not visible question and visible question', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let rects: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    let assumeRect = [];
    assumeRect[0] = SurveyHelper.createTitleFlat(TestHelper.defaultPoint,
        <Question>survey.getAllQuestions()[1], survey.controller);
    TestHelper.equalRects(expect, rects[0], assumeRect)
});
test('Calc comment boundaries title hidden', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);

    let assumeComment: IRect = SurveyHelper.createTextFieldRect(
        survey.controller.leftTopPoint, survey.controller,
        (<QuestionCommentModel>survey.getAllQuestions()[0]).rows);
    TestHelper.equalRect(expect, flats[0][0], assumeComment);
});
test('Calc question comment', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeText: IRect = SurveyHelper.createTextFlat(survey.controller.leftTopPoint, survey.getAllQuestions()[0], survey.controller, json.questions[0].commentText, TextBrick);
    let assumeTextField: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeText), survey.controller, 2);
    TestHelper.equalRect(expect, flats[0][0].unfold()[0].unfold()[0], assumeText);
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeTextField);
});
test('Check two pages start point', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    expect(flats[0].length).toBe(1);
    expect(flats[1].length).toBe(1);
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(
        flats[0][0], true, true), survey.controller.leftTopPoint);
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(
        flats[1][0], true, true), survey.controller.leftTopPoint);
});
test('Check panel wihtout title', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check panel with title', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let panelTitleFlat: IPdfBrick = SurveyHelper.createTitlePanelFlat(
        survey.controller.leftTopPoint, null, survey.controller, json.elements[0].title);
    TestHelper.equalRect(expect, flats[0][0], panelTitleFlat);
    calcTitleTop(SurveyHelper.createPoint(panelTitleFlat), survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][1]);
});
test('Check panel with title and description', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let panelTitleFlat: IPdfBrick = SurveyHelper.createTitlePanelFlat(
        survey.controller.leftTopPoint, null, survey.controller, json.elements[0].title);
    let panelDescFlat: IPdfBrick = SurveyHelper.createDescFlat(
        SurveyHelper.createPoint(panelTitleFlat), null, survey.controller, json.elements[0].description);
    TestHelper.equalRect(expect, flats[0][0], SurveyHelper.mergeRects(panelTitleFlat, panelDescFlat));
    calcTitleTop(SurveyHelper.createPoint(SurveyHelper.mergeRects(panelTitleFlat, panelDescFlat)), survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][1]);
});
test('Check panel with inner indent', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let panelContentPoint: IPoint = survey.controller.leftTopPoint;
    panelContentPoint.xLeft += SurveyHelper.measureText(json.elements[0].innerIndent).width;
    calcTitleTop(panelContentPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check question title location in panel', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    expect(flats[0][0] instanceof TextFieldBrick).toBe(true);
    expect(flats[0][1].unfold()[0] instanceof TitleBrick).toBe(true);
});
test('Check boolean without title', () => {
    let json = {
        elements: [
            {
                type: 'boolean',
                name: 'Boolman',
                title: 'Ama label'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    TestHelper.equalRect(expect, flats[0][0], {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft + SurveyHelper.measureText().height +
            SurveyHelper.measureText(json.elements[0].title).width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + SurveyHelper.measureText().height
    })
});
test('Check boolean with title', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    TestHelper.equalRect(expect, flats[0][0], {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: SurveyHelper.createTitleFlat(survey.controller.leftTopPoint,
            <Question>survey.getAllQuestions()[0], survey.controller).xRight,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + SurveyHelper.measureText().height * 2
    })
});
test('Check dropdown', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check dropdown with other', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let otherPoint: IPoint = calcTitleTop(survey.controller.leftTopPoint, survey.controller,
        <Question>survey.getAllQuestions()[0], TestHelper.wrapRect(SurveyHelper.mergeRects( 
            flats[0][0].unfold()[0], flats[0][0].unfold()[1])));
    TestHelper.equalRect(expect, flats[0][0].unfold()[2], SurveyHelper.createOtherFlat(
        otherPoint, null, survey.controller));
});
test('Check rating two elements', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getRatingMinWidth() * 2,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            SurveyHelper.measureText().height * SurveyHelper.RATING_MIN_HEIGHT
    };
    TestHelper.equalRect(expect, flats[0][0], assumeRating);
});
test('Check rating two elements with min rate description', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let question: QuestionRatingModel = <QuestionRatingModel>survey.getAllQuestions()[0];
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getRatingMinWidth() + SurveyHelper.measureText(
                SurveyHelper.getRatingItemText(question, 0,
                    question.rateMin.toString()), 'bold').width +
                SurveyHelper.measureText().height,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            SurveyHelper.measureText().height * SurveyHelper.RATING_MIN_HEIGHT
    };
    TestHelper.equalRect(expect, flats[0][0], assumeRating);
});
test('Check rating two elements with max rate description', () => {
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
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let question: QuestionRatingModel = <QuestionRatingModel>survey.getAllQuestions()[0];

    let a = SurveyHelper.getRatingMinWidth();
    let b = SurveyHelper.measureText(
        SurveyHelper.getRatingItemText(question, 1, question.rateMax.toString()), 'bold').width;

    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getRatingMinWidth() + SurveyHelper.measureText(
                SurveyHelper.getRatingItemText(question, 1,
                    question.rateMax.toString()), 'bold').width +
                SurveyHelper.measureText().height,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            SurveyHelper.measureText().height * SurveyHelper.RATING_MIN_HEIGHT
    };
    TestHelper.equalRect(expect, flats[0][0], assumeRating);
});
test('Check rating many elements', () => {
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
    options.paperWidth = options.margins.marginLeft + options.margins.marginRight +
        SurveyHelper.getRatingMinWidth() * 3;
    let survey: PdfSurvey = new PdfSurvey(json, options);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.marginRight,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            SurveyHelper.measureText().height * SurveyHelper.RATING_MIN_HEIGHT * 2
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeRating);
});
test('Check rating two elements with long min rate description', () => {
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
    let longRateDesc: number = SurveyHelper.measureText(
        json.elements[0].minRateDescription + ' 1', 'bold').width +
        SurveyHelper.measureText().height;
    let options: IDocOptions = TestHelper.defaultOptions;
    options.paperWidth = options.margins.marginLeft +
        options.margins.marginRight + longRateDesc;
    let survey: PdfSurvey = new PdfSurvey(json, options);
    let flats: IPdfBrick[][] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.marginRight,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            SurveyHelper.measureText().height * SurveyHelper.RATING_MIN_HEIGHT * 2
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeRating);
});