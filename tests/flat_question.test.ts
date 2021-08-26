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
import { DescriptionBrick } from '../src/pdf_render/pdf_description';
import { TextBoldBrick } from '../src/pdf_render/pdf_textbold';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
const __dummy_tx = new FlatTextbox(null, null, null);
const __dummy_cb = new FlatCheckbox(null, null, null);

export async function calcTitleTop(leftTopPoint: IPoint, controller: DocController,
    titleQuestion: Question, compositeFlat: IPdfBrick, isDesc: boolean = false): Promise<IPoint> {
    const assumeTitle: IRect = await SurveyHelper.createTitleFlat(leftTopPoint, titleQuestion, controller);
    let assumeDesc: IRect = assumeTitle;
    let rowLinePoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    let assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller); 
    let textboxPoint: IPoint = SurveyHelper.createPoint(assumeRowLine);
    textboxPoint.xLeft += controller.unitWidth; 
    textboxPoint.yTop += controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(textboxPoint, controller);
    if (isDesc) {
        const descPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
        descPoint.xLeft += controller.unitWidth;
        descPoint.yTop += FlatQuestion.DESC_GAP_SCALE * controller.unitHeight;  
        assumeDesc = await SurveyHelper.createDescFlat(descPoint, null, controller,
            SurveyHelper.getLocString(titleQuestion.locDescription));
        rowLinePoint = SurveyHelper.createPoint(assumeDesc);
        rowLinePoint.xLeft = controller.leftTopPoint.xLeft;  
        assumeRowLine = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
        textboxPoint = SurveyHelper.createPoint(assumeRowLine);
        textboxPoint.xLeft = assumeDesc.xLeft;
        textboxPoint.yTop += controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTextbox = SurveyHelper.createTextFieldRect(textboxPoint, controller);
    }
    const unfoldFlats: IPdfBrick[] = compositeFlat.unfold();
    const titleWithDescriptionFlats: IPdfBrick[] = unfoldFlats.slice(0, -2);
    const titleFlats: IPdfBrick[] = titleWithDescriptionFlats.filter(flat => flat instanceof TextBoldBrick)
    const actualTitle: IRect = SurveyHelper.mergeRects(...titleFlats);
    TestHelper.equalRect(expect, actualTitle, assumeTitle);    
    if (isDesc) {
        const descFlats: IPdfBrick[] = titleWithDescriptionFlats.filter(flat => flat instanceof DescriptionBrick);
        const actualDesc: IRect = SurveyHelper.mergeRects(...descFlats);
        TestHelper.equalRect(expect, actualDesc, assumeDesc);  
    }
    const actualRowLine: IRect = unfoldFlats[unfoldFlats.length - 2];
    TestHelper.equalRect(expect, actualRowLine, assumeRowLine);  
    const actualTextBox: IRect = unfoldFlats[unfoldFlats.length - 1];
    TestHelper.equalRect(expect, actualTextBox, assumeTextbox);
    return SurveyHelper.createPoint(SurveyHelper.mergeRects(assumeTitle, assumeDesc, assumeRowLine, assumeTextbox));
}
async function calcTitleBottom(controller: DocController, titleQuestion: Question,
    titleFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    const assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    const assumeTitle: IRect = await SurveyHelper.createTitleFlat(
        SurveyHelper.createPoint(assumeTextbox), titleQuestion, controller);
    assumeTextbox.xLeft += controller.unitWidth;
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
    if (isDesc) {
        const descPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
        descPoint.xLeft += controller.unitWidth;
        descPoint.yTop += controller.unitHeight * FlatQuestion.DESC_GAP_SCALE;
        const assumeDesc: IRect = await SurveyHelper.createDescFlat(
            descPoint, null, controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        assumeTitle.yTop += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTitle.yBot += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeDesc.yTop += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeDesc.yBot += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, titleFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeDesc));
    } else {
        assumeTitle.yTop += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTitle.yBot += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, titleFlat, assumeTitle);
    }
}
async function calcTitleLeft(controller: DocController, titleQuestion: Question,
    compositeFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    const oldRightMargins = controller.margins.right;
    controller.margins.right = controller.paperWidth - controller.margins.left -
        SurveyHelper.getPageAvailableWidth(controller)
        * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
    const assumeTitle: IRect = await SurveyHelper.createTitleFlat(
        controller.leftTopPoint, titleQuestion, controller);
    controller.margins.right = oldRightMargins;
    const assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle, false, true), controller);
    if (isDesc) {
        controller.margins.right = controller.paperWidth - controller.margins.left -
            SurveyHelper.getPageAvailableWidth(controller)
            * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
        const descPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
        descPoint.xLeft += controller.unitWidth;
        descPoint.yTop += controller.unitHeight * FlatQuestion.DESC_GAP_SCALE;
        const assumeDesc: IRect = await SurveyHelper.createDescFlat(
            descPoint, null, controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        controller.margins.right = oldRightMargins;
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeDesc));
        assumeTextbox.xLeft = Math.max(assumeTextbox.xLeft, assumeDesc.xRight);
    }
    else {
        TestHelper.equalRect(expect, compositeFlat, assumeTitle);
    }
    assumeTextbox.xLeft += controller.unitWidth *
        FlatQuestion.CONTENT_GAP_HOR_SCALE;
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
}
export async function calcIndent(expect: any, leftTopPoint: IPoint, controller: DocController,
    compositeFlat: IPdfBrick, checktext: string, titleQuestion: Question = null): Promise<void> {
    let assumeTitle: IRect = SurveyHelper.createRect(leftTopPoint, 0.0, 0.0);
    if (titleQuestion != null) {
        assumeTitle = await SurveyHelper.createTitleFlat(leftTopPoint, titleQuestion, controller);
    }
    const itemHeight: number = controller.unitHeight;
    const assumeCheckbox: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(SurveyHelper.createPoint(assumeTitle),
            itemHeight, itemHeight), SurveyHelper.SELECT_ITEM_FLAT_SCALE),
        leftTopPoint.xLeft + controller.unitWidth);
    const textPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    textPoint.xLeft = assumeCheckbox.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    const assumeChecktext: IRect = await SurveyHelper.createTextFlat(textPoint,
        null, controller, checktext, TextBrick);
    assumeCheckbox.yTop += controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
    assumeCheckbox.yBot += controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
    assumeChecktext.yTop += controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
    assumeChecktext.yBot += controller.unitHeight * FlatQuestion.CONTENT_GAP_VERT_SCALE;
    const unfoldFlats: IPdfBrick[] = compositeFlat.unfold().filter(flat => !(flat instanceof RowlineBrick));
    const actualFlat: IRect = SurveyHelper.mergeRects(...unfoldFlats);
    TestHelper.equalRect(expect, actualFlat,
        SurveyHelper.mergeRects(assumeTitle, assumeCheckbox, assumeChecktext));
}
test('Calc textbox boundaries title top', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title top'
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
test('Calc textbox boundaries title bottom', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title bottom',
                titleLocation: 'bottom'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    await calcTitleBottom(controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0]);
});
test('Calc textbox boundaries title left', async () => {
    const json: any = {
        showQuestionNumbers: "false",
        questions: [
            {
                type: 'text',
                name: 'textbox left bound',
                title: 'Title',
                titleLocation: 'left'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleLeft(controller, <Question>survey.getAllQuestions()[0],
        flats[0][0].unfold()[0], flats[0][0].unfold()[1]);
});
test('Calc textbox boundaries title hidden', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title hidden',
                titleLocation: 'hidden'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const contentPoint: IPoint = controller.leftTopPoint;
    contentPoint.xLeft += controller.unitWidth;
    const assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        contentPoint, controller);
    TestHelper.equalRect(expect, flats[0][0], assumeTextbox);
});
test('Calc boundaries with space between questions', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    const titlePoint: IPoint = await calcTitleTop(controller.leftTopPoint,
        controller, <Question>survey.getAllQuestions()[0], flats[0][0]);  
    titlePoint.yTop += controller.unitHeight * FlatSurvey.QUES_GAP_VERT_SCALE;
    expect(flats[0][1] instanceof RowlineBrick).toBe(true);
    await calcTitleTop(titlePoint, controller,
        <Question>survey.getAllQuestions()[1], flats[0][2]);
});
test('Calc textbox boundaries title without number', async () => {
    const json: any = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'I do not need a number'
        }]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.showQuestionNumbers = 'off';
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Calc textbox boundaries required', async () => {
    const json: any = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'Please enter your name:',
            isRequired: true
        }]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Calc boundaries title top longer than description', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'My title is so interesting',
                description: 'But the description is not enough'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0], true);
});
test('Calc boundaries title top shorter than description', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Tiny title',
                description: 'The description is so long, very long, very'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0], true);
});
test('Calc boundaries title bottom longer than description', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    await calcTitleBottom(controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0], true);
});
test('Calc boundaries title bottom shorter than description', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    await calcTitleBottom(controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0], true);
});
test('Calc boundaries title left longer than description', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleLeft(controller, <Question>survey.getAllQuestions()[0],
        new CompositeBrick(flats[0][0].unfold()[0], flats[0][0].unfold()[1]),
        flats[0][0].unfold()[2], true);
});
test('Calc boundaries title left shorter than description', async () => {
    const json: any = {
        showQuestionNumbers: 'false',
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleLeft(controller, <Question>survey.getAllQuestions()[0],
        new CompositeBrick(flats[0][0].unfold()[0], flats[0][0].unfold()[1]),
        flats[0][0].unfold()[2], true);
});
test('Calc boundaries title hidden with description', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const contentPoint: IPoint = controller.leftTopPoint;
    contentPoint.xLeft += controller.unitWidth;
    const assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        contentPoint, controller);
    TestHelper.equalRect(expect, flats[0][0], assumeTextbox);
});
test('Calc boundaries with indent', async () => {
    for (let i: number = 0; i < 9; i++) {
        const json: any = {
            questions: [
                {
                    type: 'checkbox',
                    name: 'checkbox_cycle_indent',
                    title: 'I stand straight',
                    indent: i,
                    choices: [
                        'Right choice'
                    ]
                }
            ]
        };
        const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
        const controller: DocController = new DocController(TestHelper.defaultOptions);
        const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
        expect(flats.length).toBe(1);
        expect(flats[0].length).toBe(1);
        const leftTopPoint: IPoint = controller.leftTopPoint;
        leftTopPoint.xLeft += controller.measureText(i).width;
        await calcIndent(expect, leftTopPoint, controller,
            flats[0][0], json.questions[0].choices[0],
            <Question>survey.getAllQuestions()[0]);
    }
});
test('Not visible question and visible question', async () => {
    const json: any = {
        questions: [
            {
                type: 'checkbox',
                name: 'invisible',
                visible: false
            },
            {
                type: 'checkbox',
                name: 'visible',
                visible: true
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const actualRects: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    const actualUnfoldRects: IPdfBrick[] = actualRects[0][0].unfold();
    const actualTitle: IRect = SurveyHelper.mergeRects(actualUnfoldRects[0], actualUnfoldRects[1]);
    const assumeTitle: IPdfBrick = await SurveyHelper.createTitleFlat(controller.leftTopPoint,
        <Question>survey.getAllQuestions()[1], controller);
    TestHelper.equalRect(expect, actualTitle, assumeTitle);
    const actualRowLine: IPdfBrick = actualUnfoldRects[2];
    const assumeRowLine: IPdfBrick = SurveyHelper.createRowlineFlat(
        SurveyHelper.createPoint(assumeTitle), controller);
    TestHelper.equalRect(expect, actualRowLine, assumeRowLine);
});
test('VisibleIf row', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
});
test('Check title with number next raw position', async () => {
    const json: any = {
        questions: [
            {
                type: 'checkbox',
                name: 'Eeeeeeeeeemmmmmmmmmmmptttttyyyy chhhheeeckbox',
                isRequired: false
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const noWidth: number = controller.measureText('1. ').width * SurveyHelper.TITLE_FONT_SCALE;
    const bricks: IPdfBrick[] = flats[0][0].unfold();
    expect(SurveyHelper.mergeRects(bricks[1], bricks[2]).xLeft).
        toBeCloseTo(controller.leftTopPoint.xLeft + noWidth);
});
test('Check equality of margins.left and contentPoint.xLeft with titleLocation: left', async () => {
    const json: any = {
        questions: [
            {
                type: 'checkbox',
                choices: [
                    '', ''
                ],
                titleLocation: 'left',
                colCount: 0,
                title: 'Sex'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let contentAssumePointLeft: number = SurveyHelper.createPoint(
        await SurveyHelper.createTitleFlat(controller.leftTopPoint,
        <Question>survey.getAllQuestions()[0], controller), false, true).xLeft;
    contentAssumePointLeft += controller.unitWidth;
    expect(flats[0][0].unfold()[2].xLeft).toBe(contentAssumePointLeft);
});
test('Check questions width with startWithNewLine: false property', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                name: 'startWithNewLineFlase1',
                titleLocation: 'hidden',
                startWithNewLine: 'false'
            },
            {
                type: 'text',
                name: 'startWithNewLineFlase2',
                titleLocation: 'hidden',
                startWithNewLine: 'false',
                width: '15%'
            },
            {
                type: 'text',
                name: 'startWithNewLineFlase3',
                titleLocation: 'hidden',
                startWithNewLine: 'false'
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const resultFlats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(resultFlats.length).toBe(1);
    expect(resultFlats[0].length).toBe(3);
    const currPoint: IPoint = controller.leftTopPoint;
    const width: number = SurveyHelper.getPageAvailableWidth(controller) - 2.0 * controller.unitWidth;
    const assumeFlats: IRect[] = [];
    currPoint.xLeft += controller.unitWidth;
    controller.margins.left = currPoint.xLeft;
    assumeFlats.push(SurveyHelper.createRect(currPoint, 1.0 / 3.0 * width - controller.unitWidth, controller.unitHeight));
    currPoint.xLeft = assumeFlats[0].xRight + 2.0 * controller.unitWidth;
    controller.margins.left = currPoint.xLeft;
    assumeFlats.push(SurveyHelper.createRect(currPoint, 0.15 * width - controller.unitWidth, controller.unitHeight));
    currPoint.xLeft = assumeFlats[1].xRight + 2.0 * controller.unitWidth;
    controller.margins.left = currPoint.xLeft;
    assumeFlats.push(SurveyHelper.createRect(currPoint, 1.0 / 3.0 * width - controller.unitWidth, controller.unitHeight));
    TestHelper.equalRects(expect, resultFlats[0], assumeFlats);
});
test('Check question\'s content indent with CONTENT_INDENT_SCALE', async () => {
    const json: any = {
        questions: [
            {
                type: 'text',
                hideNumber: true
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const oldContentIndent: number = FlatQuestion.CONTENT_INDENT_SCALE;
    (<any>FlatQuestion.CONTENT_INDENT_SCALE) = 0;
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    (<any>FlatQuestion.CONTENT_INDENT_SCALE) = oldContentIndent;
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    const bricks: IPdfBrick[] = flats[0][0].unfold();
    expect(bricks.length).toBe(3);
    expect(bricks[0].xLeft).toBeCloseTo(bricks[1].xLeft);
});