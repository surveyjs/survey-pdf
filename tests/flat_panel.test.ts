(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBoldBrick } from '../src/pdf_render/pdf_textbold';
import { TextBoxBrick } from '../src/pdf_render/pdf_textbox';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
import { calcTitleTop } from './flat_question.test';
let __dummy_tx = new FlatTextbox(null, null, null);

test('Check two pages start point', async () => {
    let json: any = {
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
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(2);
    expect(flats[0].length).toBe(1);
    expect(flats[1].length).toBe(1);
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(
        flats[0][0], true, true), controller.leftTopPoint);
    TestHelper.equalPoint(expect, SurveyHelper.createPoint(
        flats[1][0], true, true), controller.leftTopPoint);
});
test('Check panel wihtout title', async () => {
    let json: any = {
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
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check panel with title', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    const panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, json.elements[0].title);
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], panelTitleFlat);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(panelTitleFlat);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeRowLine);
    const contentPoint: IPoint = rowLinePoint;
    contentPoint.yTop += FlatSurvey.PANEL_CONT_GAP_SCALE * controller.unitHeight + SurveyHelper.EPSILON;
    await calcTitleTop(contentPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][1]);
});
test('Check panel with title and number', async () => {
    const json: any = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                title: 'Panel Title',
                showNumber: true,
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    }
                ]
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    const unfoldedFlats: IPdfBrick[] = flats[0][0].unfold();
    expect(unfoldedFlats.length).toBe(3);
    const panelNumberFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, '1.');
    TestHelper.equalRect(expect, unfoldedFlats[0], panelNumberFlat);
    const panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, json.elements[0].title);
    expect(unfoldedFlats[1].width).toBe(panelTitleFlat.width);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(panelTitleFlat);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, unfoldedFlats[2], assumeRowLine);
    const contentPoint: IPoint = rowLinePoint;
    contentPoint.yTop += FlatSurvey.PANEL_CONT_GAP_SCALE * controller.unitHeight + SurveyHelper.EPSILON;
    await calcTitleTop(contentPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][1]);
});
test('Check panel with title and description', async () => {
    const json: any = {
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
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    const panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, json.elements[0].title);
    const descPoint: IPoint = SurveyHelper.createPoint(panelTitleFlat);
    descPoint.yTop += FlatSurvey.PANEL_DESC_GAP_SCALE * controller.unitHeight;
    const panelDescFlat: IPdfBrick = await SurveyHelper.createDescFlat(
        descPoint, null, controller, json.elements[0].description);
    const titleUnfoldFlats: IPdfBrick[] = flats[0][0].unfold();
    const actualTitleWithDescription: IRect = SurveyHelper.mergeRects(titleUnfoldFlats[0], titleUnfoldFlats[1]);
    const assumeTitleWithDescription: IRect = SurveyHelper.mergeRects(panelTitleFlat, panelDescFlat);
    TestHelper.equalRect(expect, actualTitleWithDescription, assumeTitleWithDescription);
    const actualRowLine: IRect = titleUnfoldFlats[2];
    const rowLinePoint: IPoint = SurveyHelper.createPoint(assumeTitleWithDescription);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, actualRowLine, assumeRowLine);
    const contentPoint: IPoint = rowLinePoint;
    contentPoint.yTop += FlatSurvey.PANEL_CONT_GAP_SCALE * controller.unitHeight;
    await calcTitleTop(contentPoint, controller, <Question>survey.getAllQuestions()[0], flats[0][1]);
});
test('Check panel with inner indent', async () => {
    let json: any = {
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
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let panelContentPoint: IPoint = controller.leftTopPoint;
    panelContentPoint.xLeft += controller.measureText(json.elements[0].innerIndent).width;
    await calcTitleTop(panelContentPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Check question title location in panel', async () => {
    let json: any = {
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
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    expect(flats[0][0] instanceof TextBoxBrick).toBe(true);
    expect(flats[0][1].unfold()[0] instanceof TextBoldBrick).toBe(true);
});
test('Check not rendering invisible questions', async () => {
    const json: any = {
        elements: [
            {
                type: 'panel',
                name: 'Simple Panel',
                title: 'Panel Title',
                elements: [
                    {
                        type: 'text',
                        name: 'I am in the panel'
                    },
                    {
                        type: 'text',
                        name: 'I am invisible',
                        visible: false,
                        startWithNewLine: false
                    }
                ]
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    const panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, json.elements[0].title);
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], panelTitleFlat);
    const rowLinePoint: IPoint = SurveyHelper.createPoint(panelTitleFlat);
    const assumeRowLine: IRect = SurveyHelper.createRowlineFlat(rowLinePoint, controller);
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeRowLine);
    const contentPoint: IPoint = rowLinePoint;
    contentPoint.yTop += FlatSurvey.PANEL_CONT_GAP_SCALE * controller.unitHeight + SurveyHelper.EPSILON;
    await calcTitleTop(contentPoint, controller, <Question>survey.getAllQuestions()[0], flats[0][1]);
});
test('Check', async () => {
    const json = {
        pages: [
            {
                name: 'page1',
                elements: [
                    {
                        type: 'text',
                        name: 'question1'
                    },
                    {
                        type: 'text',
                        name: 'question2',
                        startWithNewLine: false
                    }
                ],
                title: 'A\nA\nA\nA\nA\nA\nA\nA'
            }
        ]
    };
    const options: IDocOptions = TestHelper.defaultOptions;
    options.format = [210.0, 117.0];
    const survey: SurveyPDF = new SurveyPDF(json, options);
    const controller: DocController = new DocController(options);
    const flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
});
