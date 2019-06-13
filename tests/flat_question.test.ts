(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatQuestion } from '../src/flat_layout/flat_question';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);

export async function calcTitleTop(leftTopPoint: IPoint, controller: DocController,
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
        assumeTextbox.yTop += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTextbox.yBot += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeDesc, assumeTextbox));
    }
    else {
        assumeTextbox.yTop += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTextbox.yBot += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeTextbox));
    }
    return SurveyHelper.createPoint(assumeTextbox);
}
async function calcTitleBottom(controller: DocController, titleQuestion: Question,
    titleFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    let assumeTitle: IRect = await SurveyHelper.createTitleFlat(
        SurveyHelper.createPoint(assumeTextbox), titleQuestion, controller);
    assumeTextbox.xLeft += controller.measureText().width;
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
    if (isDesc) {
        let assumeDesc: IRect = await SurveyHelper.createDescFlat(
            SurveyHelper.createPoint(assumeTitle), null,
            controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        assumeTitle.yTop += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTitle.yBot += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeDesc.yTop += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeDesc.yBot += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, titleFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeDesc));
    } else {
        assumeTitle.yTop += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTitle.yBot += controller.measureText().height *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, titleFlat, assumeTitle);
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
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeDesc));
        assumeTextbox.xLeft = Math.max(assumeTextbox.xLeft, assumeDesc.xRight);
    }
    else {
        TestHelper.equalRect(expect, compositeFlat, assumeTitle);
    }
    assumeTextbox.xLeft += controller.measureText().width *
        FlatQuestion.CONTENT_GAP_HOR_SCALE;
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
}
export async function calcIndent(expect: any, leftTopPoint: IPoint, controller: DocController,
    compositeFlat: IPdfBrick, checktext: string, titleQuestion: Question = null) {
    let assumeTitle: IRect = SurveyHelper.createRect(leftTopPoint, 0.0, 0.0);
    if (titleQuestion != null) {
        assumeTitle = await SurveyHelper.createTitleFlat(leftTopPoint, titleQuestion, controller);
    }
    let minHeight = controller.measureText().height;
    let assumeCheckbox: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(SurveyHelper.createRect(
        SurveyHelper.createPoint(assumeTitle), minHeight, minHeight), SurveyHelper.SELECT_ITEM_FLAT_SCALE));
    let textPoint = SurveyHelper.createPoint(assumeTitle);
    textPoint.xLeft = 2.0 * assumeCheckbox.xRight - assumeCheckbox.xLeft;
    let assumeChecktext: IRect = await SurveyHelper.createTextFlat(textPoint,
        null, controller, checktext, TextBrick);
    assumeCheckbox.yTop += controller.measureText().height *
        FlatQuestion.CONTENT_GAP_VERT_SCALE;
    assumeCheckbox.yBot += controller.measureText().height *
        FlatQuestion.CONTENT_GAP_VERT_SCALE;
    assumeChecktext.yTop += controller.measureText().height *
        FlatQuestion.CONTENT_GAP_VERT_SCALE;
    assumeChecktext.yBot += controller.measureText().height *
        FlatQuestion.CONTENT_GAP_VERT_SCALE;
    TestHelper.equalRect(expect, compositeFlat, SurveyHelper.mergeRects(assumeTitle, assumeCheckbox, assumeChecktext));
    let point = SurveyHelper.createPoint(assumeCheckbox);
    point.yTop += minHeight * SurveyHelper.GAP_BETWEEN_ROWS;
    return
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
    for (let i: number = 0; i < 9; i++) {
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
        await calcIndent(expect, leftTopPoint, survey.controller,
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