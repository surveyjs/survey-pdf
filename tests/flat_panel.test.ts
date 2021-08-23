(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IDocOptions, DocController } from '../src/doc_controller';
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
    let json: any = {
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
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, json.elements[0].title);
    TestHelper.equalRect(expect, flats[0][0], panelTitleFlat);
    let contentPoint: IPoint = SurveyHelper.createPoint(panelTitleFlat);
    contentPoint.yTop += FlatSurvey.PANEL_CONT_GAP_SCALE * controller.unitHeight;
    await calcTitleTop(contentPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][1]);
});
test('Check panel with title and description', async () => {
    let json: any = {
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
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, json.elements[0].title);
    let descPoint: IPoint = SurveyHelper.createPoint(panelTitleFlat);
    descPoint.yTop += FlatSurvey.PANEL_DESC_GAP_SCALE * controller.unitHeight;
    let panelDescFlat: IPdfBrick = await SurveyHelper.createDescFlat(
        descPoint, null, controller, json.elements[0].description);
    TestHelper.equalRect(expect, flats[0][0], SurveyHelper.mergeRects(panelTitleFlat, panelDescFlat));
    let contentPoint: IPoint = SurveyHelper.createPoint(SurveyHelper.mergeRects(panelTitleFlat, panelDescFlat));
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
    let json: any = {
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
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
        controller.leftTopPoint, controller, json.elements[0].title);
    TestHelper.equalRect(expect, flats[0][0], panelTitleFlat);
    let contentPoint: IPoint = SurveyHelper.createPoint(panelTitleFlat);
    contentPoint.yTop += FlatSurvey.PANEL_CONT_GAP_SCALE * controller.unitHeight;
    await calcTitleTop(contentPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][1]);
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
